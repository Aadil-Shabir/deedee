export interface Company {
  id: string;
  name: string;
  founderId: string;
  founderName: string;
  country: string;
  logo?: string;
  investment: number;
  currentValue: number;
  growthPercentage: number;
  security: string;
  securityValue: number;
  securityGrowth: number;
  isActive: boolean;
  dateAdded: string;
}

export type PortfolioTab = 'active' | 'exits' | 'returns';

export interface SellPositionData {
  companyId: string;
  percentage: number;
  askingPrice: number;
  discount: number;
  fee: number;
  netEarnings: number;
}

export interface AddCompanyData {
  companyName: string;
  investmentDate: string;
  country: string;
  founderFirstName: string;
  founderLastName: string;
  founderEmail: string;
  investmentAmount: string;
  securityType: string;
  valuation: string;
  sharesAcquired: string;
  sharePrice: string;
} 