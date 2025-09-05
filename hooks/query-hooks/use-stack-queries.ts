import { useQuery } from "@tanstack/react-query";
import { getTechStackData } from "@/actions/actions.stack";

export const useStackData = (userId: string, companyId: string) => {
  return useQuery({
    queryKey: ["stackData", userId, companyId],
    queryFn: () => getTechStackData(userId, companyId),
    enabled: !!userId && !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
