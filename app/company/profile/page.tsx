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
import { createClient } from "@/supabase/supabase";
import { useUser } from "@/hooks/use-user";
import { useCompanyContext } from "@/context/company-context";
import CompanyProfilePage from "@/app/components/ui/company/business-forms/business-profile";
import { useCallback } from "react";

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
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState<number>(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  // Add proper type for the company data
  interface CompanyData {
    id: string;
    company_name?: string | null;
    web_url?: string | null;
    short_description?: string | null;
    full_description?: string | null;
    [key: string]: any; // Allow other properties
  }

  interface FundraisingData {
    funding_stage?: string | null;
    amount_raised?: number | null;
    [key: string]: any; // Allow other properties
  }

  interface TractionData {
    revenue?: number | null;
    users?: number | null;
    growth_rate?: number | null;
    [key: string]: any; // Allow other properties
  }

  // Memoize the fetchProfileCompletion function to prevent unnecessary recreations
  const fetchProfileCompletion = useCallback(async () => {
    if (!user || !activeCompanyId) {
      setIsLoadingProgress(false); // Don't keep loading if we don't have user/company
      return;
    }

    setIsLoadingProgress(true);
    let completedSections = 0;
    const totalSections = 6; // profile, business, team, fundraising, traction, stack

    try {
      const supabase = createClient(); // No need for await here, createClient is synchronous

      // Use Promise.all for concurrent requests to improve performance
      const [
        companyResponse,
        teamCountResponse,
        fundraisingResponse,
        tractionResponse,
        stackCountResponse
      ] = await Promise.all([
        // Get company profile data
        supabase
          .from("companies")
          .select("*")
          .eq("id", activeCompanyId)
          .single(),
        
        // Get team members count
        supabase
          .from("team_members")
          .select("id", { count: "exact", head: true })
          .eq("company_id", activeCompanyId),
        
        // Get fundraising data
        supabase
          .from("fundraising_current")
          .select("*")
          .eq("company_id", activeCompanyId)
          .maybeSingle(),
        
        // Get traction data
        supabase
          .from("traction_data")
          .select("*")
          .eq("company_id", activeCompanyId)
          .maybeSingle(),
        
        // Get tech stack count
        supabase
          .from("tech_stack")
          .select("id", { count: "exact", head: true })
          .eq("company_id", activeCompanyId)
      ]);

      // Destructure responses with proper typing
      const { data: companyData, error: companyError } = companyResponse as { data: CompanyData | null; error: Error | null };
      const { count: teamCount, error: teamError } = teamCountResponse as { count: number | null; error: Error | null };
      const { data: fundraisingData, error: fundraisingError } = fundraisingResponse as { data: FundraisingData | null; error: Error | null };
      const { data: tractionData, error: tractionError } = tractionResponse as { data: TractionData | null; error: Error | null };
      const { count: stackCount, error: stackError } = stackCountResponse as { count: number | null; error: Error | null };

      // Log any errors but continue processing
      [
        { name: "company", error: companyError },
        { name: "team", error: teamError },
        { name: "fundraising", error: fundraisingError },
        { name: "traction", error: tractionError },
        { name: "stack", error: stackError }
      ].forEach(item => {
        if (item.error) {
          console.error(`Error fetching ${item.name} data:`, item.error);
        }
      });

      // Check company profile completion
      if (
        companyData &&
        companyData.company_name &&
        companyData.web_url &&
        companyData.short_description
      ) {
        completedSections += 1; // Profile section

        if (companyData.full_description) {
          completedSections += 1; // Business section
        }
      }

      // Check team completion
      if (teamCount && teamCount > 0) {
        completedSections += 1; // Team section
      }

      // Check fundraising completion
      if (
        fundraisingData &&
        (fundraisingData.funding_stage || fundraisingData.amount_raised !== null)
      ) {
        completedSections += 1; // Fundraising section
      }

      // Check traction completion
      if (
        tractionData &&
        (tractionData.revenue !== null ||
          tractionData.users !== null ||
          tractionData.growth_rate !== null)
      ) {
        completedSections += 1; // Traction section
      }

      // Check tech stack completion
      if (stackCount && stackCount > 0) {
        completedSections += 1; // Stack section
      }

      // Calculate percentage (each section is worth equal percentage)
      const percentage = Math.round((completedSections / totalSections) * 100);
      
      setProfileCompletionPercentage(percentage);
    } catch (error) {
      console.error("Error calculating profile completion:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user, activeCompanyId]);

  // Calculate profile completion percentage based on data
  useEffect(() => {
    fetchProfileCompletion();
  }, [fetchProfileCompletion]);

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