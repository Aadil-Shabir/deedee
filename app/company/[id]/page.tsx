"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCompanyQuery } from "@/hooks/query-hooks/useCompanyData";
import { CompanyProfileHeader } from "@/app/components/ui/company/profile-pages/company-profile-header";
import { CompanyProfileTabs } from "@/app/components/ui/company/profile-pages/company-profile-tabs";
import { CompanyProfileOverview } from "@/app/components/ui/company/profile-pages/company-profile-overview";
import { ComingSoonTab } from "@/app/components/ui/company/profile-pages/coming-soon-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyData } from "@/types/company";
import { CompanyProfileCapTable } from "@/app/components/ui/company/profile-pages/company-profile-captable";

type TabId =
  | "overview"
  | "dealsummary"
  | "reviews"
  | "questions"
  | "updates"
  | "dataroom"
  | "captable";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "dealsummary", label: "Deal Summary" },
  { id: "reviews", label: "Reviews" },
  { id: "questions", label: "Questions" },
  { id: "updates", label: "Updates" },
  { id: "dataroom", label: "Data Room" },
  { id: "captable", label: "Captable" },
];

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isMounted, setIsMounted] = useState(false);

  const { data: companyData, isLoading, error } = useCompanyQuery(companyId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CompanyProfileOverview companyId={companyId} />;
      case "captable":
        return <CompanyProfileCapTable companyId={companyId} />;  
      default:
        return (
          <ComingSoonTab
            tabName={tabs.find((tab) => tab.id === activeTab)?.label || ""}
          />
        );
    }
  };

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <div className="bg-zinc-800 border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-24" />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Company Not Found
          </h1>
          <p className="text-zinc-400">
            {error?.message ||
              "The company you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <CompanyProfileHeader company={companyData} />

      <CompanyProfileTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="bg-zinc-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
