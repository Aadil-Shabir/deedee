'use server'
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

// Basic team info data structure
interface TeamInfoData {
  teamSize: number;
  hasCoFounders: 'no' | 'two' | 'more';
  foundersDiversity: 'women' | 'men' | 'mixed';
  achievements: string[];
}

// Team member data structure
interface TeamMemberData {
  firstName: string;
  lastName: string;
  function: string;
  email?: string;
  linkedinUrl?: string;
  isFounder?: boolean;
}

/**
 * Save basic team information (without team members)
 */
export async function saveTeamInfo(userId: string, teamInfo: TeamInfoData) {
  const supabase = await createClient();
  
  try {
    // Get company ID for the user
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);

    if (companiesError) {
      console.error("Error fetching companies:", companiesError);
      return { success: false, message: "Failed to find company for this user" };
    }

    if (!companies || companies.length === 0) {
      return { success: false, message: "No company found" };
    }

    const companyId = companies[0].id;
    
    // Check if team info already exists
    const { data: existingInfo, error: existingError } = await supabase
      .from("team_info")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (existingError) {
      console.error("Error checking existing team info:", existingError);
    }
    
    // Insert or update team info
    const { error: saveError } = await supabase
      .from("team_info")
      .upsert({
        company_id: companyId,
        team_size: teamInfo.teamSize,
        has_co_founders: teamInfo.hasCoFounders,
        founders_diversity: teamInfo.foundersDiversity,
        achievement_1: teamInfo.achievements[0] || "",
        achievement_2: teamInfo.achievements[1] || "",
        achievement_3: teamInfo.achievements[2] || "",
        ...(existingInfo ? { id: existingInfo.id } : {}),
        updated_at: new Date().toISOString()
      });
      
    if (saveError) {
      console.error("Error saving team info:", saveError);
      return { success: false, message: "Failed to save team information" };
    }
    
    revalidatePath("/profile");
    return { success: true, message: "Team information saved successfully" };
  } catch (error) {
    console.error("Error in saveTeamInfo:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * Fetch basic team information
 */
export async function getTeamInfo(userId: string) {
  const supabase = await createClient();
  
  try {
    // Get company ID for the user
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);

    if (companiesError || !companies || companies.length === 0) {
      return { success: false, data: null, message: "Company not found" };
    }

    const companyId = companies[0].id;
    
    // Get team info
    const { data: teamInfo, error: teamInfoError } = await supabase
      .from("team_info")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (teamInfoError) {
      console.error("Error fetching team info:", teamInfoError);
      return { success: false, data: null, message: "Failed to fetch team information" };
    }
    
    if (!teamInfo) {
      return { 
        success: true, 
        data: {
          teamSize: 0,
          hasCoFounders: "no" as const,
          foundersDiversity: "mixed" as const,
          achievements: ["", "", ""]
        }, 
        message: "No team information found" 
      };
    }
    
    // Format the data for the UI
    return { 
      success: true, 
      data: {
        teamSize: teamInfo.team_size || 0,
        hasCoFounders: teamInfo.has_co_founders || "no",
        foundersDiversity: teamInfo.founders_diversity || "mixed",
        achievements: [
          teamInfo.achievement_1 || "",
          teamInfo.achievement_2 || "",
          teamInfo.achievement_3 || ""
        ]
      }, 
      message: "Team information loaded successfully" 
    };
  } catch (error) {
    console.error("Error in getTeamInfo:", error);
    return { success: false, data: null, message: "An unexpected error occurred" };
  }
}

/**
 * Add a team member
 */
export async function addTeamMember(userId: string, member: TeamMemberData) {
  const supabase = await createClient();
  
  try {
    // Get company ID for the user
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);

    if (companiesError || !companies || companies.length === 0) {
      return { success: false, message: "Company not found" };
    }

    const companyId = companies[0].id;
    
    // Get or create team_info record
    let teamInfoId;
    
    const { data: existingTeamInfo, error: infoError } = await supabase
      .from("team_info")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (infoError) {
      console.error("Error checking team info:", infoError);
      return { success: false, message: "Failed to verify team information" };
    }
    
    if (existingTeamInfo) {
      teamInfoId = existingTeamInfo.id;
    } else {
      // Create a new team_info record
      const { data: newTeamInfo, error: createError } = await supabase
        .from("team_info")
        .insert({
          company_id: companyId,
          team_size: 1,
          has_co_founders: "no",
          founders_diversity: "mixed"
        })
        .select("id")
        .single();
        
      if (createError || !newTeamInfo) {
        console.error("Error creating team info:", createError);
        return { success: false, message: "Failed to create team information" };
      }
      
      teamInfoId = newTeamInfo.id;
    }
    
    // Add the team member
    const { data: newMember, error: addError } = await supabase
      .from("team_members")
      .insert({
        team_info_id: teamInfoId,
        first_name: member.firstName,
        last_name: member.lastName,
        function: member.function,
        email: member.email || null,
        linkedin_url: member.linkedinUrl || null,
        is_founder: member.isFounder || false
      })
      .select("id")
      .single();
      
    if (addError) {
      console.error("Error adding team member:", addError);
      return { success: false, message: "Failed to add team member" };
    }
    
    revalidatePath("/profile");
    return { 
      success: true, 
      message: "Team member added successfully",
      data: { id: newMember.id }
    };
  } catch (error) {
    console.error("Error in addTeamMember:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

/**
 * Get all team members for a user's company
 */
export async function getTeamMembers(userId: string) {
  const supabase = await createClient();
  
  try {
    // Get company ID
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);

    if (companiesError || !companies || companies.length === 0) {
      return { success: false, data: [], message: "Company not found" };
    }

    const companyId = companies[0].id;
    
    // Get team info ID
    const { data: teamInfo, error: infoError } = await supabase
      .from("team_info")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (infoError) {
      console.error("Error fetching team info:", infoError);
      return { success: false, data: [], message: "Failed to fetch team information" };
    }
    
    if (!teamInfo) {
      return { success: true, data: [], message: "No team found" };
    }
    
    // Get team members
    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_info_id", teamInfo.id)
      .order("created_at", { ascending: false });
      
    if (membersError) {
      console.error("Error fetching team members:", membersError);
      return { success: false, data: [], message: "Failed to fetch team members" };
    }
    
    // Format for the UI
    const formattedMembers = members.map(member => ({
      id: member.id,
      firstName: member.first_name,
      lastName: member.last_name,
      function: member.function,
      email: member.email || "",
      linkedinUrl: member.linkedin_url || "",
      isFounder: member.is_founder || false
    }));
    
    return { 
      success: true, 
      data: formattedMembers, 
      message: "Team members loaded successfully" 
    };
  } catch (error) {
    console.error("Error in getTeamMembers:", error);
    return { success: false, data: [], message: "An unexpected error occurred" };
  }
}

/**
 * Delete a team member
 */
export async function deleteTeamMember(userId: string, memberId: string) {
  const supabase = await createClient();
  
  try {
    // Get company ID
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", userId);

    if (companiesError || !companies || companies.length === 0) {
      return { success: false, message: "Company not found" };
    }

    const companyId = companies[0].id;
    
    // Get team info ID
    const { data: teamInfo, error: infoError } = await supabase
      .from("team_info")
      .select("id")
      .eq("company_id", companyId)
      .maybeSingle();
      
    if (infoError || !teamInfo) {
      console.error("Error fetching team info:", infoError);
      return { success: false, message: "Failed to verify team information" };
    }
    
    // Delete the team member
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId)
      .eq("team_info_id", teamInfo.id);
      
    if (deleteError) {
      console.error("Error deleting team member:", deleteError);
      return { success: false, message: "Failed to delete team member" };
    }
    
    revalidatePath("/profile");
    return { success: true, message: "Team member deleted successfully" };
  } catch (error) {
    console.error("Error in deleteTeamMember:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}