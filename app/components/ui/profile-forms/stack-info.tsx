"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layers, BarChart } from "lucide-react";
import { VideoLinkInput } from "../stack/video-link-input";
import { FileUpload } from "../stack/file-upload";
import { MediaUpload } from "../stack/media-upload";

export function StackInfo() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const handleSaveVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  const handlePitchDeckUpload = (files: File[]) => {
    console.log("Pitch deck files:", files);
    // Here you would upload the file to your server/storage
  };

  const handleFinancialsUpload = (files: File[]) => {
    console.log("Financial files:", files);
    // Here you would upload the file to your server/storage
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Stack Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
            Tech Stack
          </h1>
        </div>
        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-start gap-3">
            <BarChart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-zinc-200">
                Share your technical documentation and presentation materials with potential investors.
              </p>
              <div className="flex items-center text-primary/80 text-sm mt-2 hover:text-primary transition-colors cursor-pointer">
                <span>Learn how to showcase your technology effectively</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Link Section */}
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <VideoLinkInput onSave={handleSaveVideoLink} />
        
        {videoUrl && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">Current Video</h4>
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
                onClick={() => setVideoUrl(null)}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tech Stack Details */}
      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Tech Stack Details</h2>
        
        {/* Pitch Deck Upload */}
        <FileUpload 
          title="Upload Pitch Deck (PDF)"
          acceptedFormats="pdf"
          onFilesAdded={handlePitchDeckUpload}
        />
        
        {/* Financials Upload */}
        <FileUpload 
          title="Upload Financials (PDF, Excel, Google Sheet)"
          acceptedFormats="pdf, xls, xlsx, csv, gsheet"
          onFilesAdded={handleFinancialsUpload}
        />
        
        {/* Images/Videos Upload */}
        <MediaUpload maxCount={5} />
      </div>

      <div className="flex justify-between pt-4 border-t border-zinc-800">
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          BACK
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          SAVE & CONTINUE
        </Button>
      </div>
    </div>
  );
} 