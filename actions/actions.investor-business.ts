// actions/actions.investor-business.ts
'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { toast } from 'sonner'

export type InvestorBusinessData = {
  company_name?: string
  company_url?: string
  company_logo_url?: string | null
  country?: string
  city?: string
  investor_category?: string
}

export async function updateInvestorBusiness(formData: InvestorBusinessData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", success: false }
    }
    
    // Log the data we're about to update
    console.log("Updating business profile with data:", JSON.stringify(formData, null, 2));
    
    // Check if the profile already exists
    const { data: existingProfile } = await supabase
      .from('investor_profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const updates = {
        company_name: formData.company_name,
        company_url: formData.company_url,
        company_logo_url: formData.company_logo_url,  // Make sure this is passed correctly
        country: formData.country,
        city: formData.city,
        investor_category: formData.investor_category,
        updated_at: new Date().toISOString()
      }
      
      result = await supabase
        .from('investor_profiles')
        .update(updates)
        .eq('id', user.id)
    } else {
      // Insert new profile
      const newProfile = {
        id: user.id,
        company_name: formData.company_name,
        company_url: formData.company_url,
        company_logo_url: formData.company_logo_url,  // Make sure this is passed correctly
        country: formData.country,
        city: formData.city,
        investor_category: formData.investor_category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      result = await supabase
        .from('investor_profiles')
        .insert(newProfile)
    }
    
    const { error } = result;
    
    if (error) {
      console.error("Error updating business profile:", error)
      return { error: `Database error: ${error.message}`, success: false }
    }
    
    // After successful update, verify the data was saved correctly
    const { data: verifyData, error: verifyError } = await supabase
      .from('investor_profiles')
      .select('company_logo_url')
      .eq('id', user.id)
      .single()
    
    if (verifyError) {
      console.warn("Error verifying update:", verifyError)
    } else {
      console.log("Verified logo URL in database:", verifyData?.company_logo_url)
    }
    
    // Revalidate the path to update the UI
    revalidatePath('/investor/profile')
    return { success: true, error: null }
  } catch (err: any) {
    console.error("Error in updateInvestorBusiness:", err)
    return { error: `Critical error: ${err.message}`, success: false }
  }
}

export async function getInvestorBusiness() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", data: null }
    }
    
    const { data, error } = await supabase
      .from('investor_profiles')
      .select('company_name, company_url, company_logo_url, country, city, investor_category')
      .eq('id', user.id)
      .single()
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching business profile:", error)
      return { error: `Database error: ${error.message}`, data: null }
    }
    
    return { data, error: null }
  } catch (err: any) {
    console.error("Error in getInvestorBusiness:", err)
    return { error: `Critical error: ${err.message}`, data: null }
  }
}

export async function uploadCompanyLogo(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", url: null }
    }
    
    // Get the file from the FormData
    const file = formData.get('file') as File
    if (!file) {
      return { error: "No file provided", url: null }
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-company-logo-${Date.now()}.${fileExt}`
    
    console.log("Attempting to upload file:", fileName);
    
    // Convert File to Buffer for Upload (needed in Next.js server components)
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    
    // Upload the file - use upsert to replace existing files with same name
    const { error: uploadError, data } = await supabase.storage
      .from('company-logos')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) {
      console.error("Error uploading company logo:", uploadError)
      return { error: `Failed to upload company logo: ${uploadError.message}`, url: null }
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName)
    
    console.log("Generated public URL:", publicUrl);
    
    return { url: publicUrl, error: null }
  } catch (err: any) {
    console.error("Error in uploadCompanyLogo:", err)
    return { error: `Upload error: ${err.message}`, url: null }
  }
}