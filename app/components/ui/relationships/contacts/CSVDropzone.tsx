'use client'
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CSVDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onDownloadSample: () => void;
  isUploading?: boolean;
  onUpload: () => void;
  onCancel: () => void;
}

export function CSVDropzone({
  file,
  onFileChange,
  onDownloadSample,
  isUploading = false,
  onUpload,
  onCancel
}: CSVDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileChange(file);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-300">Download sample file:</span>
        <Button 
          variant="outline" 
          onClick={onDownloadSample}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          Sample CSV File
        </Button>
      </div>

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
          <p className="text-gray-400">
            {isDragActive ? 'Drop CSV file here' : 'Drag & drop or click to select CSV file'}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          onClick={onUpload}
          disabled={!file || isUploading}
          className="bg-profile-purple hover:bg-profile-purple/90"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
