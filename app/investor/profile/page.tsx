"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestorProfileInfo from "@/app/components/ui/profile-forms/investor-profile-info";
import InvestmentMandate from "@/app/components/ui/profile-forms/investment-mandate";
import { MetricsContent } from "@/app/components/ui/investor-profile/metrics-content";
import { MatchContent } from "@/app/components/ui/investor-profile/match-content";
import InvestorBusinessInfo from "@/app/components/ui/investor/investor-business";
import { InvestorPortfolioForm } from "@/app/components/ui/investor-profile/portfolio-manager";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Investor Profile</h1>
      <p className="text-zinc-400 mb-8">Manage your investment profile and preferences</p>

      <Tabs defaultValue={activeTab} className="w-full max-w-full overflow-hidden">
        <TabsList className="flex flex-wrap mb-0 bg-[#111827] border-b border-zinc-800 rounded-t-lg overflow-hidden px-2 pb-12">
          <TabsTrigger
            value="profile"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Business
          </TabsTrigger>
          <TabsTrigger
            value="mandate"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            <span className="hidden md:inline">Investment </span>Mandate
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Portfolio
          </TabsTrigger>
          <TabsTrigger
            value="match"
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Match
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 bg-[#111827] rounded-b-lg">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <InvestorProfileInfo />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="business" className="mt-0 bg-[#111827] rounded-b-lg">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <InvestorBusinessInfo />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="mandate" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-5xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <InvestmentMandate />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <MetricsContent />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <InvestorPortfolioForm />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="match" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <MatchContent />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1424] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-t-2 border-violet-500 rounded-full"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
    </div>
  );
}