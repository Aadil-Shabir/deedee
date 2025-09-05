"use client";

import { useState, useEffect, Suspense, ReactNode } from "react"; // Added ReactNode
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileTabs } from "@/app/components/ui/profile-tabs";
import ProfileInfo from "@/app/components/ui/profile-forms/profile-info";
import { TeamInfo } from "@/app/components/ui/profile-forms/team-info";
import { FundraisingInfo } from "@/app/components/ui/profile-forms/fundraising-info";
import { TractionInfo } from "@/app/components/ui/profile-forms/traction-info";
import { StackInfo } from "@/app/components/ui/profile-forms/stack-info";
import { PromoteForm } from "@/app/components/ui/profile-forms/promote-form";
import { ReportForm } from "@/app/components/ui/profile-forms/report-form";
import { CompanyReviews } from "@/app/components/ui/profile-forms/review-form";
import { MatchForm } from "@/app/components/ui/profile-forms/match-form";
import { useProfileContext } from "@/context/profile-context";
import { ProfileProgress } from "@/app/components/layout/profile-progress";
import { useUser } from "@/hooks/use-user";
import { useCompanyContext } from "@/context/company-context";
import CompanyProfilePage from "@/app/components/ui/company/business-forms/business-profile";
import { useCallback } from "react";
import { useProfileCompletion } from "@/hooks/query-hooks/use-profile-completion";
import { useCompanyQuery } from "@/hooks/query-hooks/useCompanyData";


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
  "match",
] as const; // Make this a const array for better type safety

// Define a Tab type based on the valid tabs
export type TabId = typeof validTabs[number];

// Add proper types to TabSynchronizer
interface TabSynchronizerProps {
  setActiveTab: (tab: TabId) => void;
}

function TabSynchronizer({ setActiveTab }: TabSynchronizerProps): null {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabId | null;
    if (tabParam && validTabs.includes(tabParam as TabId)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  return null; 
}

export default function ProfilePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const router = useRouter();
  const { completedTabs, markTabCompleted } = useProfileContext();
  const { user } = useUser();
  const { activeCompanyId } = useCompanyContext();


    const { 
    data: profileData, 
    isLoading: isLoadingProgress, 
    error: profileError 
  } = useProfileCompletion(activeCompanyId || "");

    const { 
    data: companyData,
    isLoading: isLoadingCompany,
    error: companyError
  } = useCompanyQuery(activeCompanyId || "");


  const profileCompletionPercentage = profileData?.completionPercentage || 0;



  // Update tab handler to also update URL
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);

    // Mark the previous tab as completed when changing tabs
    if (activeTab && activeTab !== tabId) {
      markTabCompleted(activeTab);
    }

    // Update URL without full navigation (preserves state)
    router.replace(`/company/profile?tab=${tabId}`, { scroll: false });
  };

  // Function to render the active tab content
  const renderTabContent = (): ReactNode => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo onComplete={() => markTabCompleted("profile")} />;
      case "business":
        return <CompanyProfilePage onComplete={() => markTabCompleted("business")} />;
      case "team":
        return <TeamInfo onComplete={() => markTabCompleted("team")} />;
      case "fundraising":
        return <FundraisingInfo onComplete={() => markTabCompleted("fundraising")} />;
      case "traction":
        return <TractionInfo onComplete={() => markTabCompleted("traction")} />;
      case "stack":
        return <StackInfo onTabChange={(tabId: string) => {
          // Only change tab if it's a valid TabId
          if (validTabs.includes(tabId as TabId)) {
            handleTabChange(tabId as TabId);
          }
        }} onComplete={() => markTabCompleted("stack")} />;
      case "promote":
        return <PromoteForm onComplete={() => markTabCompleted("promote")} />;
      case "reports":
        return <ReportForm onComplete={() => markTabCompleted("reports")} />;
      case "reviews":
        return <CompanyReviews onComplete={() => markTabCompleted("reviews")} />;
      case "match":
        return <MatchForm onComplete={() => markTabCompleted("match")} />;
      default:
        return (
          <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
            <p className="text-zinc-400 text-lg">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-full">
      <ProfileProgress
        completionPercentage={profileCompletionPercentage}
        isLoading={isLoadingProgress}
      />

      {/* Suspense boundary for the component that uses useSearchParams */}
      <Suspense fallback={null}>
        <TabSynchronizer setActiveTab={setActiveTab} />
      </Suspense>

      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 py-4 md:py-8 px-3 md:px-6">
        {renderTabContent()}
      </div>
    </div>
  );
}