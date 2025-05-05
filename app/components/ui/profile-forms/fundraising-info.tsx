"use client";

import { useState, useEffect } from "react";
import { useCompanyContext } from "@/context/company-context";
import { FundraisingTabs } from "../fundraising/fundraising-tabs";
import { CurrentRound } from "../fundraising/current-round";
import { PastFundraising } from "../fundraising/past-fundraising";
import { Progress } from "@/components/ui/progress";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FundraisingInfo({onComplete}: {onComplete: ()=> void}) {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const { activeCompanyId, allUserCompanies } = useCompanyContext();
  
  const handleTabChange = (tab: "current" | "past") => {
    setActiveTab(tab);
  };

  const handleSwitchToPast = () => {
    setActiveTab("past");
  };
  
  const handleSwitchToCurrent = () => {
    setActiveTab("current");
  };
  
  // Find active company name
  const activeCompany = allUserCompanies?.find(c => c.id === activeCompanyId);

  return (
    <div className="container mx-auto py-8">
      {/* Header section */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
            Fundraising
          </h1>
          
          {activeCompanyId && activeCompany ? (
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-md">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-zinc-300">Company:</span>
              <span className="font-medium text-white">{activeCompany.company_name || activeCompany.company_name}</span>
            </div>
          ) : null}
        </div>
        
        <p className="text-zinc-400 max-w-3xl mb-4">
          Provide details about your fundraising goals and history. This information helps 
          investors understand your financial needs and previous backing.
        </p>
        
        {!activeCompanyId && (
          <div className="bg-amber-900/20 border border-amber-700/50 p-6 rounded-lg text-center mb-8">
            <Building className="h-10 w-10 text-amber-500/80 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-200 mb-2">No Company Selected</h3>
            <p className="text-amber-300/80 mb-4 max-w-md mx-auto">
              Please select a company from your dashboard to manage fundraising information.
            </p>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Only show tabs and content if company is selected */}
      {activeCompanyId && (
        <>
          <FundraisingTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === "current" ? (
            <CurrentRound onNext={handleSwitchToPast} onComplete={onComplete} />
          ) : (
            <PastFundraising onBack={handleSwitchToCurrent} onComplete={onComplete}/>
          )}
        </>
      )}
    </div>
  );
}