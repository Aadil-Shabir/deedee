//lib/constants/investor-constants.ts

export const investorTypes = [
    { value: "venture-capital", label: "Venture Capital" },
    { value: "angel-investor", label: "Angel Investor" },
    { value: "family-office", label: "Family Office" },
    { value: "strategic-investor", label: "Strategic Investor" },
    { value: "accelerator", label: "Accelerator/Incubator" },
    { value: "private-equity", label: "Private Equity" },
    { value: "corporate-investor", label: "Corporate Investor" },
    { value: "individual", label: "Individual" },
];

export const companyStages = [
    { value: "concept", label: "Concept" },
    { value: "pre-revenue", label: "Pre-Revenue" },
    { value: "post-revenue", label: "Post-Revenue" },
    { value: "break-even", label: "Break-Even" },
    { value: "profitable", label: "Profitable" },
    { value: "scaling", label: "Scaling" },
    { value: "growth", label: "Growth" },
];

export const businessModels = [
    { value: "saas", label: "SaaS", description: "Software as a Service" },
    { value: "ecommerce", label: "E-Commerce", description: "Online Retail Business" },
    { value: "marketplace", label: "Marketplace", description: "Platform for Buyers and Sellers" },
    { value: "consulting", label: "Consulting", description: "Professional Advisory Services" },
    { value: "hardware", label: "Hardware", description: "Physical Tech Products" },
    {
        value: "online-marketplace",
        label: "Online Marketplace",
        description: "Digital Platform for Buying and Selling",
    },
    { value: "agency", label: "Agency", description: "Service Provider for Businesses" },
    { value: "service-business", label: "Service Business", description: "Business Providing Services" },
    { value: "real-estate", label: "Real Estate", description: "Property Business" },
    { value: "retail", label: "Retail", description: "Physical Stores Selling Goods" },
];

export const salesTypes = [
    { value: "b2c", label: "B2C", description: "Business to Consumer" },
    { value: "b2b", label: "B2B", description: "Business to Business" },
    { value: "c2c", label: "C2C", description: "Consumer to Consumer" },
    { value: "b2g", label: "B2G", description: "Business to Government" },
    { value: "c2b", label: "C2B", description: "Consumer to Business" },
    { value: "g2c", label: "G2C", description: "Government to Consumer" },
    { value: "g2b", label: "G2B", description: "Government to Business" },
    { value: "b2b2c", label: "B2B2C", description: "Business to Business to Consumer" },
];

export const businessTypes = [
    { value: "small-business", label: "Small Business" },
    { value: "startup", label: "Startup" },
    { value: "enterprise", label: "Enterprise" },
    { value: "non-profit", label: "Non-Profit" },
];

export const industries = [
    { value: "education", label: "Education" },
    { value: "technology", label: "Technology" },
    { value: "entertainment", label: "Entertainment & Media" },
    { value: "financial-services", label: "Financial Services" },
    { value: "healthcare", label: "Healthcare" },
    { value: "real-estate", label: "Real Estate & Construction" },
    { value: "retail", label: "Retail & Consumer Goods" },
];

export const geographies = [
    { value: "south-asia", label: "South Asia" },
    { value: "south-east-asia", label: "South East Asia" },
    { value: "mena", label: "MENA" },
    { value: "europe", label: "Europe" },
    { value: "north-america", label: "North America" },
    { value: "south-america", label: "South America" },
    { value: "africa", label: "Africa" },
    { value: "oceania", label: "Oceania" },
    { value: "global", label: "Global" },
];

export const investmentRanges = [
    { value: "under-100k", label: "Under $100k" },
    { value: "100k-250k", label: "$100k – $250k" },
    { value: "250k-500k", label: "$250k – $500k" },
    { value: "500k-1m", label: "$500k – $1M" },
    { value: "1m-3m", label: "$1M – $3M" },
    { value: "3m-5m", label: "$3M – $5M" },
    { value: "5m-10m", label: "$5M – $10M" },
    { value: "10m-plus", label: "$10M+" },
];
