"use server";

import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { createClient } from '@/supabase/server';

interface TechStackFile {
  id: string;
  file_name: string;
  file_type: string;
  category: string;
  file_size: number;
  storage_path: string;
  display_order?: number;
  metadata?: any;
}

interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Get tech stack data for a specific company
 */
export async function getTechStackData(
  userId: string,
  companyId: string
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase =await createClient();

    // Get tech stack record
    const { data: techStack, error: techStackError } = await supabase
      .from("tech_stack")
      .select("*")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (techStackError) {
      console.error("Error fetching tech stack data:", techStackError);
      return {
        success: false,
        message: "Failed to load tech stack data",
      };
    }

    if (!techStack) {
      // No tech stack data yet, return empty data
      return {
        success: true,
        message: "No tech stack data found",
        data: {
          videoUrl: null,
          files: []
        },
      };
    }

    // Get files
    const { data: files, error: filesError } = await supabase
      .from("tech_stack_files")
      .select("*")
      .eq("tech_stack_id", techStack.id)
      .order("created_at", { ascending: false });

    if (filesError) {
      console.error("Error fetching tech stack files:", filesError);
      return {
        success: false,
        message: "Failed to load tech stack files",
      };
    }

    return {
      success: true,
      message: "Tech stack data loaded successfully",
      data: {
        id: techStack.id,
        videoUrl: techStack.video_url,
        files: files || []
      },
    };
  } catch (error) {
    console.error("Error in getTechStackData:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Save video URL to tech stack
 */
export async function saveVideoUrl(
  userId: string,
  companyId: string,
  videoUrl: string
): Promise<APIResponse> {
  try {
    if (!userId || !companyId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = await createClient();

    // Check if tech stack record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("tech_stack")
      .select("id")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking tech stack record:", checkError);
      return {
        success: false,
        message: "Failed to check existing record",
      };
    }

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from("tech_stack")
        .update({ video_url: videoUrl || null })
        .eq("id", existingRecord.id);

      if (error) {
        console.error("Error updating video URL:", error);
        return {
          success: false,
          message: "Failed to update video URL",
        };
      }
    } else {
      // Create new tech stack record
      const { error } = await supabase
        .from("tech_stack")
        .insert({
          company_id: companyId,
          user_id: userId,
          video_url: videoUrl || null
        });

      if (error) {
        console.error("Error creating tech stack record:", error);
        return {
          success: false,
          message: "Failed to save video URL",
        };
      }
    }

    revalidatePath("/company/profile");
    revalidatePath("/tech-stack");

    return {
      success: true,
      message: "Video URL saved successfully",
    };
  } catch (error) {
    console.error("Error in saveVideoUrl:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Upload file to tech stack
 */
export async function uploadTechStackFile(
  userId: string,
  companyId: string,
  file: File,
  category: string,
  sessionToken?: string // Add token parameter
): Promise<APIResponse<TechStackFile>> {
  try {
    if (!userId || !companyId || !file || !category) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase =await createClient();
    
    // If a session token is provided, set it for this request
    if (sessionToken) {
      // Set the session manually
      await supabase.auth.setSession({
        access_token: sessionToken,
        refresh_token: '',
      });
    }
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No authenticated session found");
      return {
        success: false,
        message: "Not authenticated. Please sign in and try again.",
      };
    }
    
    console.log("Session user ID:", session.user.id);
    console.log("Requested user ID:", userId);
    
    // Compare the session user ID with the requested user ID
    if (session.user.id !== userId) {
      return {
        success: false,
        message: "Not authorized to upload for this user",
      };
    }

    // Generate file ID and prepare paths
    const fileId = createId();
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split('.').pop() || '';
    const storagePath = `${category}/${userId}/${fileId}.${fileExt}`;
    
    // Check/create tech stack record
    let techStackId: string;
    
    const { data: existingRecord, error: checkError } = await supabase
      .from("tech_stack")
      .select("id")
      .eq("company_id", companyId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking tech stack record:", checkError);
      return {
        success: false,
        message: "Failed to check existing tech stack",
      };
    }

    if (existingRecord) {
      techStackId = existingRecord.id;
    } else {
      // Create new tech stack record
      const { data, error } = await supabase
        .from("tech_stack")
        .insert({
          company_id: companyId,
          user_id: userId,
          video_url: null
        })
        .select("id");

      if (error || !data?.[0]) {
        console.error("Error creating tech stack record:", error);
        return {
          success: false,
          message: `Failed to create tech stack record: ${error?.message || "Unknown error"}`,
        };
      }

      techStackId = data[0].id;
    }

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload file to storage
    const { error: uploadError } = await supabase
      .storage
      .from('tech-stack')
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return {
        success: false,
        message: `Failed to upload file: ${uploadError.message}`,
      };
    }

    // Save file record in database
    const fileData = {
      tech_stack_id: techStackId,
      file_name: fileName,
      file_type: fileExt,
      category,
      file_size: fileSize,
      storage_path: `tech-stack/${storagePath}`
    };
    
    const { data: fileRecord, error: fileError } = await supabase
      .from("tech_stack_files")
      .insert(fileData)
      .select()
      .single();

    if (fileError) {
      console.error("Error saving file record:", fileError);
      return {
        success: false,
        message: `File uploaded but failed to save record: ${fileError.message}`,
      };
    }

    revalidatePath("/company/profile");

    return {
      success: true,
      message: "File uploaded successfully",
      data: fileRecord
    };
  } catch (error) {
    console.error("Error in uploadTechStackFile:", error);
    return {
      success: false,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Delete tech stack file
 */
export async function deleteTechStackFile(
  userId: string,
  fileId: string
): Promise<APIResponse> {
  try {
    if (!userId || !fileId) {
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    const supabase = await createClient();

    // 1. Get file information
    const { data: fileInfo, error: fileError } = await supabase
      .from("tech_stack_files")
      .select("storage_path, tech_stack_id")
      .eq("id", fileId)
      .maybeSingle();

    if (fileError || !fileInfo) {
      console.error("Error getting file info:", fileError);
      return {
        success: false,
        message: "Failed to get file information",
      };
    }

    // 2. Verify file belongs to user
    const { data: techStackInfo, error: authError } = await supabase
      .from("tech_stack")
      .select("user_id")
      .eq("id", fileInfo.tech_stack_id)
      .maybeSingle();

    if (authError || !techStackInfo) {
      console.error("Error verifying file ownership:", authError);
      return {
        success: false,
        message: "Failed to verify file ownership",
      };
    }

    if (techStackInfo.user_id !== userId) {
      return {
        success: false,
        message: "You don't have permission to delete this file",
      };
    }

    // 3. Delete from storage
    if (fileInfo.storage_path) {
      const storagePath = fileInfo.storage_path.replace('tech-stack/', '');
      
      const { error: storageError } = await supabase
        .storage
        .from('tech-stack')
        .remove([storagePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue anyway, as we want to delete the database record
      }
    }

    // 4. Delete database record
    const { error: deleteError } = await supabase
      .from("tech_stack_files")
      .delete()
      .eq("id", fileId);

    if (deleteError) {
      console.error("Error deleting file record:", deleteError);
      return {
        success: false,
        message: "Failed to delete file record",
      };
    }

    revalidatePath("/company/profile");
    revalidatePath("/tech-stack");

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteTechStackFile:", error);
    return {
      success: false,
      message: "An unexpected error occurred during deletion",
    };
  }
}