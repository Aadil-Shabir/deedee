import { useMutation, useQueryClient } from "@tanstack/react-query";

type Resp = { success: boolean; deleted_profile_id?: string; error?: string };

export function useDeleteInvestor() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (profileId: string) => {
            // If your API route is /api/admin/investors/[profileId]
            const res = await fetch(`/api/admin/investors/${profileId}`, { method: "DELETE" });
            const json = (await res.json().catch(() => ({}))) as Resp;
            if (!res.ok) throw new Error(json.error || "Delete failed");
            return json;
        },
        onSuccess: () => {
            // invalidate whatever lists/tables you use
            void qc.invalidateQueries({ queryKey: ["admin-investors-list"] });
            void qc.invalidateQueries({ queryKey: ["admin-investors-table"] });
            void qc.invalidateQueries({ queryKey: ["admin-investor-stats"] });
        },
    });
}
