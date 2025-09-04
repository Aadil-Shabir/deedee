"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InvestorFormData } from "@/types/investor-form";
import InvestorFormFields from "../../investor-profile/Investor-form-fields";

interface AddInvestorFormProps {
  onSubmit: (
    data: InvestorFormData
  ) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  initialData?: Partial<InvestorFormData>;
  isSubmitting?: boolean;
}

export function AddInvestorForm({
  onSubmit,
  onCancel,
  initialData = {},
  isSubmitting = false,
}: AddInvestorFormProps) {
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmittingState, setIsSubmitting] = useState<boolean>(false);

  // Initialize form data with defaults and initial values
  const [formData, setFormData] = useState<InvestorFormData>({
    firstName: "",
    lastName: "",
    company: "",
    companyId: "",
    email: "",
    type: "",
    stage: "interested",
    country: "",
    city: "",
    isInvestment: false,
    amount: "",
    investmentType: "equity",
    interestRate: "",
    valuation: "",
    numShares: "",
    sharePrice: "",
    previousRaised: "",
    paidPercentage: 0,
    investorTypes: [],
  });

  // Calculate share price - avoid storing in state to prevent loops
  const calculatedSharePrice = useMemo(() => {
    if (formData.isInvestment && formData.investmentType === "equity") {
      const amount = parseFloat(formData.amount || "0") || 0;
      const numShares = parseFloat(formData.numShares || "0") || 0;

      if (amount > 0 && numShares > 0) {
        return (amount / numShares).toFixed(2);
      }
    }
    return formData.sharePrice || "0.00";
  }, [
    formData.amount,
    formData.numShares,
    formData.isInvestment,
    formData.investmentType,
    formData.sharePrice,
  ]);

  // Reset form when initialData changes - FIXED
  useEffect(() => {
    if (initialData) {
      // Don't use formData in the spread to avoid loops
      setFormData({
        firstName: initialData.firstName || "",
        companyId: initialData.companyId || "",
        lastName: initialData.lastName || "",
        company: initialData.company || "",
        email: initialData.email || "",
        type: initialData.type || "",
        stage: initialData.stage || "interested",
        country: initialData.country || "",
        city: initialData.city || "",
        isInvestment: initialData.isInvestment || false,
        amount: initialData.amount || "",
        investmentType: initialData.investmentType || "equity",
        interestRate: initialData.interestRate || "",
        valuation: initialData.valuation || "",
        numShares: initialData.numShares || "",
        sharePrice: initialData.sharePrice || "",
        previousRaised: initialData.previousRaised || "",
        paidPercentage: initialData.paidPercentage || 0,
        investorTypes: initialData.investorTypes || [],
      });
      setErrors({});
      setTouched({});
    }
  }, [initialData]); // formData removed from dependencies

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Mark field as touched
    if (!touched[field]) {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    }

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handlePreviousRaisedChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      previousRaised: value,
    }));
  };

  const handlePaidPercentageChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      paidPercentage: value,
    }));
  };

  const handleInvestorTypesChange = (types: string[]) => {
    setFormData((prev) => ({
      ...prev,
      investorTypes: types,
    }));
  };

  // Handle toggle for investment switch
  const handleToggleInvestment = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isInvestment: checked,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    const newTouched: Record<string, boolean> = {};

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });

    // Required fields
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.company) {
      newErrors.company = "Company name is required";
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Amount validation for investment
    if (formData.isInvestment) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Investment amount is required";
      }

      if (formData.investmentType === "debt" && !formData.interestRate) {
        newErrors.interestRate = "Interest rate is required";
      }

      if (formData.investmentType === "equity") {
        if (!formData.valuation || parseFloat(formData.valuation) <= 0) {
          newErrors.valuation = "Valuation is required";
        }

        if (!formData.numShares || parseFloat(formData.numShares) <= 0) {
          newErrors.numShares = "Number of shares is required";
        }
      }
    }

    setErrors(newErrors);
    setTouched(newTouched);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingState) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await onSubmit({
        ...formData,
        company: formData.company,
        type: formData.type,
        sharePrice: calculatedSharePrice,
        ...(initialData.id ? { id: initialData.id } : {}),
      });

      if (!result.success) {
        // Check if the error is about duplicate email
        if (result.error && result.error.includes("email already exists")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already associated with another investor",
          }));
          setIsSubmitting(false);

          // Scroll to the email field
          document
            .getElementById("email")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // Handle other errors
          setSubmissionError(result.error || "Failed to save investor data");
          setIsSubmitting(false);
        }
        return;
      }

      // Success handling
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InvestorFormFields
        formData={{
          ...formData,
          sharePrice: calculatedSharePrice,
        }}
        formErrors={errors}
        touchedFields={touched}
        onFieldChange={handleFieldChange}
        onToggleInvestment={handleToggleInvestment}
        onPastFundraisingChange={{
          onPreviousRaisedChange: handlePreviousRaisedChange,
          onPaidPercentageChange: handlePaidPercentageChange,
          onInvestorTypesChange: handleInvestorTypesChange,
        }}
        isReadOnly={isSubmittingState}
      />

      {submissionError && (
        <div className="text-red-500 text-sm">{submissionError}</div>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmittingState}
          className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmittingState}
          className="bg-profile-purple hover:bg-profile-purple/90"
        >
          {isSubmittingState ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
