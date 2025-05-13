import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompanyInfoFieldsProps {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  investorType: string;
  stage: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string | null>;
  touched?: Record<string, boolean>;
  disabled?: boolean;
}

export function CompanyInfoFields({
  companyName,
  firstName,
  lastName,
  email,
  investorType,
  stage,
  onChange,
  errors = {},
  touched = {},
  disabled = false
}: CompanyInfoFieldsProps) {
  const getErrorMessage = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Investor Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="companyName" className={getErrorMessage("companyName") ? "text-red-500" : ""}>
          Company/Fund Name
        </Label>
        <Input
          id="companyName"
          placeholder="Enter company name"
          className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("companyName") ? "border-red-500" : ""}`}
          value={companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          disabled={disabled}
        />
        {getErrorMessage("companyName") && (
          <p className="text-sm text-red-500">{getErrorMessage("companyName")}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className={getErrorMessage("firstName") ? "text-red-500" : ""}>
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("firstName") ? "border-red-500" : ""}`}
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            disabled={disabled}
          />
          {getErrorMessage("firstName") && (
            <p className="text-sm text-red-500">{getErrorMessage("firstName")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className={getErrorMessage("lastName") ? "text-red-500" : ""}>
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("lastName") ? "border-red-500" : ""}`}
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            disabled={disabled}
          />
          {getErrorMessage("lastName") && (
            <p className="text-sm text-red-500">{getErrorMessage("lastName")}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className={getErrorMessage("email") ? "text-red-500" : ""}>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("email") ? "border-red-500" : ""}`}
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={disabled}
        />
        {getErrorMessage("email") && (
          <p className="text-sm text-red-500">{getErrorMessage("email")}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="investorType">Investor Type</Label>
          <Select
            value={investorType}
            onValueChange={(value) => onChange("investorType", value)}
            disabled={disabled}
          >
            <SelectTrigger id="investorType" className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select investor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vc">Venture Capital</SelectItem>
              <SelectItem value="angel">Angel Investor</SelectItem>
              <SelectItem value="family_office">Family Office</SelectItem>
              <SelectItem value="strategic">Strategic Investor</SelectItem>
              <SelectItem value="accelerator">Accelerator/Incubator</SelectItem>
              <SelectItem value="pe">Private Equity</SelectItem>
              <SelectItem value="corporate">Corporate Investor</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select
            value={stage}
            onValueChange={(value) => onChange("stage", value)}
            disabled={disabled}
          >
            <SelectTrigger id="stage" className="bg-gray-800/50 border-gray-700">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="discovery">Discovery</SelectItem>
              <SelectItem value="pitch">Pitch</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="investor">Investor</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}