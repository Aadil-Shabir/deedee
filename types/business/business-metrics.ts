
import { BusinessModel } from './business-types';

export interface BusinessMetric {
  id: string;
  company_id: string;
  metric_date: string;  // Must be string to match Supabase
  business_model: BusinessModel;
  metric_name: string;
  metric_value: number;
  metric_description?: string;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export const METRICS_BY_BUSINESS_MODEL: Record<BusinessModel, Array<{id: string, name: string, description?: string, formula?: string}>> = {
  saas: [
    { id: "mrr", name: "Monthly Recurring Revenue (MRR)", description: "The predictable revenue generated from subscriptions each month" },
    { id: "arr", name: "Annual Recurring Revenue (ARR)", description: "The yearly value of subscription revenue" },
    { id: "nrr", name: "Net Revenue Retention (NRR)", description: "Measures how much revenue you keep from existing customers over time" },
    { id: "cac", name: "Customer Acquisition Cost (CAC)", description: "Average cost to acquire a new customer" },
    { id: "ltv", name: "Customer Lifetime Value (LTV)", description: "The total revenue a business can expect from a single customer" },
    { id: "ltv_cac", name: "LTV to CAC Ratio", description: "Ratio comparing customer lifetime value to acquisition cost" },
    { id: "gross_margin", name: "Gross Margin (%)", description: "Percentage of revenue remaining after direct costs" },
    { id: "customer_churn", name: "Customer Churn Rate (%)", description: "Rate at which customers cancel their subscriptions" },
    { id: "revenue_churn", name: "Revenue Churn Rate (%)", description: "Rate at which recurring revenue is lost" },
    { id: "cac_payback", name: "CAC Payback Period (Months)", description: "Time it takes to recover the cost of acquiring a customer" },
    { id: "burn_rate", name: "Burn Rate & Runway", description: "Rate at which a company is spending its capital" },
    { id: "rule_40", name: "The Rule of 40", description: "Growth rate + Profit margin should exceed 40%" }
  ],
  ecommerce: [
    { id: "revenue", name: "Revenue", description: "Total income generated from sales" },
    { id: "profit", name: "Profit", description: "Revenue minus expenses" },
    { id: "customer_lifetime_value", name: "Customer Lifetime Value", description: "Predicted revenue from a customer during their relationship with the company" },
    { id: "average_order_value", name: "Average Order Value", description: "Average amount spent per order" },
    { id: "customer_acquisition_cost", name: "Customer Acquisition Cost", description: "Cost of acquiring a new customer" },
    { id: "conversion_rate", name: "Conversion Rate", description: "Percentage of visitors who make a purchase" },
    { id: "churn_rate", name: "Churn Rate", description: "Percentage of customers who stop buying products" }
  ],
  marketplace: [
    { id: "gross_merchandise_volume", name: "Gross Merchandise Volume (GMV)", description: "Total sales value through the marketplace" },
    { id: "take_rate", name: "Take Rate", description: "Percentage of GMV that the marketplace keeps as revenue" },
    { id: "active_users", name: "Active Users", description: "Number of users who have made a transaction in a given period" },
    { id: "conversion_rate", name: "Conversion Rate", description: "Percentage of visitors who become buyers or sellers" },
    { id: "customer_acquisition_cost", name: "Customer Acquisition Cost", description: "Cost of acquiring a new user" },
    { id: "churn_rate", name: "Churn Rate", description: "Rate at which users stop using the marketplace" }
  ],
  consulting: [
    { id: "revenue", name: "Revenue", description: "Total income generated from services" },
    { id: "profit_margin", name: "Profit Margin", description: "Percentage of revenue remaining after expenses" },
    { id: "utilization_rate", name: "Utilization Rate", description: "Percentage of time consultants are billable" },
    { id: "project_success_rate", name: "Project Success Rate", description: "Percentage of projects completed successfully" },
    { id: "customer_satisfaction", name: "Customer Satisfaction", description: "Level of satisfaction reported by customers" },
    { id: "new_customer_acquisition_rate", name: "New Customer Acquisition Rate", description: "Rate at which new customers are acquired" }
  ],
  hardware: [
    { id: "revenue", name: "Revenue", description: "Total income generated from sales" },
    { id: "cost_of_goods_sold", name: "Cost of Goods Sold (COGS)", description: "Direct costs of producing goods" },
    { id: "gross_margin", name: "Gross Margin", description: "Revenue minus COGS" },
    { id: "inventory_turnover", name: "Inventory Turnover", description: "Rate at which inventory is sold and replaced" },
    { id: "customer_acquisition_cost", name: "Customer Acquisition Cost", description: "Cost of acquiring a new customer" },
    { id: "return_rate", name: "Return Rate", description: "Percentage of products that are returned" }
  ],
  online_marketplace: [
    { id: "gmv", name: "Gross Merchandise Volume", description: "Total value of goods sold" },
    { id: "take_rate", name: "Take Rate", description: "Percentage of GMV that the marketplace keeps as revenue" }
  ],
  agency: [
    { id: "revenue", name: "Revenue", description: "Total income generated from services" },
    { id: "profit_margin", name: "Profit Margin", description: "Percentage of revenue remaining after expenses" }
  ],
  service_business: [
    { id: "revenue", name: "Revenue", description: "Total income generated from services" },
    { id: "profit_margin", name: "Profit Margin", description: "Percentage of revenue remaining after expenses" }
  ],
  real_estate: [
    { id: "revenue", name: "Revenue", description: "Total income generated" },
    { id: "occupancy_rate", name: "Occupancy Rate", description: "Percentage of units occupied" }
  ],
  retail: [
    { id: "revenue", name: "Revenue", description: "Total income generated from sales" },
    { id: "profit_margin", name: "Profit Margin", description: "Percentage of revenue remaining after expenses" }
  ],
  service_based: [
    { id: "revenue", name: "Revenue", description: "Total income generated from services" },
    { id: "profit_margin", name: "Profit Margin", description: "Percentage of revenue remaining after expenses" }
  ]
};
