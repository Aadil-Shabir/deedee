import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";

interface CompanyData {
  id: string;
  company_name: string;
  web_url?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

async function fetchCompany(companyId: string): Promise<CompanyData> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) {
    throw new Error(error.message || "Company not found");
  }

  return data;
}

export function useCompanyQuery(companyId: string) {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => fetchCompany(companyId),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes formerly cacheTime
    refetchOnWindowFocus: false, 
  });
}
