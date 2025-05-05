"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProfileContext } from "@/context/profile-context";
import { useState, useEffect } from "react";

interface ProfileProgressProps {
  completionPercentage?: number;
  isLoading?: boolean;
}

export function ProfileProgress({ 
  completionPercentage = 0,
  isLoading: initialLoading = false 
}: ProfileProgressProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [percentage, setPercentage] = useState(completionPercentage);
  
  // Use the context value if available, otherwise use the prop
  const profileContext = useProfileContext();

  useEffect(() => {
    // Set initial loading state
    setIsLoading(initialLoading);
    
    // If we have a valid percentage from props, use it
    if (completionPercentage > 0) {
      setPercentage(completionPercentage);
      setIsLoading(false);
    } 
    // Otherwise, try to get it from context
    else if (profileContext && profileContext.profileCompletionPercentage > 0) {
      setPercentage(profileContext.profileCompletionPercentage);
      setIsLoading(false);
    }
    
    // If both are 0, it might be legitimately 0% or still loading
    // Let the isLoading prop determine this
  }, [completionPercentage, initialLoading, profileContext]);
  
  // If loading persists for more than 3 seconds, assume it's 0%
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        // If no progress data after timeout, assume 0
        if (percentage === 0) {
          setPercentage(0);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, percentage]);

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
        <span className="text-zinc-400 text-sm">
          {isLoading ? "Loading..." : `${percentage}%`}
        </span>
      </div>
      
      <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isLoading 
              ? 'bg-zinc-600 animate-pulse' 
              : 'bg-violet-600'
          }`}
          style={{ width: `${isLoading ? 30 : percentage}%` }}
        ></div>
      </div>
    </div>
  );
}