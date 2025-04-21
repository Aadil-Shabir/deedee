"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronDown, Filter, Download, Share2 } from "lucide-react";

interface ActionButtonProps {
  onAction?: (action: string) => void;
}

export function ActionButton({ onAction }: ActionButtonProps) {
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg shadow-md flex items-center gap-2"
        >
          <span>Actions</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#171e2e] border-zinc-800 text-white min-w-[180px]">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
          onClick={() => handleAction('create-saved-search')}
        >
          <Plus className="h-4 w-4" />
          <span>Create Saved Search</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
          onClick={() => handleAction('filter')}
        >
          <Filter className="h-4 w-4" />
          <span>Apply Filters</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
          onClick={() => handleAction('export')}
        >
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
          onClick={() => handleAction('share')}
        >
          <Share2 className="h-4 w-4" />
          <span>Share Results</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 