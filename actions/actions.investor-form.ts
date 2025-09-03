"use server"

import { createClient } from '@/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { InvestorFormData, InvestorFormResponse } from '@/types/investor-form';



function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}


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


    let createdAuthUserId: string | null = null;
    let createdFirmId: string | null = null;
    let createdProfileId: string | null = null;

    try{


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


     if (!formData.id && formData.company && formData.email) {
        
        const firmLocation = formData.country && formData.city 
          ? `${formData.city}, ${formData.country}` 
          : formData.country || null;

    
        const { data: existingFirm } = await supabase
          .from('investor_firms')
          .select('id')
          .eq('firm_name', formData.company)
          .maybeSingle();

        if (existingFirm?.id) {
          createdFirmId = existingFirm.id;
        } else {
          
          const { data: newFirm, error: firmError } = await supabase
            .from('investor_firms')
            .insert({
              firm_name: formData.company,
              investor_type: formData.type || 'Unknown',
              hq_location: firmLocation,
              source: 'deedee',
            })
            .select('id')
            .single();

          if (firmError) {
            throw new Error(`Failed to create investor firm: ${firmError.message}`);
          }
          createdFirmId = newFirm.id;
        }

        const investmentPreference = (formData.type === 'individual' || formData.type === 'angel investor') 
          ? 'individual' 
          : 'business';

        const profileLocation = formData.country && formData.city 
          ? `${formData.city}, ${formData.country}` 
          : formData.country || null;

        const { data: existingProfile } = await supabase
          .from('investor_profiles')
          .select('id')
          .eq('email', formData.email)
          .maybeSingle();

        if (!existingProfile?.id) {

          const adminSupabase = createAdminClient();
          const normalizedEmail = formData.email.toLowerCase();
          
          const { data: authRes, error: authError } = await adminSupabase.auth.admin.createUser({
            email: normalizedEmail,
            password: Math.random().toString(36).slice(-8) + "Aa1!",
            email_confirm: true,
            user_metadata: { 
              first_name: formData.firstName, 
              last_name: formData.lastName, 
              role: "investor" 
            },
          });
          
          if (authError || !authRes?.user) {
            throw new Error(`Failed to create user account: ${authError?.message}`);
          }
          createdAuthUserId = authRes.user.id;

          const { data: newProfile, error: profileError } = await supabase
            .from('investor_profiles')
            .insert({
              id: createdAuthUserId,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              location: profileLocation,
              source: 'admin',
              investment_preference: investmentPreference,
            })
            .select('id')
            .single();

          if (profileError) {
            throw new Error(`Failed to create investor profile: ${profileError.message}`);
          }
          createdProfileId = newProfile.id;
        } else {
          createdProfileId = existingProfile.id;
        }
      }

    return { 
      success: true, 
      error: null, 
      data: result 
    };

     } catch (innerError: any) {
      
      if (!formData.id) {
        if (createdProfileId) {
          await supabase.from('investor_profiles').delete().eq('id', createdProfileId);
        }
        if (createdFirmId) {
          await supabase.from('investor_firms').delete().eq('id', createdFirmId);
        }
        if (createdAuthUserId) {
          const adminSupabase = createAdminClient();
          await adminSupabase.auth.admin.deleteUser(createdAuthUserId).catch(() => {});
        }
      }
      throw innerError;
    
    }
    
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