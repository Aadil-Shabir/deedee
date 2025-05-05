
import { Contact } from "./contacts";

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
  
  updateInvestorPipeline: (
    investorId: string, 
    founderId: string, 
    stage: string
  ) => Promise<void>;
  
  createInvestorPipeline: (
    investorId: string, 
    founderId: string, 
    stage: string
  ) => Promise<void>;
}
