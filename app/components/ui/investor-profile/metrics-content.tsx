"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getInvestorMetrics, 
  updateInvestorMetrics, 
  InvestorMetricsData,
  RevenueGrowthPreference,
  BusinessType,
  BusinessModelType
} from "@/actions/actions.investor-metrics";

const DEFAULT_METRICS: InvestorMetricsData = {
  minGrossMargin: 0,
  maxGrossMargin: 100,
  minEbitdaMargin: 0,
  maxEbitdaMargin: 100,
  minCacLtvRatio: 1,
  maxCacLtvRatio: 20,
  requiresRecurringRevenue: false,
  revenueGrowthPreference: null,
  preferredBusinessTypes: [] as BusinessType[],
  preferredBusinessModels: [] as BusinessModelType[]
};

export function MetricsContent() {
  // Form state with proper typing
  const [requiresRecurringRevenue, setRequiresRecurringRevenue] = useState<boolean>(false);
  const [revenueGrowthRate, setRevenueGrowthRate] = useState<RevenueGrowthPreference | null>(null);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [businessModels, setBusinessModels] = useState<BusinessModelType[]>([]);
  
  // Range sliders (min/max) with numeric typing
  const [grossProfitMargin, setGrossProfitMargin] = useState<[number, number]>([0, 100]);
  const [ebitdaMargin, setEbitdaMargin] = useState<[number, number]>([0, 100]);
  const [cacLtvRatio, setCacLtvRatio] = useState<[number, number]>([1, 20]);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch metrics data
  const { data: metricsData, isLoading } = useQuery<
    InvestorMetricsData, // Define expected success data type
    Error,              // Define expected error type
    InvestorMetricsData // Define returned value type (what you'll actually use)
  >({
    queryKey: ['investorMetrics'],
    queryFn: async () => {
      const response = await getInvestorMetrics();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data) {
        // Return explicitly typed default values
        return DEFAULT_METRICS;
      }
      
      return response.data;
    }
  });

  // Handle query errors
  useEffect(() => {
    const queryState = queryClient.getQueryState<InvestorMetricsData, Error>(['investorMetrics']);
    if (queryState?.error) {
      console.error("Error fetching metrics data:", queryState.error);
      toast.error("Failed to load metrics data");
    }
  }, [queryClient]);

  // Load data when available with proper type checking
  useEffect(() => {
    if (metricsData) {
      // Use optional chaining and nullish coalescing for safer access
      setGrossProfitMargin([
        Number(metricsData?.minGrossMargin ?? 0),
        Number(metricsData?.maxGrossMargin ?? 100)
      ]);
      
      setEbitdaMargin([
        Number(metricsData?.minEbitdaMargin ?? 0),
        Number(metricsData?.maxEbitdaMargin ?? 100)
      ]);
      
      setCacLtvRatio([
        Number(metricsData?.minCacLtvRatio ?? 1),
        Number(metricsData?.maxCacLtvRatio ?? 20)
      ]);
      
      setRequiresRecurringRevenue(Boolean(metricsData?.requiresRecurringRevenue));
      
      // For complex types, do more careful validation
      const growth = metricsData?.revenueGrowthPreference;
      setRevenueGrowthRate(
        growth && isValidRevenueGrowthPreference(growth) ? growth : null
      );
      
      // For arrays, be very explicit about validation
      setBusinessTypes(
        Array.isArray(metricsData?.preferredBusinessTypes) 
          ? metricsData.preferredBusinessTypes.filter(isValidBusinessType)
          : []
      );
      
      setBusinessModels(
        Array.isArray(metricsData?.preferredBusinessModels)
          ? metricsData.preferredBusinessModels.filter(isValidBusinessModel)
          : []
      );
    }
  }, [metricsData]);

  // Type-safe helper function to toggle value in array with correct typing
  const toggleArrayValue = <T extends string>(array: T[], value: T): T[] => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  // Type guards for validation
  function isValidRevenueGrowthPreference(value: any): value is RevenueGrowthPreference {
    return ["less-than-5", "5-10", "10-20", "more-than-20"].includes(value);
  }
  
  function isValidBusinessType(value: any): value is BusinessType {
    return ["startup", "small-business", "corporation", "non-profit"].includes(value);
  }
  
  function isValidBusinessModel(value: any): value is BusinessModelType {
    return [
      "ecommerce", "online-marketplaces", "service-based", "software", 
      "manufacturing", "wholesale", "franchise", "real-estate"
    ].includes(value);
  }

  // Type-safe casting for radio group
  const handleRevenueGrowthChange = (value: string) => {
    if (isValidRevenueGrowthPreference(value)) {
      setRevenueGrowthRate(value);
    } else {
      setRevenueGrowthRate(null);
    }
  };

  // Handle business type toggle with type safety
  const handleBusinessTypeToggle = (type: string) => {
    if (isValidBusinessType(type)) {
      setBusinessTypes(toggleArrayValue(businessTypes, type));
    }
  };

  // Handle business model toggle with type safety
  const handleBusinessModelToggle = (model: string) => {
    if (isValidBusinessModel(model)) {
      setBusinessModels(toggleArrayValue(businessModels, model));
    }
  };

  // Metrics mutation with proper type handling
  const { mutate: updateMetrics, isPending } = useMutation({
    mutationFn: async () => {
      // Create a properly typed data object with all required fields
      const data: InvestorMetricsData = {
        minGrossMargin: Number(grossProfitMargin[0]),
        maxGrossMargin: Number(grossProfitMargin[1]),
        minEbitdaMargin: Number(ebitdaMargin[0]),
        maxEbitdaMargin: Number(ebitdaMargin[1]),
        minCacLtvRatio: Number(cacLtvRatio[0]),
        maxCacLtvRatio: Number(cacLtvRatio[1]),
        requiresRecurringRevenue,
        revenueGrowthPreference: revenueGrowthRate,
        preferredBusinessTypes: businessTypes,
        preferredBusinessModels: businessModels,
      };
      
      const result = await updateInvestorMetrics(data);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result;
    },
    onSuccess: () => {
      toast.success("Metrics updated successfully");
      queryClient.invalidateQueries({ queryKey: ['investorMetrics'] });
      router.push('/investor/profile?tab=preferences');
    },
    onError: (error: Error) => {
      toast.error("Failed to update metrics", {
        description: error.message
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-8">Investment Criteria</h2>
        
        <div className="space-y-10">
          {/* Gross Profit Margin */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Gross Profit Margin (%)</h3>
            <div className="pt-4">
              <Slider
                value={grossProfitMargin}
                onValueChange={(value) => setGrossProfitMargin(value as [number, number])}
                max={100}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">{grossProfitMargin[0]}%</span>
                <span className="text-sm text-zinc-400">{grossProfitMargin[1]}%</span>
              </div>
            </div>
          </div>
          
          {/* EBITDA Margin */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">EBITDA Margin (%)</h3>
            <div className="pt-4">
              <Slider
                value={ebitdaMargin}
                onValueChange={(value) => setEbitdaMargin(value as [number, number])}
                max={100}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">{ebitdaMargin[0]}%</span>
                <span className="text-sm text-zinc-400">{ebitdaMargin[1]}%</span>
              </div>
            </div>
          </div>
          
          {/* CAC/LTV Ratio */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">CAC/LTV Ratio</h3>
            <div className="pt-4">
              <Slider
                value={cacLtvRatio}
                onValueChange={(value) => setCacLtvRatio(value as [number, number])}
                max={20}
                min={1}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">{cacLtvRatio[0]}</span>
                <span className="text-sm text-zinc-400">{cacLtvRatio[1]}</span>
              </div>
            </div>
          </div>
          
          {/* Recurring Revenue Switch */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Requires Recurring Revenue</h3>
            <Switch
              checked={requiresRecurringRevenue}
              onCheckedChange={setRequiresRecurringRevenue}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          
          {/* Revenue Growth Rate */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Revenue Growth Rate</h3>
            <RadioGroup 
              value={revenueGrowthRate || ""} 
              onValueChange={handleRevenueGrowthChange}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="less-than-5"
                    id="less-than-5"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="less-than-5" className="text-white cursor-pointer">
                    Less than 5%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="5-10"
                    id="5-10"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="5-10" className="text-white cursor-pointer">
                    5% - 10%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="10-20"
                    id="10-20"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="10-20" className="text-white cursor-pointer">
                    10% - 20%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="more-than-20"
                    id="more-than-20"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="more-than-20" className="text-white cursor-pointer">
                    More than 20%
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Business Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">What kind of businesses do you prefer to invest in?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="startup"
                  checked={businessTypes.includes("startup")}
                  onCheckedChange={() => handleBusinessTypeToggle("startup")}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="startup" className="text-white cursor-pointer">
                  Startup
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="small-business"
                  checked={businessTypes.includes("small-business")}
                  onCheckedChange={() => handleBusinessTypeToggle("small-business")}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="small-business" className="text-white cursor-pointer">
                  Small Business
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="corporation"
                  checked={businessTypes.includes("corporation")}
                  onCheckedChange={() => handleBusinessTypeToggle("corporation")}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="corporation" className="text-white cursor-pointer">
                  Corporation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="non-profit"
                  checked={businessTypes.includes("non-profit")}
                  onCheckedChange={() => handleBusinessTypeToggle("non-profit")}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="non-profit" className="text-white cursor-pointer">
                  Non-Profit
                </label>
              </div>
            </div>
          </div>
          
          {/* Business Models */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">What business model has your interest?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["ecommerce", "Ecommerce"],
                ["online-marketplaces", "Online Marketplaces"],
                ["service-based", "Service Based Businesses"],
                ["software", "Software"],
                ["manufacturing", "Manufacturing"],
                ["wholesale", "WholeSale"],
                ["franchise", "Franchise"],
                ["real-estate", "Real Estate"]
              ].map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <Checkbox
                    id={value}
                    checked={businessModels.includes(value as BusinessModelType)}
                    onCheckedChange={() => handleBusinessModelToggle(value)}
                    className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                  />
                  <label htmlFor={value} className="text-white cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <Button
            type="button"
            variant="outline"
            className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 px-8"
            onClick={() => router.push('/investor/profile?tab=mandate')}
          >
            Back
          </Button>
          <Button
            type="button"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
            onClick={() => updateMetrics()}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>   
    </div>
  );
}