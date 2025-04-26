"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormField, CurrencyInput, PercentageInput } from "./form-field";
import { RadioOptions } from "./radio-options";
import { Progress } from "@/components/ui/progress";
import { PieChart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { getCurrentRoundData, saveCurrentRoundData } from "@/actions/actions.fundraising";
import { useToast } from "@/components/ui/toast-provider";

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

interface CurrentRoundProps {
  onNext?: () => void;
}

export function CurrentRound({ onNext }: CurrentRoundProps = {}) {
  // Form state
  const [capitalReason, setCapitalReason] = useState("growth");
  const [raisingAmount, setRaisingAmount] = useState("");
  const [latestValuation, setLatestValuation] = useState("");
  const [currentValuation, setCurrentValuation] = useState("");
  const [fundingType, setFundingType] = useState("equity");
  const [equityPercentage, setEquityPercentage] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [maxInvestment, setMaxInvestment] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Fields for debt and mixed funding
  const [interestRate, setInterestRate] = useState("");
  const [equityAmount, setEquityAmount] = useState("");
  const [debtAmount, setDebtAmount] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks for context and toast
  const { activeCompanyId } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();

  // Track completion status for each field
  const getFields = () => {
    const baseFields = [
      { id: "capitalReason", isCompleted: !!capitalReason },
      { id: "raisingAmount", isCompleted: !!raisingAmount },
      { id: "latestValuation", isCompleted: !!latestValuation },
      { id: "currentValuation", isCompleted: !!currentValuation },
      { id: "fundingType", isCompleted: !!fundingType },
      { id: "minInvestment", isCompleted: !!minInvestment },
      { id: "maxInvestment", isCompleted: !!maxInvestment },
      { id: "closingTime", isCompleted: !!closingTime },
    ];

    // Add funding type specific fields
    if (fundingType === "equity") {
      return [...baseFields, 
        { id: "equityPercentage", isCompleted: !!equityPercentage }
      ];
    } else if (fundingType === "debt") {
      return [...baseFields, 
        { id: "interestRate", isCompleted: !!interestRate }
      ];
    } else if (fundingType === "mixed") {
      return [...baseFields, 
        { id: "equityAmount", isCompleted: !!equityAmount },
        { id: "debtAmount", isCompleted: !!debtAmount },
        { id: "interestRate", isCompleted: !!interestRate }
      ];
    }

    return baseFields;
  };

  // Calculate completion percentage
  useEffect(() => {
    const fields = getFields();
    const completedFields = fields.filter(field => field.isCompleted).length;
    const totalFields = fields.length;
    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [
    capitalReason, raisingAmount, latestValuation, currentValuation,
    fundingType, equityPercentage, minInvestment, maxInvestment, closingTime,
    interestRate, equityAmount, debtAmount
  ]);

  // Load data when component mounts or company changes
  useEffect(() => {
    const loadCurrentRoundData = async () => {
      if (!user?.id || !activeCompanyId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getCurrentRoundData(user.id, activeCompanyId);

        if (response.success && response.data) {
          // Set state with loaded data
          setCapitalReason(response.data.capitalReason);
          setRaisingAmount(response.data.raisingAmount);
          setLatestValuation(response.data.latestValuation);
          setCurrentValuation(response.data.currentValuation);
          setFundingType(response.data.fundingType);
          setEquityPercentage(response.data.equityPercentage);
          setMinInvestment(response.data.minInvestment);
          setMaxInvestment(response.data.maxInvestment);
          setClosingTime(response.data.closingTime);

          // Set conditional fields
          setInterestRate(response.data.interestRate || "");
          setEquityAmount(response.data.equityAmount || "");
          setDebtAmount(response.data.debtAmount || "");
        }
      } catch (err) {
        console.error("Error loading fundraising data:", err);
        toast({
          title: "Error",
          description: "Failed to load fundraising data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentRoundData();
  }, [user, activeCompanyId, toast]);

  // Handle funding type change
  const handleFundingTypeChange = (type: string) => {
    setFundingType(type);

    // Reset type-specific fields when changing types
    if (type !== "debt" && type !== "mixed") {
      setInterestRate("");
    }

    if (type !== "mixed") {
      setEquityAmount("");
      setDebtAmount("");
    }
  };

  // Save data and navigate to next step
  const handleNext = async () => {
    // If no user or company is selected, show error
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save fundraising information",
        variant: "destructive",
      });
      return;
    }

    if (!activeCompanyId) {
      toast({
        title: "No Company Selected",
        description: "Please select a company to save fundraising information",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare data for saving
      const data = {
        capitalReason,
        raisingAmount,
        latestValuation,
        currentValuation,
        fundingType,
        equityPercentage,
        minInvestment,
        maxInvestment,
        closingTime,
        interestRate,
        equityAmount,
        debtAmount
      };

      // Call server action to save data
      const response = await saveCurrentRoundData(user.id, activeCompanyId, data);

      if (response.success) {
        toast({
          title: "Success",
          description: "Fundraising information saved successfully",
          variant: "default",
        });

        // Move to next step
        if (onNext) {
          onNext();
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save fundraising information",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving fundraising data:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-zinc-400">Loading fundraising data...</div>
        </div>
      ) : !activeCompanyId ? (
        <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
          <p className="text-amber-200 text-center">
            No company selected. Please select a company to manage fundraising information.
          </p>
        </div>
      ) : (
        <>
          {/* Completion Progress */}
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-zinc-200">Section Completion</span>
              </div>
              <span className="text-sm font-medium text-primary">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-zinc-700" />
          </div>

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
                onChange={handleFundingTypeChange}
                name="funding-type"
              />
            </FormField>

            {/* Conditional fields with animation */}
            <AnimatePresence>
              {fundingType === "debt" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-zinc-800/30 rounded-lg border border-zinc-700 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronDown className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium text-zinc-200">Debt Funding Details</h3>
                  </div>

                  <FormField
                    id="interest-rate"
                    label="What is the interest rate for your debt?"
                    isCompleted={!!interestRate}
                  >
                    <PercentageInput
                      id="interest-rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      placeholder="5.5"
                    />
                  </FormField>
                </motion.div>
              )}

              {fundingType === "mixed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-zinc-800/30 rounded-lg border border-zinc-700 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronDown className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium text-zinc-200">Mixed Funding Details</h3>
                  </div>

                  <FormField
                    id="equity-amount"
                    label="How much equity funding are you raising?"
                    isCompleted={!!equityAmount}
                  >
                    <CurrencyInput
                      id="equity-amount"
                      value={equityAmount}
                      onChange={setEquityAmount}
                      placeholder="500,000"
                    />
                  </FormField>

                  <FormField
                    id="debt-amount"
                    label="How much debt funding are you raising?"
                    isCompleted={!!debtAmount}
                  >
                    <CurrencyInput
                      id="debt-amount"
                      value={debtAmount}
                      onChange={setDebtAmount}
                      placeholder="500,000"
                    />
                  </FormField>

                  <FormField
                    id="interest-rate"
                    label="What is the interest rate for the debt portion?"
                    isCompleted={!!interestRate}
                  >
                    <PercentageInput
                      id="interest-rate"
                      value={interestRate}
                      onChange={setInterestRate}
                      placeholder="5.5"
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>

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

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              BACK
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={handleNext}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "NEXT"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}