import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvestors, deleteInvestor } from "@/actions/actions.fundraising";
import { submitInvestorByCompanyName } from "@/actions/actions.investor-form";

// Types
interface FundraisingInvestor {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  type?: string;
  stage?: string;
  amount?: string;
  isInvestment?: boolean;
  country?: string;
  city?: string;
}

async function fetchFundraisingInvestors(
  userId: string,
  companyId: string
): Promise<FundraisingInvestor[]> {
  const response = await getInvestors(userId, companyId);

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch investors");
  }

  return response.data || [];
}

export function useFundraisingInvestors(userId: string, companyId: string) {
  return useQuery({
    queryKey: ["fundraising-investors", userId, companyId],
    queryFn: () => fetchFundraisingInvestors(userId, companyId),
    enabled: !!userId && !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useAddFundraisingInvestor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      investorData,
      userId,
    }: {
      investorData: any;
      userId: string;
    }) => {
      const response = await submitInvestorByCompanyName(investorData, userId);

      if (!response.success) {
        throw new Error(response.error || "Failed to add investor");
      }

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fundraising-investors", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["company-investors"],
      });
    },
  });
}

export function useDeleteFundraisingInvestor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      investorId,
    }: {
      userId: string;
      investorId: string;
    }) => {
      const response = await deleteInvestor(userId, investorId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete investor");
      }

      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fundraising-investors", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["company-investors"],
      });
    },
  });
}
