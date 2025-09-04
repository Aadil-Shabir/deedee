"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InvestorList } from "./investor-list";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { 
  getInvestors, 
  deleteInvestor 
} from "@/actions/actions.fundraising";
import { submitInvestorByCompanyName } from "@/actions/actions.investor-form";
import { useToast } from "@/components/ui/toast-provider";
import { FormField } from "./form-field";

interface PastFundraisingProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export function PastFundraising({ onBack, onComplete }: PastFundraisingProps = {}) {
  // Form state
  const [investors, setInvestors] = useState<any[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Hooks for context and toast
  const { activeCompanyId } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();

  // Calculate completion percentage
  useEffect(() => {
    const fields = [
      // Consider investors as the main field for this section now
      { id: "hasInvestors", isCompleted: investors.length > 0 }
    ];
    
    const completedFields = fields.filter(field => field.isCompleted).length;
    const totalFields = fields.length;
    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [investors.length]);
  
  // Load data when component mounts or company changes
  useEffect(() => {
    const loadInvestorsData = async () => {
      if (!user?.id || !activeCompanyId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Load investors
        const investorsResponse = await getInvestors(user.id, activeCompanyId);
        
        if (investorsResponse.success && investorsResponse.data) {
          setInvestors(investorsResponse.data);
        }
      } catch (err) {
        console.error("Error loading investors data:", err);
        toast({
          title: "Error",
          description: "Failed to load investors data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvestorsData();
  }, [ activeCompanyId,user, isSaving, toast]);

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
      const response = await submitInvestorByCompanyName(investorData, user.id);
      
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
          description: response.error || "Failed to add investor",
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
  
  // Handle save - simplified since past fundraising data is now captured in individual investor forms
  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    if (!activeCompanyId) {
      toast({
        title: "No Company Selected",
        description: "Please select a company to continue",
        variant: "destructive",
      });
      return;
    }

    // Since we're now capturing past fundraising data in individual investor forms,
    // this section is considered complete if there are investors
    toast({
      title: "Success",
      description: "Past fundraising section completed",
      variant: "default",
    });
    
    if (onComplete) {
      onComplete();
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