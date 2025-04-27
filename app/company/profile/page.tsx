"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileTabs } from "@/app/components/ui/profile-tabs";
import ProfileInfo from "@/app/components/ui/profile-forms/profile-info";
import { TeamInfo } from "@/app/components/ui/profile-forms/team-info";
import { FundraisingInfo } from "@/app/components/ui/profile-forms/fundraising-info";
import { TractionInfo } from "@/app/components/ui/profile-forms/traction-info";
import { StackInfo } from "@/app/components/ui/profile-forms/stack-info";
import { CompanyContextProvider, useCompanyContext } from "@/context/company-context";
import CompanyProfilePage from "@/app/components/ui/business-forms/business-profile";

// List of valid tabs for validation
const validTabs = [
  "profile", 
  "business", 
  "team", 
  "fundraising", 
  "traction", 
  "stack", 
  "promote", 
  "reports", 
  "reviews", 
  "match"
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Effect to sync activeTab with URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update tab handler to also update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update URL without full navigation (preserves state)
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`/company/profile?${params.toString()}`, { scroll: false });
  };
  
  return (
    <div className="min-h-full">
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 py-8 px-6">
        {activeTab === "profile" ? (
          <ProfileInfo />
        ) : activeTab === "business" ? (
            <CompanyProfilePage />
        ) : activeTab === "team" ? (
          <TeamInfo />
        ) : activeTab === "fundraising" ? (
          <FundraisingInfo />
        ) : activeTab === "traction" ? (
          <TractionInfo />
        ) : activeTab === "stack" ? (
          <StackInfo onTabChange={handleTabChange} />
        ) : activeTab === "promote" ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Promote Your Company</h2>
            {/* Promote section content */}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
            <p className="text-zinc-400 text-lg">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}