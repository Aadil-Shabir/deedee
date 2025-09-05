import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeamMembers, getTeamInfo } from "@/actions/actions.teams";


export function useTeamMembers(userId: string, companyId: string) {
  return useQuery({
    queryKey: ["team-members", userId, companyId],
    queryFn: () => getTeamMembers(userId, companyId),
    enabled: !!userId && !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function useTeamInfo(userId: string, companyId: string) {
  return useQuery({
    queryKey: ["team-info", userId, companyId],
    queryFn: () => getTeamInfo(userId, companyId),
    enabled: !!userId && !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}
