import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/supabase";

interface BusinessDetails {
  id: string;
  company_id: string;
  headquarters_location: string | null;
  incorporation_date: string | null;
  business_type: string | null;
  sales_type: string | null;
  business_stage: string | null;
  business_model: string | null;
  created_at: string;
  updated_at: string;
}

interface IndustryData {
  category_id: string;
  subcategory_id: string | null;
}

async function fetchBusinessDetails(companyId: string): Promise<BusinessDetails | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('business_details')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle();
    
  if (error) {
    console.error('Error loading business details:', error);
    throw new Error(error.message || "Failed to fetch business details");
  }
  
  return data;
}

async function fetchCompanyIndustries(companyId: string): Promise<Record<string, string[]>> {
  const supabase = createClient();
  
  const { data: industriesData, error: industriesError } = await supabase
    .from('company_industries')
    .select('category_id, subcategory_id')
    .eq('company_id', companyId);
    
  if (industriesError) {
    console.error('Error loading industry data:', industriesError);
    throw new Error(industriesError.message || "Failed to fetch industry data");
  }
  
  if (industriesData && industriesData.length > 0) {
    const categories: Record<string, string[]> = {};
    

    industriesData.forEach(item => {
      if (item.category_id) {
        if (!categories[item.category_id]) {
          categories[item.category_id] = [];
        }
        

        if (item.subcategory_id) {
          categories[item.category_id].push(item.subcategory_id);
        }
      }
    });
    
    console.log('Loaded industry categories:', categories);
    return categories;
  } else {
    console.log('No industry data found for company');
    return {};
  }
}

export function useBusinessDetails(companyId: string | null) {
  return useQuery({
    queryKey: ["business-details", companyId],
    queryFn: () => fetchBusinessDetails(companyId!),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCompanyIndustries(companyId: string | null) {
  return useQuery({
    queryKey: ["company-industries", companyId],
    queryFn: () => fetchCompanyIndustries(companyId!),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
