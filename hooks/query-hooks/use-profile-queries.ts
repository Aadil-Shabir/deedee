import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";


interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  company_function?: string;
  email?: string;
  founder_type?: string;
  calendar_link?: string;
  instagram_link?: string;
  linkedin_url?: string;
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}


async function fetchProfileData(userId: string): Promise<ProfileData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to fetch profile data");
  }
  return data;
}


export function useProfileData(userId: string) {
  return useQuery({
    queryKey: ["profile-data", userId],
    queryFn: () => fetchProfileData(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
