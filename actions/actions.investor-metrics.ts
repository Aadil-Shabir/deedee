'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

// Define types that match with the component types
export type RevenueGrowthPreference = 
  | "less-than-5"
  | "5-10"
  | "10-20"
  | "more-than-20";

export type BusinessType =
  | "startup"
  | "small-business"
  | "corporation"
  | "non-profit";

export type BusinessModelType =
  | "ecommerce"
  | "online-marketplaces"
  | "service-based"
  | "software"
  | "manufacturing"
  | "wholesale"
  | "franchise"
  | "real-estate";

// Type definition for investment metrics data
export interface InvestorMetricsData {
  minGrossMargin: number;
  maxGrossMargin: number;
  minEbitdaMargin: number;
  maxEbitdaMargin: number;
  minCacLtvRatio: number;
  maxCacLtvRatio: number;
  requiresRecurringRevenue: boolean;
  revenueGrowthPreference: RevenueGrowthPreference | null;
  preferredBusinessTypes: BusinessType[];
  preferredBusinessModels: BusinessModelType[];
}

// Default values for new metrics
const DEFAULT_METRICS: InvestorMetricsData = {
  minGrossMargin: 0,
  maxGrossMargin: 100,
  minEbitdaMargin: 0,
  maxEbitdaMargin: 100,
  minCacLtvRatio: 1,
  maxCacLtvRatio: 20,
  requiresRecurringRevenue: false,
  revenueGrowthPreference: null,
  preferredBusinessTypes: [],
  preferredBusinessModels: []
};

// Get investor metrics with explicit return type
export async function getInvestorMetrics(): Promise<{
  data: InvestorMetricsData | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Not authenticated", data: null };
    }
    
    // Get metrics data
    const { data: metricsData, error: metricsError } = await supabase
      .from('investor_metrics')
      .select('*')
      .eq('investor_id', user.id)
      .single();
      
    if (metricsError && metricsError.code !== 'PGRST116') {
      console.error("Error fetching metrics:", metricsError);
      return { error: metricsError.message, data: null };
    }
    
    // If no data was found, return default values
    if (!metricsData) {
      return { data: DEFAULT_METRICS, error: null };
    }
    
    // Convert all values to proper types with fallbacks
    const result: InvestorMetricsData = {
      minGrossMargin: Number(metricsData.min_gross_profit_margin) || 0,
      maxGrossMargin: Number(metricsData.max_gross_profit_margin) || 100,
      minEbitdaMargin: Number(metricsData.min_ebitda_margin) || 0,
      maxEbitdaMargin: Number(metricsData.max_ebitda_margin) || 100,
      minCacLtvRatio: Number(metricsData.min_cac_ltv_ratio) || 1,
      maxCacLtvRatio: Number(metricsData.max_cac_ltv_ratio) || 20,
      requiresRecurringRevenue: Boolean(metricsData.requires_recurring_revenue),
      revenueGrowthPreference: validateRevenueGrowthPreference(metricsData.revenue_growth_preference),
      preferredBusinessTypes: validateBusinessTypes(metricsData.preferred_business_types),
      preferredBusinessModels: validateBusinessModels(metricsData.preferred_business_models)
    };
    
    return { data: result, error: null };
  } catch (err: any) {
    console.error("Error in getInvestorMetrics:", err);
    return { error: err.message, data: null };
  }
}

// Update investor metrics with explicit return type
export async function updateInvestorMetrics(
  metrics: InvestorMetricsData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Not authenticated", success: false };
    }
    
    // Validate and convert numeric inputs for consistency
    const validatedMetrics = {
      min_gross_profit_margin: Number(metrics.minGrossMargin),
      max_gross_profit_margin: Number(metrics.maxGrossMargin),
      min_ebitda_margin: Number(metrics.minEbitdaMargin),
      max_ebitda_margin: Number(metrics.maxEbitdaMargin),
      min_cac_ltv_ratio: Number(metrics.minCacLtvRatio),
      max_cac_ltv_ratio: Number(metrics.maxCacLtvRatio),
      requires_recurring_revenue: Boolean(metrics.requiresRecurringRevenue),
      revenue_growth_preference: metrics.revenueGrowthPreference,
      // Ensure arrays are properly formatted for PostgreSQL array storage
      preferred_business_types: Array.isArray(metrics.preferredBusinessTypes) ? metrics.preferredBusinessTypes : [],
      preferred_business_models: Array.isArray(metrics.preferredBusinessModels) ? metrics.preferredBusinessModels : [],
      investor_id: user.id,
      updated_at: new Date().toISOString()
    };
    
    // Update or insert metrics
    const { error: metricsError } = await supabase
      .from('investor_metrics')
      .upsert(validatedMetrics, { onConflict: 'investor_id' });
      
    if (metricsError) {
      throw metricsError;
    }
    
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error in updateInvestorMetrics:", err);
    return { error: err.message, success: false };
  }
}

// Helper functions for type validation

function validateRevenueGrowthPreference(value: any): RevenueGrowthPreference | null {
  const validValues: RevenueGrowthPreference[] = ["less-than-5", "5-10", "10-20", "more-than-20"];
  return validValues.includes(value as RevenueGrowthPreference) ? (value as RevenueGrowthPreference) : null;
}

function validateBusinessTypes(values: any): BusinessType[] {
  if (!Array.isArray(values)) return [];
  
  const validTypes: BusinessType[] = ["startup", "small-business", "corporation", "non-profit"];
  return values.filter(v => validTypes.includes(v as BusinessType)) as BusinessType[];
}

function validateBusinessModels(values: any): BusinessModelType[] {
  if (!Array.isArray(values)) return [];
  
  const validModels: BusinessModelType[] = [
    "ecommerce", "online-marketplaces", "service-based", "software", 
    "manufacturing", "wholesale", "franchise", "real-estate"
  ];
  
  return values.filter(v => validModels.includes(v as BusinessModelType)) as BusinessModelType[];
}