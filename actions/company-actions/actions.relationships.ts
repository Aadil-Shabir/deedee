'use server';

import { createClient } from '@/supabase/server';

/**
 * Fetches investors related to a specific company
 */
export async function getCompanyInvestors(companyId: string) {
  try {
    const supabase = await createClient();

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { fundraisingInvestors: [], investorProfiles: [], error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Fetch investors from fundraising_investors table
    const { data: fundraisingInvestors, error: fundraisingError } = await supabase
      .from('fundraising_investors')
      .select('*')
      .eq('company_id', companyId);
    
    if (fundraisingError) {
      console.error("Error fetching fundraising investors:", fundraisingError);
      return { fundraisingInvestors: [], investorProfiles: [], error: fundraisingError.message };
    }

    // Get company details
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('company_name, web_url')
      .eq('id', companyId)
      .single();
    
    // Fetch relevant investor profiles if we have company data
    let investorProfiles = [];
    if (companyData && !companyError) {
      const { data: profiles, error: profilesError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('company_name', companyData.company_name);
      
      if (!profilesError) {
        investorProfiles = profiles || [];
      }
    }
    
    return {
      fundraisingInvestors: fundraisingInvestors || [],
      investorProfiles: investorProfiles,
      error: null
    };
  } catch (error: any) {
    console.error("Error in getCompanyInvestors:", error);
    return { 
      fundraisingInvestors: [], 
      investorProfiles: [], 
      error: error.message || "Unknown error" 
    };
  }
}

/**
 * Updates the stage of an investor in the pipeline
 */
export async function updateInvestorStage(investorId: string, stage: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('fundraising_investors')
      .update({ 
        stage, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', investorId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating investor stage:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Adds a new investor to the company
 */
export async function addCompanyInvestor(
  companyId: string, 
  investorData: {
    firstName: string;
    lastName: string;
    company?: string;
    email?: string;
    type?: string;
    amount?: number;
  }
) {
  try {
    const supabase = await createClient();
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from('fundraising_investors')
      .insert({
        company_id: companyId,
        user_id: session.user.id,
        first_name: investorData.firstName,
        last_name: investorData.lastName,
        company: investorData.company || null,
        email: investorData.email || null,
        type: investorData.type || null,
        stage: 'interested', // Default stage
        amount: investorData.amount || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, investor: null };
    }

    return { success: true, error: null, investor: data };
  } catch (error: any) {
    console.error("Error adding investor:", error);
    return { success: false, error: error.message || "Unknown error", investor: null };
  }
}

/**
 * Updates an existing investor
 */
export async function updateCompanyInvestor(
  investorId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    type?: string;
    stage?: string;
    amount?: number;
  }
) {
  try {
    const supabase = await createClient();

    // Convert the updates object to match database column names
    const dbUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.firstName) dbUpdates.first_name = updates.firstName;
    if (updates.lastName) dbUpdates.last_name = updates.lastName;
    if (updates.company !== undefined) dbUpdates.company = updates.company;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.stage) dbUpdates.stage = updates.stage;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;

    const { data, error } = await supabase
      .from('fundraising_investors')
      .update(dbUpdates)
      .eq('id', investorId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, investor: null };
    }

    return { success: true, error: null, investor: data };
  } catch (error: any) {
    console.error("Error updating investor:", error);
    return { success: false, error: error.message || "Unknown error", investor: null };
  }
}

/**
 * Deletes an investor from the company
 */
export async function deleteCompanyInvestor(investorId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('fundraising_investors')
      .delete()
      .eq('id', investorId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting investor:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Gets totals of reservations and investments for a company
 */
export async function getCompanyInvestmentTotals(companyId: string) {
  try {
    const supabase = await createClient();
    
    // Calculate reservations total (where is_investment is false)
    const { data: reservations, error: reservationsError } = await supabase
      .from('fundraising_investors')
      .select('amount')
      .eq('company_id', companyId)
      .eq('is_investment', false);
    
    if (reservationsError) {
      console.error("Error fetching reservations:", reservationsError);
      return { 
        reservations: 0, 
        investments: 0, 
        error: reservationsError.message 
      };
    }
    
    // Calculate investments total (where is_investment is true)
    const { data: investments, error: investmentsError } = await supabase
      .from('fundraising_investors')
      .select('amount')
      .eq('company_id', companyId)
      .eq('is_investment', true);
    
    if (investmentsError) {
      console.error("Error fetching investments:", investmentsError);
      return { 
        reservations: 0, 
        investments: 0, 
        error: investmentsError.message 
      };
    }
    
    // Sum up the amounts
    const reservationsTotal = reservations?.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0) || 0;
    
    const investmentsTotal = investments?.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0) || 0;
    
    return {
      reservations: reservationsTotal,
      investments: investmentsTotal,
      error: null
    };
  } catch (error: any) {
    console.error("Error calculating totals:", error);
    return { 
      reservations: 0, 
      investments: 0, 
      error: error.message || "Unknown error" 
    };
  }
}