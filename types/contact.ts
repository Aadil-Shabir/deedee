export interface Contact {
    id: string;
    company_name: string;
    full_name: string;
    email: string;
    last_modified: string;
    investor_type: string;
    stage: string;
    founder_id: string;
    created_at: string;
    phone?: string;
    linkedin_url?: string;
    notes?: string;
    hq_geography?: string;
    visit_count?: number;
    match_rate?: number;
    avatar?: string;
    
    // Fields for first/last name that might be present
    first_name?: string;
    last_name?: string;
    company?: string;
    country?: string;
    city?: string;
    
    // Additional fields from investors_data table
    investments?: string;
    investment_type?: string;
    investor_relations?: string;
    funding_stage?: string;
    business_stages?: string[];
    business_type?: string[];
    sector?: string[];
    business_kind?: string;
    preferred_verticals?: string[];
    hq_country?: string;
    hq_city?: string;
    web_url?: string;
    crunchbase?: string;
    general_email?: string;
    primary_contact_first_name?: string;
    primary_contact_last_name?: string;
    primary_contact_email?: string;
    primary_contact_function?: string;
    primary_contact_mobile?: string;
    primary_contact_linkedin?: string;
    primary_contact_twitter?: string;
    secondary_contact_first_name?: string;
    secondary_contact_last_name?: string;
    secondary_contact_email?: string;
    secondary_contact_linkedin?: string;
    secondary_contact_twitter?: string;
    secondary_contact_function?: string;
    secondary_contact_mobile?: string;
    relationship_status?: string;
}

export interface InvestorFormData {
    id?: string;
    first_name: string;
    last_name: string;
    company?: string;
    email?: string;
    type?: string;
    stage?: string;
    country?: string;
    city?: string;
    amount?: number | null;
    is_investment?: boolean;
}
