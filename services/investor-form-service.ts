
import { Contact } from "@/types/contacts";
import { toast } from "sonner";
import { InvestorFormData, InvestorContactData, InvestorData } from "@/types/investor";
import { getContactsService } from "./contact-service";
import { getInvestorsService } from "./investor-service";
import { getPipelineService } from "./pipeline-service";
// import { getContactsService } from "./contactsService";
// import { getInvestorsService } from "./investorsService";
// import { getPipelineService } from "./pipelineService";

export async function submitInvestorForm(
  formData: InvestorFormData, 
  user: any,
  selectedContact: Contact | null | undefined,
  setIsSubmitting: (value: boolean) => void,
  onAdd: (investor: any) => void,
  onOpenChange: (open: boolean) => void
) {
  if (!user) {
    toast.error("You must be logged in to add investors");
    return false;
  }

  setIsSubmitting(true);
  const amount = parseFloat(formData.amount) || 0;
  
  try {
    console.log("Submitting investor form with data:", formData);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // Format geography string only if both city and country are provided
    let hqGeography = null;
    if (formData.country) {
      hqGeography = formData.city ? `${formData.city}, ${formData.country}` : formData.country;
    }

    // Prepare contact data
    const contactData: InvestorContactData = {
      company_name: formData.companyName,
      full_name: fullName,
      email: formData.email,
      investor_type: formData.investorType,
      stage: formData.stage,
      founder_id: user.id,
      last_modified: new Date().toISOString(),
      hq_country: formData.country || undefined,
      hq_city: formData.city || undefined,
      hq_geography: hqGeography as string | undefined, 
    };

    // Prepare investor data
    const investorData: InvestorData = {
      company_name: formData.companyName,
      first_name: formData.firstName,
      last_name: formData.lastName,
      investor_type: formData.investorType,
      email: formData.email,
      stage: formData.stage,
      investment_type: formData.isInvestment ? formData.investmentType : null,
      interest_rate: formData.investmentType === 'debt' ? parseFloat(formData.interestRate) || null : null,
      valuation: formData.investmentType === 'equity' ? parseFloat(formData.valuation) || null : null,
      num_shares: formData.investmentType === 'equity' ? parseInt(formData.numShares) || null : null,
      share_price: formData.investmentType === 'equity' ? parseFloat(formData.sharePrice) || null : null,
      reservation_amount: !formData.isInvestment ? amount : 0,
      investment_amount: formData.isInvestment ? amount : 0,
      founder_id: user.id,
      verified: false
    };

    // Get service instances
    const contactsService = getContactsService();
    const investorsService = getInvestorsService();
    const pipelineService = getPipelineService();

    // Step 1: Save or update contact
    const contactResult = await contactsService.saveContactData(
      contactData,
      selectedContact?.id
    );

    if (!contactResult) {
      toast.error("Failed to save contact data");
      setIsSubmitting(false);
      return false;
    }

    // Step 2: Save or update investor data
    const investorResult = await investorsService.saveInvestorData(investorData);

    if (!investorResult) {
      toast.error("Failed to save investor data");
      setIsSubmitting(false);
      return false;
    }

    // Step 3: Check and update pipeline
    const existingPipeline = await pipelineService.getPipeline(investorResult.id, user.id);
    
    if (existingPipeline) {
      await pipelineService.updatePipeline(investorResult.id, user.id, formData.stage);
    } else {
      await pipelineService.createPipeline(investorResult.id, user.id, formData.stage);
    }

    // Pass back combined data for UI updates
    const returnData = {
      ...contactResult,
      ...investorResult,
      id: contactResult.id // Use contact ID as the primary reference
    };
    
    onAdd(returnData);
    onOpenChange(false);
    
    toast.success(selectedContact ? "Investor updated successfully" : "Investor added successfully");
    return true;
  } catch (error) {
    console.error('Error adding/updating investor:', error);
    toast.error(selectedContact ? "Failed to update investor" : "Failed to add investor");
    return false;
  } finally {
    setIsSubmitting(false);
  }
}
