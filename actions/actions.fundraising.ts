"use server";

import { createClient } from "@/supabase/supabase";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Type definitions for fundraising data
interface CurrentRoundData {
  capitalReason: string;
  raisingAmount: string;
  latestValuation: string;
  currentValuation: string;
  fundingType: string;
  equityPercentage: string;
  interestRate?: string;
  equityAmount?: string;
  debtAmount?: string;
  minInvestment: string;
  maxInvestment: string;
  closingTime: string;
}

interface PastFundraisingData {
  previousRaised: string;
  paidPercentage: number;
  investorTypes: string[];
}

interface InvestorData {
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  type?: string;
  stage?: string;
  country?: string;
  city?: string;
  amount?: string;
  isInvestment: boolean;
}

interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Utility function to parse numeric strings and handle commas
function parseNumericString(value: string | null | undefined): number | null {
  if (!value) return null;
  return parseFloat(value.replace(/,/g, ""));
}

/**
 * Fetch current fundraising round data for a company
 */
export async function getCurrentRoundData(
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

    const { data, error } = await supabase
      .from("fundraising_current")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching current round data:", error);
      return {
        success: false,
        message: "Failed to load fundraising data",
      };
    }

    if (!data) {
      return {
        success: true,
        message: "No fundraising data found",
        data: null,
      };
    }

    // Transform database data to match component state
    const formattedData = {
      capitalReason: data.capital_reason || "growth",
      raisingAmount: data.raising_amount?.toString() || "",
      latestValuation: data.latest_valuation?.toString() || "",
      currentValuation: data.current_valuation?.toString() || "",
      fundingType: data.funding_type || "equity",
      equityPercentage: data.equity_percentage?.toString() || "",
      minInvestment: data.min_investment?.toString() || "",
      maxInvestment: data.max_investment?.toString() || "",
      closingTime: data.closing_time || "",
      interestRate: data.interest_rate?.toString() || "",
      equityAmount: data.equity_amount?.toString() || "",
      debtAmount: data.debt_amount?.toString() || "",
    };

    return {
      success: true,
      message: "Fundraising data loaded successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error in getCurrentRoundData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Save current fundraising round data for a company
 */
export async function saveCurrentRoundData(
  userId: string,
  companyId: string,
  data: CurrentRoundData
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Convert string values to proper numeric types
    const dbData: any = {
      company_id: companyId,
      user_id: userId,
      capital_reason: data.capitalReason,
      raising_amount: parseNumericString(data.raisingAmount),
      latest_valuation: parseNumericString(data.latestValuation),
      current_valuation: parseNumericString(data.currentValuation),
      funding_type: data.fundingType,
      equity_percentage: parseNumericString(data.equityPercentage),
      min_investment: parseNumericString(data.minInvestment),
      max_investment: parseNumericString(data.maxInvestment),
      closing_time: data.closingTime,
      updated_at: new Date().toISOString(),
    };

    // Add conditional fields
    if (data.fundingType === "debt" || data.fundingType === "mixed") {
      dbData.interest_rate = parseNumericString(data.interestRate);
    }

    if (data.fundingType === "mixed") {
      dbData.equity_amount = parseNumericString(data.equityAmount);
      dbData.debt_amount = parseNumericString(data.debtAmount);
    }

    // Check if record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("fundraising_current")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing record:", checkError);
      return {
        success: false,
        message: "Failed to check existing fundraising data",
      };
    }

    let saveError;

    if (existingRecord?.id) {
      // Update existing record
      const { error } = await supabase
        .from("fundraising_current")
        .update(dbData)
        .eq("id", existingRecord.id);

      saveError = error;
    } else {
      // Insert new record
      const { error } = await supabase.from("fundraising_current").insert(dbData);
      saveError = error;
    }

    if (saveError) {
      console.error("Error saving current round data:", saveError);
      return {
        success: false,
        message: "Failed to save fundraising information",
      };
    }

    // Revalidate paths that might show this data
    revalidatePath("/fundraising");
    revalidatePath("/company/[id]/fundraising");

    return {
      success: true,
      message: "Fundraising data saved successfully",
    };
  } catch (error) {
    console.error("Error in saveCurrentRoundData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Fetch past fundraising data for a company
 */
export async function getPastFundraisingData(
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

    // Get past fundraising data
    const { data, error } = await supabase
      .from("fundraising_past")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching past fundraising data:", error);
      return {
        success: false,
        message: "Failed to load past fundraising data",
      };
    }

    // Transform to component format
    const formattedData = data
      ? {
          previousRaised: data.previous_raised?.toString() || "",
          paidPercentage: data.paid_percentage || 0,
          investorTypes: data.investor_types || ["angel"],
        }
      : {
          previousRaised: "",
          paidPercentage: 0,
          investorTypes: ["angel"],
        };

    return {
      success: true,
      message: "Past fundraising data loaded successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error in getPastFundraisingData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Save past fundraising data for a company
 */
export async function savePastFundraisingData(
  userId: string,
  companyId: string,
  data: PastFundraisingData
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Convert to database format
    const dbData = {
      company_id: companyId,
      user_id: userId,
      previous_raised: parseNumericString(data.previousRaised),
      paid_percentage: data.paidPercentage,
      investor_types: data.investorTypes,
      updated_at: new Date().toISOString(),
    };

    // Check if record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("fundraising_past")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing record:", checkError);
      return {
        success: false,
        message: "Failed to check existing past fundraising data",
      };
    }

    let saveError;

    if (existingRecord?.id) {
      // Update existing record
      const { error } = await supabase
        .from("fundraising_past")
        .update(dbData)
        .eq("id", existingRecord.id);

      saveError = error;
    } else {
      // Insert new record
      const { error } = await supabase.from("fundraising_past").insert(dbData);
      saveError = error;
    }

    if (saveError) {
      console.error("Error saving past fundraising data:", saveError);
      return {
        success: false,
        message: "Failed to save past fundraising information",
      };
    }

    // Revalidate paths
    revalidatePath("/fundraising");
    revalidatePath("/company/[id]/fundraising");

    return {
      success: true,
      message: "Past fundraising data saved successfully",
    };
  } catch (error) {
    console.error("Error in savePastFundraisingData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Get investors for a company
 */
export async function getInvestors(
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

    const { data, error } = await supabase
      .from("fundraising_investors")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching investors:", error);
      return {
        success: false,
        message: "Failed to load investors",
      };
    }

    // Transform to component format
    const investors = data.map((investor) => ({
      id: investor.id,
      firstName: investor.first_name,
      lastName: investor.last_name,
      company: investor.company || "",
      email: investor.email || "",
      type: investor.type || "",
      stage: investor.stage || "",
      country: investor.country || "",
      city: investor.city || "",
      amount: investor.amount?.toString() || "",
      isInvestment: investor.is_investment,
    }));

    return {
      success: true,
      message: "Investors loaded successfully",
      data: investors,
    };
  } catch (error) {
    console.error("Error in getInvestors:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Add a new investor for a company
 */
export async function addInvestor(
  userId: string,
  companyId: string,
  investor: InvestorData
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Convert to database format
    const dbData = {
      user_id: userId,
      company_id: companyId,
      first_name: investor.firstName,
      last_name: investor.lastName,
      company: investor.company || null,
      email: investor.email || null,
      type: investor.type || null,
      stage: investor.stage || null,
      country: investor.country || null,
      city: investor.city || null,
      amount: parseNumericString(investor.amount),
      is_investment: investor.isInvestment,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("fundraising_investors")
      .insert(dbData)
      .select('id')
      .single();

    if (error) {
      console.error("Error adding investor:", error);
      return {
        success: false,
        message: "Failed to add investor",
      };
    }

    // Revalidate paths
    revalidatePath("/fundraising");
    revalidatePath("/company/[id]/fundraising");

    return {
      success: true,
      message: "Investor added successfully",
      data: { id: data.id },
    };
  } catch (error) {
    console.error("Error in addInvestor:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Delete an investor
 */
export async function deleteInvestor(
  userId: string,
  investorId: string
): Promise<APIResponse> {
  try {
    if (!userId || !investorId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = createClient();

    // Ensure the user owns this investor record
    const { error } = await supabase
      .from("fundraising_investors")
      .delete()
      .eq("id", investorId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting investor:", error);
      return {
        success: false,
        message: "Failed to delete investor",
      };
    }

    // Revalidate paths
    revalidatePath("/fundraising");
    revalidatePath("/company/[id]/fundraising");

    return {
      success: true,
      message: "Investor deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteInvestor:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}