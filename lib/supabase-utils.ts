import { createClient } from '@/supabase/supabase';
import { User } from '@supabase/supabase-js';

const supabase = createClient();  

// Helper to convert base64 to a file blob
export const dataURLtoFile = (dataurl: string, filename: string): File => {
  try {
    // Check if it's already a valid URL rather than a data URL
    if (dataurl.startsWith('http')) {
      // For existing image URLs, return a minimal placeholder file
      return new File([new ArrayBuffer(1)], filename, { type: 'image/jpeg' });
    }

    // Ensure it's a proper data URL
    if (!dataurl.startsWith('data:')) {
      throw new Error('Invalid data URL format');
    }

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    
    // Safely handle the base64 data
    let bstr;
    try {
      bstr = atob(arr[1]);
    } catch (error) {
      console.error('Invalid base64 encoding in data URL');
      throw new Error('Invalid base64 encoding');
    }
    
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('Error in dataURLtoFile:', error);
    // Return a minimal placeholder file in case of error
    return new File([new ArrayBuffer(1)], filename, { type: 'image/jpeg' });
  }
};

// Upload profile picture to Supabase storage
export const uploadProfilePicture = async (
  user: User,
  imageDataUrl: string
): Promise<string | null> => {
  try {
    // Skip upload if it's already a Supabase storage URL
    if (imageDataUrl.includes('supabase')) {
      return imageDataUrl;
    }
    
    // Skip upload if it's not a data URL (and not a Supabase URL)
    if (!imageDataUrl.startsWith('data:')) {
      console.warn('Not a data URL, cannot upload to storage:', imageDataUrl.substring(0, 30) + '...');
      return null;
    }

    // Convert data URL to File
    const file = dataURLtoFile(imageDataUrl, `profile-${user.id}-${Date.now()}.jpeg`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(`${user.id}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(data.path);

    console.log("YEH SARA DONKEY KA DATA HAI", publicUrlData); 
    
    console.log('Uploaded profile picture URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    return null;
  }
};

// Upload company logo to Supabase storage
export const uploadCompanyLogo = async (
  userId: string,
  companyId: string,
  imageDataUrl: string
): Promise<string | null> => {
  try {
    const file = dataURLtoFile(imageDataUrl, `logo-${companyId}-${Date.now()}.jpeg`);
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(`${userId}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading company logo:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadCompanyLogo:', error);
    return null;
  }
};

// Save profile information to Supabase database
export const saveProfileInfo = async (
  user: User,
  profileData: {
    first_name: string;
    last_name: string;
    company_function: string;
    founder_type: string;
    calendar_link?: string;
    profile_picture_url?: string;
    instagram_link: string;
    linkedin_url?: string;
    role?: string;
  }
) => {
  try {
    // We'll separate role from the rest of the data since it's stored in a separate table
    const { role, ...profileDataToSave } = profileData;
    
    // Update profiles table without the role field
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        ...profileDataToSave,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving profile info:', error);
      return { success: false, error };
    }

    // If role is provided, update it in the user_roles table
    if (role) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role
        });

      if (roleError) {
        console.error('Error updating user role:', roleError);
        // We don't fail the entire operation if just the role update fails
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveProfileInfo:', error);
    return { success: false, error };
  }
};

// Save company information to Supabase database
export const saveCompanyInfo = async (
  userId: string,
  companyData: {
    company_name: string;
    web_url: string;
    short_description: string;
    full_description: string;
    products_count: number;
    logo_url?: string;
  }
) => {
  try {
    // First insert or update the company record
    const { data, error } = await supabase
      .from('companies')
      .upsert({
        owner_id: userId,
        ...companyData,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error saving company info:', error);
      return { success: false, error, companyId: null };
    }

    return { success: true, companyId: data?.[0]?.id || null };
  } catch (error) {
    console.error('Error in saveCompanyInfo:', error);
    return { success: false, error, companyId: null };
  }
};

// Save business details to Supabase database
export const saveBusinessDetails = async (
  companyId: string,
  businessData: {
    headquarters_location: string;
    incorporation_date?: string;
    business_type: string;
    sales_type: string;
    business_stage: string;
    business_model: string;
  }
) => {
  try {
    const { error } = await supabase
      .from('business_details')
      .upsert({
        company_id: companyId,
        ...businessData,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving business details:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveBusinessDetails:', error);
    return { success: false, error };
  }
};

// Save industry information to Supabase database
export const saveIndustryInfo = async (
  companyId: string,
  selectedCategories: {
    [key: string]: string[];
  }
) => {
  try {
    // First remove existing industry associations for this company
    const { error: deleteError } = await supabase
      .from('company_industries')
      .delete()
      .eq('company_id', companyId);

    if (deleteError) {
      console.error('Error deleting existing industry associations:', deleteError);
      return { success: false, error: deleteError };
    }

    // Create new industry associations
    const industryEntries = [];

    for (const [categoryId, subCategories] of Object.entries(selectedCategories)) {
      for (const subCategory of subCategories) {
        // Get subcategory ID
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from('industry_subcategories')
          .select('id')
          .eq('category_id', categoryId)
          .eq('subcategory_name', subCategory)
          .single();

        if (subcategoryError) {
          console.error('Error fetching subcategory:', subcategoryError);
          continue;
        }

        if (subcategoryData) {
          industryEntries.push({
            company_id: companyId,
            category_id: categoryId,
            subcategory_id: subcategoryData.id
          });
        }
      }
    }

    if (industryEntries.length > 0) {
      const { error: insertError } = await supabase
        .from('company_industries')
        .insert(industryEntries);

      if (insertError) {
        console.error('Error inserting industry associations:', insertError);
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveIndustryInfo:', error);
    return { success: false, error };
  }
}; 