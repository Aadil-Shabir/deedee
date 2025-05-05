
export interface Industry {
  id: string;
  name: string;
  subIndustries?: SubIndustry[];
}

export interface SubIndustry {
  id: string;
  name: string;
  industryId: string;
}

// Categorized industry data with sub-industries
export const INDUSTRY_DATA: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    subIndustries: [
      { id: "hospitals", name: "Hospitals & Clinics", industryId: "healthcare" },
      { id: "pharmaceuticals", name: "Pharmaceuticals", industryId: "healthcare" },
      { id: "medical_devices", name: "Medical Devices", industryId: "healthcare" },
      { id: "biotech", name: "Biotechnology", industryId: "healthcare" },
      { id: "healthcare_it", name: "Healthcare IT", industryId: "healthcare" },
    ]
  },
  {
    id: "technology",
    name: "Technology",
    subIndustries: [
      { id: "software", name: "Software Development", industryId: "technology" },
      { id: "hardware", name: "Computer Hardware", industryId: "technology" },
      { id: "it_services", name: "IT Services", industryId: "technology" },
      { id: "cybersecurity", name: "Cybersecurity", industryId: "technology" },
      { id: "cloud_computing", name: "Cloud Computing", industryId: "technology" },
    ]
  },
  {
    id: "finance",
    name: "Financial Services",
    subIndustries: [
      { id: "banking", name: "Banking", industryId: "finance" },
      { id: "insurance", name: "Insurance", industryId: "finance" },
      { id: "investment", name: "Investment & Wealth Management", industryId: "finance" },
      { id: "fintech", name: "Fintech", industryId: "finance" },
      { id: "accounting", name: "Accounting & Tax", industryId: "finance" },
    ]
  },
  {
    id: "retail",
    name: "Retail & Consumer Goods",
    subIndustries: [
      { id: "ecommerce", name: "E-commerce", industryId: "retail" },
      { id: "physical_retail", name: "Physical Retail", industryId: "retail" },
      { id: "consumer_products", name: "Consumer Products", industryId: "retail" },
      { id: "fashion", name: "Fashion & Apparel", industryId: "retail" },
      { id: "luxury", name: "Luxury Goods", industryId: "retail" },
    ]
  },
  {
    id: "education",
    name: "Education",
    subIndustries: [
      { id: "k12", name: "K-12 Education", industryId: "education" },
      { id: "higher_ed", name: "Higher Education", industryId: "education" },
      { id: "edtech", name: "Educational Technology", industryId: "education" },
      { id: "professional_training", name: "Professional Training", industryId: "education" },
      { id: "tutoring", name: "Tutoring & Test Prep", industryId: "education" },
    ]
  },
  {
    id: "entertainment",
    name: "Entertainment & Media",
    subIndustries: [
      { id: "film", name: "Film & TV Production", industryId: "entertainment" },
      { id: "gaming", name: "Gaming", industryId: "entertainment" },
      { id: "music", name: "Music", industryId: "entertainment" },
      { id: "digital_media", name: "Digital Media", industryId: "entertainment" },
      { id: "publishing", name: "Publishing", industryId: "entertainment" },
    ]
  },
  {
    id: "realestate",
    name: "Real Estate & Construction",
    subIndustries: [
      { id: "development", name: "Property Development", industryId: "realestate" },
      { id: "construction", name: "Construction", industryId: "realestate" },
      { id: "property_management", name: "Property Management", industryId: "realestate" },
      { id: "commercial", name: "Commercial Real Estate", industryId: "realestate" },
      { id: "residential", name: "Residential Real Estate", industryId: "realestate" },
    ]
  }
];
