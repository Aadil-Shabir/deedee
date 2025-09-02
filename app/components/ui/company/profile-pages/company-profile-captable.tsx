"use client";

import { useState } from "react";
import {
  useCaptableInvestors,
  useCaptableSummary,
} from "@/hooks/query-hooks/use-captable-data";
import { CaptableSummaryCards } from "./captable/captable-summary-cards";
import { CaptableToggle } from "./captable/captable-toggle";
import { CaptableList } from "./captable/captable-list";
import { CaptablePieChart } from "./captable/captable-pie-chart";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyProfileCapTableProps {
  companyId: string;
}

export function CompanyProfileCapTable({
  companyId,
}: CompanyProfileCapTableProps) {
  const [viewMode, setViewMode] = useState<"list" | "pie">("list");

  const {
    data: investorsData,
    isLoading: investorsLoading,
    error: investorsError,
  } = useCaptableInvestors(companyId);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useCaptableSummary(companyId);

  const isLoading = investorsLoading || summaryLoading;
  const hasError = investorsError || summaryError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-2">Failed to load cap table data</p>
        <p className="text-sm text-zinc-500">
          {investorsError?.message ||
            summaryError?.message ||
            "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     
      <CaptableSummaryCards summary={summaryData} />

      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-100">Cap Table</h2>
        <CaptableToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      
      <div className="bg-zinc-800 rounded-lg border border-zinc-700">
        {viewMode === "list" ? (
          <CaptableList investors={investorsData || []} />
        ) : (
          <CaptablePieChart investors={investorsData || []} />
        )}
      </div>
    </div>
  );
}
