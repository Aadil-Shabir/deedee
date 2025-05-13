import { InvestorFormData } from "@/types/investor-form";
import { CompanyInfoFields } from "./company-info";
import { LocationSection } from "./LocationSection";
import { InvestmentDetailsFields } from "./investment-details";

interface InvestorFormFieldsProps {
  formData: InvestorFormData;
  formErrors: Record<string, string | null>;
  touchedFields: Record<string, boolean>;
  onFieldChange: (field: string, value: string) => void;
  onToggleInvestment: (checked: boolean) => void;
  isReadOnly?: boolean;
}

export function InvestorFormFields({
  formData,
  formErrors,
  touchedFields,
  onFieldChange,
  onToggleInvestment,
  isReadOnly = false
}: InvestorFormFieldsProps) {
  return (
    <div className="space-y-4">
      <CompanyInfoFields 
        companyName={formData.companyName}
        firstName={formData.firstName}
        lastName={formData.lastName}
        email={formData.email}
        investorType={formData.investorType}
        stage={formData.stage}
        onChange={onFieldChange}
        errors={formErrors}
        touched={touchedFields}
        disabled={isReadOnly}
      />
      
      <div className="space-y-4 border border-gray-700 rounded-md p-4">
        <h3 className="text-lg font-medium">Location Information</h3>
        <LocationSection
          selectedCountry={formData.country}
          selectedCity={formData.city}
          onCountryChange={(country) => onFieldChange("country", country)}
          onCityChange={(city) => onFieldChange("city", city)}
          disabled={isReadOnly}
        />
      </div>
      
      <InvestmentDetailsFields 
        isInvestment={formData.isInvestment}
        amount={formData.amount}
        investmentType={formData.investmentType}
        interestRate={formData.interestRate}
        valuation={formData.valuation}
        numShares={formData.numShares}
        sharePrice={formData.sharePrice}
        onToggleInvestment={onToggleInvestment}
        onChange={onFieldChange}
        errors={formErrors}
        touched={touchedFields}
        disabled={isReadOnly}
      />
    </div>
  );
}