"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortfolioData {
  allocation: {
    companies: {
      name: string;
      value: number;
      color: string;
    }[];
  };
  growth: {
    months: string[];
    values: number[];
  };
}

interface PortfolioOverviewProps {
  data: PortfolioData;
}

export function PortfolioOverview({ data }: PortfolioOverviewProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <Card className="bg-[#0f1729] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-violet-400">
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-fit mb-8">
            <TabsTrigger 
              value="summary" 
              className={`px-4 py-2 ${activeTab === "summary" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="diversification" 
              className={`px-4 py-2 ${activeTab === "diversification" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              Diversification
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className={`px-4 py-2 ${activeTab === "performance" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="irr" 
              className={`px-4 py-2 ${activeTab === "irr" ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
            >
              IRR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-4">Portfolio Allocation</h3>
                <div className="relative w-full h-64">
                  <div className="rounded-full overflow-hidden w-full h-full">
                    {/* Simple pie chart representation */}
                    <div className="relative w-full h-full">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {data.allocation.companies.map((company, index) => {
                          // For simplicity, we'll create a basic pie chart
                          const startAngle = index * (360 / data.allocation.companies.length);
                          const endAngle = (index + 1) * (360 / data.allocation.companies.length);
                          
                          return (
                            <path
                              key={company.name}
                              d={`M 50 50 L ${50 + 40 * Math.cos(startAngle * Math.PI / 180)} ${50 + 40 * Math.sin(startAngle * Math.PI / 180)} A 40 40 0 0 1 ${50 + 40 * Math.cos(endAngle * Math.PI / 180)} ${50 + 40 * Math.sin(endAngle * Math.PI / 180)} Z`}
                              fill={company.color}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  {data.allocation.companies.map((company) => (
                    <div key={company.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }}></div>
                      <span className="text-zinc-200">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-4">Portfolio Growth</h3>
                <div className="h-64 relative">
                  {/* Simple bar chart representation */}
                  <div className="flex h-full items-end justify-between">
                    {data.growth.values.map((value, index) => {
                      const height = (value / Math.max(...data.growth.values)) * 100;
                      return (
                        <div key={index} className="flex flex-col items-center w-full">
                          <div 
                            className="w-4/5 bg-violet-500 rounded-t" 
                            style={{ height: `${height}%` }}
                          ></div>
                          <span className="text-xs text-zinc-400 mt-1">{data.growth.months[index]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between">
                    <span className="text-xs text-zinc-400">$10.0M</span>
                    <span className="text-xs text-zinc-400">$7.5M</span>
                    <span className="text-xs text-zinc-400">$5.0M</span>
                    <span className="text-xs text-zinc-400">$2.5M</span>
                    <span className="text-xs text-zinc-400">$0.0M</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diversification">
            <div className="flex items-center justify-center h-64 text-zinc-400">
              Diversification analysis will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="flex items-center justify-center h-64 text-zinc-400">
              Performance metrics will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="irr">
            <div className="flex items-center justify-center h-64 text-zinc-400">
              IRR calculations will be displayed here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 