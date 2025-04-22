'use server'
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

// Using string IDs for UUIDs
interface SelectedCategories {
  [categoryId: string]: string[]; // UUID categoryId -> array of UUID subcategory IDs
}

/**
 * Saves selected industry categories and subcategories to the company_industries table
 */
export const saveCompanyIndustries = async (
  userId: string,
  selectedCategories: SelectedCategories
) => {
  const supabase = await createClient();
  
  try {
    // Get company ID for the user - FIXED to handle multiple companies
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
    const companyId = companies[0].id;
    
    // Log for debugging
    if (companies.length > 1) {
      console.warn(`User ${userId} has multiple companies. Using first one: ${companyId}`);
    }

    // Delete existing entries
    const { error: deleteError } = await supabase
      .from("company_industries")
      .delete()
      .eq("company_id", companyId);

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
          company_id: companyId,
          category_id: categoryId,
          subcategory_id: null
        });
      } else {
        // Add each subcategory
        for (const subCategoryId of subcategoryIds) {
          industryEntries.push({
            company_id: companyId,
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
 * Retrieves saved industry categories and subcategories for a company
 */
export const getCompanyIndustries = async (userId: string) => {
  const supabase = await createClient();
  
  try {
    // Get company ID for the user - FIXED to handle multiple companies
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
    const companyId = companies[0].id;
    
    // Log for debugging
    if (companies.length > 1) {
      console.warn(`User ${userId} has multiple companies. Using first one: ${companyId}`);
    }

    // Get all industry entries for this company
    const { data: industryData, error: industryError } = await supabase
      .from("company_industries")
      .select("category_id, subcategory_id")
      .eq("company_id", companyId);

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

    // Log the result for debugging
    console.log("Returning selected categories:", selectedCategories);

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