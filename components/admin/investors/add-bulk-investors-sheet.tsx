"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Upload,
    FileText,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Download,
    RefreshCw,
    Users,
    Building2,
    Mail,
    MapPin,
    Briefcase,
    Info,
    User,
} from "lucide-react";
import { useBulkInvestorImport } from "@/hooks/query-hooks/use-bulk-investor-import";
import { parseInvestorFile, generateSampleCSV, type ParsedInvestorData } from "@/lib/utils/file-parser";

interface AddBulkInvestorsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Step = "upload" | "preview" | "processing" | "results";

export function AddBulkInvestorsSheet({ open, onOpenChange }: AddBulkInvestorsSheetProps) {
    const [currentStep, setCurrentStep] = useState<Step>("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedInvestorData[]>([]);
    const [parseErrors, setParseErrors] = useState<string[]>([]);
    const [parseWarnings, setParseWarnings] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { importInvestors, isImporting, progress, data, resetProgress } = useBulkInvestorImport();

    const handleFileSelect = async (file: File) => {
        console.log("🔄 File selected:", {
            name: file.name,
            size: file.size,
            type: file.type,
        });

        // Reset state
        setSelectedFile(file);
        setParsedData([]);
        setParseErrors([]);
        setParseWarnings([]);
        setIsProcessing(true);

        try {
            console.log("🚀 Starting file parsing...");

            // Add artificial delay to show processing state
            await new Promise((resolve) => setTimeout(resolve, 500));

            const result = await parseInvestorFile(file);

            console.log("📊 Parse result:", {
                success: result.success,
                dataLength: result.data.length,
                errorsLength: result.errors.length,
                warningsLength: result.warnings.length,
            });

            // Always set the results, even if there are errors
            setParsedData(result.data);
            setParseErrors(result.errors);
            setParseWarnings(result.warnings);

            if (result.success && result.data.length > 0) {
                console.log("✅ File parsed successfully, moving to preview step");
                setCurrentStep("preview");
            } else {
                console.log("❌ File parsing failed or no data found");
                // Stay on upload step to show errors
            }
        } catch (error: any) {
            console.error("💥 Error in handleFileSelect:", error);
            setParseErrors([`Failed to parse file: ${error.message}`]);
            setParsedData([]);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const startImport = async () => {
        if (parsedData.length === 0) {
            console.error("❌ No data to import");
            return;
        }

        console.log("🚀 Starting import of", parsedData.length, "investors");
        setCurrentStep("processing");

        try {
            await importInvestors(parsedData);
            console.log("✅ Import completed successfully");
            setCurrentStep("results");
        } catch (error: any) {
            console.error("❌ Import failed:", error);
            // Error handling is done in the hook
        }
    };

    const downloadSampleCSV = () => {
        console.log("📥 Generating sample CSV");
        try {
            const csvContent = generateSampleCSV();
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "investor_import_template.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("✅ Sample CSV downloaded");
        } catch (error: any) {
            console.error("❌ Error downloading sample CSV:", error);
        }
    };

    const resetSheet = () => {
        console.log("🔄 Resetting sheet");
        setCurrentStep("upload");
        setSelectedFile(null);
        setParsedData([]);
        setParseErrors([]);
        setParseWarnings([]);
        setIsProcessing(false);
        resetProgress();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        console.log("🚪 Closing sheet");
        resetSheet();
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="w-full sm:max-w-4xl overflow-hidden flex flex-col">
                <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Bulk Import Investors
                    </SheetTitle>
                    <SheetDescription>
                        Upload an Excel or CSV file to import multiple investors at once. Simple and straightforward.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 pr-6">
                    <div className="space-y-6 py-6">
                        {/* Step Indicator */}
                        <div className="flex items-center justify-between">
                            {(["upload", "preview", "processing", "results"] as Step[]).map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                        currentStep === step
                            ? "bg-primary text-primary-foreground"
                            : index < (["upload", "preview", "processing", "results"] as Step[]).indexOf(currentStep)
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                    }
                  `}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className="ml-2 text-sm capitalize">{step}</span>
                                    {index < 3 && <div className="w-8 h-px bg-border mx-4" />}
                                </div>
                            ))}
                        </div>

                        {/* Upload Step */}
                        {currentStep === "upload" && (
                            <div className="space-y-6">
                                {/* File Upload Area */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div
                                            className={`
                        border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                        ${isProcessing ? "opacity-50 pointer-events-none" : ""}
                      `}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragOver(true);
                                            }}
                                            onDragLeave={() => setIsDragOver(false)}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                                                    <h3 className="text-lg font-medium mb-2">Processing file...</h3>
                                                    <p className="text-muted-foreground">
                                                        Please wait while we parse your data
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <h3 className="text-lg font-medium mb-2">
                                                        Upload your investor file
                                                    </h3>
                                                    <p className="text-muted-foreground mb-4">
                                                        Drag and drop your Excel (.xlsx, .xls) or CSV file here, or
                                                        click to browse
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Simple format with basic investor information
                                                    </p>
                                                    <Button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isProcessing}
                                                    >
                                                        Choose File
                                                    </Button>
                                                </>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={handleFileInputChange}
                                                className="hidden"
                                                disabled={isProcessing}
                                            />
                                        </div>

                                        {selectedFile && (
                                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{selectedFile.name}</span>
                                                    <Badge variant="secondary">
                                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Sample Template */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            Need a template?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Download our simple CSV template with the required fields.
                                        </p>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-xs text-muted-foreground">
                                                <strong>Required:</strong> first_name, last_name, email, country, city,
                                                invests_via_company
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <strong>Optional:</strong> company_name, investor_type, title
                                            </p>
                                        </div>
                                        <Button variant="outline" onClick={downloadSampleCSV}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Template
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Parse Errors */}
                                {parseErrors.length > 0 && (
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <div className="space-y-1">
                                                <p className="font-medium">File parsing errors:</p>
                                                <ScrollArea className="h-32">
                                                    {parseErrors.map((error, index) => (
                                                        <div key={index} className="text-sm">
                                                            {error}
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Parse Warnings */}
                                {parseWarnings.length > 0 && (
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            <div className="space-y-1">
                                                <p className="font-medium">Warnings ({parseWarnings.length}):</p>
                                                <ScrollArea className="h-32">
                                                    {parseWarnings.slice(0, 10).map((warning, index) => (
                                                        <div key={index} className="text-sm">
                                                            {warning}
                                                        </div>
                                                    ))}
                                                    {parseWarnings.length > 10 && (
                                                        <div className="text-sm text-muted-foreground">
                                                            ... and {parseWarnings.length - 10} more warnings
                                                        </div>
                                                    )}
                                                </ScrollArea>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {/* Preview Step */}
                        {currentStep === "preview" && (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-2xl font-bold">{parsedData.length}</p>
                                                    <p className="text-sm text-muted-foreground">Investors</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {parsedData.filter((d) => d.invests_via_company).length}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Company</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-green-500" />
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {parsedData.filter((d) => !d.invests_via_company).length}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Individual</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-orange-500" />
                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {new Set(parsedData.map((d) => d.country).filter(Boolean)).size}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Countries</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Warnings */}
                                {parseWarnings.length > 0 && (
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            <div className="space-y-1">
                                                <p className="font-medium">Warnings ({parseWarnings.length}):</p>
                                                <ScrollArea className="h-24">
                                                    {parseWarnings.slice(0, 5).map((warning, index) => (
                                                        <div key={index} className="text-sm">
                                                            {warning}
                                                        </div>
                                                    ))}
                                                    {parseWarnings.length > 5 && (
                                                        <div className="text-sm text-muted-foreground">
                                                            ... and {parseWarnings.length - 5} more warnings
                                                        </div>
                                                    )}
                                                </ScrollArea>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Data Preview */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Data Preview (First 10 rows)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-80">
                                            <div className="space-y-2 pr-4">
                                                {parsedData.slice(0, 10).map((investor, index) => (
                                                    <div key={index} className="p-3 border rounded-lg">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">
                                                                        {investor.first_name} {investor.last_name}
                                                                    </span>
                                                                    <Badge
                                                                        variant={
                                                                            investor.invests_via_company
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {investor.invests_via_company
                                                                            ? "Company"
                                                                            : "Individual"}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {investor.email}
                                                                </p>
                                                                {investor.company_name && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-sm">
                                                                            {investor.company_name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="text-sm">
                                                                        {investor.city}, {investor.country}
                                                                    </span>
                                                                </div>
                                                                {investor.title && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-sm">
                                                                            {investor.title}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {investor.investor_type && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {investor.investor_type}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {parsedData.length > 10 && (
                                                    <p className="text-sm text-muted-foreground text-center py-2">
                                                        ... and {parsedData.length - 10} more investors
                                                    </p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                                        Back to Upload
                                    </Button>
                                    <Button onClick={startImport} disabled={parsedData.length === 0}>
                                        Import {parsedData.length} Investors
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Processing Step */}
                        {currentStep === "processing" && (
                            <div className="space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="text-center space-y-4">
                                            <RefreshCw className="h-12 w-12 text-primary mx-auto animate-spin" />
                                            <h3 className="text-lg font-medium">Importing Investors</h3>
                                            <p className="text-muted-foreground">
                                                Please wait while we process your data. This includes creating profiles,
                                                firms, and contacts as needed.
                                            </p>

                                            {progress && (
                                                <div className="space-y-2">
                                                    <Progress
                                                        value={(progress.current / progress.total) * 100}
                                                        className="w-full"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Processing {progress.current} of {progress.total} investors
                                                    </p>
                                                    {progress.currentEmail && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Current: {progress.currentEmail}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Results Step */}
                        {currentStep === "results" && data && (
                            <div className="space-y-6">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {data.summary.successful}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Successful</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {data.summary.failed}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Failed</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {data.summary.successRate}%
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Success Rate</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Detailed Results */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Import Results</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-80">
                                            <div className="space-y-2 pr-4">
                                                {data.results.map((result, index) => (
                                                    <div
                                                        key={index}
                                                        className={`
                            p-3 border rounded-lg
                            ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                          `}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    {result.success ? (
                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                                    )}
                                                                    <span className="font-medium">
                                                                        Row {result.rowIndex}
                                                                    </span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {result.email}
                                                                    </span>
                                                                </div>

                                                                {result.error && (
                                                                    <p className="text-sm text-red-600">
                                                                        {result.error}
                                                                    </p>
                                                                )}

                                                                {result.warnings && result.warnings.length > 0 && (
                                                                    <div className="space-y-1">
                                                                        {result.warnings.map((warning, i) => (
                                                                            <p
                                                                                key={i}
                                                                                className="text-xs text-amber-600"
                                                                            >
                                                                                ⚠️ {warning}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {result.success && (
                                                                    <div className="text-xs text-green-600 space-y-1">
                                                                        {result.userId && (
                                                                            <p>
                                                                                ✅ User: {result.userId.slice(0, 8)}...
                                                                            </p>
                                                                        )}
                                                                        {result.firmId && (
                                                                            <p>
                                                                                ✅ Firm: {result.firmId.slice(0, 8)}...
                                                                            </p>
                                                                        )}
                                                                        {result.profileId && (
                                                                            <p>
                                                                                ✅ Profile:{" "}
                                                                                {result.profileId.slice(0, 8)}...
                                                                            </p>
                                                                        )}
                                                                        {result.contactId && (
                                                                            <p>
                                                                                ✅ Contact:{" "}
                                                                                {result.contactId.slice(0, 8)}...
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={resetSheet}>
                                        Import Another File
                                    </Button>
                                    <Button onClick={handleClose}>Close</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
