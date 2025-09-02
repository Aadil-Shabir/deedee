"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface CompanyProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function CompanyProfileTabs({ tabs, activeTab, onTabChange }: CompanyProfileTabsProps) {
  return (
    <div className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-3 sm:py-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-zinc-400 hover:text-zinc-200 border-b-2 border-transparent hover:border-zinc-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
