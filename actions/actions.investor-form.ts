"use server"

import { createClient } from "@/supabase/server";
import { InvestorFormData, InvestorFormResponse, DatabaseInvestorData } from "@/types/investor-form";
import { mapFormDataToDatabase } from "@/utils/investor-mapping";
import { revalidatePath } from "next/cache";

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
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      return { 
        success: false, 
        error: "First and last name are required" 
      };
    }
    
    if (!userId) {
      return { 
        success: false, 
        error: "User ID is required" 
      };
    }
    
    if (!formData.companyName) {
      return {
        success: false,
        error: "Company name is required"
      };
    }
    
    // Step 1: Look for company by name
    let companyId: string | null = null;
    
    // First look for exact match
    const { data: exactMatch } = await supabase
      .from('companies')
      .select('id')
      .eq('company_name', formData.companyName.trim())
      .eq('owner_id', userId)
      .limit(1)
      .single();
    
    if (exactMatch?.id) {
      companyId = exactMatch.id;
    } else {
      // Look for fuzzy match (case insensitive)
      const { data: fuzzyMatches } = await supabase
        .from('companies')
        .select('id')
        .ilike('company_name', `%${formData.companyName.trim()}%`)
        .eq('owner_id', userId)
        .limit(1);
      
      if (fuzzyMatches && fuzzyMatches.length > 0) {
        companyId = fuzzyMatches[0].id;
      } else {
        // Create a new company
        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert({
            company_name: formData.companyName.trim(),
            owner_id: userId,
            short_description: `Company profile for ${formData.companyName.trim()}`
          })
          .select('id')
          .single();
        
        if (createError) {
          return { 
            success: false, 
            error: `Failed to create company: ${createError.message}` 
          };
        }
        
        companyId = newCompany.id;
      }
    }
    
    // Step 2: Map form data to database structure
    const dbData = mapFormDataToDatabase(formData, userId, companyId as string);
    
    // Step 3: Save investor with the found/created company ID
    let result;
    if (formData.id) {
      // Update existing record
      const { data, error } = await supabase
        .from("fundraising_investors")
        .update(dbData)
        .eq("id", formData.id)
        .select();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      result = data?.[0];
    } else {
      // Create a new record
      const { data, error } = await supabase
        .from("fundraising_investors")
        .insert(dbData)
        .select();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      result = data?.[0];
    }

    // Revalidate the data cache
    revalidatePath("/relationships");
    
    return { 
      success: true, 
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
export async function submitInvestorForm(formData: InvestorFormData, userId: string) {
  try {
    const supabase = await createClient();

    // Map form data to database structure
        const companyId = formData.companyId || null;
        const investorRecord = mapFormDataToDatabase(formData, userId, companyId as string);

    // Check if we're updating an existing record
    if (formData.id) {
      // Update existing record
      const { error } = await supabase
        .from("fundraising_investors")
        .update(investorRecord)
        .eq("id", formData.id);
      
      if (error) {
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
      
      // Get the updated record
      const { data: updatedData, error: fetchError } = await supabase
        .from("fundraising_investors")
        .select('*')
        .eq("id", formData.id)
        .single();
      
      if (fetchError) {
        return {
          success: false,
          error: fetchError.message,
          data: null
        };
      }

      return {
        success: true,
        error: null,
        data: updatedData
      };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("fundraising_investors")
        .insert(investorRecord)
        .select("*")
        .single();
        
      if (error) {
        // Check specifically for unique constraint violation
        if (error.code === '23505' && error.message.includes('unique_investor_email_per_user')) {
          return {
            success: false,
            error: "An investor with this email already exists in your records.",
            data: null
          };
        }
        
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      return {
        success: true,
        error: null,
        data
      };
    }
  } catch (error: any) {
    console.error("Error in submitInvestorForm:", error);
    return {
      success: false,
      error: error.message || "An unknown error occurred",
      data: null
    };
  }
}