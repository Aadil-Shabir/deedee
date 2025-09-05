import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";

interface CompanyData {
  id: string;
  company_name?: string | null;
  web_url?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  [key: string]: any;
}

interface FundraisingData {
  funding_stage?: string | null;
  amount_raised?: number | null;
  [key: string]: any;
}

interface TractionData {
  revenue?: number | null;
  users?: number | null;
  growth_rate?: number | null;
  [key: string]: any;
}

interface ProfileCompletionData {
  completionPercentage: number;
  companyData: CompanyData | null;
  teamCount: number;
  fundraisingData: FundraisingData | null;
  tractionData: TractionData | null;
  stackCount: number;
}

async function fetchProfileCompletion(companyId: string): Promise<ProfileCompletionData> {
  const supabase = createClient();

  
  const [
    companyResponse,
    teamCountResponse,
    fundraisingResponse,
    tractionResponse,
    stackCountResponse
  ] = await Promise.all([
  
    supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single(),
    
    
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId),
    
    
    supabase
      .from("fundraising_current")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle(),
    
    
    supabase
      .from("traction_data")
      .select("*")
      .eq("company_id", companyId)
      .maybeSingle(),
    
    
    supabase
      .from("tech_stack")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId)
  ]);

  
  const { data: companyData, error: companyError } = companyResponse as { data: CompanyData | null; error: Error | null };
  const { count: teamCount, error: teamError } = teamCountResponse as { count: number | null; error: Error | null };
  const { data: fundraisingData, error: fundraisingError } = fundraisingResponse as { data: FundraisingData | null; error: Error | null };
  const { data: tractionData, error: tractionError } = tractionResponse as { data: TractionData | null; error: Error | null };
  const { count: stackCount, error: stackError } = stackCountResponse as { count: number | null; error: Error | null };

 
  [
    { name: "company", error: companyError },
    { name: "team", error: teamError },
    { name: "fundraising", error: fundraisingError },
    { name: "traction", error: tractionError },
    { name: "stack", error: stackError }
  ].forEach(item => {
    if (item.error) {
      if (item.error instanceof Error || (typeof item.error === "string" && item.error)) {
        console.error(`Error fetching ${item.name} data:`, item.error);
      }
    }
  });

  let completedSections = 0;
  const totalSections = 6; // profile, business, team, fundraising, traction, stack


  if (
    companyData &&
    companyData.company_name &&
    companyData.web_url &&
    companyData.short_description
  ) {
    completedSections += 1; // Profile section

    if (companyData.full_description) {
      completedSections += 1; 
    }
  }

 
  if (teamCount && teamCount > 0) {
    completedSections += 1; 
  }

  
  if (
    fundraisingData &&
    (fundraisingData.funding_stage || fundraisingData.amount_raised !== null)
  ) {
    completedSections += 1; 
  }

  
  if (
    tractionData &&
    (tractionData.revenue !== null ||
      tractionData.users !== null ||
      tractionData.growth_rate !== null)
  ) {
    completedSections += 1; 
  }

  
  if (stackCount && stackCount > 0) {
    completedSections += 1; 
  }

  
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return {
    completionPercentage,
    companyData,
    teamCount: teamCount || 0,
    fundraisingData,
    tractionData,
    stackCount: stackCount || 0
  };
}

export function useProfileCompletion(companyId: string) {
  return useQuery({
    queryKey: ["profile-completion", companyId],
    queryFn: () => fetchProfileCompletion(companyId),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });
}
