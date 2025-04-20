"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart } from "lucide-react";
import { FormField, RecurringRevenueToggle } from "../traction/form-field";
import { AchievementInput } from "../traction/achievement-input";
import { RevenueInput, ClientsInput, MetricInput, PercentMetricInput } from "../traction/revenue-input";

export function TractionInfo() {
  const [achievements, setAchievements] = useState<string[]>(["", "", ""]);
  const [revenue, setRevenue] = useState<{ [key: string]: string }>({
    thisMonth: "70,000",
    lastMonth: "56,000",
    priorMonth: "50,000",
  });
  const [clients, setClients] = useState<{ [key: string]: string }>({
    thisMonth: "",
    lastMonth: "",
    priorMonth: "",
  });
  const [cac, setCac] = useState("75");
  const [leadToSalesRatio, setLeadToSalesRatio] = useState("40");
  const [aov, setAov] = useState("155");
  const [clv, setClv] = useState("250");
  const [grossProfit, setGrossProfit] = useState("65");
  const [ebitdaMargin, setEbitdaMargin] = useState("45");
  const [hasRecurringRevenue, setHasRecurringRevenue] = useState(true);

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Traction Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
            Traction
          </h1>
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
      </div>

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
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          BACK
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          CALCULATE & SAVE
        </Button>
      </div>
    </div>
  );
} 