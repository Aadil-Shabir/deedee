export type SortField = "first_name" | "email" | "firm_name" | "created_at" | "activity_score" | "source";
export type SortOrder = "asc" | "desc";

export interface InvestorData {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    profile_image_url: string | null;
    investor_category: string | null;
    location: string | null;
    source: string;
    created_at: string;
    last_verified_at: string | null;
    last_login: string | null;
    activity_score: number | null;
    email_confirmed: boolean;
    created_by_admin: boolean;
    firm_name: string | null;
    firm_website: string | null;
    firm_type: string | null;
    firm_location: string | null;
    contact_title: string | null;
    contact_verified: boolean;
}

export type InvestorsFilters = {
    q?: string;
    sectors?: string[];
    regions?: string[];
    business_type?: string[];
    stage?: string[];
    model?: string[];
    sales_type?: string[];
    ranges?: string[];
};

export interface InvestorsResponse {
    investors: InvestorData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export async function getInvestorsTable(params: {
    page: number;
    limit: number;
    sortBy: SortField;
    sortOrder: SortOrder;
    filters?: InvestorsFilters;
}): Promise<InvestorsResponse> {
    const sp = new URLSearchParams();
    sp.set("page", String(params.page));
    sp.set("limit", String(params.limit));
    sp.set("sortBy", params.sortBy);
    sp.set("sortOrder", params.sortOrder);

    const f = params.filters;
    if (f?.q?.trim()) sp.set("q", f.q.trim());
    const setCSV = (key: keyof InvestorsFilters) => {
        const arr = (f?.[key] as string[] | undefined)?.filter(Boolean);
        if (arr && arr.length) sp.set(String(key), arr.join(","));
    };
    setCSV("sectors");
    setCSV("regions");
    setCSV("business_type");
    setCSV("stage");
    setCSV("model");
    setCSV("sales_type");
    setCSV("ranges");

    const res = await fetch(`/api/admin/investors/table?${sp.toString()}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to fetch investors");
    }
    return (await res.json()) as InvestorsResponse;
}
