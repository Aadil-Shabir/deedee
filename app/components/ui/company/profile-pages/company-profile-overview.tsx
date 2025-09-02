"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Percent,
  BarChart2,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Play,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/growth-calculations";

interface BusinessMetrics {
  mrr: number | null;
  arr: number | null;
  revenue_growth_percentage: number | null;
  client_growth_percentage: number | null;
  revenue_per_client: number | null;
  ltv_cac_ratio: number | null;
  customer_acquisition_efficiency: number | null;
  has_recurring_revenue: boolean;
  is_growing: boolean;
  has_profitable_business: boolean;
  has_healthy_margins: boolean;
  rule_of_40_score: number | null;
  has_positive_unit_economics: boolean;
}

interface TractionData {
  revenue_this_month: number | null;
  clients_this_month: number | null;
  has_recurring_revenue: boolean;
  gross_profit_margin: number | null;
  ebitda_margin: number | null;
}

interface MetricCardProps {
  title: string;
  value: string | number | null;
  // description?: string;
  icon: React.ReactNode;
  isPositive?: boolean;
  isNegative?: boolean;
  isCurrency?: boolean;
  isPercentage?: boolean;
  comparison?: string;
}

function MetricCard({
  title,
  value,
  // description,
  icon,
  isPositive = false,
  isNegative = false,
  isCurrency = false,
  isPercentage = false,
  comparison,
}: MetricCardProps) {
  const formattedValue =
    value === null || value === undefined
      ? "N/A"
      : isCurrency
      ? formatCurrency(Number(value))
      : isPercentage
      ? formatPercentage(Number(value))
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  const getTrendIndicator = () => {
    if (isPositive) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
    if (isNegative) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
    return null;
  };

  return (
    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-5 border border-zinc-700/50 hover:border-zinc-600/70 transition-all hover:shadow-lg shadow-zinc-900/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/20 text-primary">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        </div>
        {getTrendIndicator()}
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-zinc-100">{formattedValue}</h2>
          {comparison && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isPositive
                  ? "bg-green-950/50 text-green-400"
                  : isNegative
                  ? "bg-red-950/50 text-red-400"
                  : "bg-blue-950/50 text-blue-400"
              }`}
            >
              {comparison}
            </span>
          )}
        </div>
      </div>

      {/* <p className="text-xs text-zinc-400 leading-relaxed">{description || ""}</p> */}
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-5 border border-zinc-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

interface CompanyProfileOverviewProps {
  companyId: string;
}

async function fetchBusinessMetricsAndTraction(companyId: string) {
  const supabase = createClient();

  const { data: metricsData, error: metricsError } = await supabase
    .from("growth_metrics")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_latest", true)
    .maybeSingle();

  let tractionInfo = null;
  try {
    const { data: tractionResponse, error: tractionError } = await supabase
      .from("traction_data")
      .select(
        "revenue_this_month, clients_this_month, has_recurring_revenue, gross_profit_margin, ebitda_margin"
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!tractionError) {
      tractionInfo = tractionResponse;
    }
  } catch (tractionErr) {
    console.log("Traction data not available for this company");
  }

  if (metricsError && metricsError.code !== "PGRST116") {
    console.error("Error fetching metrics:", metricsError);
  }

  return {
    metrics: metricsData,
    tractionData: tractionInfo,
  };
}

export function CompanyProfileOverview({
  companyId,
}: CompanyProfileOverviewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["company-business-metrics", companyId],
    queryFn: () => fetchBusinessMetricsAndTraction(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const metrics = data?.metrics || null;
  const tractionData = data?.tractionData || null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!metrics && !tractionData) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-zinc-800">
            <BarChart3 className="h-8 w-8 text-zinc-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-zinc-200 mb-2">
          No Business Metrics Available
        </h3>
        <p className="text-zinc-400 max-w-md mx-auto">
          Business metrics will appear here once the company provides their
          traction and financial data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-6 border border-zinc-700/50">
        <h2 className="text-xl font-semibold text-zinc-100 mb-3 flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Introduction
        </h2>
        <p className="text-zinc-300 leading-relaxed">
          This will be intro section
        </p>
      </div>

      <h2 className="text-xl font-semibold text-zinc-100 mb-3 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-primary" />
        Business Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics?.mrr !== null && (
          <MetricCard
            title="Monthly Recurring Revenue"
            value={metrics.mrr}
            icon={<DollarSign className="h-4 w-4" />}
            isCurrency={true}
            isPositive={metrics.is_growing}
          />
        )}

        {metrics?.arr !== null && (
          <MetricCard
            title="Annual Recurring Revenue"
            value={metrics.arr}
            icon={<DollarSign className="h-4 w-4" />}
            isCurrency={true}
            isPositive={metrics.is_growing}
          />
        )}

        {tractionData?.revenue_this_month !== null &&
          tractionData?.revenue_this_month !== undefined && (
            <MetricCard
              title="Monthly Revenue"
              value={tractionData.revenue_this_month}
              icon={<TrendingUp className="h-4 w-4" />}
              isCurrency={true}
              isPositive={metrics?.is_growing}
            />
          )}

        {metrics?.revenue_growth_percentage !== null && (
          <MetricCard
            title="Revenue Growth"
            value={metrics.revenue_growth_percentage}
            icon={<TrendingUp className="h-4 w-4" />}
            isPositive={metrics.revenue_growth_percentage > 0}
            isNegative={metrics.revenue_growth_percentage < 0}
            isPercentage={true}
          />
        )}

        {metrics?.client_growth_percentage !== null && (
          <MetricCard
            title="Client Growth"
            value={metrics.client_growth_percentage}
            icon={<Users className="h-4 w-4" />}
            isPositive={metrics.client_growth_percentage > 0}
            isNegative={metrics.client_growth_percentage < 0}
            isPercentage={true}
          />
        )}

        {tractionData?.clients_this_month !== null &&
          tractionData?.clients_this_month !== undefined && (
            <MetricCard
              title="Active Clients"
              value={tractionData.clients_this_month}
              icon={<Users className="h-4 w-4" />}
            />
          )}

        {metrics?.revenue_per_client !== null && (
          <MetricCard
            title="Revenue per Client"
            value={metrics.revenue_per_client}
            icon={<Users className="h-4 w-4" />}
            isCurrency={true}
          />
        )}

        {metrics?.ltv_cac_ratio !== null && (
          <MetricCard
            title="LTV:CAC Ratio"
            value={metrics.ltv_cac_ratio}
            icon={<BarChart3 className="h-4 w-4" />}
            isPositive={metrics.ltv_cac_ratio >= 3}
            isNegative={metrics.ltv_cac_ratio < 1}
            // comparison={
            //   metrics.ltv_cac_ratio >= 3 ? "Excellent" :
            //   metrics.ltv_cac_ratio >= 1 ? "Sustainable" :
            //   "Unsustainable"
            // }
          />
        )}

        {metrics?.rule_of_40_score !== null && (
          <MetricCard
            title="Rule of 40 Score"
            value={metrics.rule_of_40_score}
            icon={<BarChart3 className="h-4 w-4" />}
            isPositive={metrics.rule_of_40_score >= 40}
            isNegative={metrics.rule_of_40_score < 20}
            // comparison={
            //   metrics.rule_of_40_score >= 40 ? "Excellent" :
            //   metrics.rule_of_40_score >= 20 ? "Good" :
            //   "Needs improvement"
            // }
          />
        )}

        {tractionData?.gross_profit_margin !== null &&
          tractionData?.gross_profit_margin !== undefined && (
            <MetricCard
              title="Gross Profit Margin"
              value={tractionData.gross_profit_margin}
              icon={<Percent className="h-4 w-4" />}
              isPercentage={true}
              isPositive={tractionData.gross_profit_margin > 30}
              isNegative={tractionData.gross_profit_margin < 20}
            />
          )}

        {tractionData?.ebitda_margin !== null &&
          tractionData?.ebitda_margin !== undefined && (
            <MetricCard
              title="EBITDA Margin"
              value={tractionData.ebitda_margin}
              icon={<Percent className="h-4 w-4" />}
              isPercentage={true}
              isPositive={tractionData.ebitda_margin > 0}
              isNegative={tractionData.ebitda_margin < 0}
            />
          )}
      </div>

      <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <Play className="h-5 w-5 text-primary" />
        Video Pitch
      </h3>
      <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-6 border border-zinc-700/50">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-zinc-700/50">
              <Play className="h-8 w-8 text-zinc-400" />
            </div>
          </div>
          <p className="text-zinc-400">No video available</p>
        </div>
      </div>
    </div>
  );
}
