"use client";

import { useState } from "react";
import { ChevronsUp, DollarSign } from "lucide-react";
import { FundraisingTabs } from "../fundraising/fundraising-tabs";
import { CurrentRound } from "../fundraising/current-round";
import { PastFundraising } from "../fundraising/past-fundraising";

export function FundraisingInfo() {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Fundraising Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
            Fundraising
          </h1>
        </div>
        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-start gap-3">
            <ChevronsUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-zinc-200">
                Provide details about your fundraising needs to attract suitable investors. Clarity in your financial goals helps investors understand your business trajectory.
              </p>
              <div className="flex items-center text-primary/80 text-sm mt-2 hover:text-primary transition-colors cursor-pointer">
                <span>View fundraising best practices</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <FundraisingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "current" ? (
        <CurrentRound />
      ) : (
        <PastFundraising />
      )}
    </div>
  );
} 