"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormField, CurrencyInput } from "./form-field";
import { PaymentProgress } from "./payment-progress";
import { InvestorTypes } from "./investor-types";
import { InvestorList } from "./investor-list";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { 
  getPastFundraisingData, 
  savePastFundraisingData, 
  getInvestors, 
  addInvestor, 
  deleteInvestor 
} from "@/actions/actions.fundraising";
import { useToast } from "@/components/ui/toast-provider";

interface PastFundraisingProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export function PastFundraising({ onBack, onComplete }: PastFundraisingProps = {}) {
  // Form state
  const [previousRaised, setPreviousRaised] = useState("");
  const [paidPercentage, setPaidPercentage] = useState(0);
  const [selectedInvestorTypes, setSelectedInvestorTypes] = useState<string[]>(["angel"]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Hooks for context and toast
  const { activeCompanyId } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();

  // Track completion status for each field
  const fields = [
    { id: "previousRaised", isCompleted: !!previousRaised },
    { id: "investorTypes", isCompleted: selectedInvestorTypes.length > 0 },
    // Consider investors as a bonus field
    { id: "hasInvestors", isCompleted: investors.length > 0 }
  ];
  
  // Calculate completion percentage
  useEffect(() => {
    const completedFields = fields.filter(field => field.isCompleted).length;
    const totalFields = fields.length;
    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [fields, previousRaised, selectedInvestorTypes, investors.length]);
  
  // Load data when component mounts or company changes
  useEffect(() => {
    const loadPastFundraisingData = async () => {
      if (!user?.id || !activeCompanyId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Load past fundraising data
        const pastResponse = await getPastFundraisingData(user.id, activeCompanyId);
        
        if (pastResponse.success && pastResponse.data) {
          setPreviousRaised(pastResponse.data.previousRaised);
          setPaidPercentage(pastResponse.data.paidPercentage);
          setSelectedInvestorTypes(pastResponse.data.investorTypes);
        }
        
        // Load investors
        const investorsResponse = await getInvestors(user.id, activeCompanyId);
        
        if (investorsResponse.success && investorsResponse.data) {
          setInvestors(investorsResponse.data);
        }
      } catch (err) {
        console.error("Error loading past fundraising data:", err);
        toast({
          title: "Error",
          description: "Failed to load past fundraising data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPastFundraisingData();
  }, [ activeCompanyId,user, isSaving]);

  const toggleInvestorType = (type: string) => {
    if (selectedInvestorTypes.includes(type)) {
      setSelectedInvestorTypes(selectedInvestorTypes.filter((t) => t !== type));
    } else {
      setSelectedInvestorTypes([...selectedInvestorTypes, type]);
    }
  };

  // Add investor handler
  const handleAddInvestor = async (investorData: any) => {
    if (!user?.id || !activeCompanyId) {
      toast({
        title: "Error",
        description: "Authentication required to add investors",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await addInvestor(user.id, activeCompanyId, {
        firstName: investorData.firstName,
        lastName: investorData.lastName,
        company: investorData.company,
        email: investorData.email,
        type: investorData.type,
        stage: investorData.stage,
        country: investorData.country,
        city: investorData.city,
        amount: investorData.amount,
        isInvestment: Boolean(investorData.isInvestment)
      });
      
      if (response.success && response.data) {
        // Add the new investor to the state with the returned ID
        const newInvestor = {
          ...investorData,
          id: response.data.id,
        };
        
        setInvestors([newInvestor, ...investors]);
        
        toast({
          title: "Success",
          description: "Investor added successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add investor",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error adding investor:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Delete investor handler
  const handleDeleteInvestor = async (investorId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Authentication required to delete investors",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await deleteInvestor(user.id, investorId);
      
      if (response.success) {
        // Remove the deleted investor from the state
        setInvestors(investors.filter(inv => inv.id !== investorId));
        
        toast({
          title: "Success",
          description: "Investor removed successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete investor",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting investor:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Save past fundraising data
  const handleSave = async () => {
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
      const data = {
        previousRaised,
        paidPercentage,
        investorTypes: selectedInvestorTypes,
      };

      const response = await savePastFundraisingData(user.id, activeCompanyId, data);

      if (response.success) {
        toast({
          title: "Success",
          description: "Past fundraising information saved successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save information",
          variant: "destructive",
        });
      }
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error("Error saving past fundraising data:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="text-zinc-400">Loading past fundraising data...</div>
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

            <FormField 
              id="paid-percentage" 
              label="How much has been paid off?"
              isCompleted={true} // Always complete as it has a default value
            >
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
              <FormField
                id="investors"
                label="Previous Investors"
                isCompleted={investors.length > 0}
              >
                <InvestorList 
                  investors={investors} 
                  onAddInvestor={handleAddInvestor}
                  onDeleteInvestor={handleDeleteInvestor}
                />
              </FormField>
            </div>
          </section>

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={handleBack}
            >
              BACK
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Next"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}