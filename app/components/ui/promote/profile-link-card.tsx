"use client";

import { useState } from "react";
import { LinkIcon, CheckIcon, ClipboardCopyIcon } from "@heroicons/react/outline";

interface ProfileLinkCardProps {
  profileUrl: string;
}

export function ProfileLinkCard({ profileUrl }: ProfileLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="rounded-lg backdrop-blur-sm bg-zinc-800/50 border border-zinc-700 p-6 animate-float shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <LinkIcon className="h-5 w-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-zinc-100">Your Profile Link</h3>
      </div>

      <div className="flex items-center mt-3 relative">
        <div className="flex-1 overflow-hidden bg-zinc-900/50 rounded-l-md border border-zinc-700 p-3">
          <p className="text-zinc-300 text-sm truncate">{profileUrl}</p>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center bg-violet-600 hover:bg-violet-500 transition-colors p-3 rounded-r-md min-w-[60px] border border-violet-500"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-zinc-100" />
          ) : (
            <ClipboardCopyIcon className="h-5 w-5 text-zinc-100" />
          )}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs text-zinc-400">
          Share this link with others to let them view your public profile.
        </p>
      </div>
    </div>
  );
} 