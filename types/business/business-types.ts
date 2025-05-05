
export type BusinessModel =
  | "saas"
  | "ecommerce"
  | "marketplace"
  | "consulting"
  | "hardware"
  | "online_marketplace"
  | "agency"
  | "service_business"
  | "real_estate"
  | "retail"
  | "service_based";

export type CompanyStage =
  | "concept"
  | "pre_revenue"
  | "post_revenue"
  | "break_even"
  | "profitable"
  | "scaling"
  | "growth";

export type BusinessFormData = {
  companyName: string;
  websiteUrl: string;
  description: string;
  businessBlurb: string;
  headquarters: string;
  incorporationDate: string;
  businessType: string;
  salesType: string;
  businessStage: CompanyStage;
  businessModel: BusinessModel;
  numProducts: string;
  logoUrl?: string;
  selectedSubIndustries?: string[];
};

export type FundingStage = "2" | "2-3" | "3-4" | "4-6" | "undefined";
export type FundingPurpose = "growth" | "financing" | "acquiring";
export type FundingType = "equity" | "debt" | "mixed";
