
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvestmentDetailsFieldsProps {
  isInvestment: boolean;
  amount: string;
  investmentType: string;
  interestRate: string;
  valuation: string;
  numShares: string;
  sharePrice: string;
  onToggleInvestment: (checked: boolean) => void;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string | null>;
  touched?: Record<string, boolean>;
  disabled?: boolean;
}

export function InvestmentDetailsFields({
  isInvestment,
  amount,
  investmentType,
  interestRate,
  valuation,
  numShares,
  sharePrice,
  onToggleInvestment,
  onChange,
  errors = {},
  touched = {},
  disabled = false
}: InvestmentDetailsFieldsProps) {
  const getErrorMessage = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  return (
    <div className="space-y-4 pt-3 border-t border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Investment Details</h3>
          <p className="text-sm text-gray-400">Is this an investment or a reservation?</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={!isInvestment ? "text-white" : "text-gray-400"}>Reservation</span>
          <Switch
            checked={isInvestment}
            onCheckedChange={onToggleInvestment}
            disabled={disabled}
          />
          <span className={isInvestment ? "text-white" : "text-gray-400"}>Investment</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="amount"
          className={getErrorMessage("amount") ? "text-red-500" : ""}
        >
          {isInvestment ? 'Investment' : 'Reservation'} Amount
        </Label>
        <Input
          id="amount"
          placeholder={`Enter ${isInvestment ? 'investment' : 'reservation'} amount`}
          className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("amount") ? "border-red-500" : ""}`}
          value={amount}
          onChange={(e) => onChange("amount", e.target.value)}
          type="number"
          disabled={disabled}
        />
        {getErrorMessage("amount") && (
          <p className="text-sm text-red-500">{getErrorMessage("amount")}</p>
        )}
      </div>
      
      {isInvestment && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investmentType">Investment Type</Label>
            <Select
              value={investmentType}
              onValueChange={(value) => onChange("investmentType", value)}
              disabled={disabled}
            >
              <SelectTrigger id="investmentType" className="bg-gray-800/50 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {investmentType === 'debt' ? (
            <div className="space-y-2">
              <Label 
                htmlFor="interestRate"
                className={getErrorMessage("interestRate") ? "text-red-500" : ""}
              >
                Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                placeholder="Enter interest rate"
                className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("interestRate") ? "border-red-500" : ""}`}
                value={interestRate}
                onChange={(e) => onChange("interestRate", e.target.value)}
                type="number"
                disabled={disabled}
              />
              {getErrorMessage("interestRate") && (
                <p className="text-sm text-red-500">{getErrorMessage("interestRate")}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="valuation"
                  className={getErrorMessage("valuation") ? "text-red-500" : ""}
                >
                  Valuation
                </Label>
                <Input
                  id="valuation"
                  placeholder="Enter valuation amount"
                  className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("valuation") ? "border-red-500" : ""}`}
                  value={valuation}
                  onChange={(e) => onChange("valuation", e.target.value)}
                  type="number"
                  disabled={disabled}
                />
                {getErrorMessage("valuation") && (
                  <p className="text-sm text-red-500">{getErrorMessage("valuation")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="numShares"
                  className={getErrorMessage("numShares") ? "text-red-500" : ""}
                >
                  Number of Shares
                </Label>
                <Input
                  id="numShares"
                  placeholder="Enter number of shares"
                  className={`bg-gray-800/50 border-gray-700 ${getErrorMessage("numShares") ? "border-red-500" : ""}`}
                  value={numShares}
                  onChange={(e) => onChange("numShares", e.target.value)}
                  type="number"
                  disabled={disabled}
                />
                {getErrorMessage("numShares") && (
                  <p className="text-sm text-red-500">{getErrorMessage("numShares")}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between bg-gray-800/30 p-4 rounded-lg">
                <span>Share Price:</span>
                <span className="text-profile-purple font-medium">${sharePrice}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
