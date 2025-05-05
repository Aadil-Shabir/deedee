
import { InvestorFormData } from "@/types/investor";
import { toast } from "sonner";

export const validateInvestorForm = (formData: InvestorFormData): boolean => {
  // Check if required fields are filled
  if (!formData.firstName?.trim()) {
    toast.error("First name is required");
    return false;
  }

  if (!formData.lastName?.trim()) {
    toast.error("Last name is required");
    return false;
  }

  if (!formData.email?.trim()) {
    toast.error("Email is required");
    return false;
  }

  if (!formData.companyName?.trim()) {
    toast.error("Company name is required");
    return false;
  }

  if (!formData.investmentType) {
    toast.error("Investment type is required");
    return false;
  }

  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    toast.error("Valid investment amount is required");
    return false;
  }

  // All validations passed
  return true;
};

export const calculateSharePrice = (valuation: string | number, numShares: string | number, reservedShares?: number): string => {
  // Convert inputs to numbers if they're strings
  const valuationNum = typeof valuation === 'string' ? parseFloat(valuation) : valuation;
  const numSharesNum = typeof numShares === 'string' ? parseFloat(numShares) : numShares;
  
  if (!valuationNum || !numSharesNum || valuationNum <= 0 || numSharesNum <= 0) {
    return "0.00";
  }
  
  // Calculate share price based on valuation and shares
  const totalShares = reservedShares && reservedShares > 0 ? reservedShares : numSharesNum;
  const price = valuationNum / totalShares;
  
  // Format to 2 decimal places
  return price.toFixed(2);
};

export const calculateEquityPercentage = (amount: number, valuation: number): number => {
  if (!amount || !valuation || valuation <= 0) {
    return 0;
  }
  
  // Calculate equity percentage based on investment amount and company valuation
  return (amount / valuation) * 100;
};

export const calculateMinimumGoalProgress = (currentAmount: number, targetAmount: number): number => {
  if (!currentAmount || !targetAmount || targetAmount <= 0) {
    return 0;
  }
  
  // Calculate progress percentage of fundraising goal
  const percentage = (currentAmount / targetAmount) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};
