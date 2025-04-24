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
 * Fetches basic business information for a specific company
 * 
 * @param userId - The ID of the currently logged-in user
 * @param companyId - Optional specific company ID to fetch. If not provided, gets active company.
 * @returns Object containing business data or error information
 */
export async function fetchBusinessInfo(userId: string, companyId?: string) {
  console.log("FetchBusinessInfo called with userId:", userId, "companyId:", companyId);
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
    
    // If we have a target company ID, fetch that specific company
    if (targetCompanyId) {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', targetCompanyId)
        .eq('owner_id', userId) // Security check: ensure company belongs to user
        .single();
        
      if (error) {
        console.error('Error fetching company:', error);
        return { success: false, message: 'Failed to load company information' };
      }
      
      if (!company) {
        return { 
          success: false, 
          data: null,
          message: 'Company not found or access denied' 
        };
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
      
      return { 
        success: true, 
        data: businessData,
        message: 'Business information loaded successfully'
      };
    }
    
    // If no target company ID and no active company in profile, get all companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', userId);
      
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
    
    // Set this as the active company in profile
    await supabase
      .from('profiles')
      .update({ active_company_id: company.id })
      .eq('id', userId);
    
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
    
    return { 
      success: true, 
      data: businessData,
      message: 'Business information loaded successfully'
    };
    
  } catch (error) {
    console.error('Error in fetchBusinessInfo:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

/**
 * Fetches business details for a specific company
 * 
 * @param userId - The ID of the currently logged-in user
 * @param companyId - Optional specific company ID to fetch. If not provided, gets active company.
 */
export async function fetchBusinessDetails(userId: string, companyId?: string) {
  console.log("fetchBusinessDetails called with userId:", userId, "companyId:", companyId);
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
      } else {
        // Get first company as fallback
        const { data: companies } = await supabase
          .from("companies")
          .select("id")
          .eq("owner_id", userId);
          
        if (companies && companies.length > 0) {
          targetCompanyId = companies[0].id;
          
          // Update active company in profile
          await supabase
            .from('profiles')
            .update({ active_company_id: targetCompanyId })
            .eq('id', userId);
        }
      }
    }
    
    if (!targetCompanyId) {
      return { 
        success: false, 
        data: null,
        message: 'No company found for this user' 
      };
    }
    
    // Get business details for the target company
    const { data, error } = await supabase
      .from("business_details")
      .select("*")
      .eq("company_id", targetCompanyId)
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