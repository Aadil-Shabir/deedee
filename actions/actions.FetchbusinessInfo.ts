'use server'

import { createClient } from "@/supabase/server";

interface BusinessData {
  id: string;
  companyName: string;
  webUrl: string;
  shortDescription: string;
  productsCount: number | string;
  fullDescription: string;
  logoUrl: string | null;
}

interface BusinessDetailsData {
  headquartersLocation: string;
  incorporationDate: string;
  businessType: string;
  salesType: string;
  businessStage: string;
  businessModel: string;
}

/**
 * Fetches basic business information for a logged-in user
 * 
 * @param userId - The ID of the currently logged-in user
 * @returns Object containing business data or error information
 */
export async function fetchBusinessInfo(userId: string) {
  console.log("FetchBusinessInfo called with userId:", userId);
  const supabase = await createClient();
  
  try {
    // Log the action
    console.log("Fetching companies for user:", userId);
    
    // Get all companies for this user
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', userId);
      
    console.log("Query result:", { companies, error: companiesError });
    
    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return { success: false, message: 'Failed to load company information' };
    }
    
    // If no companies found, return empty data
    if (!companies || companies.length === 0) {
      return { 
        success: true, 
        data: null,
        message: 'No company found for this user' 
      };
    }
    
    // Use the first company found
    const company = companies[0];
    
    // Log if multiple companies exist
    if (companies.length > 1) {
      console.warn(`User ${userId} has multiple companies. Using first one: ${company.id}`);
    }
    
    // Format the data for the client
    const businessData: BusinessData = {
      id: company.id,
      companyName: company.company_name || '',
      webUrl: company.web_url || '',
      shortDescription: company.short_description || '',
      productsCount: company.products_count !== null ? company.products_count.toString() : '',
      fullDescription: company.full_description || '',
      logoUrl: company.logo_url || null
    };
    
    // Return with additional debugging info
    return { 
      success: true, 
      data: businessData,
      message: 'Business information loaded successfully',
      debug: { companyCount: companies.length, companyId: company.id }
    };
    
  } catch (error) {
    console.error('Error in fetchBusinessInfo:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Fetches business details for a logged-in user
 */
export async function fetchBusinessDetails(userId: string) {
  console.log("fetchBusinessDetails called with userId:", userId);
  const supabase = await createClient();
  
  try {
    // Get company ID for this user
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);
      
    if (companyError) {
      console.error('Error fetching companies:', companyError);
      return { success: false, message: 'Failed to load company information' };
    }
    
    if (!companies || companies.length === 0) {
      return { 
        success: true, 
        data: null,
        message: 'No company found for this user' 
      };
    }
    
    // Use the first company
    const companyId = companies[0].id;
    
    // Get business details
    const { data, error } = await supabase
      .from("business_details")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching business details:', error);
      return { success: false, message: 'Failed to load business details' };
    }
    
    if (!data) {
      return { 
        success: true, 
        data: null,
        message: 'No business details found' 
      };
    }
    
    console.log("Found business details:", data);
    
    return {
      success: true,
      data: {
        headquartersLocation: data.headquarters_location || '',
        incorporationDate: data.incorporation_date || '',
        businessType: data.business_type || '',
        salesType: data.sales_type || '',
        businessStage: data.business_stage || '',
        businessModel: data.business_model || ''
      },
      message: 'Business details loaded successfully'
    };
    
  } catch (error) {
    console.error('Error in fetchBusinessDetails:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}