"use server"

import { createClient } from '@/supabase/server';
import { InvestorFormData, InvestorFormResponse } from '@/types/investor-form';

/**
 * Helper function to convert string number to database numeric or null
 */
function toNumeric(value: string | undefined): number | null {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

/**
 * Submits investor form with company name lookup
 * This function finds or creates a company based on name before saving
 * @param formData The investor form data
 * @param userId The current user's ID
 * @returns Promise resolving to response object
 */
export async function submitInvestorByCompanyName(
  formData: InvestorFormData,
  userId: string
): Promise<InvestorFormResponse> {
  try {
    const supabase = await createClient();
    
    // Get or verify the companyId
    let companyId = formData.companyId;
    
    // If no company ID is provided, try to find by name
    if (!companyId && formData.company) {
      // Look up company by name
      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .eq('company_name', formData.company)
        .eq('user_id', userId)
        .single();
        
      if (companyData) {
        companyId = companyData.id;
      } else {
        // Create new company if not found
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            company_name: formData.company,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (companyError) {
          return { success: false, error: `Failed to create company: ${companyError.message}` };
        }
        
        companyId = newCompany.id;
      }
    }
    
    if (!companyId) {
      return { success: false, error: "No company provided and unable to create one" };
    }

    // Format the data to match the database schema
    const investorData = {
      company_id: companyId,
      user_id: userId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: formData.company || null,
      email: formData.email || null,
      type: formData.type || null,
      stage: formData.stage || 'interested',
      country: formData.country || null,
      city: formData.city || null,
      amount: toNumeric(formData.amount),
      is_investment: formData.isInvestment === true,
      investment_type: formData.investmentType || 'equity',
      interest_rate: toNumeric(formData.interestRate),
      valuation: toNumeric(formData.valuation),
      num_shares: toNumeric(formData.numShares),
      share_price: toNumeric(formData.sharePrice),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert or update the record
    let result;
    if (formData.id) {
      // Update existing investor
      const { data, error } = await supabase
        .from('fundraising_investors')
        .update({
          ...investorData,
          created_at: undefined // Don't update creation date
        })
        .eq('id', formData.id)
        .select()
        .single();
        
      if (error) {
        return { success: false, error: `Failed to update investor: ${error.message}` };
      }
      result = data;
    } else {
      // Create new investor
      const { data, error } = await supabase
        .from('fundraising_investors')
        .insert(investorData)
        .select()
        .single();
        
      if (error) {
        return { success: false, error: `Failed to add investor: ${error.message}` };
      }
      result = data;
    }

    return { 
      success: true, 
      error: null, 
      data: result 
    };
  } catch (error: any) {
    console.error("Error in submitInvestorByCompanyName:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
}

/**
 * Submits investor form
 * This function handles both creating and updating investor records
 * @param formData The investor form data
 * @param userId The current user's ID
 * @returns Promise resolving to response object
 */
export async function submitInvestorForm(
  formData: InvestorFormData, 
  userId: string,
  companyId: string
): Promise<InvestorFormResponse> {
  try {
    const supabase = await createClient();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      return { success: false, error: "First name and last name are required" };
    }

    if (!companyId) {
      return { success: false, error: "Company ID is required" };
    }

    // Format the data to match the database schema
    const investorData = {
      company_id: companyId,
      user_id: userId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: formData.company || null,
      email: formData.email || null,
      type: formData.type || null,
      stage: formData.stage || 'interested',
      country: formData.country || null,
      city: formData.city || null,
      amount: toNumeric(formData.amount),
      is_investment: formData.isInvestment === true,
      investment_type: formData.investmentType || 'equity',
      interest_rate: toNumeric(formData.interestRate),
      valuation: toNumeric(formData.valuation),
      num_shares: toNumeric(formData.numShares),
      share_price: toNumeric(formData.sharePrice),
      updated_at: new Date().toISOString()
    };

    // Insert or update the record
    let result;
    if (formData.id) {
      // Update existing investor
      const { data, error } = await supabase
        .from('fundraising_investors')
        .update(investorData)
        .eq('id', formData.id)
        .select()
        .single();
        
      if (error) {
        return { success: false, error: `Failed to update investor: ${error.message}` };
      }
      result = data;
    } else {
      // Add created_at for new records
      const { data, error } = await supabase
        .from('fundraising_investors')
        .insert({
          ...investorData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        return { success: false, error: `Failed to add investor: ${error.message}` };
      }
      result = data;
    }

    return { 
      success: true, 
      error: null, 
      data: result 
    };
  } catch (error: any) {
    console.error("Error in submitInvestorForm:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred"
    };
  }
}