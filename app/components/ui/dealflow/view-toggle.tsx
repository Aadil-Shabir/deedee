"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex bg-[#171e2e] border border-zinc-800 rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-none h-9 w-9 ${
          viewMode === 'grid' 
            ? 'bg-zinc-800/80 text-white' 
            : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
        onClick={() => onViewModeChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-none h-9 w-9 ${
          viewMode === 'list' 
            ? 'bg-zinc-800/80 text-white' 
            : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
        onClick={() => onViewModeChange('list')}
        aria-label="List view"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
} 