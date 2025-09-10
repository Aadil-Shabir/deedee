import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";

interface CompanyBasicInfo {
  id: string;
  company_name: string;
  web_url: string;
  short_description: string | null;
  products_count: number | null;
  full_description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

async function fetchUserCompanies(userId: string): Promise<CompanyBasicInfo[]> {
  const supabase = createClient();


  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Authentication verification failed:", authError);
    throw new Error("Please try logging in again");
  }
  
  if (!authData?.user) {
    console.error("No authenticated user found in Supabase");
    throw new Error("Authentication required");
  }


  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    

    if (error.code === 'PGRST301') {
      throw new Error("You don't have permission to access this data");
    } else if (error.code === '42P01') {
      throw new Error("The companies table doesn't exist");
    } else {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
  
  console.log("Successfully loaded companies:", data?.length || 0);
  return data || [];
}

export function useUserCompanies(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-companies", userId],
    queryFn: () => fetchUserCompanies(userId!),
    enabled: !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
