import { InvestorFormData, DatabaseInvestorData } from "@/types/investor-form";

export function mapFormDataToDatabase(
  formData: InvestorFormData, 
  userId: string,
  companyId: string
): DatabaseInvestorData {
  // Parse numeric values
  const amount = formData.amount ? parseFloat(formData.amount) : null;
  const interestRate = formData.interestRate ? parseFloat(formData.interestRate) : null;
  const valuation = formData.valuation ? parseFloat(formData.valuation) : null;
  const numShares = formData.numShares ? parseFloat(formData.numShares) : null;
  const sharePrice = formData.sharePrice ? parseFloat(formData.sharePrice) : null;
  
  return {
    ...(formData.id ? { id: formData.id } : {}),
    user_id: userId,
    company_id: companyId,
    first_name: formData.firstName,
    last_name: formData.lastName,
    company: formData.companyName,
    email: formData.email || null,
    type: formData.investorType || null,
    stage: formData.stage || null,
    country: formData.country || null,
    city: formData.city || null,
    amount: amount,
    is_investment: formData.isInvestment,
    investment_type: formData.investmentType || null,
    interest_rate: interestRate,
    valuation: valuation,
    num_shares: numShares,
    share_price: sharePrice,
    updated_at: new Date().toISOString()
  };
}

export function mapDatabaseToFormData(dbData: DatabaseInvestorData): InvestorFormData {
  return {
    id: dbData.id,
    firstName: dbData.first_name,
    lastName: dbData.last_name,
    companyId: dbData.company_id,
    companyName: dbData.company || "",
    email: dbData.email || "",
    investorType: dbData.type || "",
    stage: dbData.stage || "interested",
    country: dbData.country || "",
    city: dbData.city || "",
    isInvestment: dbData.is_investment,
    amount: dbData.amount?.toString() || "",
    investmentType: dbData.investment_type || "equity",
    interestRate: dbData.interest_rate?.toString() || "",
    valuation: dbData.valuation?.toString() || "",
    numShares: dbData.num_shares?.toString() || "",
    sharePrice: dbData.share_price?.toString() || ""
  };
}

export function mapContactToInvestorForm(contact: any): Partial<InvestorFormData> {
  if (!contact) {
    return {
      firstName: "",
      lastName: "",
      companyName: ""
    };
  }
  
  return {
    id: contact.id,
    firstName: contact.first_name || contact.full_name?.split(' ')[0] || "",
    lastName: contact.last_name || 
      (contact.full_name?.split(' ').length > 1 ? contact.full_name?.split(' ').slice(1).join(' ') : ""),
    companyName: contact.company || contact.company_name || "",
    email: contact.email || "",
    investorType: contact.investor_type || "",
    stage: contact.stage?.toLowerCase() || "interested",
    country: contact.country || contact.hq_geography || "",
    city: contact.city || "",
    isInvestment: false,
    amount: "",
    investmentType: "equity",
    interestRate: "",
    valuation: "",
    numShares: "",
    sharePrice: ""
  };
}