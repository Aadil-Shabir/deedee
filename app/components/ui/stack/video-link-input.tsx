"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VideoLinkInputProps {
  initialValue?: string;
  onSave: (url: string) => Promise<void>;
}

export function VideoLinkInput({ initialValue = "", onSave }: VideoLinkInputProps) {
  const [videoUrl, setVideoUrl] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [embeddableUrl, setEmbeddableUrl] = useState<string | null>(null);

  // Function to check if URL is from Loom and get embed URL
  const processVideoUrl = (url: string) => {
    // Check if it's a Loom URL
    const loomPattern = /https:\/\/(www\.)?loom\.com\/share\/([\w\d]+)/;
    const loomMatch = url.match(loomPattern);

    if (loomMatch && loomMatch[2]) {
      const videoId = loomMatch[2];
      // Convert to embeddable URL
      return `https://www.loom.com/embed/${videoId}`;
    }
    
    // Check if it's a YouTube URL
    const youtubePattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubePattern);
    
    if (youtubeMatch && youtubeMatch[1]) {
      const videoId = youtubeMatch[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If not a recognized format, return null
    return null;
  };

  // Update embeddable URL when video URL changes
  useEffect(() => {
    if (videoUrl) {
      const embedUrl = processVideoUrl(videoUrl);
      setEmbeddableUrl(embedUrl);
    } else {
      setEmbeddableUrl(null);
    }
  }, [videoUrl]);

  const handleSave = async () => {
    if (!videoUrl) return;

    try {
      setIsSaving(true);
      await onSave(videoUrl);
    } catch (error) {
      console.error("Error saving video link:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowPreview = () => {
    if (embeddableUrl) {
      setShowPreview(true);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-zinc-100">Add Demo Video</h3>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          <Input
            type="url"
            placeholder="Enter URL from Loom or YouTube"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="bg-zinc-800/70 border-zinc-700 focus:border-primary/50 text-zinc-200 placeholder:text-zinc-500"
          />
          <Button 
            onClick={handleSave} 
            disabled={!videoUrl || isSaving}
            className="bg-primary hover:bg-primary/90 min-w-[90px]"
          >
            {isSaving ? "Saving..." : "Save URL"}
          </Button>
        </div>

        {videoUrl && embeddableUrl && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-primary border-primary/30 hover:bg-primary/10"
              onClick={handleShowPreview}
            >
              <Video className="mr-2 h-4 w-4" />
              Preview Video
            </Button>
            {videoUrl.includes("loom.com") && (
              <p className="text-xs text-emerald-400">
                Loom video detected! Click preview to watch.
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-zinc-500">
          Add a link to your product demo video from Loom, YouTube, or other video platforms.
        </p>
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-3xl bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Video Preview</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Viewing: {videoUrl}
            </DialogDescription>
          </DialogHeader>
          
          <div className="aspect-video w-full mt-4 bg-black rounded-md overflow-hidden">
            {embeddableUrl && (
              <iframe
                src={embeddableUrl}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            )}
          </div>
          
          {videoUrl.includes("loom.com") && (
            <div className="mt-4 flex justify-center">
              <a 
                href={videoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-primary text-white font-medium hover:opacity-90 transition-all shadow-lg"
              >
                <Video className="mr-2 h-5 w-5" />
                Open in Loom
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}