
export interface Investor {
  id: string;
  name: string;
  company: string;
  type: string;
  score: number;
  date: string;
  avatar: string;
  email?: string;
}

export interface InvestorDetails extends Investor {
  email: string;
  phone: string;
  website: string;
  stage: string;
  location?: string;
  businessTypes?: string[];
  sectors?: string[];
  stages?: string[];
  investmentRange?: string;
  visits: {
    page: string;
    count: number;
    lastVisit: string;
  }[];
}
