// app/actions/investor-profile.ts
'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type InvestorProfileData = {
  investment_preference?: string
  about?: string
  first_name?: string
  last_name?: string
  email?: string
  profile_image_url?: string | null
  company_name?: string
  company_url?: string
  country?: string
  city?: string
  investor_category?: string
}

// Get current investor profile
export async function getInvestorProfile() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", data: null }
    }
    
    const { data, error } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('id', user.id) // Changed from 'id' to 'user_id'
      .single()
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", error)
      return { error: "Failed to fetch profile", data: null }
    }

    console.log("Retrieved profile data:", data);
    
    return { data, error: null }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { error: "An unexpected error occurred", data: null }
  }
}

// Update investor profile with image URL
export async function upsertInvestorProfile(formData: InvestorProfileData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", success: false }
    }

    console.log("Updating profile with data:", JSON.stringify(formData, null, 2));
    
    // Check if profile exists - FIXED: use user_id instead of id
    const { data: existingProfile } = await supabase
      .from('investor_profiles')
      .select('id')
      .eq('id', user.id) // Changed from 'id' to 'user_id'
      .single()
      
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('investor_profiles')
        .update({
          investment_preference: formData.investment_preference,
          about: formData.about,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          profile_image_url: formData.profile_image_url, // This is now correctly passed
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id) // Use the actual row ID, not user ID
        
      if (error) {
        console.error("Error updating profile:", error)
        return { error: "Failed to update profile: " + error.message, success: false }
      }
    } else {
      // Insert new profile
      const { error } = await supabase
        .from('investor_profiles')
        .insert({
          id: user.id, // Changed from 'id' to 'user_id'
          investment_preference: formData.investment_preference,
          about: formData.about,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          profile_image_url: formData.profile_image_url, // This is now correctly passed
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        
      if (error) {
        console.error("Error creating profile:", error)
        return { error: "Failed to create profile: " + error.message, success: false }
      }
    }

    // Add revalidation to ensure cache is refreshed
    revalidatePath('/investor/profile')
    return { success: true, error: null }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { error: "An unexpected error occurred", success: false }
  }
}

// Upload profile image to Supabase storage and return the URL
export async function uploadProfileImage(formData: FormData) {
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
    
    // Create bucket if needed
    try {
      await supabase.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024 // 2MB
      })
    } catch (error: any) {
      // Ignore if bucket already exists
      if (!error.message.includes('already exists')) {
        throw error
      }
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return { error: "Failed to upload image", url: null }
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)
    
    return { url: publicUrl, error: null }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { error: "An unexpected error occurred", url: null }
  }
}

// Delete investor profile
export async function deleteInvestorProfile() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: "Not authenticated", success: false }
    }
    
    const { error } = await supabase
      .from('investor_profiles')
      .delete()
      .eq('id', user.id)
    
    if (error) {
      console.error("Error deleting profile:", error)
      return { error: "Failed to delete profile", success: false }
    }
    
    revalidatePath('/investor/profile')
    return { success: true, error: null }
  } catch (err) {
    console.error("Unexpected error:", err)
    return { error: "An unexpected error occurred", success: false }
  }
}