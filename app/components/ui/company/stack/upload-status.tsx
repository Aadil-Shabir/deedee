"use client";

import { X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type UploadStatus = "uploading" | "success" | "error";

interface UploadStatusItemProps {
  fileName: string;
  status: UploadStatus;
  progress: number;
  onRemove: () => void;
}

export function UploadStatusItem({ fileName, status, progress, onRemove }: UploadStatusItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-zinc-800/50 border border-zinc-700">
      <div className="shrink-0">
        <FileText className="h-6 w-6 text-zinc-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-200 truncate">{fileName}</p>
          <div className="flex gap-2 items-center">
            {status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
            {status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full hover:bg-zinc-700" 
              onClick={onRemove}
            >
              <X className="h-3 w-3 text-zinc-400" />
            </Button>
          </div>
        </div>
        
        {status === "uploading" && (
          <div className="mt-2">
            <Progress value={progress} className="h-1.5 bg-zinc-700" />
            <span className="text-xs text-zinc-400 mt-1">{progress}%</span>
          </div>
        )}
        
        {status === "error" && (
          <p className="text-xs text-red-400 mt-1">Upload failed. Click to retry.</p>
        )}
      </div>
    </div>
  );
}

interface UploadStatusListProps {
  files: {
    id: string;
    name: string;
    status: UploadStatus;
    progress: number;
  }[];
  onRemoveFile: (id: string) => void;
}

export function UploadStatusList({ files, onRemoveFile }: UploadStatusListProps) {
  if (files.length === 0) return null;
  
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-sm font-medium text-zinc-400">Upload Status</h4>
      <div className="space-y-2">
        {files.map((file) => (
          <UploadStatusItem
            key={file.id}
            fileName={file.name}
            status={file.status}
            progress={file.progress}
            onRemove={() => onRemoveFile(file.id)}
          />
        ))}
      </div>
    </div>
  );
} 