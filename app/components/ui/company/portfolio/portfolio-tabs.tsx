"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface PortfolioTabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange: (tabId: string) => void;
}

export function PortfolioTabs({ 
  tabs, 
  defaultActiveTab, 
  onTabChange 
}: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="flex bg-[#171e2e] rounded-lg overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors",
            activeTab === tab.id 
              ? "bg-violet-600 text-white" 
              : "text-zinc-400 hover:text-white"
          )}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.id
                ? "bg-violet-700 text-white"
                : "bg-zinc-800 text-zinc-400"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
} 