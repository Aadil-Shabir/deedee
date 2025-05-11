"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileTabs } from "@/app/components/ui/profile-tabs";
import ProfileInfo from "@/app/components/ui/profile-forms/profile-info";
// import CompanyProfilePage from "@/app/components/ui/business-forms/business-profile";
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
];

// Create a component that uses useSearchParams inside Suspense
function TabSynchronizer({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  return null; // This component doesn't render anything
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { completedTabs, markTabCompleted } = useProfileContext();
  const { user } = useUser();
  const { activeCompanyId } = useCompanyContext();
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Calculate profile completion percentage based on data
  useEffect(() => {
    async function fetchProfileCompletion() {
      if (!user || !activeCompanyId) {
        setIsLoadingProgress(false); // Don't keep loading if we don't have user/company
        return;
      }

      setIsLoadingProgress(true);
      let completedSections = 0;
      const totalSections = 6; // profile, business, team, fundraising, traction, stack

      try {
        const supabase = await createClient();

        // Get company profile data
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", activeCompanyId)
          .single();

        if (companyError) {
          console.error("Error fetching company data:", companyError);
        }

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

        // Get team members count
        const { count: teamCount, error: teamError } = await supabase
          .from("team_members")
          .select("id", { count: "exact", head: true })
          .eq("company_id", activeCompanyId);

        if (teamError) {
          console.error("Error fetching team data:", teamError);
        }

        // Check team completion
        if (teamCount && teamCount > 0) {
          completedSections += 1; // Team section
        }

        // Get fundraising data
        const { data: fundraisingData, error: fundraisingError } = await supabase
          .from("fundraising_current")
          .select("*")
          .eq("company_id", activeCompanyId)
          .maybeSingle();

        if (fundraisingError) {
          console.error("Error fetching fundraising data:", fundraisingError);
        }

        // Check fundraising completion
        if (
          fundraisingData &&
          (fundraisingData.funding_stage || fundraisingData.amount_raised !== null)
        ) {
          completedSections += 1; // Fundraising section
        }

        // Get traction data
        const { data: tractionData, error: tractionError } = await supabase
          .from("traction_data")
          .select("*")
          .eq("company_id", activeCompanyId)
          .maybeSingle();

        if (tractionError) {
          console.error("Error fetching traction data:", tractionError);
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

        // Get tech stack count
        const { count: stackCount, error: stackError } = await supabase
          .from("tech_stack")
          .select("id", { count: "exact", head: true })
          .eq("company_id", activeCompanyId);

        if (stackError) {
          console.error("Error fetching tech stack data:", stackError);
        }

        // Check tech stack completion
        if (stackCount && stackCount > 0) {
          completedSections += 1; // Stack section
        }

        // Calculate percentage (each section is worth equal percentage)
        const percentage = Math.round((completedSections / totalSections) * 100);
        console.log(`Profile completion: ${completedSections}/${totalSections} = ${percentage}%`);

        setProfileCompletionPercentage(percentage);
      } catch (error) {
        console.error("Error calculating profile completion:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    }

    fetchProfileCompletion();
  }, [user, activeCompanyId]);

  // Update tab handler to also update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // Mark the previous tab as completed when changing tabs
    if (activeTab && activeTab !== tabId) {
      markTabCompleted(activeTab);
    }

    // Update URL without full navigation (preserves state)
    router.replace(`/company/profile?tab=${tabId}`, { scroll: false });
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
        {activeTab === "profile" ? (
          <ProfileInfo onComplete={() => markTabCompleted("profile")} />
        ) : activeTab === "business" ? (
          <CompanyProfilePage onComplete={() => markTabCompleted("business")} />
        ) : activeTab === "team" ? (
          <TeamInfo onComplete={() => markTabCompleted("team")} />
        ) : activeTab === "fundraising" ? (
          <FundraisingInfo onComplete={() => markTabCompleted("fundraising")} />
        ) : activeTab === "traction" ? (
          <TractionInfo onComplete={() => markTabCompleted("traction")} />
        ) : activeTab === "stack" ? (
          <StackInfo onTabChange={handleTabChange} onComplete={() => markTabCompleted("stack")} />
        ) : activeTab === "promote" ? (
          <PromoteForm onComplete={() => markTabCompleted("promote")} />
        ) : activeTab === "reports" ? (
          <ReportForm onComplete={() => markTabCompleted("reports")} />
        ) : activeTab === "reviews" ? (
          <CompanyReviews onComplete={() => markTabCompleted("reviews")} />
        ) : activeTab === "match" ? (
          <MatchForm onComplete={() => markTabCompleted("match")} />
        ) : (
          <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
            <p className="text-zinc-400 text-lg">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}