// hooks/query-hooks/investor-business.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getInvestorProfile, 
  upsertInvestorProfile, 
} from '@/actions/actions.investor-profile';
import { updateInvestorBusiness, uploadCompanyLogo } from '@/actions/actions.investor-business';

// Match the database schema exactly
export type InvestorBusinessData = {
  company_name?: string | null;
  company_url?: string | null;
  company_logo_url?: string | null;
  country?: string | null;
  city?: string | null;
  investor_category?: string | null;
};

// React Query hook for fetching business data
export function useInvestorBusinessQuery(options = {}) {
  return useQuery({
    queryKey: ['investorBusiness'],
    queryFn: async () => {
      try {
        const { data, error } = await getInvestorProfile();
        
        if (error) {
          console.error("Error in server action:", error);
          throw new Error(error);
        }
        
        // Extract only business-related fields for the component
        if (data) {
          return {
            company_name: data.company_name || null,
            company_url: data.company_url || null,
            company_logo_url: data.company_logo_url || null,
            country: data.country || null,
            city: data.city || null,
            investor_category: data.investor_category || null,
          };
        }
        
        // Return null if no data
        return null;
      } catch (err: any) {
        console.error("Query error:", err);
        throw new Error(err.message || "Failed to fetch business data");
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

// React Query hook for updating business data
export function useUpdateInvestorBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (businessData: InvestorBusinessData) => {
      try {
        console.log("Business data received by hook:", JSON.stringify(businessData, null, 2));
        
        // Call the server action with the complete data
        const { success, error } = await updateInvestorBusiness({
          company_name: businessData.company_name || undefined,
          company_url: businessData.company_url || undefined,
          company_logo_url: businessData.company_logo_url,  // IMPORTANT: Make sure this is included
          country: businessData.country || undefined,
          city: businessData.city || undefined,
          investor_category: businessData.investor_category || undefined
        });
        
        if (error) {
          throw new Error(error);
        }
        
        return success;
      } catch (err: any) {
        console.error("Mutation error:", err);
        throw new Error(err.message || "Failed to update business data");
      }
    },
    onSuccess: () => {
      toast.success('Business profile updated successfully', {
        duration: 5000,
        id: 'business-update-success'
      });
      queryClient.invalidateQueries({ queryKey: ['investorBusiness'] });
    },
    onError: (error: any) => {
      toast.error('Failed to update business profile', {
        description: error.message || 'Please try again',
        duration: 5000,
        id: 'business-update-error'
      });
    }
  });
}

// React Query hook for uploading company logo
export function useUploadCompanyLogo() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const { url, error } = await uploadCompanyLogo(formData);
        
        if (error) {
          throw new Error(error);
        }
        
        return url;
      } catch (err: any) {
        console.error("Upload error:", err);
        throw new Error(err.message || "Failed to upload logo");
      }
    },
    onSuccess: (url) => {
      toast.success('Company logo uploaded', {
        duration: 3000,
        id: 'logo-upload-success'
      });
      return url;
    },
    onError: (error: any) => {
      toast.error('Failed to upload logo', {
        description: error.message || 'Please try a different image',
        duration: 5000,
        id: 'logo-upload-error'
      });
    }
  });
}