"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, CurrencyInput } from "./form-field";
import { PaymentProgress } from "./payment-progress";
import { InvestorTypes } from "./investor-types";
import { InvestorList } from "./investor-list";

export function PastFundraising() {
  const [previousRaised, setPreviousRaised] = useState("");
  const [paidPercentage, setPaidPercentage] = useState(0);
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
          Save & Next
        </Button>
      </div>
    </div>
  );
} 