"use client";

import { useState } from "react";
import { FileUpload } from "./file-upload";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MediaUploadProps {
  maxCount: number;
}

export function MediaUpload({ maxCount }: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string }[]>([]);

  const handleFiles = (files: File[]) => {
    const newFiles = files.slice(0, maxCount - mediaFiles.length).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setMediaFiles(prev => [...prev, ...newFiles].slice(0, maxCount));
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <FileUpload 
        title={`Upload Images or Videos (up to ${maxCount})`}
        acceptedFormats="image/*, video/*"
        onFilesAdded={handleFiles}
      />
      
      {mediaFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-zinc-400 mb-2">Uploaded Files ({mediaFiles.length}/{maxCount})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-zinc-700">
                <div className="aspect-video relative">
                  {file.file.type.startsWith('image/') ? (
                    <Image 
                      src={file.preview} 
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                      <ImagePlus className="h-10 w-10 text-zinc-500" />
                      <span className="mt-1 text-xs text-zinc-500">{file.file.name}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 