
export interface PortfolioItemDetails {
  founderName: string;
  location: string;
  originalInvestment: string;
  security: string;
  originalSharePrice: string;
  latestSharePrice: string;
  shareGrowth: string;
}

export interface PortfolioItemMetrics {
  sharePrice: string;
  moic: string;
  ownership: string;
}

export interface PortfolioItem {
  name: string;
  logo: string;
  status: string;
  currentValue: string;
  valueChange: string;
  metrics: PortfolioItemMetrics;
  details: PortfolioItemDetails;
}
