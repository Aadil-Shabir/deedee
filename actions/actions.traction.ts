"use server";

import { createClient } from "@/supabase/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  calculateMRR,
  calculateARR,
  calculateRevenueGrowth,
  calculateCustomerAcquisitionEfficiency,
  calculateLtvCacRatio,
  calculateMoMGrowth,
  calculateRevenuePerClient,
  calculateRuleOf40,
  parseNumericString
} from "@/utils/growth-calculations";

// Type definitions for traction data
export type TractionData =  {
  achievements: string[];
  revenue: {
    thisMonth: string;
    lastMonth: string;
    priorMonth: string;
  };
  clients: {
    thisMonth: string;
    lastMonth: string;
    priorMonth: string;
  };
  metrics: {
    cac: string;
    leadToSalesRatio: string;
    aov: string;
    clv: string;
    grossProfit: string;
    ebitdaMargin: string;
  };
  hasRecurringRevenue: boolean;
}

interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  redirectUrl?: string;
}

/**
 * Get traction data for a specific company
 */
export async function getTractionData(
  userId: string,
  companyId: string
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Query the traction_data table for the specific company
    const { data, error } = await supabase
      .from("traction_data")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching traction data:", error);
      return {
        success: false,
        message: "Failed to load traction data",
      };
    }

    // If no data exists yet, return empty data structure
    if (!data) {
      return {
        success: true,
        message: "No traction data found",
        data: {
          achievements: ["", "", ""],
          revenue: {
            thisMonth: "",
            lastMonth: "",
            priorMonth: "",
          },
          clients: {
            thisMonth: "",
            lastMonth: "",
            priorMonth: "",
          },
          metrics: {
            cac: "",
            leadToSalesRatio: "",
            aov: "",
            clv: "",
            grossProfit: "",
            ebitdaMargin: "",
          },
          hasRecurringRevenue: true,
        },
      };
    }

    // Format the data to match the component structure
    const formattedData: TractionData = {
      achievements: data.achievements || ["", "", ""],
      revenue: {
        thisMonth: data.revenue_this_month?.toString() || "",
        lastMonth: data.revenue_last_month?.toString() || "",
        priorMonth: data.revenue_prior_month?.toString() || "",
      },
      clients: {
        thisMonth: data.clients_this_month?.toString() || "",
        lastMonth: data.clients_last_month?.toString() || "",
        priorMonth: data.clients_prior_month?.toString() || "",
      },
      metrics: {
        cac: data.customer_acquisition_cost?.toString() || "",
        leadToSalesRatio: data.lead_to_sales_ratio?.toString() || "",
        aov: data.average_order_value?.toString() || "",
        clv: data.customer_lifetime_value?.toString() || "",
        grossProfit: data.gross_profit_percentage?.toString() || "",
        ebitdaMargin: data.ebitda_margin_percentage?.toString() || "",
      },
      hasRecurringRevenue: data.has_recurring_revenue ?? true,
    };

    return {
      success: true,
      message: "Traction data loaded successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error in getTractionData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Save traction data and compute growth metrics for a specific company,
 * then redirect to score card page
 */
export async function saveTractionDataAndComputeMetrics(
  userId: string,
  companyId: string,
  data: TractionData,
  redirectToScoreCard: boolean = true
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // 1. Save traction data
    // Convert to database format
    const dbData = {
      company_id: companyId,
      user_id: userId,
      achievements: data.achievements.filter(a => a.length > 0), // Filter out empty achievements
      revenue_this_month: parseNumericString(data.revenue.thisMonth),
      revenue_last_month: parseNumericString(data.revenue.lastMonth),
      revenue_prior_month: parseNumericString(data.revenue.priorMonth),
      clients_this_month: data.clients.thisMonth ? parseInt(data.clients.thisMonth) : null,
      clients_last_month: data.clients.lastMonth ? parseInt(data.clients.lastMonth) : null,
      clients_prior_month: data.clients.priorMonth ? parseInt(data.clients.priorMonth) : null,
      customer_acquisition_cost: parseNumericString(data.metrics.cac),
      lead_to_sales_ratio: parseNumericString(data.metrics.leadToSalesRatio),
      average_order_value: parseNumericString(data.metrics.aov),
      customer_lifetime_value: parseNumericString(data.metrics.clv),
      gross_profit_percentage: parseNumericString(data.metrics.grossProfit),
      ebitda_margin_percentage: parseNumericString(data.metrics.ebitdaMargin),
      has_recurring_revenue: data.hasRecurringRevenue,
      updated_at: new Date().toISOString(),
    };

    // Check if record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("traction_data")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing record:", checkError);
      return {
        success: false,
        message: "Failed to check existing traction data",
      };
    }

    let saveError;
    let tractionRecordId;

    if (existingRecord?.id) {
      // Update existing record
      const { error, data: updatedData } = await supabase
        .from("traction_data")
        .update(dbData)
        .eq("id", existingRecord.id)
        .select("id");

      saveError = error;
      tractionRecordId = existingRecord.id;
    } else {
      // Insert new record
      const { error, data: insertedData } = await supabase
        .from("traction_data")
        .insert(dbData)
        .select("id");

      saveError = error;
      tractionRecordId = insertedData?.[0]?.id;
    }

    if (saveError) {
      console.error("Error saving traction data:", saveError);
      return {
        success: false,
        message: "Failed to save traction information",
      };
    }

    // 2. Calculate and save growth metrics
    // Extract numeric values for calculations
    const revenueThisMonth = parseNumericString(data.revenue.thisMonth) || 0;
    const revenueLastMonth = parseNumericString(data.revenue.lastMonth) || 0;
    const clientsThisMonth = data.clients.thisMonth ? parseInt(data.clients.thisMonth) : 0;
    const clientsLastMonth = data.clients.lastMonth ? parseInt(data.clients.lastMonth) : 0;
    const cac = parseNumericString(data.metrics.cac) || 0;
    const aov = parseNumericString(data.metrics.aov) || 0;
    const clv = parseNumericString(data.metrics.clv) || 0;
    const grossProfit = parseNumericString(data.metrics.grossProfit) || 0;
    const ebitdaMargin = parseNumericString(data.metrics.ebitdaMargin) || 0;

    // Calculate metrics
    const mrr = calculateMRR(revenueThisMonth);
    const arr = calculateARR(mrr);
    const revenueGrowth = calculateRevenueGrowth(revenueThisMonth, revenueLastMonth);
    const clientGrowth = calculateMoMGrowth(clientsThisMonth, clientsLastMonth);
    const revenuePerClient = calculateRevenuePerClient(revenueThisMonth, clientsThisMonth);
    const ltvCacRatio = calculateLtvCacRatio(clv, cac);
    const customerAcquisitionEfficiency = calculateCustomerAcquisitionEfficiency(clv, cac);
    const ruleOf40Score = calculateRuleOf40(revenueGrowth, ebitdaMargin);

    // Prepare growth metrics data
    const metricsData = {
      company_id: companyId,
      user_id: userId,
      traction_data_id: tractionRecordId,
      
      // Monthly revenue figures
      mrr,
      arr,
      
      // Growth rates
      revenue_growth_percentage: revenueGrowth,
      client_growth_percentage: clientGrowth,
      
      // Efficiency metrics
      revenue_per_client: revenuePerClient,
      ltv_cac_ratio: ltvCacRatio,
      customer_acquisition_efficiency: customerAcquisitionEfficiency,
      
      // Business health indicators
      has_recurring_revenue: data.hasRecurringRevenue,
      is_growing: revenueGrowth > 0,
      has_profitable_business: ebitdaMargin > 0,
      has_healthy_margins: grossProfit > 30,
      rule_of_40_score: ruleOf40Score,
      has_positive_unit_economics: ltvCacRatio > 3,
      
      // Metadata
      calculation_date: new Date().toISOString(),
      source_data_date: new Date().toISOString(),
      is_latest: true
    };

    // Save the metrics to the growth_metrics table
    const { error: metricsError } = await supabase
      .from('growth_metrics')
      .insert(metricsData);

    if (metricsError) {
      console.error("Error saving growth metrics:", metricsError);
      // Continue anyway, since the traction data was saved successfully
    }

    // 3. Revalidate paths and prepare for redirect
    revalidatePath("/traction");
    revalidatePath("/company/[id]/traction");
    revalidatePath("/company/score-card");
    revalidatePath("/dashboard");

    // Prepare response
    const response: APIResponse = {
      success: true,
      message: "Traction data saved and metrics calculated successfully",
    };

    // Add redirect URL if requested
    if (redirectToScoreCard) {
      response.redirectUrl = `/company/score-card`;
    }

    return response;
  } catch (error) {
    console.error("Error in saveTractionDataAndComputeMetrics:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Calculate growth metrics based on traction data
 */
export async function calculateGrowthMetrics(
  userId: string,
  companyId: string
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Try to get metrics from growth_metrics table first (faster)
    const { data: existingMetrics, error: metricsError } = await supabase
      .from("growth_metrics")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .eq("is_latest", true)
      .maybeSingle();

    // If metrics exist and are recent (within the last day), use them
    if (existingMetrics && !metricsError) {
      const calculationDate = new Date(existingMetrics.calculation_date);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      if (calculationDate > oneDayAgo) {
        // Format the metrics to match the expected structure
        const metrics = {
          mrr: existingMetrics.mrr,
          arr: existingMetrics.arr,
          revenueGrowth: existingMetrics.revenue_growth_percentage,
          clientGrowth: existingMetrics.client_growth_percentage,
          revenuePerClient: existingMetrics.revenue_per_client,
          ltvCacRatio: existingMetrics.ltv_cac_ratio,
          customerAcquisitionEfficiency: existingMetrics.customer_acquisition_efficiency,
          hasRecurringRevenue: existingMetrics.has_recurring_revenue,
          isGrowing: existingMetrics.is_growing,
          hasProfitableBusiness: existingMetrics.has_profitable_business,
          hasHealthyMargins: existingMetrics.has_healthy_margins,
          ruleOf40Score: existingMetrics.rule_of_40_score,
          hasPositiveUnitEconomics: existingMetrics.has_positive_unit_economics,
        };
        
        return {
          success: true,
          message: "Growth metrics retrieved from database",
          data: metrics,
        };
      }
    }

    // If no recent metrics, calculate them from traction data
    const { data, error } = await supabase
      .from("traction_data")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching traction data for calculations:", error);
      return {
        success: false,
        message: "Failed to load traction data",
      };
    }

    if (!data) {
      return {
        success: false,
        message: "No traction data available for calculations",
      };
    }

    // Calculate various metrics
    const revenueThisMonth = data.revenue_this_month || 0;
    const revenueLastMonth = data.revenue_last_month || 0;
    const clientsThisMonth = data.clients_this_month || 0;
    const clientsLastMonth = data.clients_last_month || 0;
    const cac = data.customer_acquisition_cost || 0;
    const aov = data.average_order_value || 0;
    const clv = data.customer_lifetime_value || 0;
    const grossProfit = data.gross_profit_percentage || 0;
    const ebitdaMargin = data.ebitda_margin_percentage || 0;

    // Calculate growth metrics
    const metrics = {
      // Monthly figures
      mrr: calculateMRR(revenueThisMonth),
      arr: calculateARR(calculateMRR(revenueThisMonth)),
      
      // Growth rates
      revenueGrowth: calculateRevenueGrowth(revenueThisMonth, revenueLastMonth),
      clientGrowth: calculateMoMGrowth(clientsThisMonth, clientsLastMonth),
      
      // Efficiency metrics
      revenuePerClient: calculateRevenuePerClient(revenueThisMonth, clientsThisMonth),
      ltvCacRatio: calculateLtvCacRatio(clv, cac),
      customerAcquisitionEfficiency: calculateCustomerAcquisitionEfficiency(clv, cac),
      
      // Business health indicators
      hasRecurringRevenue: data.has_recurring_revenue,
      isGrowing: calculateRevenueGrowth(revenueThisMonth, revenueLastMonth) > 0,
      hasProfitableBusiness: ebitdaMargin > 0,
      hasHealthyMargins: grossProfit > 30,
      ruleOf40Score: calculateRuleOf40(
        calculateRevenueGrowth(revenueThisMonth, revenueLastMonth),
        ebitdaMargin
      ),
      hasPositiveUnitEconomics: calculateLtvCacRatio(clv, cac) > 3
    };

    // Save the newly calculated metrics to the database
    const metricsData = {
      company_id: companyId,
      user_id: userId,
      traction_data_id: data.id,
      
      mrr: metrics.mrr,
      arr: metrics.arr,
      revenue_growth_percentage: metrics.revenueGrowth,
      client_growth_percentage: metrics.clientGrowth,
      revenue_per_client: metrics.revenuePerClient,
      ltv_cac_ratio: metrics.ltvCacRatio,
      customer_acquisition_efficiency: metrics.customerAcquisitionEfficiency,
      
      has_recurring_revenue: metrics.hasRecurringRevenue,
      is_growing: metrics.isGrowing,
      has_profitable_business: metrics.hasProfitableBusiness,
      has_healthy_margins: metrics.hasHealthyMargins,
      rule_of_40_score: metrics.ruleOf40Score,
      has_positive_unit_economics: metrics.hasPositiveUnitEconomics,
      
      calculation_date: new Date().toISOString(),
      source_data_date: data.updated_at,
      is_latest: true
    };

    // Save the metrics to the growth_metrics table
    const { error: saveError } = await supabase
      .from('growth_metrics')
      .insert(metricsData);

    if (saveError) {
      console.error("Error saving calculated metrics:", saveError);
      // Continue anyway since we've calculated the metrics
    }

    return {
      success: true,
      message: "Growth metrics calculated and saved successfully",
      data: metrics,
    };
  } catch (error) {
    console.error("Error in calculateGrowthMetrics:", error);
    return {
      success: false,
      message: "An unexpected error occurred while calculating metrics",
    };
  }
}