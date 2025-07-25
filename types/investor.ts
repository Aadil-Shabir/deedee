import { Contact } from "./contacts";
import { InvestorSource } from "./investor-source";

export interface InvestorFormData {
    companyName: string;
    firstName: string;
    lastName: string;
    investorType: string;
    email: string;
    stage: string;
    investmentType: string;
    amount: string;
    isInvestment: boolean;
    interestRate: string;
    valuation: string;
    numShares: string;
    sharePrice: string;
    country: string;
    city: string;
}

export interface InvestorData {
    company_name: string;
    first_name: string;
    last_name: string;
    investor_type: string;
    email: string;
    stage: string;
    investment_type: string | null;
    interest_rate: number | null;
    valuation: number | null;
    num_shares: number | null;
    share_price: number | null;
    reservation_amount: number;
    investment_amount: number;
    founder_id: string;
    verified: boolean;
}

export interface InvestorContactData {
    company_name: string;
    full_name: string;
    email: string;
    investor_type: string;
    stage: string;
    founder_id: string;
    last_modified: string;
    hq_country: string | undefined;
    hq_city: string | undefined;
    hq_geography: string | undefined;
}

export interface InvestorServiceResult {
    contact: Contact | null;
    investor: {
        id: string;
        [key: string]: any;
    } | null;
    success: boolean;
    message: string;
}

export interface InvestorServiceInterface {
    saveInvestorData: (
        contactData: InvestorContactData,
        investorData: InvestorData,
        selectedContact: Contact | null | undefined
    ) => Promise<InvestorServiceResult>;

    getInvestorByEmail: (email: string) => Promise<any>;

    updateInvestorPipeline: (investorId: string, founderId: string, stage: string) => Promise<void>;

    createInvestorPipeline: (investorId: string, founderId: string, stage: string) => Promise<void>;
}

export type InvestorCsvData = {
    id?: string;
    firm_name: string | null;
    website_url: string | null;
    linkedin_url: string | null;
    investor_type: "Angel" | "VC" | "CVC" | "FO" | "Fund of Funds" | null;
    hq_location: string | null;
    other_locations: string[] | null;
    fund_size: number | null;
    stage_focus: string[] | null;
    check_size_range: string | null;
    geographies_invested: string[] | null;
    industries_invested: string[] | null;
    sub_industries_invested: string[] | null;
    portfolio_companies: Array<{
        name: string;
        url?: string;
        industry?: string;
        date?: string;
    }> | null;
    investment_thesis_summary: string | null;
    thesis_industry_distribution: Record<string, number> | null;
    fund_vintage_year: number | null;
    recent_exits: string[] | null;
    activity_score: number | null;
    last_updated_at: string | null;
    isDuplicate?: boolean;
    source: string;
};

export type InvestorUploadError = {
    row: number;
    field: string;
    message: string;
    value?: any;
};
