'use server'
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

// Using string IDs for UUIDs
interface SelectedCategories {
  [categoryId: string]: string[]; // UUID categoryId -> array of UUID subcategory IDs
}

/**
 * Saves selected industry categories and subcategories for a specific company
 */
export const saveCompanyIndustries = async (
  userId: string,
  selectedCategories: SelectedCategories,
  companyId?: string
) => {
  const supabase = await createClient();
  
  try {
    let targetCompanyId = companyId;
    
    // If no company ID is specified, get the active company from user profile
    if (!targetCompanyId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('active_company_id')
        .eq('id', userId)
        .single();
        
      if (profile?.active_company_id) {
        targetCompanyId = profile.active_company_id;
      }
    }
    
    // If we still don't have a target company ID, get the first company
    if (!targetCompanyId) {
      const { data: companies, error: companiesError } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", userId);

      if (companiesError) {
        console.error("Error fetching companies:", companiesError);
        return { success: false, message: "Failed to find companies for this user" };
      }

      if (!companies || companies.length === 0) {
        return { success: false, message: "No companies found" };
      }

      // Use the first company found
      targetCompanyId = companies[0].id;
    }

    // Verify that this company belongs to the user
    const { data: companyCheck, error: checkError } = await supabase
      .from("companies")
      .select("id")
      .eq("id", targetCompanyId)
      .eq("owner_id", userId)
      .single();
      
    if (checkError || !companyCheck) {
      console.error("Company access verification failed:", checkError);
      return { success: false, message: "You don't have access to this company" };
    }

    // Delete existing entries
    const { error: deleteError } = await supabase
      .from("company_industries")
      .delete()
      .eq("company_id", targetCompanyId);

    if (deleteError) {
      console.error("Error deleting existing industries:", deleteError);
      return { success: false, message: "Failed to update industry information" };
    }

    // Prepare new entries
    const industryEntries = [];
    
    for (const [categoryId, subcategoryIds] of Object.entries(selectedCategories)) {
      if (subcategoryIds.length === 0) {
        // If no subcategories selected, just add the category
        industryEntries.push({
          company_id: targetCompanyId,
          category_id: categoryId,
          subcategory_id: null
        });
      } else {
        // Add each subcategory
        for (const subCategoryId of subcategoryIds) {
          industryEntries.push({
            company_id: targetCompanyId,
            category_id: categoryId,
            subcategory_id: subCategoryId
          });
        }
      }
    }

    // Insert the new entries (if any)
    if (industryEntries.length > 0) {
      const { error: insertError } = await supabase
        .from("company_industries")
        .insert(industryEntries);

      if (insertError) {
        console.error("Error inserting industries:", insertError);
        return { success: false, message: "Failed to save industry information" };
      }
    }

    // Revalidate the paths that might show this data
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true, message: "Industry information saved successfully" };
  } catch (error) {
    console.error("Error in saveCompanyIndustries:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

/**
 * Retrieves saved industry categories and subcategories for a specific company
 */
export const getCompanyIndustries = async (userId: string, companyId?: string) => {
  const supabase = await createClient();
  
  try {
    let targetCompanyId = companyId;
    
    // If no company ID is specified, get the active company from user profile
    if (!targetCompanyId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('active_company_id')
        .eq('id', userId)
        .single();
        
      if (profile?.active_company_id) {
        targetCompanyId = profile.active_company_id;
      }
    }
    
    // If we still don't have a target company ID, get the first company
    if (!targetCompanyId) {
      const { data: companies, error: companiesError } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", userId);

      if (companiesError) {
        console.error("Error fetching companies:", companiesError);
        return { success: false, data: {}, message: "Failed to find companies for this user" };
      }

      if (!companies || companies.length === 0) {
        return { success: false, data: {}, message: "No companies found" };
      }

      // Use the first company found
      targetCompanyId = companies[0].id;
    }

    // Get all industry entries for this company
    const { data: industryData, error: industryError } = await supabase
      .from("company_industries")
      .select("category_id, subcategory_id")
      .eq("company_id", targetCompanyId);

    if (industryError) {
      console.error("Error fetching industries:", industryError);
      return { success: false, data: {}, message: "Failed to load industry information" };
    }

    // Transform the data to the format needed by the UI
    const selectedCategories: SelectedCategories = {};
    
    for (const entry of industryData || []) {
      if (!selectedCategories[entry.category_id]) {
        selectedCategories[entry.category_id] = [];
      }
      
      if (entry.subcategory_id) {
        selectedCategories[entry.category_id].push(entry.subcategory_id);
      }
    }

    return { 
      success: true, 
      data: selectedCategories, 
      message: "Industry information loaded successfully" 
    };
  } catch (error) {
    console.error("Error in getCompanyIndustries:", error);
    return { success: false, data: {}, message: "An unexpected error occurred" };
  }
};