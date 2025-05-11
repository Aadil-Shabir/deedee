'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

// Type definition for portfolio companies
interface PortfolioCompany {
  id: string;
  name: string;
  website?: string;
  investmentDate?: string;
  investmentAmount?: number;
  stage?: string;
  ownershipPercentage?: number;
  industry?: string;
  location?: string;
  notes?: string;
  logoUrl?: string;
}

// Fetch all portfolio companies for the current user
export async function getPortfolioCompanies() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', data: null };
    }
    
    const { data, error } = await supabase
      .from('investor_portfolio')
      .select('*')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    // Convert from database format to component format
    const formattedData = data.map(item => ({
      id: item.id,
      name: item.company_name,
      website: item.company_website || undefined,
      investmentDate: item.investment_date || undefined,
      investmentAmount: item.investment_amount !== null ? Number(item.investment_amount) : undefined,
      stage: item.investment_stage || undefined,
      ownershipPercentage: item.ownership_percentage !== null ? Number(item.ownership_percentage) : undefined,
      industry: item.company_industry || undefined,
      location: item.company_location || undefined,
      notes: item.notes || undefined,
      logoUrl: item.company_logo_url || undefined
    }));
    
    return { data: formattedData, error: null };
  } catch (error: any) {
    console.error('Error fetching portfolio companies:', error);
    return { error: error.message, data: null };
  }
}

// Add a new portfolio company
export async function addPortfolioCompany(company: Partial<PortfolioCompany>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', success: false };
    }
    
    if (!company.name) {
      return { error: 'Company name is required', success: false };
    }
    
    console.log("Adding company with data:", JSON.stringify(company, null, 2));
    
    // Convert from component format to database format
    const dbRecord = {
      investor_id: user.id,
      company_name: company.name,
      company_website: company.website || null,
      company_logo_url: company.logoUrl || null, // Make sure this is included
      investment_date: company.investmentDate || null,
      investment_amount: company.investmentAmount !== undefined ? company.investmentAmount : null,
      investment_stage: company.stage || null,
      ownership_percentage: company.ownershipPercentage !== undefined ? company.ownershipPercentage : null,
      company_industry: company.industry || null,
      company_location: company.location || null,
      notes: company.notes || null
    };
    
    console.log("Database record to be inserted:", dbRecord);
    
    const { error, data } = await supabase
      .from('investor_portfolio')
      .insert(dbRecord)
      .select('*')
      .single();
      
    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }
    
    console.log("Successfully added company with ID:", data?.id);
    
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error adding portfolio company:', error);
    return { error: error.message, success: false };
  }
}

// Update an existing portfolio company
export async function updatePortfolioCompany(company: Partial<PortfolioCompany>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', success: false };
    }
    
    if (!company.id) {
      return { error: 'Company ID is required', success: false };
    }
    
    if (!company.name) {
      return { error: 'Company name is required', success: false };
    }
    
    // First verify that the company belongs to the user
    const { data: existingCompany, error: fetchError } = await supabase
      .from('investor_portfolio')
      .select('investor_id')
      .eq('id', company.id)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (existingCompany.investor_id !== user.id) {
      return { error: 'Unauthorized access to portfolio company', success: false };
    }
    
    // Convert from component format to database format
    const dbRecord = {
      company_name: company.name,
      company_website: company.website || null,
      company_logo_url: company.logoUrl || null, // Make sure this is properly set
      investment_date: company.investmentDate || null,
      investment_amount: company.investmentAmount !== undefined ? company.investmentAmount : null,
      investment_stage: company.stage || null,
      ownership_percentage: company.ownershipPercentage !== undefined ? company.ownershipPercentage : null,
      company_industry: company.industry || null,
      company_location: company.location || null,
      notes: company.notes || null,
      updated_at: new Date().toISOString()
    };
    
    console.log("Updating company with data:", JSON.stringify(dbRecord, null, 2));
    
    const { error, data } = await supabase
      .from('investor_portfolio')
      .update(dbRecord)
      .eq('id', company.id)
      .select('*')
      .single();
      
    if (error) {
      console.error("Database update error:", error);
      throw error;
    }
    
    console.log("Updated company, new data:", data);
    
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating portfolio company:', error);
    return { error: error.message, success: false };
  }
}

// Delete a portfolio company
export async function deletePortfolioCompany(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', success: false };
    }
    
    // First verify that the company belongs to the user
    const { data: existingCompany, error: fetchError } = await supabase
      .from('investor_portfolio')
      .select('investor_id')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    if (existingCompany.investor_id !== user.id) {
      return { error: 'Unauthorized access to portfolio company', success: false };
    }
    
    const { error } = await supabase
      .from('investor_portfolio')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting portfolio company:', error);
    return { error: error.message, success: false };
  }
}

// Upload company logo - Updated to use the profile-images bucket
export async function uploadCompanyLogo(file: File) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', url: null };
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${user.id}-${Date.now()}.${fileExt}`;
    
    console.log("Uploading portfolio logo to profile-images bucket:", fileName, "size:", file.size);
    
    // Convert File object to suitable format for Supabase storage
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase storage - changed bucket name to profile-images
    const { error: uploadError, data } = await supabase.storage
      .from('profile-images') // Changed from portfolio-logos to profile-images
      .upload(fileName, fileData, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw uploadError;
    }
    
    console.log("Upload successful, data:", data);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images') // Changed from portfolio-logos to profile-images
      .getPublicUrl(fileName);
    
    console.log("Generated public URL:", publicUrl);
    
    return { url: publicUrl, error: null };
  } catch (error: any) {
    console.error('Error uploading company logo:', error);
    return { error: error.message, url: null };
  }
}