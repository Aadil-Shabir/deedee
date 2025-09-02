import type { InvestorsFilterState } from "@/components/admin/investors/filters/investors-filters-bar";

const KEYS: (keyof InvestorsFilterState)[] = [
    "q",
    "sectors",
    "regions",
    "business_type",
    "stage",
    "model",
    "sales_type",
    "ranges",
];

export function parseFiltersFromSearchParams(sp: URLSearchParams): InvestorsFilterState {
    const str = (k: string) => sp.get(k) ?? "";
    const arr = (k: string) =>
        sp
            .get(k)
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) ?? [];
    return {
        q: str("q"),
        sectors: arr("sectors"),
        regions: arr("regions"),
        business_type: arr("business_type"),
        stage: arr("stage"),
        model: arr("model"),
        sales_type: arr("sales_type"),
        ranges: arr("ranges"),
    };
}

export function encodeFiltersToSearchParams(sp: URLSearchParams, f: InvestorsFilterState) {
    for (const k of KEYS) {
        const v = f[k];
        if (Array.isArray(v)) {
            if (v.length) sp.set(k, v.join(","));
            else sp.delete(k);
        } else {
            if (v && v.trim()) sp.set(k, v.trim());
            else sp.delete(k);
        }
    }
    return sp;
}
