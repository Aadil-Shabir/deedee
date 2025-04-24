"use client";

import { useState } from "react";
import { ProfileTabs } from "@/app/components/ui/profile-tabs";
import ProfileInfo from "@/app/components/ui/profile-forms/profile-info";
import { TeamInfo } from "@/app/components/ui/profile-forms/team-info";
import { FundraisingInfo } from "@/app/components/ui/profile-forms/fundraising-info";
import { TractionInfo } from "@/app/components/ui/profile-forms/traction-info";
import { StackInfo } from "@/app/components/ui/profile-forms/stack-info";
import { CompanyContextProvider, useCompanyContext } from "@/context/company-context";
import CompanyProfilePage from "@/app/components/ui/business-forms/business-profile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div className="min-h-full">
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
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
          <StackInfo />
        ) : (
          <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
            <p className="text-zinc-400 text-lg">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}