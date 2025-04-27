"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Layers, BarChart, Building } from "lucide-react";
import { VideoLinkInput } from "../stack/video-link-input";
import { FileUpload } from "../stack/file-upload";
import { MediaUpload } from "../stack/media-upload";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { deleteTechStackFile, getTechStackData, saveVideoUrl, uploadTechStackFile } from "@/actions/actions.stack";

interface TechStackFile {
  id: string;
  file_name: string;
  file_type: string;
  category: string;
  file_size: number;
  storage_path: string;
  display_order?: number;
  metadata?: any;
}

interface StackInfoProps {
  onTabChange?: (tabId: string) => void;
}

export function StackInfo({ onTabChange }: StackInfoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<TechStackFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { activeCompanyId, allUserCompanies } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();

  const activeCompany = allUserCompanies?.find((c) => c.id === activeCompanyId);

  const pitchDeckFiles = files.filter((file) => file.category === "pitch_deck");
  const financialFiles = files.filter((file) => file.category === "financials");
  const mediaFiles = files.filter((file) =>
    ["image", "video"].includes(file.category)
  );

  useEffect(() => {
    const loadTechStackData = async () => {
      if (!user?.id || !activeCompanyId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await getTechStackData(user.id, activeCompanyId);

        if (response.success && response.data) {
          setVideoUrl(response.data.videoUrl);
          setFiles(response.data.files || []);
        }
      } catch (err) {
        console.error("Error loading tech stack data:", err);
        toast({
          title: "Error",
          description: "Failed to load tech stack data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTechStackData();
  }, [user, activeCompanyId, toast]);

  const handleSaveVideoLink = async (url: string) => {
    if (!user?.id || !activeCompanyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save video link",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const response = await saveVideoUrl(user.id, activeCompanyId, url);

      if (response.success) {
        setVideoUrl(url);
        toast({
          title: "Success",
          description: "Video link saved successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save video link",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving video link:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadFileByCategory = async (files: File[], category: string) => {
    if (!user?.id || !activeCompanyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Show initial notification when upload starts
      const initialToastId = toast({
        title: "Upload Started",
        description: `Starting upload of ${files.length} ${
          files.length === 1 ? "file" : "files"
        }...`,
        variant: "default",
      });

      for (const file of files) {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 8) {
          toast({
            title: "File Too Large",
            description: `The file ${file.name} is ${fileSizeInMB.toFixed(1)}MB. Please upload files smaller than 8MB.`,
            variant: "destructive",
          });
          continue;
        }

        // Create a unique toast ID for this file
        const fileToastId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Show toast for this specific file upload
        toast({
          title: "Uploading...",
          description: file.name,
          variant: "default",
        });

        try {
          const response = await uploadTechStackFile(
            user.id,
            activeCompanyId,
            file,
            category
          );

          if (response.success && response.data) {
            setFiles((prev) => [...prev, response.data as TechStackFile]);

            // Update the file's specific toast with success
            toast({
              title: "Upload Complete",
              description: `${file.name} uploaded successfully`,
              variant: "default",
            });
          } else {
            console.error("Upload error:", response.message);
            
            // Update the file's specific toast with error
            toast({
              title: "Upload Failed",
              description: response.message || `Failed to upload ${file.name}`,
              variant: "destructive",
            });
          }
        } catch (uploadError) {
          console.error("Error in file upload:", uploadError);
          
          // Update the file's specific toast with error
          toast({
            title: "Upload Error",
            description: `${file.name} - The file couldn't be uploaded. Please try again.`,
            variant: "destructive",
          });
        }
      }

      // Show a final summary toast
      toast({
        title: "Upload Complete",
        description: `${
          category === 'pitch_deck'
            ? 'Pitch deck'
            : category === 'financials'
            ? 'Financial documents'
            : 'Media files'
        } have been processed`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error uploading file:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePitchDeckUpload = (files: File[]) => {
    uploadFileByCategory(files, "pitch_deck");
  };

  const handleFinancialsUpload = (files: File[]) => {
    uploadFileByCategory(files, "financials");
  };

  const handleMediaUpload = (files: File[]) => {
    for (const file of files) {
      let category;
      if (file.type.startsWith('image/')) {
        category = 'image';
      } else if (file.type.startsWith('video/')) {
        category = 'video';
      } else {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported image or video format.`,
          variant: "destructive",
        });
        continue;
      }
      
      uploadFileByCategory([file], category);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete files",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const response = await deleteTechStackFile(user.id, fileId);

      if (response.success) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId));

        toast({
          title: "Success",
          description: "File deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete file",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = () => {
    toast({
      title: "Success",
      description: "All changes have been saved",
      variant: "default",
    });

    if (onTabChange) {
      onTabChange("promote");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
              Tech Stack
            </h1>
          </div>

          {activeCompanyId && activeCompany && (
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-md">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-zinc-300">Company:</span>
              <span className="font-medium text-white">
                {activeCompany.company_name || ""}
              </span>
            </div>
          )}
        </div>

        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-start gap-3">
            <BarChart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-zinc-200">
                Share your technical documentation and presentation materials
                with potential investors.
              </p>
              <div className="flex items-center text-primary/80 text-sm mt-2 hover:text-primary transition-colors cursor-pointer">
                <span>Learn how to showcase your technology effectively</span>
              </div>
            </div>
          </div>
        </div>

        {!activeCompanyId && (
          <div className="bg-amber-900/20 border border-amber-700/50 p-6 rounded-lg text-center mb-8">
            <Building className="h-10 w-10 text-amber-500/80 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-200 mb-2">
              No Company Selected
            </h3>
            <p className="text-amber-300/80 mb-4 max-w-md mx-auto">
              Please select a company from your dashboard to manage tech stack
              information.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="text-zinc-400">Loading tech stack data...</div>
        </div>
      ) : activeCompanyId ? (
        <>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <VideoLinkInput onSave={handleSaveVideoLink} />

            {videoUrl && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-zinc-400 mb-3">
                  Current Video
                </h4>
                <div className="bg-zinc-800 rounded-md p-3 flex items-center justify-between">
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {videoUrl}
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSaveVideoLink("")}
                    disabled={isSaving}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Tech Stack Details
            </h2>

            <FileUpload
              title="Upload Pitch Deck (PDF)"
              acceptedFormats="pdf"
              onFilesAdded={handlePitchDeckUpload}
              existingFiles={pitchDeckFiles.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                onRemove: () => handleFileDelete(file.id),
              }))}
            />

            <FileUpload
              title="Upload Financials (PDF, Excel, Google Sheet)"
              acceptedFormats="pdf,xls,xlsx,csv"
              onFilesAdded={handleFinancialsUpload}
              existingFiles={financialFiles.map((file) => ({
                id: file.id,
                name: file.file_name,
                size: file.file_size,
                type: file.file_type,
                onRemove: () => handleFileDelete(file.id),
              }))}
            />

            <MediaUpload
              maxCount={5}
              onFilesAdded={handleMediaUpload}
              existingMedia={mediaFiles.map((file) => ({
                id: file.id,
                type: file.category,
                name: file.file_name,
                preview: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${file.storage_path}`,
                onRemove: () => handleFileDelete(file.id),
              }))}
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => router.back()}
            >
              BACK
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSaveAndContinue}
              disabled={isSaving}
            >
              SAVE & CONTINUE
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
