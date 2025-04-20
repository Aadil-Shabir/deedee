"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileProgressProps {
  completionPercentage?: number;
}

export function ProfileProgress({ completionPercentage = 0 }: ProfileProgressProps) {
  return (
    <div className="w-full bg-[#121218] py-4 px-6 border-b border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-zinc-100 text-lg font-medium">Profile Completion</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-zinc-400 hover:text-zinc-300">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">
                  Complete your profile to increase visibility to investors and partners.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-zinc-400 text-sm">{completionPercentage}%</span>
      </div>
      
      <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
    </div>
  );
} 