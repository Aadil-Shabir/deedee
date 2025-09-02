"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type BulkDeleteItem = { id?: string; email?: string | null };

type Resp = {
    successCount: number;
    failureCount: number;
    results: { profileId?: string; email?: string | null; ok: boolean; error?: string; note?: string }[];
    message: string;
};

export function useBulkDeleteInvestors() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (items: BulkDeleteItem[]) => {
            const res = await fetch("/api/admin/investors/bulk-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });
            const json = (await res.json()) as Resp;
            if (!res.ok) throw new Error((json as any)?.error || "Bulk delete failed");
            return json;
        },
        onSuccess: async () => {
            await Promise.allSettled([
                qc.invalidateQueries({ queryKey: ["admin-investors-table"] }),
                qc.invalidateQueries({ queryKey: ["investor-details"] }),
            ]);
        },
    });
}
