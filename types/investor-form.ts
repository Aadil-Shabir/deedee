export interface InvestorFormData {
  id?: string; 
  // Basic information - matches database columns
  firstName: string;           // maps to first_name
  lastName: string;            // maps to last_name
  company?: string;            // maps to company
  email?: string;              // maps to email
  
  // Investor categorization
  type?: string;               // maps to type
  stage?: string;              // maps to stage
  
  // Geographic information
  country?: string;            // maps to country
  city?: string;               // maps to city
  
  // Financial details - match database columns
  amount?: string;             // maps to amount (converted to numeric)
  isInvestment?: boolean;      // maps to is_investment
  investmentType?: string;     // maps to investment_type
  interestRate?: string;       // maps to interest_rate (converted to numeric)
  valuation?: string;          // maps to valuation (converted to numeric)
  numShares?: string;          // maps to num_shares (converted to numeric)
  sharePrice?: string;         // maps to share_price (converted to numeric)
  
  // Additional fields for UI/UX
  notes?: string;              // Not in DB but useful for UI
  phone?: string;              // Not in DB but useful for UI
  website?: string;            // Not in DB but useful for UI
  linkedin?: string;           // Not in DB but useful for UI
  
  // For internal use
  companyId?: string;          // Used to specify company_id



   previousRaised?: string;
   paidPercentage?: number;
   investorTypes?: string[]
}

export interface InvestorFormResponse {
  success: boolean;
  error: string | null;
  data?: any;
}