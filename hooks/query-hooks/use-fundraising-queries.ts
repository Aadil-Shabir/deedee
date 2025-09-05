import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";

// Types for fundraising data
interface FundraisingCurrent {
  id?: string;
  company_id: string;
  funding_stage?: string;
  amount_raised?: number;
  target_amount?: number;
  use_of_funds?: string;
  timeline?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface FundraisingPast {
  id: string;
  company_id: string;
  round_name?: string;
  amount_raised?: number;
  round_date?: string;
  investors?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch current fundraising data
async function fetchCurrentFundraising(companyId: string): Promise<FundraisingCurrent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fundraising_current")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to fetch current fundraising data");
  }
  return data;
}

// Fetch past fundraising data
async function fetchPastFundraising(companyId: string): Promise<FundraisingPast[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fundraising_past")
    .select("*")
    .eq("company_id", companyId)
    .order("round_date", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch past fundraising data");
  }
  return data || [];
}

// React Query hooks
export function useCurrentFundraising(companyId: string) {
  return useQuery({
    queryKey: ["fundraising-current", companyId],
    queryFn: () => fetchCurrentFundraising(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function usePastFundraising(companyId: string) {
  return useQuery({
    queryKey: ["fundraising-past", companyId],
    queryFn: () => fetchPastFundraising(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
