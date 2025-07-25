export type InvestorSource = "admin" | "investor" | "founder" | "ai";

export interface InvestorFirmWithSource {
    id: string;
    firm_name: string;
    website_url: string | null;
    linkedin_url: string | null;
    investor_type: string;
    hq_location: string;
    other_locations: string[] | null;
    fund_size: number | null;
    stage_focus: string[] | null;
    check_size_range: string | null;
    geographies_invested: string[] | null;
    industries_invested: string[] | null;
    sub_industries_invested: string[] | null;
    portfolio_companies: any[] | null;
    investment_thesis_summary: string | null;
    thesis_industry_distribution: any | null;
    fund_vintage_year: number | null;
    recent_exits: string[] | null;
    activity_score: number | null;
    source: string; // Changed to string to match database
    created_by_id: string | null;
    last_updated_at: string;
}
