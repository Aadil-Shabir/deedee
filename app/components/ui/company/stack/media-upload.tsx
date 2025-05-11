"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, VideoIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadStatusList } from "./upload-status";

// Define interface for existing media
interface ExistingMedia {
  id: string;
  type: string; // 'image' or 'video'
  name: string;
  preview: string;
  onRemove: () => void;
}

interface MediaUploadProps {
  maxCount: number;
  onFilesAdded: (files: File[]) => void;
  existingMedia?: ExistingMedia[];
}

export function MediaUpload({ 
  maxCount, 
  onFilesAdded, 
  existingMedia = [] 
}: MediaUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<{
    id: string;
    file: File;
    name: string;
    status: "uploading" | "success" | "error";
    progress: number;
  }[]>([]);
  
  const [isDragActive, setIsDragActive] = useState(false);

  // Calculate total media count
  const totalMediaCount = existingMedia.length;
  
  const onDrop = (acceptedFiles: File[]) => {
    // Calculate how many slots are left
    const slotsLeft = maxCount - existingMedia.length;
    if (slotsLeft <= 0) {
      // Show an alert or toast here that max limit is reached
      return;
    }
    
    // Only take the number of files that fit in available slots
    const filesToUpload = acceptedFiles.slice(0, slotsLeft);
    
    // Create file objects with initial progress
    const newFiles = filesToUpload.map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      status: "uploading" as const,
      progress: 0,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);

    // Start progress simulation and uploading for each file
    newFiles.forEach((fileObj) => {
      // Start progress simulation
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setUploadingFiles((prev) => {
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

      // Perform actual upload
      const doUpload = async () => {
        try {
          // Call the passed upload function
          await onFilesAdded([fileObj.file]);
          
          // Mark as complete
          setUploadingFiles((prev) => {
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
            setUploadingFiles((prev) => 
              prev.filter((f) => f.id !== fileObj.id)
            );
          }, 2000);
          
        } catch (error) {
          // Mark as error
          setUploadingFiles((prev) => {
            const updatedFiles = prev.map((f) => {
              if (f.id === fileObj.id) {
                return { ...f, status: "error" as const };
              }
              return f;
            });
            return updatedFiles;
          });
        } finally {
          clearInterval(progressInterval);
        }
      };

      doUpload();
    });
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    }
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-zinc-100 mb-3">
        {`Upload Images or Videos (${totalMediaCount}/${maxCount})`}
      </h3>
      
      {totalMediaCount < maxCount && (
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
          <p className="text-zinc-300 mb-1">
            Drag and drop or click to upload images or videos
          </p>
          <p className="text-zinc-500 text-sm">
            Accepted formats: images (JPG, PNG, GIF) or videos (MP4, WEBM)
          </p>
        </div>
      )}
      
      {/* Display upload progress */}
      <UploadStatusList files={uploadingFiles} onRemoveFile={removeUploadingFile} />
      
      {/* Display existing media */}
      {existingMedia.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-zinc-400 mb-2">Media Gallery</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingMedia.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-md overflow-hidden border border-zinc-700"
              >
                <div className="aspect-video relative">
                  {item.type === "image" ? (
                    <Image
                      src={item.preview}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800">
                      <VideoIcon className="h-10 w-10 text-zinc-500" />
                      <span className="mt-2 text-xs text-zinc-500 text-center px-2">
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={item.onRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display message when max limit is reached */}
      {totalMediaCount >= maxCount && (
        <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/50 rounded-md text-amber-200 text-sm">
          Maximum file limit reached ({maxCount}). Remove some files to upload
          more.
        </div>
      )}
    </div>
  );
}