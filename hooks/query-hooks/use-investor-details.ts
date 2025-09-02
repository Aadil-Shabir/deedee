"use client";
import { useQuery } from "@tanstack/react-query";

export type InvestorDetails = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    profile_image_url: string | null;
    about: string | null;
    location: string | null;
    investor_category: string | null;
    created_at: string;
    last_login: string | null;
    last_verified_at: string | null;
    activity_score: number | null;
    source: string | null;
    contact: { id: string; title: string | null; verified: boolean | null } | null;
    firm: {
        id: string;
        firm_name: string | null;
        investor_type: string | null;
        website_url: string | null;
        hq_location: string | null;
    } | null;
    preferences: {
        sectors?: string[] | null;
        regions?: string[] | null;
        business_type?: string[] | null;
        stage?: string[] | null;
        range?: string[] | null;
        sweet_spot?: string | null;
        model?: string[] | null;
        sales_type?: string[] | null;
        amount_funded?: string | number | null;
    } | null;
};

type Resp = { investor: InvestorDetails };

export function useInvestorDetails(id?: string) {
    return useQuery({
        queryKey: ["investor-details", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await fetch(`/api/admin/investors/${id}`);
            const json = (await res.json()) as Resp;
            if (!res.ok) throw new Error((json as unknown as string) || "Failed to load investor");
            return json.investor;
        },
        staleTime: 60_000,
        retry: 1,
    });
}
