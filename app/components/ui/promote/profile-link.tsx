import React from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

export function ProfileLink() {
  return (
    <div className="w-full py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Promote</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-medium text-white mb-4">Here is your DeeDee profile link</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 text-zinc-300 flex items-center">
            https://deedee.ai/company/...
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300">
            <ClipboardCopy className="h-4 w-4" />
            <span>Copy</span>
          </Button>
        </div>
        
        <div className="mt-6">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            Visit Profile
          </Button>
        </div>
      </div>
    </div>
  );
} 