import { useQuery } from "@tanstack/react-query";
import { getCaptableService, } from "@/services/captable-service";
import { CaptableInvestor, CaptableSummary } from "@/types/captable";

export function useCaptableInvestors(companyId: string) {
  return useQuery({
    queryKey: ["captable-investors", companyId],
    queryFn: () => getCaptableService().getCaptableInvestors(companyId),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5, 
  });
}

export function useCaptableSummary(companyId: string) {
  return useQuery({
    queryKey: ["captable-summary", companyId],
    queryFn: () => getCaptableService().getCaptableSummary(companyId),
    enabled: !!companyId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
