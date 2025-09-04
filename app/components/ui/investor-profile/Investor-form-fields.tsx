import { InvestorFormData } from "@/types/investor-form";
import { CompanyInfoFields } from "./company-info-fields";
import { LocationSection } from "./location/location-section";
import { InvestmentDetailsFields } from "./investment-details-field";
import { PastFundraisingFields } from "./past-fundraising-fields";
// import { CompanyInfoFields } from "./CompanyInfoFields";
// import { InvestmentDetailsFields } from "./InvestmentDetailsFields";
// import { LocationSection } from "@/components/investor-business/LocationSection";

interface InvestorFormFieldsProps {
  formData: InvestorFormData;
  formErrors: Record<string, string | null>;
  touchedFields: Record<string, boolean>;
  onFieldChange: (field: string, value: string) => void;
  onToggleInvestment: (checked: boolean) => void;
  onPastFundraisingChange?: {
    onPreviousRaisedChange: (value: string) => void;
    onPaidPercentageChange: (value: number) => void;
    onInvestorTypesChange: (types: string[]) => void;
  };
  isReadOnly?: boolean;
}

export default function InvestorFormFields({
  formData,
  formErrors,
  touchedFields,
  onFieldChange,
  onToggleInvestment,
  onPastFundraisingChange,
  isReadOnly = false,
}: InvestorFormFieldsProps) {
  return (
    <div className="space-y-4">
      <CompanyInfoFields
        companyName={formData.company || ""}
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email || ""}
        investorType={formData.type || ""}
        stage={formData.stage || "interested"}
        onChange={(field, value) => {
          if (field === "companyName") {
            onFieldChange("company", value);
          } else if (field === "investorType") {
            onFieldChange("type", value);
          } else {
            onFieldChange(field, value);
          }
        }}
        errors={formErrors}
        touched={touchedFields}
        disabled={isReadOnly}
      />

      <div className="space-y-4 border border-gray-700 rounded-md p-4">
        <h3 className="text-lg font-medium">Location Information</h3>
        <LocationSection
          selectedCountry={formData.country || ""}
          selectedCity={formData.city || ""}
          onCountryChange={(country) => onFieldChange("country", country)}
          onCityChange={(city) => onFieldChange("city", city)}
          disabled={isReadOnly}
        />
      </div>

      <InvestmentDetailsFields
        isInvestment={formData.isInvestment || false}
        amount={formData.amount || ""}
        investmentType={formData.investmentType || "equity"}
        interestRate={formData.interestRate || ""}
        valuation={formData.valuation || ""}
        numShares={formData.numShares || ""}
        sharePrice={formData.sharePrice || ""}
        onToggleInvestment={onToggleInvestment}
        onChange={onFieldChange}
        errors={formErrors}
        touched={touchedFields}
        disabled={isReadOnly}
      />

      {onPastFundraisingChange && (
        <PastFundraisingFields
          previousRaised={formData.previousRaised}
          paidPercentage={formData.paidPercentage}
          investorTypes={formData.investorTypes}
          onPreviousRaisedChange={onPastFundraisingChange.onPreviousRaisedChange}
          onPaidPercentageChange={onPastFundraisingChange.onPaidPercentageChange}
          onInvestorTypesChange={onPastFundraisingChange.onInvestorTypesChange}
          disabled={isReadOnly}
        />
      )}
    </div>
  );
}
