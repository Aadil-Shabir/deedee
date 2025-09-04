"use client";

import React from "react";
import { FormField, CurrencyInput } from "../company/fundraising/form-field";
import { PaymentProgress } from "../company/fundraising/payment-progress";
import { InvestorTypes } from "../company/fundraising/investor-types";

interface PastFundraisingFieldsProps {
  previousRaised?: string;
  paidPercentage?: number;
  investorTypes?: string[];
  onPreviousRaisedChange: (value: string) => void;
  onPaidPercentageChange: (value: number) => void;
  onInvestorTypesChange: (types: string[]) => void;
  disabled?: boolean;
}

export function PastFundraisingFields({
  previousRaised = "",
  paidPercentage = 0,
  investorTypes = [],
  onPreviousRaisedChange,
  onPaidPercentageChange,
  onInvestorTypesChange,
  disabled = false,
}: PastFundraisingFieldsProps) {
  const toggleInvestorType = (type: string) => {
    if (disabled) return;

    if (investorTypes.includes(type)) {
      onInvestorTypesChange(investorTypes.filter((t) => t !== type));
    } else {
      onInvestorTypesChange([...investorTypes, type]);
    }
  };

  return (
    <div className="space-y-4 border border-gray-700 rounded-md p-4">
      <h3 className="text-lg font-medium">Past Fundraising Information</h3>

      <FormField
        id="previous-raised"
        label="How much equity or debt have you raised prior to this round?"
        isCompleted={!!previousRaised}
      >
        <CurrencyInput
          id="previous-raised"
          value={previousRaised}
          onChange={disabled ? () => {} : onPreviousRaisedChange}
          placeholder="150,000"
        />
      </FormField>

      <FormField
        id="paid-percentage"
        label="How much has been paid off?"
        isCompleted={true}
      >
        <PaymentProgress
          value={paidPercentage}
          onChange={disabled ? () => {} : onPaidPercentageChange}
        />
      </FormField>

      <FormField
        id="investor-types"
        label="Who did you raise from? (select multiple if needed.)"
        isCompleted={investorTypes.length > 0}
      >
        <InvestorTypes
          selectedTypes={investorTypes}
          onToggle={disabled ? () => {} : toggleInvestorType}
        />
      </FormField>
    </div>
  );
}
