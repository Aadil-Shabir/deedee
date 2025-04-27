"use client";

import { useState, useEffect } from "react";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { calculateGrowthMetrics } from "@/actions/actions.traction";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  BarChart3, 
  RefreshCcw, 
  Users, 
  DollarSign, 
  Percent, 
  Clock, 
  BadgeCheck, 
  AlertCircle,
  Building,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/growth-calculations";

interface MetricCardProps {
  title: string;
  value: string | number | null;
  description: string;
  progress: number;
  icon: React.ReactNode;
  isPositive?: boolean;
  isNegative?: boolean;
  isCurrency?: boolean;
  isPercentage?: boolean;
  comparison?: string;
  threshold?: { value: number; label: string };
}

function MetricCard({ 
  title, 
  value, 
  description, 
  progress, 
  icon, 
  isPositive = false, 
  isNegative = false, 
  isCurrency = false, 
  isPercentage = false, 
  comparison,
  threshold 
}: MetricCardProps) {
  // Format the value based on its type
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
  
  // Progress bar color based on progress value and positive/negative indicators
  const getProgressColor = () => {
    if (isNegative) return "bg-red-500";
    if (isPositive) return "bg-green-500";
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-amber-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Get appropriate indicator for the trend
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
            <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-950/50 text-green-400' : isNegative ? 'bg-red-950/50 text-red-400' : 'bg-blue-950/50 text-blue-400'}`}>
              {comparison}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className={`h-1.5 bg-zinc-700/50 ${getProgressColor()}`} />
        
        {threshold && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">0</span>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">{threshold.label}: {threshold.value}</span>
            </div>
            <span className="text-zinc-500">100</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton component for metric cards
function MetricCardSkeleton() {
  return (
    <div className="bg-zinc-800/60 backdrop-blur-sm rounded-lg p-5 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md bg-zinc-700/70" />
          <Skeleton className="h-4 w-32 bg-zinc-700/70" />
        </div>
      </div>
      
      <div className="mb-4">
        <Skeleton className="h-8 w-24 mb-2 bg-zinc-700/70" />
        <Skeleton className="h-3 w-full bg-zinc-700/70" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-1.5 w-full bg-zinc-700/70" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-4 bg-zinc-700/70" />
          <Skeleton className="h-3 w-20 bg-zinc-700/70" />
          <Skeleton className="h-3 w-4 bg-zinc-700/70" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for summary stats
function SummaryStatsSkeleton() {
  return (
    <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-5 border border-zinc-700/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2 p-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full bg-zinc-700/70" />
              <Skeleton className="h-3 w-16 bg-zinc-700/70" />
            </div>
            <Skeleton className="h-7 w-20 bg-zinc-700/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreCardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { activeCompanyId, allUserCompanies } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Find active company name
  const activeCompany = allUserCompanies?.find(c => c.id === activeCompanyId);

  // Load metrics when component mounts or company changes
  useEffect(() => {
    loadGrowthMetrics();
  }, [user, activeCompanyId]);

  const loadGrowthMetrics = async () => {
    if (!user?.id || !activeCompanyId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await calculateGrowthMetrics(user.id, activeCompanyId);
      
      if (response.success && response.data) {
        setMetrics(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load growth metrics",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error loading growth metrics:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadGrowthMetrics();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
                Company Score Card
              </h1>
              {activeCompany && (
                <p className="text-zinc-400">Metrics and insights for {activeCompany.company_name || ""}</p>
              )}
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={isLoading || isRefreshing || !activeCompanyId}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Metrics"}
          </Button>
        </div>
        
        {!activeCompanyId ? (
          <div className="bg-amber-900/20 border border-amber-700/50 p-6 rounded-lg text-center">
            <Building className="h-10 w-10 text-amber-500/80 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-200 mb-2">No Company Selected</h3>
            <p className="text-amber-300/80 mb-4 max-w-md mx-auto">
              Please select a company from your dashboard to view its score card.
            </p>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : isLoading ? (
          <>
            {/* Skeleton loader for summary stats */}
            <SummaryStatsSkeleton />

            {/* Skeleton loader for metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {Array(9).fill(0).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : !metrics ? (
          <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-8 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No Metrics Available</h3>
            <p className="text-zinc-400 mb-4 max-w-md mx-auto">
              There are no metrics available for this company yet. Make sure you have entered traction data first.
            </p>
            <Button
              onClick={() => window.location.href = "/traction"}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Traction Page
            </Button>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-5 border border-zinc-700/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1 p-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <p className="text-xs text-zinc-400">MRR</p>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100">{formatCurrency(metrics.mrr)}</h3>
                </div>
                
                <div className="space-y-1 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-xs text-zinc-400">Revenue Growth</p>
                  </div>
                  <h3 className={`text-xl font-bold ${metrics.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(metrics.revenueGrowth)}
                  </h3>
                </div>
                
                <div className="space-y-1 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="text-xs text-zinc-400">CLV:CAC Ratio</p>
                  </div>
                  <h3 className={`text-xl font-bold ${metrics.ltvCacRatio >= 3 ? 'text-green-400' : metrics.ltvCacRatio >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                    {metrics.ltvCacRatio?.toFixed(1)}x
                  </h3>
                </div>
                
                <div className="space-y-1 p-3">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-primary" />
                    <p className="text-xs text-zinc-400">Rule of 40</p>
                  </div>
                  <h3 className={`text-xl font-bold ${metrics.ruleOf40Score >= 40 ? 'text-green-400' : metrics.ruleOf40Score >= 20 ? 'text-amber-400' : 'text-red-400'}`}>
                    {metrics.ruleOf40Score?.toFixed(1)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Monthly Revenue Metrics */}
              <MetricCard
                title="Monthly Recurring Revenue (MRR)"
                value={metrics.mrr}
                description="Monthly recurring revenue is the normalized monthly revenue from all active subscriptions."
                progress={(metrics.mrr / 50000) * 100}
                icon={<DollarSign className="h-4 w-4" />}
                isCurrency={true}
                isPositive={metrics.isGrowing}
                threshold={{ value: 50000, label: "Goal" }}
              />
              
              <MetricCard
                title="Annual Recurring Revenue (ARR)"
                value={metrics.arr}
                description="Annual recurring revenue shows the yearly income from subscriptions."
                progress={(metrics.arr / 600000) * 100}
                icon={<DollarSign className="h-4 w-4" />}
                isCurrency={true}
                isPositive={metrics.isGrowing}
                threshold={{ value: 600000, label: "Goal" }}
              />
              
              <MetricCard
                title="Revenue per Client"
                value={metrics.revenuePerClient}
                description="Average revenue generated from each client per month."
                progress={(metrics.revenuePerClient / 5000) * 100}
                icon={<Users className="h-4 w-4" />}
                isCurrency={true}
                threshold={{ value: 5000, label: "Target" }}
              />

              {/* Growth Metrics */}
              <MetricCard
                title="Revenue Growth"
                value={metrics.revenueGrowth}
                description="Month-over-month revenue growth percentage."
                progress={metrics.revenueGrowth > 100 ? 100 : metrics.revenueGrowth}
                icon={<TrendingUp className="h-4 w-4" />}
                isPositive={metrics.revenueGrowth > 0}
                isNegative={metrics.revenueGrowth < 0}
                isPercentage={true}
                comparison={metrics.revenueGrowth > 0 ? "Growing" : "Declining"}
                threshold={{ value: 15, label: "Good rate" }}
              />
              
              <MetricCard
                title="Client Growth"
                value={metrics.clientGrowth}
                description="Month-over-month growth in client count."
                progress={metrics.clientGrowth > 100 ? 100 : metrics.clientGrowth}
                icon={<Users className="h-4 w-4" />}
                isPositive={metrics.clientGrowth > 0}
                isNegative={metrics.clientGrowth < 0}
                isPercentage={true}
                threshold={{ value: 10, label: "Good rate" }}
              />
              
              <MetricCard
                title="Rule of 40 Score"
                value={metrics.ruleOf40Score}
                description="Sum of growth rate and profit margin. A score over 40 is considered excellent."
                progress={metrics.ruleOf40Score > 100 ? 100 : metrics.ruleOf40Score}
                icon={<BarChart3 className="h-4 w-4" />}
                isPositive={metrics.ruleOf40Score >= 40}
                isNegative={metrics.ruleOf40Score < 20}
                comparison={metrics.ruleOf40Score >= 40 ? "Excellent" : metrics.ruleOf40Score >= 20 ? "Good" : "Needs improvement"}
                threshold={{ value: 40, label: "Target" }}
              />

              {/* Customer Metrics */}
              <MetricCard
                title="LTV:CAC Ratio"
                value={metrics.ltvCacRatio}
                description="Lifetime Value to Customer Acquisition Cost ratio. A ratio of 3+ is considered excellent."
                progress={(metrics.ltvCacRatio / 5) * 100}
                icon={<Users className="h-4 w-4" />}
                isPositive={metrics.ltvCacRatio >= 3}
                isNegative={metrics.ltvCacRatio < 1}
                comparison={metrics.ltvCacRatio >= 3 ? "Excellent" : metrics.ltvCacRatio >= 1 ? "Sustainable" : "Unsustainable"}
                threshold={{ value: 3, label: "Healthy" }}
              />
              
              <MetricCard
                title="Customer Acquisition Efficiency"
                value={metrics.customerAcquisitionEfficiency}
                description="Measures how efficiently you're acquiring customers. Higher is better."
                progress={(metrics.customerAcquisitionEfficiency / 5) * 100}
                icon={<Clock className="h-4 w-4" />}
                isPositive={metrics.customerAcquisitionEfficiency >= 3}
                threshold={{ value: 3, label: "Target" }}
              />
              
              <MetricCard
                title="Business Health"
                value={metrics.hasPositiveUnitEconomics ? "Positive" : "Negative"}
                description="Overall unit economics health based on metrics."
                progress={metrics.hasPositiveUnitEconomics ? 80 : 30}
                icon={<BadgeCheck className="h-4 w-4" />}
                isPositive={metrics.hasPositiveUnitEconomics}
                isNegative={!metrics.hasPositiveUnitEconomics}
                comparison={metrics.hasProfitableBusiness ? "Profitable" : "Not Profitable"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}