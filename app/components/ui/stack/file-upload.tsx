"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { UploadStatusList } from "./upload-status";

interface FileUploadProps {
  title: string;
  acceptedFormats: string;
  onFilesAdded: (files: File[]) => void;
}

export function FileUpload({ title, acceptedFormats, onFilesAdded }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<{
    id: string;
    file: File;
    name: string;
    status: "uploading" | "success" | "error";
    progress: number;
  }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      // Simulate file upload process
      const newFiles = acceptedFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        status: "uploading" as const,
        progress: 0
      }));
      
      setUploadFiles(prev => [...prev, ...newFiles]);
      
      // Simulate upload progress
      newFiles.forEach(fileObj => {
        const interval = setInterval(() => {
          setUploadFiles(prev => {
            const updatedFiles = prev.map(f => {
              if (f.id === fileObj.id) {
                const newProgress = Math.min(f.progress + 10, 100);
                if (newProgress === 100) {
                  clearInterval(interval);
                  onFilesAdded([f.file]);
                  return { ...f, progress: newProgress, status: "success" as const };
                }
                return { ...f, progress: newProgress };
              }
              return f;
            });
            return updatedFiles;
          });
        }, 300);
      });
    }
  }, [onFilesAdded]);

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'application/vnd.google-apps.spreadsheet': ['.gsheet'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov']
    }
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-zinc-100 mb-3">{title}</h3>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-zinc-700 hover:border-zinc-500"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
        <p className="text-zinc-300 mb-1">Drag and drop or click to upload</p>
        <p className="text-zinc-500 text-sm">Accepted formats: {acceptedFormats}</p>
      </div>
      
      <UploadStatusList files={uploadFiles} onRemoveFile={removeFile} />
    </div>
  );
} 