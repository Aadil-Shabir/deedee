/**
 * Utility functions for calculating key metrics from traction data
 */

// Monthly and Annual Recurring Revenue
export const calculateMRR = (monthlyRevenue: number): number => {
  if (!monthlyRevenue || isNaN(monthlyRevenue)) return 0;
  return monthlyRevenue;
};

export const calculateARR = (mrr: number): number => {
  if (!mrr || isNaN(mrr)) return 0;
  return mrr * 12;
};

// Revenue Growth Rate
export const calculateRevenueGrowth = (
  currentMonthRevenue: number, 
  previousMonthRevenue: number
): number => {
  if (!previousMonthRevenue || previousMonthRevenue <= 0 || !currentMonthRevenue || isNaN(currentMonthRevenue)) return 0;
  return ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
};

// Net Revenue Retention (NRR)
export const calculateNRR = (
  currentMonthRevenue: number,
  previousMonthRevenue: number,
  churnedRevenue: number
): number => {
  if (!previousMonthRevenue || previousMonthRevenue <= 0) return 0;
  return ((currentMonthRevenue - churnedRevenue) / previousMonthRevenue) * 100;
};

// Customer Lifetime Value
export const calculateLTV = (
  averageOrderValue: number, 
  grossMargin: number, 
  churnRate: number
): number => {
  if (!churnRate || churnRate <= 0 || !averageOrderValue || !grossMargin) return 0;
  // Convert percentages to decimals
  const marginDecimal = grossMargin / 100;
  const churnDecimal = churnRate / 100;
  return (averageOrderValue * marginDecimal) / churnDecimal;
};

// LTV to CAC Ratio
export const calculateLtvCacRatio = (
  ltv: number, 
  cac: number
): number => {
  if (!cac || cac <= 0 || !ltv) return 0;
  return ltv / cac;
};

// CAC Payback Period (in months)
export const calculateCACPaybackPeriod = (
  cac: number, 
  averageOrderValue: number, 
  grossMargin: number
): number => {
  if (!averageOrderValue || averageOrderValue <= 0 || !grossMargin || grossMargin <= 0 || !cac) return 0;
  // Convert percentage to decimal
  const marginDecimal = grossMargin / 100;
  return cac / (averageOrderValue * marginDecimal);
};

// Rule of 40 (Growth Rate + Profit Margin)
export const calculateRuleOf40 = (
  growthRate: number, 
  profitMargin: number
): number => {
  if (isNaN(growthRate) || isNaN(profitMargin)) return 0;
  return growthRate + profitMargin;
};

// Burn Rate & Runway
export const calculateRunway = (
  cashBalance: number,
  monthlyBurn: number
): number => {
  if (!monthlyBurn || monthlyBurn <= 0 || !cashBalance) return 0;
  return cashBalance / monthlyBurn;
};

// Customer Acquisition Efficiency
export const calculateCustomerAcquisitionEfficiency = (
  customerLifetimeValue: number,
  customerAcquisitionCost: number
): number => {
  if (!customerAcquisitionCost || customerAcquisitionCost <= 0 || !customerLifetimeValue) return 0;
  return customerLifetimeValue / customerAcquisitionCost;
};

// Month-over-Month Growth
export const calculateMoMGrowth = (current: number, previous: number): number => {
  if (!previous || previous <= 0 || !current) return 0;
  return ((current - previous) / previous) * 100;
};

// Revenue Per Client/Customer
export const calculateRevenuePerClient = (
  totalRevenue: number,
  totalClients: number
): number => {
  if (!totalClients || totalClients <= 0 || !totalRevenue) return 0;
  return totalRevenue / totalClients;
};

// Format a number as currency
export const formatCurrency = (value: number): string => {
  if (!value || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Format a number as percentage
export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '0%';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Parse numeric string with commas to number
export const parseNumericString = (value: string | null | undefined): number | null => {
  if (!value) return null;
  return parseFloat(value.replace(/,/g, ""));
};