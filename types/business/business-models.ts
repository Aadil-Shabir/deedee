
import { BusinessModel } from "./business-types";

export interface BusinessModelOption {
  value: BusinessModel;
  label: string;
  description: string;
}

export const BUSINESS_MODELS: BusinessModelOption[] = [
  {
    value: "saas",
    label: "SaaS",
    description: "Software as a Service",
  },
  {
    value: "ecommerce",
    label: "E-commerce",
    description: "Online retail business",
  },
  {
    value: "marketplace",
    label: "Marketplace",
    description: "Platform connecting buyers and sellers",
  },
  {
    value: "consulting",
    label: "Consulting",
    description: "Professional advisory services",
  },
  {
    value: "hardware",
    label: "Hardware",
    description: "Physical technology products",
  },
  {
    value: "online_marketplace",
    label: "Online Marketplace",
    description: "Digital platform for transactions",
  },
  {
    value: "agency",
    label: "Agency",
    description: "Service provider for businesses",
  },
  {
    value: "service_business",
    label: "Service Business",
    description: "General service provider",
  },
  {
    value: "real_estate",
    label: "Real Estate",
    description: "Property business",
  },
  {
    value: "retail",
    label: "Retail",
    description: "Physical stores selling goods",
  },
  {
    value: "service_based",
    label: "Service Based",
    description: "Business offering specialized services",
  },
];
