"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface VideoLinkInputProps {
  onSave: (url: string) => void;
}

export function VideoLinkInput({ onSave }: VideoLinkInputProps) {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSave = () => {
    if (videoUrl.trim()) {
      onSave(videoUrl);
      setVideoUrl("");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-zinc-100">Add YouTube or Loom Video Link</h3>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
            <Link className="h-4 w-4" />
          </div>
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
            className="pl-10 bg-zinc-800/50 border-zinc-700 focus:border-primary"
          />
        </div>
        <Button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90"
        >
          Save Link
        </Button>
      </div>
    </div>
  );
} 