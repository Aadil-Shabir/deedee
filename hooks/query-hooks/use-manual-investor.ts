import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddManualInvestorData {
    firstName: string;
    lastName: string;
    email: string;
    investsViaCompany: boolean;
    investorType?: string;
    companyName?: string;
    country: string;
    city: string;
    title?: string;
}

export function useAddManualInvestor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AddManualInvestorData) => {
            const response = await fetch("/api/admin/investors/manual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add investor");
            }

            return response.json();
        },
        onSuccess: (data) => {
            toast.success("Investor added successfully!", {
                description: `${data.data.investorType} investor created successfully.`,
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["investors"] });
            queryClient.invalidateQueries({ queryKey: ["investor-stats"] });
            queryClient.invalidateQueries({ queryKey: ["investor-firms"] });
            queryClient.invalidateQueries({ queryKey: ["investor-contacts"] });
        },
        onError: (error: Error) => {
            toast.error("Failed to add investor", {
                description: error.message,
            });
        },
    });
}

export function useCheckInvestorEmail() {
    return useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch("/api/admin/investors/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to check email");
            }

            return response.json();
        },
    });
}
