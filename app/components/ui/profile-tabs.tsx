import { TabId } from "@/app/company/profile/page";
import { useState } from "react";

const defaultTabItems = [
  { id: "profile", label: "Profile" },
  { id: "business", label: "Business" },
  { id: "team", label: "Team" },
  { id: "fundraising", label: "Fundraising" },
  { id: "traction", label: "Traction" },
  { id: "stack", label: "Stack" },
  { id: "promote", label: "Promote" },
  { id: "reports", label: "Reports" },
  { id: "reviews", label: "Reviews" },
  { id: "match", label: "Match" },
];

interface TabItem {
  id: string;
  label: string;
}

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: TabId) => void;
  tabs?: TabItem[];
}

export function ProfileTabs({ activeTab, onTabChange, tabs }: ProfileTabsProps) {
  // Use custom tabs if provided, otherwise use default tabs
  const tabItems = tabs || defaultTabItems;
  
  // Define special tabs that use violet color
  const specialTabs = ["promote", "reports", "reviews", "match", "analytics"];
  
  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-full mx-auto px-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabId)}
              className={`py-4 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? specialTabs.includes(tab.id)
                    ? "text-violet-500"
                    : "text-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div 
                  className={`absolute bottom-0 left-0 h-0.5 w-full ${
                    specialTabs.includes(tab.id)
                      ? "bg-violet-500" 
                      : "bg-primary"
                  }`}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 