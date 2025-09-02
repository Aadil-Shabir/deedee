export interface CaptableInvestor {
  id: string;
  investor_name: string;
  investment_date: string;
  round_type: string;
  security_type: string;
  valuation: number;
  share_price: number;
  shares: number;
  investment_amount: number;
  ownership_percentage: number;
  growth_percentage: number;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CaptableSummary {
  total_equity: number;
  total_debt: number;
  open_for_investment: number;
}

