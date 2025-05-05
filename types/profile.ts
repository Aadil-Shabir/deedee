
export interface Profile {
  id?: string;
  name?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  entreprenuer_type?: string;
  profile_image?: string;
  companies?: Company[];
}

export interface Company {
  id?: string;
  name?: string;
  business_description?: string;
  company_stage?: string;
  company_industries?: { industry_id: string }[];
  team_size?: number;
  fundraising_amount?: number;
  fundraising_stage?: string;
  fundraising_status?: string;
  business_metrics?: any[];
}
