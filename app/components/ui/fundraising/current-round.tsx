"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, CurrencyInput, PercentageInput } from "./form-field";
import { RadioOptions } from "./radio-options";
import { InvestorTypes } from "./investor-types";
import { PaymentProgress } from "./payment-progress";
import { InvestorList } from "./investor-list";

const reasonOptions = [
  { value: "growth", label: "For Growth" },
  { value: "financing", label: "For Financing Ad spend, Inventory, etc." },
  { value: "acquiring", label: "For Acquiring another company" },
];

const fundingTypeOptions = [
  { value: "equity", label: "Equity" },
  { value: "debt", label: "Debt" },
  { value: "mixed", label: "Mixed" },
];

const closingTimeOptions = [
  { value: "lt_2", label: "<2 months" },
  { value: "2_3", label: "2-3 months" },
  { value: "3_4", label: "3-4 months" },
  { value: "4_6", label: "4-6 months" },
  { value: "undefined", label: "not yet defined" },
];

export function CurrentRound() {
  const [capitalReason, setCapitalReason] = useState("growth");
  const [raisingAmount, setRaisingAmount] = useState("");
  const [latestValuation, setLatestValuation] = useState("");
  const [currentValuation, setCurrentValuation] = useState("");
  const [fundingType, setFundingType] = useState("equity");
  const [equityPercentage, setEquityPercentage] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [maxInvestment, setMaxInvestment] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [paidPercentage, setPaidPercentage] = useState(0);
  const [previousRaised, setPreviousRaised] = useState("");
  const [selectedInvestorTypes, setSelectedInvestorTypes] = useState<string[]>(["angel"]);
  const [investors, setInvestors] = useState<any[]>([]);

  const toggleInvestorType = (type: string) => {
    if (selectedInvestorTypes.includes(type)) {
      setSelectedInvestorTypes(selectedInvestorTypes.filter((t) => t !== type));
    } else {
      setSelectedInvestorTypes([...selectedInvestorTypes, type]);
    }
  };

  const handleAddInvestor = (investor: any) => {
    const newInvestor = {
      ...investor,
      id: `inv-${Date.now()}`,
      name: `${investor.firstName} ${investor.lastName}`,
    };
    setInvestors([...investors, newInvestor]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section>
        <FormField
          id="capital-reason"
          label="I'm raising capital.."
          isCompleted={!!capitalReason}
        >
          <RadioOptions
            options={reasonOptions}
            value={capitalReason}
            onChange={setCapitalReason}
            name="capital-reason"
          />
        </FormField>

        <FormField
          id="raising-amount"
          label="How much capital are you currently raising in USD?"
          isCompleted={!!raisingAmount}
        >
          <CurrencyInput
            id="raising-amount"
            value={raisingAmount}
            onChange={setRaisingAmount}
            placeholder="1,000,000"
          />
        </FormField>

        <FormField
          id="latest-valuation"
          label="What is your latest valuation in USD?"
          isCompleted={!!latestValuation}
        >
          <CurrencyInput
            id="latest-valuation"
            value={latestValuation}
            onChange={setLatestValuation}
            placeholder="10,000,000"
          />
        </FormField>

        <FormField
          id="current-valuation"
          label="What is your current valuation in USD?"
          isCompleted={!!currentValuation}
        >
          <CurrencyInput
            id="current-valuation"
            value={currentValuation}
            onChange={setCurrentValuation}
            placeholder="5,000,000"
          />
        </FormField>

        <FormField id="funding-type" label="I'm raising:" isCompleted={!!fundingType}>
          <RadioOptions
            options={fundingTypeOptions}
            value={fundingType}
            onChange={setFundingType}
            name="funding-type"
          />
        </FormField>

        <FormField
          id="equity-percentage"
          label="What is your equity percentage available for investors?"
          isCompleted={!!equityPercentage}
        >
          <PercentageInput
            id="equity-percentage"
            value={equityPercentage}
            onChange={setEquityPercentage}
            placeholder="20.0"
          />
        </FormField>

        <FormField
          id="min-investment"
          label="What is the minimum Investment size a single Investor can Invest?"
          helpText="(cannot be less than $5k)"
          isCompleted={!!minInvestment}
        >
          <CurrencyInput
            id="min-investment"
            value={minInvestment}
            onChange={setMinInvestment}
            placeholder="5,000"
          />
        </FormField>

        <FormField
          id="max-investment"
          label="What is the Maximum Investment size a single Investor can Invest?"
          helpText="(If investment amount exceeds funding amount, notify)"
          isCompleted={!!maxInvestment}
        >
          <CurrencyInput
            id="max-investment"
            value={maxInvestment}
            onChange={setMaxInvestment}
            placeholder="750,000"
          />
        </FormField>

        <FormField
          id="closing-time"
          label="When would you maximum like to close this round?"
          isCompleted={!!closingTime}
        >
          <RadioOptions
            options={closingTimeOptions}
            value={closingTime}
            onChange={setClosingTime}
            name="closing-time"
          />
        </FormField>
      </section>

      <section className="pt-4 border-t border-zinc-800">
        <FormField
          id="previous-raised"
          label="How much equity or debt have you raised prior to this round?"
          isCompleted={!!previousRaised}
        >
          <CurrencyInput
            id="previous-raised"
            value={previousRaised}
            onChange={setPreviousRaised}
            placeholder="150,000"
          />
        </FormField>

        <FormField id="paid-percentage" label="How much has been paid off?">
          <PaymentProgress value={paidPercentage} onChange={setPaidPercentage} />
        </FormField>

        <FormField
          id="investor-types"
          label="Who did you raise from? (select multiple if needed.)"
          isCompleted={selectedInvestorTypes.length > 0}
        >
          <InvestorTypes
            selectedTypes={selectedInvestorTypes}
            onToggle={toggleInvestorType}
          />
        </FormField>

        <div className="mt-8">
          <InvestorList investors={investors} onAddInvestor={handleAddInvestor} />
        </div>
      </section>

      <div className="flex justify-between pt-4 border-t border-zinc-800">
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          BACK
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          NEXT
        </Button>
      </div>
    </div>
  );
} 