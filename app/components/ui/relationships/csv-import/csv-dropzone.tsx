'use client'
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CsvDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setUploadErrors?: (errors: string[]) => void;
  accept?: Record<string, string[]>;
  helpText?: string;
  maxFileSizeMB?: number;
}

export function CsvDropzone({ 
  file, 
  setFile, 
  setUploadErrors, 
  accept = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.csv', '.xls', '.xlsx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.csv', '.xlsx'],
    'text/plain': ['.csv', '.txt']
  },
  helpText = "CSV Format Help",
  maxFileSizeMB = 5
}: CsvDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (setUploadErrors) {
      setUploadErrors([]);
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
    }
  }, [setFile, setUploadErrors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-profile-purple' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      {file ? (
        <p className="text-gray-300">{file.name}</p>
      ) : (
        <div>
          <p className="text-gray-400">
            {isDragActive ? 'Drop CSV file here' : 'Drag & drop or click to select CSV file'}
          </p>
          <div className="flex items-center justify-center mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Info className="h-3 w-3 mr-1" />
                    <span>{helpText}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm font-medium mb-1">CSV Tips:</p>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>Most spreadsheet formats are accepted</li>
                    <li>Include column headers in the first row</li>
                    <li>Headers will be auto-normalized (case insensitive)</li>
                    <li>Download our sample template for reference</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
      <p className="text-gray-500 text-xs mt-2">Maximum file size: {maxFileSizeMB}MB</p>
    </div>
  );
}
