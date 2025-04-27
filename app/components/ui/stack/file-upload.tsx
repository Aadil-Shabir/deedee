"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { UploadStatusList } from "./upload-status";
import { Button } from "@/components/ui/button";

// Define interface for existing files
interface ExistingFile {
  id: string;
  name: string;
  size: number;
  type: string;
  onRemove: () => void;
}

interface FileUploadProps {
  title: string;
  acceptedFormats: string;
  onFilesAdded: (files: File[]) => void;
  existingFiles?: ExistingFile[];
}

export function FileUpload({
  title,
  acceptedFormats,
  onFilesAdded,
  existingFiles = [],
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<{
    id: string;
    file: File;
    name: string;
    status: "uploading" | "success" | "error";
    progress: number;
    error?: string;
  }[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        // Create file objects with initial progress
        const newFiles = acceptedFiles.map((file) => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          status: "uploading" as const,
          progress: 0,
        }));

        setUploadFiles((prev) => [...prev, ...newFiles]);

        // Start progress simulation for each file
        newFiles.forEach((fileObj) => {
          const simulateProgress = () => {
            const interval = setInterval(() => {
              setUploadFiles((prev) => {
                const updatedFiles = prev.map((f) => {
                  if (f.id === fileObj.id) {
                    // Increase progress by 10% each time
                    const newProgress = Math.min(f.progress + 10, 95);
                    return { ...f, progress: newProgress };
                  }
                  return f;
                });
                return updatedFiles;
              });
            }, 300);

            // Return function to clear interval
            return interval;
          };

          const progressInterval = simulateProgress();

          // Start the actual upload and then update status when done
          const doUpload = async () => {
            try {
              // Call the passed upload function
              await onFilesAdded([fileObj.file]);
              
              // Mark as complete
              setUploadFiles((prev) => {
                const updatedFiles = prev.map((f) => {
                  if (f.id === fileObj.id) {
                    return { ...f, progress: 100, status: "success" as const };
                  }
                  return f;
                });
                return updatedFiles;
              });

              // Remove from list after 2 seconds
              setTimeout(() => {
                setUploadFiles((prev) => 
                  prev.filter((f) => f.id !== fileObj.id)
                );
              }, 2000);
              
            } catch (error) {
              console.error("Error uploading file:", error);
              
              // Display detailed error message for debugging
              let errorMessage = "Upload failed";
              if (typeof error === 'object' && error !== null) {
                if ('message' in error) {
                  errorMessage = (error as Error).message;
                } else if (error.toString) {
                  errorMessage = error.toString();
                }
              }
              
              // Mark as error
              setUploadFiles((prev) => {
                const updated = prev.map((f) => {
                  if (f.id === fileObj.id) {
                    return { 
                      ...f, 
                      status: "error" as const, 
                      error: errorMessage
                    };
                  }
                  return f;
                });
                return updated;
              });
            } finally {
              clearInterval(progressInterval);
            }
          };

          doUpload();
        });
      }
    },
    [onFilesAdded]
  );

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Create an accept object based on accepted formats string
  const getAcceptObject = () => {
    const formats = acceptedFormats.split(',').map(f => f.trim());
    const acceptObj: Record<string, string[]> = {};
    
    formats.forEach(format => {
      if (format === 'pdf') {
        acceptObj['application/pdf'] = ['.pdf'];
      } else if (format === 'xls') {
        acceptObj['application/vnd.ms-excel'] = ['.xls'];
      } else if (format === 'xlsx') {
        acceptObj['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
      } else if (format === 'csv') {
        acceptObj['text/csv'] = ['.csv'];
      }
    });
    
    return acceptObj;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: getAcceptObject()
  });

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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
        <p className="text-zinc-500 text-sm">
          Accepted formats: {acceptedFormats}
        </p>
      </div>

      {/* Display upload progress */}
      <UploadStatusList files={uploadFiles} onRemoveFile={removeFile} />

      {/* Display existing files */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-zinc-400 mb-2">
            Existing Files
          </h4>
          <div className="space-y-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-md bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full hover:bg-zinc-700 p-0"
                  onClick={file.onRemove}
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}