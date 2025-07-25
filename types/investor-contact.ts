export interface InvestorContactCsvData {
    full_name: string;
    email: string;
    role_type: string;
    firm_id?: string | null;
    title?: string | null;
    email_verified?: boolean | null;
    mobile_phone?: string | null;
    linkedin_url?: string | null;
    location?: string | null;
    investor_focus_notes?: string | null;
    intro_method?: string | null;
    personal_notes?: string | null;
    activity_score?: number | null;
    preferred_channel?: string | null;
    source: string;
    isDuplicate?: boolean;
}

export interface InvestorContactUploadError {
    row: number;
    field: string;
    message: string;
    value: any;
}

export interface InvestorContactValidationResult {
    data: InvestorContactCsvData[];
    errors: InvestorContactUploadError[];
    duplicates: InvestorContactCsvData[];
}
