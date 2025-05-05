
import { useState, useEffect } from "react";
import { Contact } from "@/types/contacts";
import { InvestorFormData } from "@/types/investor";
import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";
import { calculateSharePrice } from "@/utils/investor-validation";
import { createClient } from "@/supabase/supabase";

export function useInvestorFormState(selectedContact: Contact | null | undefined, open: boolean) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInvestor, setIsLoadingInvestor] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState<InvestorFormData>({
    companyName: "",
    firstName: "",
    lastName: "",
    investorType: "",
    email: "",
    stage: "interested",
    investmentType: "equity",
    amount: "",
    isInvestment: false,
    interestRate: "",
    valuation: "",
    numShares: "",
    sharePrice: "0",
    country: "",
    city: "",
  });

  // Load investor data when selected contact changes or dialog opens
  useEffect(() => {
    if (selectedContact && open) {
      console.log("Loading contact data:", selectedContact);
      setIsLoadingInvestor(true);
      
      // Parse name data
      const nameParts = (selectedContact.full_name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Parse geography data
      const city = selectedContact.hq_city || "";
      const country = selectedContact.hq_country || "";
      
      // Set basic contact info
      setFormData(prev => ({
        ...prev,
        companyName: selectedContact.company_name || "",
        firstName,
        lastName,
        email: selectedContact.email || "",
        investorType: selectedContact.investor_type || "",
        stage: selectedContact.stage || "interested",
        country,
        city,
      }));
      
      // Load investment details if this contact is also an investor
      if (selectedContact.email) {
        loadInvestorDetails(selectedContact.email);
      } else {
        setIsLoadingInvestor(false);
      }
    } else if (open) {
      // Reset form when opening with no selected contact
      resetForm();
      setIsLoadingInvestor(false);
    }
  }, [selectedContact, open]);

  // Recalculate share price when valuation or numShares changes
  useEffect(() => {
    if (formData.valuation && formData.numShares) {
      const newSharePrice = calculateSharePrice(formData.valuation, formData.numShares);
      setFormData(prev => ({ ...prev, sharePrice: newSharePrice }));
    }
  }, [formData.valuation, formData.numShares]);

  const loadInvestorDetails = async (email: string) => {
    setIsLoadingInvestor(true);
    try {
        const supabase = await createClient()
      // Use .limit(1) to avoid multiple rows error
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('email', email)
        .limit(1);
      
      if (error) {
        console.error('Error loading investor details:', error);
        toast.error("Failed to load investor details");
        setIsLoadingInvestor(false);
        return;
      }
      
      if (data && data.length > 0) {
        const investorData = data[0];
        console.log("Found investor data:", investorData);
        
        // Check if there's an investment amount or type
        const hasInvestment = (
          Number(investorData.investment_amount) > 0 || 
          investorData.investment_type !== null
        );
        
        // Format numerical values to prevent "undefined" or "null" strings
        const formatValue = (value: any) => {
          if (value === null || value === undefined) return "";
          return String(value);
        };
        
        setFormData(prev => ({
          ...prev,
          isInvestment: hasInvestment,
          investmentType: investorData.investment_type || "equity",
          amount: hasInvestment 
            ? formatValue(investorData.investment_amount)
            : formatValue(investorData.reservation_amount),
          interestRate: formatValue(investorData.interest_rate),
          valuation: formatValue(investorData.valuation),
          numShares: formatValue(investorData.num_shares),
          sharePrice: formatValue(investorData.share_price || "0"),
          firstName: investorData.first_name || prev.firstName,
          lastName: investorData.last_name || prev.lastName,
          stage: investorData.stage || prev.stage,
        }));
      } else {
        console.log("No investor data found for email:", email);
      }
    } catch (error) {
      console.error('Error loading investor details:', error);
      toast.error("Failed to load investor details");
    } finally {
      setIsLoadingInvestor(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Updating field ${field} to value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched on change
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Validate field on change
    validateField(field, value);
  };

  const handleToggleInvestment = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isInvestment: checked }));
  };

  const validateField = (field: string, value: string) => {
    let error: string | null = null;
    
    switch (field) {
      case "companyName":
        error = !value.trim() ? "Company name is required" : null;
        break;
      case "email":
        error = !value.trim() ? "Email is required" : null;
        break;
      case "amount":
        if (value.trim() && parseFloat(value) <= 0) {
          error = `Please enter a valid ${formData.isInvestment ? 'investment' : 'reservation'} amount`;
        }
        break;
      case "interestRate":
        if (formData.isInvestment && formData.investmentType === 'debt' && value.trim() && parseFloat(value) <= 0) {
          error = "Please enter a valid interest rate";
        }
        break;
      case "valuation":
        if (formData.isInvestment && formData.investmentType === 'equity' && value.trim() && parseFloat(value) <= 0) {
          error = "Please enter a valid valuation";
        }
        break;
      case "numShares":
        if (formData.isInvestment && formData.investmentType === 'equity' && value.trim() && parseInt(value) <= 0) {
          error = "Please enter a valid number of shares";
        }
        break;
    }
    
    setFormErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const errors: Record<string, string | null> = {};
    
    // Validate required fields
    errors.companyName = validateField("companyName", formData.companyName);
    errors.email = validateField("email", formData.email);
    
    // Validate investment-specific fields
    if (formData.isInvestment) {
      errors.amount = validateField("amount", formData.amount);
      
      if (formData.investmentType === 'debt') {
        errors.interestRate = validateField("interestRate", formData.interestRate);
      } else if (formData.investmentType === 'equity') {
        errors.valuation = validateField("valuation", formData.valuation);
        errors.numShares = validateField("numShares", formData.numShares);
      }
    }
    
    setFormErrors(errors);
    
    // Mark all fields as touched
    const touched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      touched[key] = true;
    });
    setTouchedFields(touched);
    
    // Return true if there are no errors
    return !Object.values(errors).some(error => error !== null);
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      firstName: "",
      lastName: "",
      investorType: "",
      email: "",
      stage: "interested",
      investmentType: "equity",
      amount: "",
      isInvestment: false,
      interestRate: "",
      valuation: "",
      numShares: "",
      sharePrice: "0",
      country: "",
      city: "",
    });
    setFormErrors({});
    setTouchedFields({});
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    isLoadingInvestor,
    handleFieldChange,
    handleToggleInvestment,
    validateForm,
    formErrors,
    touchedFields,
    resetForm
  };
}
