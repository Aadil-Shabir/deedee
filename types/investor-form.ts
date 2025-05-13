export interface InvestorFormData {
  id?: string;
  // User-facing fields (camelCase)
  firstName: string;
  companyId: string; 
  lastName: string;
  companyName: string;
  email: string;
  investorType: string;
  stage: string;
  country: string;
  city: string;
  isInvestment: boolean;
  amount: string;
  investmentType: string;
  interestRate: string;
  valuation: string;
  numShares: string;
  sharePrice: string;
}

// Database fields structure (snake_case)
export interface DatabaseInvestorData {
  id?: string;
  company_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string | null;
  type: string | null;
  stage: string | null;
  country: string | null;
  city: string | null;
  amount: number | null;
  is_investment: boolean;
  investment_type: string | null;
  interest_rate: number | null;
  valuation: number | null;
  num_shares: number | null;
  share_price: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface InvestorFormResponse {
  success: boolean;
  error?: string;
  data?: any;
  message?: string;
}