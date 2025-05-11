import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getInvestorMandate, updateInvestorMandate, InvestorMandateData } from '@/actions/actions.investor-mandate';

// Types for the hook parameters
export type UpdateMandateParams = {
  mainData: InvestorMandateData;
  regions: string[];
  industries: string[];
  stages: string[];
};

// Query hook to fetch mandate data
export function useInvestorMandateQuery(options = {}) {
  return useQuery({
    queryKey: ['investorMandate'],
    queryFn: async () => {
      try {
        const { data, relatedData, error } = await getInvestorMandate();
        
        if (error) {
          console.error("Error fetching mandate data:", error);
          throw new Error(error);
        }
        
        // Extract B2B, B2C etc. from industries
        const businessSectors = ['B2B', 'B2C', 'B2G', 'B2B2C'];
        const sectors = relatedData?.industries?.filter(i => 
          businessSectors.includes(i)
        ) || [];
        
        // Extract business types from industries
        const businessTypesList = ['Startup', 'Small Business', 'Corporation', 'Non-Profit'];
        const businessTypes = relatedData?.industries?.filter(i => 
          businessTypesList.includes(i)
        ) || [];
        
        return { 
          mainData: data || {}, 
          regions: relatedData?.regions || [],
          industries: relatedData?.industries?.filter(i => 
            !businessSectors.includes(i) && !businessTypesList.includes(i)
          ) || [],
          sectors: sectors,
          stages: relatedData?.stages || [],
          businessTypes: businessTypes
        };
      } catch (err: any) {
        console.error("Query error:", err);
        throw new Error(err.message || "Failed to fetch mandate data");
      }
    },
    // Don't refetch on window focus for better UX
    refetchOnWindowFocus: false,
    // Only retry once
    retry: 1,
    // Pass additional options
    ...options
  });
}

// Mutation hook to update mandate data
export function useUpdateInvestorMandate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ mainData, regions, industries, stages }: UpdateMandateParams) => {
      try {
        // Parse numeric values if they're strings
        if (mainData.funded_amount && typeof mainData.funded_amount === 'string') {
          mainData.funded_amount = parseFloat(mainData.funded_amount as string);
        }
        
        if (mainData.investment_sweet_spot && typeof mainData.investment_sweet_spot === 'string') {
          mainData.investment_sweet_spot = parseFloat(mainData.investment_sweet_spot as string);
        }
        
        const { success, error } = await updateInvestorMandate({
          mainData,
          regions,
          industries,
          stages
        });
        
        if (error) {
          throw new Error(error);
        }
        
        return success;
      } catch (err: any) {
        console.error("Mutation error:", err);
        throw new Error(err.message || "Failed to update mandate data");
      }
    },
    onSuccess: () => {
      toast.success('Investment mandate updated successfully', {
        duration: 5000,
        id: 'mandate-update-success'
      });
      queryClient.invalidateQueries({ queryKey: ['investorMandate'] });
    },
    onError: (error: any) => {
      toast.error('Failed to update investment mandate', {
        description: error.message || 'Please try again',
        duration: 5000,
        id: 'mandate-update-error'
      });
    }
  });
}