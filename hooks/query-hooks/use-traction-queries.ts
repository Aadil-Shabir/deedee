import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";


interface TractionData {
  id?: string;
  company_id: string;
  achievements?: string[];
  revenue?: {
    thisMonth?: string;
    lastMonth?: string;
    priorMonth?: string;
  };
  clients?: {
    thisMonth?: string;
    lastMonth?: string;
    priorMonth?: string;
  };
  cac?: string;
  lead_to_sales_ratio?: string;
  aov?: string;
  clv?: string;
  gross_profit?: string;
  ebitda_margin?: string;
  has_recurring_revenue?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}


async function fetchTractionData(companyId: string): Promise<TractionData | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("traction_data")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to fetch traction data");
  }
  return data;
}


export function useTractionData(companyId: string) {
  return useQuery({
    queryKey: ["traction-data", companyId],
    queryFn: () => fetchTractionData(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
