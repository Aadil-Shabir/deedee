"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { ParsedInvestorData } from "@/lib/utils/file-parser";

interface ImportResult {
    success: boolean;
    rowIndex: number;
    email: string;
    error?: string;
    warnings?: string[];
    userId?: string;
    firmId?: string;
    profileId?: string;
    contactId?: string;
}

interface ImportSummary {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
}

interface ImportResponse {
    success: boolean;
    summary: ImportSummary;
    results: ImportResult[];
}

interface ImportProgress {
    current: number;
    total: number;
    currentEmail?: string;
}

export function useBulkInvestorImport() {
    const queryClient = useQueryClient();
    const [progress, setProgress] = useState<ImportProgress | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: ParsedInvestorData[]): Promise<ImportResponse> => {
            console.log("🚀 Starting bulk import mutation with", data.length, "investors");

            // Initialize progress
            setProgress({ current: 0, total: data.length });

            // Process in batches to show progress
            const batchSize = 5;
            const allResults: ImportResult[] = [];

            for (let i = 0; i < data.length; i += batchSize) {
                const batch = data.slice(i, i + batchSize);

                // Update progress with current email
                if (batch.length > 0) {
                    setProgress({
                        current: i,
                        total: data.length,
                        currentEmail: batch[0].email,
                    });
                }

                console.log(
                    `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(data.length / batchSize)}`
                );

                const response = await fetch("/api/admin/investors/bulk", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data: batch }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to import batch");
                }

                const batchResult: ImportResponse = await response.json();
                allResults.push(...batchResult.results);
            }

            // Final progress update
            setProgress({ current: data.length, total: data.length });

            // Calculate final summary
            const successful = allResults.filter((r) => r.success).length;
            const failed = allResults.filter((r) => !r.success).length;
            const successRate = Math.round((successful / allResults.length) * 100);

            const summary: ImportSummary = {
                total: allResults.length,
                successful,
                failed,
                successRate,
            };

            return {
                success: true,
                summary,
                results: allResults,
            };
        },
        onSuccess: (data) => {
            console.log("✅ Bulk import completed successfully:", data.summary);

            // Show success toast
            toast.success(
                `Import completed! ${data.summary.successful}/${data.summary.total} investors imported successfully`,
                {
                    description:
                        data.summary.failed > 0
                            ? `${data.summary.failed} imports failed. Check the results for details.`
                            : "All investors were imported successfully!",
                }
            );

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["investors"] });
            queryClient.invalidateQueries({ queryKey: ["investor-stats"] });
            queryClient.invalidateQueries({ queryKey: ["investor-firms"] });
            queryClient.invalidateQueries({ queryKey: ["investor-contacts"] });
        },
        onError: (error: Error) => {
            console.error("❌ Bulk import failed:", error);

            toast.error("Import failed", {
                description: error.message || "An unexpected error occurred during import",
            });

            // Reset progress on error
            setProgress(null);
        },
    });

    const resetProgress = () => {
        setProgress(null);
    };

    return {
        importInvestors: mutation.mutateAsync,
        isImporting: mutation.isPending,
        progress,
        data: mutation.data,
        error: mutation.error,
        resetProgress,
    };
}
