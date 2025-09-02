"use client";

import { List, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaptableToggleProps {
  viewMode: "list" | "pie";
  onViewModeChange: (mode: "list" | "pie") => void;
}

export function CaptableToggle({ viewMode, onViewModeChange }: CaptableToggleProps) {
  return (
    <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-700 p-1 gap-1">
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className={`flex items-center gap-2 px-3 py-2 text-sm ${
          viewMode === "list"
            ? "bg-zinc-600 text-zinc-100"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
        }`}
      >
        <List className="h-4 w-4 " />
        List View
      </Button>
      
      <Button
        variant={viewMode === "pie" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("pie")}
        className={`flex items-center gap-2 px-3 py-2 text-sm ${
          viewMode === "pie"
            ? "bg-zinc-600 text-zinc-100"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
        }`}
      >
        <PieChart className="h-4 w-4" />
        Pie Chart
      </Button>
    </div>
  );
}
