"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart, Building } from "lucide-react";
// import { FormField, RecurringRevenueToggle } from "../traction/form-field";
// import { AchievementInput } from "../traction/achievement-input";
// import { RevenueInput, ClientsInput, MetricInput, PercentMetricInput } from "../traction/revenue-input";
import { useCompanyContext } from "@/context/company-context";
import { useUser } from "@/hooks/use-user";
import { getTractionData, saveTractionDataAndComputeMetrics, TractionData } from "@/actions/actions.traction";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "../company/fundraising/form-field";
import { AchievementInput } from "../company/traction/achievement-input";
import { ClientsInput, MetricInput, PercentMetricInput, RevenueInput } from "../company/traction/revenue-input";
import { RecurringRevenueToggle } from "../company/traction/form-field";

export function TractionInfo({onComplete}: {onComplete: ()=> void}) {
  // Form state
  const [achievements, setAchievements] = useState<string[]>(["", "", ""]);
  const [revenue, setRevenue] = useState<{ [key: string]: string }>({
    thisMonth: "",
    lastMonth: "",
    priorMonth: "",
  });
  const [clients, setClients] = useState<{ [key: string]: string }>({
    thisMonth: "",
    lastMonth: "",
    priorMonth: "",
  });
  const [cac, setCac] = useState("");
  const [leadToSalesRatio, setLeadToSalesRatio] = useState("");
  const [aov, setAov] = useState("");
  const [clv, setClv] = useState("");
  const [grossProfit, setGrossProfit] = useState("");
  const [ebitdaMargin, setEbitdaMargin] = useState("");
  const [hasRecurringRevenue, setHasRecurringRevenue] = useState(true);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Hooks for context and toast
  const router = useRouter();
  const { activeCompanyId, allUserCompanies } = useCompanyContext();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Find active company name
  const activeCompany = allUserCompanies?.find(c => c.id === activeCompanyId);
  
  // Load data when component mounts or company changes
  useEffect(() => {
    const loadTractionData = async () => {
      if (!user?.id || !activeCompanyId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const response = await getTractionData(user.id, activeCompanyId);
        
        if (response.success && response.data) {
          // Set state with loaded data
          setAchievements(response.data.achievements);
          setRevenue(response.data.revenue);
          setClients(response.data.clients);
          setCac(response.data.metrics.cac);
          setLeadToSalesRatio(response.data.metrics.leadToSalesRatio);
          setAov(response.data.metrics.aov);
          setClv(response.data.metrics.clv);
          setGrossProfit(response.data.metrics.grossProfit);
          setEbitdaMargin(response.data.metrics.ebitdaMargin);
          setHasRecurringRevenue(response.data.hasRecurringRevenue);
        }
      } catch (err) {
        console.error("Error loading traction data:", err);
        toast({
          title: "Error",
          description: "Failed to load traction data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTractionData();
  }, [user, activeCompanyId, toast]);

  const handleRevenueChange = (key: string, value: string) => {
    setRevenue({
      ...revenue,
      [key]: value,
    });
  };

  const handleClientsChange = (key: string, value: string) => {
    setClients({
      ...clients,
      [key]: value,
    });
  };
  
  // Save traction data and calculate metrics
  const handleCalculateAndSave = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save traction information",
        variant: "destructive",
      });
      return;
    }

    if (!activeCompanyId) {
      toast({
        title: "No Company Selected",
        description: "Please select a company to save traction information",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare data for saving
      const data: TractionData = {
        achievements,
        revenue: {
          thisMonth: revenue.thisMonth || '',
          lastMonth: revenue.lastMonth || '',
          priorMonth: revenue.priorMonth || '',
        },
        clients: {
          thisMonth: clients.thisMonth || '',
          lastMonth: clients.lastMonth || '',
          priorMonth: clients.priorMonth || '',
        },
        metrics: {
          cac,
          leadToSalesRatio,
          aov,
          clv,
          grossProfit,
          ebitdaMargin,
        },
        hasRecurringRevenue,
      };

      // Save traction data and compute metrics
      const response = await saveTractionDataAndComputeMetrics(user.id, activeCompanyId, data, true);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Traction data saved and metrics calculated successfully",
          variant: "default",
        });
        
        // Navigate to the score card page
        if (response.redirectUrl) {
          router.push(response.redirectUrl);
        } else {
          router.push("/company/score-card");
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save traction information",
          variant: "destructive",
        });
      }
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error("Error saving traction data:", err);
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Traction Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
              Traction
            </h1>
          </div>
          
          {activeCompanyId && activeCompany && (
            <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-md">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-zinc-300">Company:</span>
              <span className="font-medium text-white">{ activeCompany.company_name || ""}</span>
            </div>
          )}
        </div>
        
        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-start gap-3">
            <BarChart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-zinc-200">
                Share your company achievements and key metrics to demonstrate growth potential to potential investors.
              </p>
              <div className="flex items-center text-primary/80 text-sm mt-2 hover:text-primary transition-colors cursor-pointer">
                <span>Learn how to showcase your traction effectively</span>
              </div>
            </div>
          </div>
        </div>
        
        {!activeCompanyId && (
          <div className="bg-amber-900/20 border border-amber-700/50 p-6 rounded-lg text-center mb-8">
            <Building className="h-10 w-10 text-amber-500/80 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-200 mb-2">No Company Selected</h3>
            <p className="text-amber-300/80 mb-4 max-w-md mx-auto">
              Please select a company from your dashboard to manage traction information.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="text-zinc-400">Loading traction data...</div>
        </div>
      ) : activeCompanyId ? (
        <>
          {/* Main Form */}
          <div className="space-y-6">
            <FormField
              id="achievements"
              label="Please share 3 notable company achievements (click to edit)"
              isCompleted={achievements.some(a => a.length > 0)}
            >
              <AchievementInput 
                achievements={achievements} 
                onChange={setAchievements} 
              />
            </FormField>

            <FormField
              id="revenue"
              label="What are your revenue numbers of the last 3 months in United States Dollars?"
              isCompleted={Object.values(revenue).some(v => v.length > 0)}
            >
              <RevenueInput 
                values={revenue} 
                onChange={handleRevenueChange} 
              />
            </FormField>

            <FormField
              id="clients"
              label="What were your total active clients for the last 3 months?"
              isCompleted={Object.values(clients).some(v => v.length > 0)}
            >
              <ClientsInput 
                values={clients} 
                onChange={handleClientsChange} 
              />
            </FormField>

            <FormField
              id="cac"
              label="What is your customer acquisition cost? (CAC)"
              isCompleted={cac.length > 0}
            >
              <MetricInput 
                id="cac" 
                value={cac} 
                onChange={setCac} 
                isCompleted={cac.length > 0} 
              />
            </FormField>

            <FormField
              id="leadToSalesRatio"
              label="What is your lead to sales ratio? (%)"
              isCompleted={leadToSalesRatio.length > 0}
            >
              <PercentMetricInput 
                id="leadToSalesRatio" 
                value={leadToSalesRatio} 
                onChange={setLeadToSalesRatio} 
                isCompleted={leadToSalesRatio.length > 0} 
              />
            </FormField>

            <FormField
              id="aov"
              label="What is the average order value in $? (AOV)"
              isCompleted={aov.length > 0}
            >
              <MetricInput 
                id="aov" 
                value={aov} 
                onChange={setAov} 
                isCompleted={aov.length > 0} 
              />
            </FormField>

            <FormField
              id="clv"
              label="What is the lifetime value of your customer? (CLV)"
              isCompleted={clv.length > 0}
            >
              <MetricInput 
                id="clv" 
                value={clv} 
                onChange={setClv} 
                isCompleted={clv.length > 0} 
              />
            </FormField>

            <FormField
              id="grossProfit"
              label="What is your gross profit? (% GP)"
              isCompleted={grossProfit.length > 0}
            >
              <PercentMetricInput 
                id="grossProfit" 
                value={grossProfit} 
                onChange={setGrossProfit} 
                isCompleted={grossProfit.length > 0} 
              />
            </FormField>

            <FormField
              id="ebitdaMargin"
              label="What is your EBITDA margin? (%)"
              isCompleted={ebitdaMargin.length > 0}
            >
              <PercentMetricInput 
                id="ebitdaMargin" 
                value={ebitdaMargin} 
                onChange={setEbitdaMargin} 
                isCompleted={ebitdaMargin.length > 0} 
              />
            </FormField>

            <FormField
              id="recurringRevenue"
              label="Does Your Business have recurring revenue streams?"
              isCompleted={true}
            >
              <RecurringRevenueToggle 
                hasRecurring={hasRecurringRevenue} 
                onToggle={setHasRecurringRevenue} 
              />
            </FormField>
          </div>

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button 
              variant="outline" 
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => router.back()}
            >
              BACK
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              onClick={handleCalculateAndSave}
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "CALCULATE & VIEW SCORE CARD"}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}