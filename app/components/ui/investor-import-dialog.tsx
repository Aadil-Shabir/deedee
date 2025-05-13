'use client';

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload, DownloadCloud, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useUser } from "@/hooks/use-user";
import { bulkImportInvestors } from "@/actions/actions.investor-import";

// Update the onImportSuccess property type in InvestorImportDialogProps
interface InvestorImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: (summary: { imported: number; skipped: number; failed: number; }) => void;
}

export function InvestorImportDialog({ 
  open, 
  onOpenChange,
  onImportSuccess 
}: InvestorImportDialogProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [mappedFields, setMappedFields] = useState<{[key: string]: string}>({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    investor_type: '',
    stage: '',
    country: '',
    city: '',
    amount: '',
    is_investment: '',
    investment_type: '',
    interest_rate: '',
    valuation: '',
    num_shares: ''
  });
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);
    setParsedData([]);
    setActiveTab('upload');

    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt === 'csv') {
      parseCSV(selectedFile);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      parseExcel(selectedFile);
    } else {
      setError('Unsupported file format. Please use CSV, XLS, or XLSX files.');
    }
  };

  const parseCSV = (file: File) => {
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        handleParseResults(results.data as any[], results.meta.fields || []);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  const parseExcel = (file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = sheet[XLSX.utils.encode_cell({r: range.s.r, c: C})];
          headers.push(cell?.v || `Column${C}`);
        }
        
        handleParseResults(jsonData as any[], headers);
      } catch (error) {
        setError(`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleParseResults = (data: any[], fields: string[]) => {
    if (data.length === 0) {
      setError('The file contains no data');
      setIsLoading(false);
      return;
    }
    
    setParsedData(data);
    setAvailableFields(fields);
    
    const fieldMapping: {[key: string]: string} = {};
    const commonMappings: {[key: string]: string[]} = {
      full_name: ['full name', 'name', 'investor name', 'contact name', 'fullname'],
      first_name: ['first name', 'firstname', 'given name', 'first'],
      last_name: ['last name', 'lastname', 'surname', 'family name', 'last'],
      email: ['email', 'email address', 'e-mail', 'contact email', 'investor email'],
      company_name: ['company', 'company name', 'organization', 'firm', 'fund'],
      investor_type: ['type', 'investor type', 'category', 'investment type'],
      stage: ['stage', 'status', 'investment stage', 'phase'],
      country: ['country', 'nation', 'location'],
      city: ['city', 'town', 'location'],
      amount: ['amount', 'investment amount', 'reservation amount', 'funding'],
      is_investment: ['is investment', 'investment', 'committed', 'invested'],
      investment_type: ['investment type', 'equity/debt', 'funding type'],
      interest_rate: ['interest rate', 'rate', 'interest', 'debt interest'],
      valuation: ['valuation', 'company valuation', 'pre-money', 'post-money'],
      num_shares: ['num shares', 'number of shares', 'shares', 'equity shares']
    };
    
    // Auto-map fields based on common naming patterns
    Object.entries(commonMappings).forEach(([targetField, possibleMatches]) => {
      const matchedField = fields.find(field => 
        possibleMatches.includes(field.toLowerCase())
      );
      
      if (matchedField) {
        fieldMapping[targetField] = matchedField;
      }
    });
    
    setMappedFields(fieldMapping);
    setIsLoading(false);
    
    if (data.length > 0) {
      setActiveTab('preview');
    }
  };

  const handleFieldMappingChange = (systemField: string, fileField: string) => {
    setMappedFields(prev => ({
      ...prev,
      [systemField]: fileField
    }));
  };

  const handleImport = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to import investors");
      return;
    }
    
    if (parsedData.length === 0) {
      setError('No data to import');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const transformedData = parsedData.map(row => {
        const newRow: {[key: string]: any} = {};
        
        // Map fields from file to our system fields
        Object.entries(mappedFields).forEach(([systemField, fileField]) => {
          if (fileField && row[fileField] !== undefined) {
            // Handle boolean conversions
            if (systemField === 'is_investment') {
              const value = row[fileField];
              if (typeof value === 'boolean') {
                newRow[systemField] = value;
              } else if (typeof value === 'string') {
                newRow[systemField] = ['yes', 'true', 'y', '1'].includes(value.toLowerCase());
              } else if (typeof value === 'number') {
                newRow[systemField] = value !== 0;
              }
            } else {
              newRow[systemField] = row[fileField];
            }
          }
        });
        
        return newRow;
      });
      
      // Filter out records without minimum required fields 
      const validData = transformedData.filter(row => {
        // Either full_name or first_name + last_name must be present
        const hasName = row.full_name || (row.first_name && row.last_name);
        // Company is required
        const hasCompany = row.company_name;
        
        return hasName && hasCompany;
      });
      
      if (validData.length === 0) {
        setError('No valid investors found after mapping fields. Each record must have at least a name and company.');
        setIsLoading(false);
        return;
      }
      
      // Use our bulk import server action
      const result = await bulkImportInvestors(validData, user.id);
      
      if (result.success) {
        // Reset state and close dialog on success
        setTimeout(() => {
          setFile(null);
          setFileName('');
          setParsedData([]);
          setIsLoading(false);
          setActiveTab('upload');
          
          // Call onImportSuccess with summary including skipped count
          if (onImportSuccess) {
            onImportSuccess({
              imported: result.imported,
              skipped: result.skipped,
              failed: result.failed
            });
          }
          
          onOpenChange(false);
          toast.success(result.message);
        }, 1000);
      } else {
        setError(result.error || "Import failed");
        setIsLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setError(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
      toast.error("Import failed due to an error");
    }
  };

  const downloadTemplate = () => {
    const sampleData = [
      {
        "First Name": "John",
        "Last Name": "Doe",
        "Email": "john.doe@example.com",
        "Company": "Acme Ventures",
        "Investor Type": "Angel",
        "Stage": "Discovery",
        "Country": "United States",
        "City": "San Francisco",
        "Amount": "50000",
        "Is Investment": "Yes",
        "Investment Type": "Equity",
        "Valuation": "5000000",
        "Number of Shares": "10000"
      },
      {
        "First Name": "Jane",
        "Last Name": "Smith",
        "Email": "jane.smith@example.com",
        "Company": "Smith Capital",
        "Investor Type": "VC",
        "Stage": "Pitch",
        "Country": "UK",
        "City": "London",
        "Amount": "25000",
        "Is Investment": "No", // Reservation
        "Investment Type": "",
        "Valuation": "",
        "Number of Shares": ""
      },
      {
        "First Name": "Alex",
        "Last Name": "Johnson",
        "Email": "alex@example.com",
        "Company": "Johnson Funds",
        "Investor Type": "Strategic",
        "Stage": "Analysis",
        "Country": "Canada",
        "City": "Toronto",
        "Amount": "100000",
        "Is Investment": "Yes",
        "Investment Type": "Debt",
        "Interest Rate": "6.5"
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
    
    XLSX.writeFile(workbook, "investor_import_template.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1D29] text-white border-gray-800 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="h-5 w-5 text-profile-purple" />
            Import Investors
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload a CSV or Excel file with your investor data. The system will match or create company records.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'preview')}>
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-profile-purple"
            >
              Upload File
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-profile-purple"
              disabled={parsedData.length === 0}
            >
              Map & Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4 space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                error ? 'border-red-500/50' : 'border-gray-700 hover:border-profile-purple/50'
              } transition-colors`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) {
                  const event = {
                    target: {
                      files: [droppedFile]
                    }
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(event);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-gray-800 p-3">
                  <FileSpreadsheet className="h-8 w-8 text-profile-purple" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload your investor data</h3>
                  <p className="text-sm text-gray-400 max-w-md">
                    Drag and drop a CSV or Excel file, or click to browse.
                    We support .csv, .xlsx and .xls files.
                  </p>
                </div>
                
                <div className="relative">
                  <Button variant="outline" className="border-gray-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <Input 
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                
                {fileName && (
                  <div className="text-sm text-gray-300 flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    {fileName}
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-profile-purple" />}
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-md p-3 text-sm text-red-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="text-gray-400 border-gray-800"
              >
                <DownloadCloud className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              
              <Button
                type="button"
                onClick={() => parsedData.length > 0 && setActiveTab('preview')}
                disabled={parsedData.length === 0 || isLoading}
                className="bg-profile-purple"
              >
                Continue to Preview
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Map your file columns to investor fields</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(mappedFields).map(([systemField, fileField]) => (
                    <div key={systemField} className="space-y-1">
                      <Label 
                        htmlFor={`field-${systemField}`}
                        className={`text-sm ${systemField === 'company_name' || systemField === 'first_name' || systemField === 'last_name' || systemField === 'full_name' ? 'text-profile-purple' : 'text-gray-400'}`}
                      >
                        {(systemField === 'company_name' || 
                          (systemField === 'first_name' && !mappedFields.full_name) || 
                          (systemField === 'last_name' && !mappedFields.full_name) || 
                          (systemField === 'full_name' && !mappedFields.first_name)) && '* '}
                        {systemField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      
                      <select
                        id={`field-${systemField}`}
                        value={fileField}
                        onChange={(e) => handleFieldMappingChange(systemField, e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded w-full py-2 px-3 text-white text-sm"
                      >
                        <option value="">-- Select Field --</option>
                        {availableFields.map(field => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-3 flex justify-between items-center">
                  <h3 className="text-sm font-medium">Data Preview</h3>
                  <span className="text-xs text-gray-400">{parsedData.length} records found</span>
                </div>
                
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/70 border-b border-gray-700">
                        {availableFields.slice(0, 6).map((field, index) => (
                          <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-400">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {parsedData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-800/50">
                          {availableFields.slice(0, 6).map((field, colIndex) => (
                            <td key={`${rowIndex}-${colIndex}`} className="px-3 py-2 text-sm whitespace-nowrap text-gray-300">
                              {row[field] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {parsedData.length > 5 && (
                  <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-800">
                    Showing 5 of {parsedData.length} records
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <div className="flex items-center justify-between w-full pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('upload')}
                  className="text-gray-400 border-gray-800"
                >
                  Back to Upload
                </Button>
                
                <Button
                  onClick={handleImport}
                  disabled={isLoading}
                  className="bg-profile-purple"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Import Investors
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}