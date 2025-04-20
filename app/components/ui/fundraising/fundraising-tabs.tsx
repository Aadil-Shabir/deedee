"use client";

interface FundraisingTabsProps {
  activeTab: "current" | "past";
  onTabChange: (tab: "current" | "past") => void;
}

export function FundraisingTabs({ activeTab, onTabChange }: FundraisingTabsProps) {
  return (
    <div className="flex bg-zinc-800/50 rounded-lg backdrop-blur-sm w-full max-w-3xl mx-auto mb-8">
      <button
        onClick={() => onTabChange("current")}
        className={`flex-1 py-3 text-center rounded-lg transition-colors ${
          activeTab === "current"
            ? "bg-primary text-white"
            : "bg-transparent text-zinc-400 hover:text-zinc-200"
        }`}
      >
        Current Round
      </button>
      <button
        onClick={() => onTabChange("past")}
        className={`flex-1 py-3 text-center rounded-lg transition-colors ${
          activeTab === "past"
            ? "bg-primary text-white"
            : "bg-transparent text-zinc-400 hover:text-zinc-200"
        }`}
      >
        Past Fundraising
      </button>
    </div>
  );
} 