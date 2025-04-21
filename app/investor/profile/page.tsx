"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestorProfileInfo from "@/app/components/ui/profile-forms/investor-profile-info";
import BusinessInfo from "@/app/components/ui/profile-forms/business-info";
import { PortfolioOverview } from "@/components/ui/investor/portfolio-overview";
import { MarketIntelligence } from "@/components/ui/investor/market-intelligence";
import { FounderEngagement } from "@/components/ui/investor/founder-engagement";
import { ActivityDashboard, Activity } from "@/components/ui/investor/activity-dashboard";
import { DealPipeline } from "@/components/ui/investor/deal-pipeline";
import { StatsCard } from "@/components/ui/investor/stats-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Users, Briefcase, LineChart, BarChart, PieChart, Activity as ActivityIcon } from "lucide-react";
import InvestmentMandate from "@/app/components/ui/profile-forms/investment-mandate";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const MetricsContent = () => {
  const monthlyMetrics = [
    { title: "Deal Flow", value: "24", trend: { value: "+12%", positive: true } },
    { title: "Investments", value: "$420K", trend: { value: "+8%", positive: true } },
    { title: "Portfolio Growth", value: "18.5%", trend: { value: "+3.2%", positive: true } },
    { title: "ROI", value: "24.7%", trend: { value: "-2.3%", positive: false } }
  ];

  const annualMetrics = [
    { title: "Total Invested", value: "$1.2M", trend: { value: "+32%", positive: true } },
    { title: "Active Companies", value: "18", trend: { value: "+5", positive: true } },
    { title: "Exits", value: "3", trend: { value: "+2", positive: true } },
    { title: "Fund Performance", value: "21.3%", trend: { value: "+5.7%", positive: true } }
  ];

  const performanceData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    values: [5.2, 7.4, 8.1, 7.9, 9.2, 10.5, 11.2, 10.8, 12.3, 13.1, 12.8, 14.2]
  };

  const sectorAllocation = [
    { name: "SaaS", value: 35, color: "#a78bfa" },
    { name: "Fintech", value: 25, color: "#818cf8" },
    { name: "Healthcare", value: 20, color: "#4f46e5" },
    { name: "Consumer", value: 12, color: "#6366f1" },
    { name: "Other", value: 8, color: "#8b5cf6" }
  ];

  // Investment criteria state
  const [requiresRecurringRevenue, setRequiresRecurringRevenue] = useState(false);
  const [revenueGrowthRate, setRevenueGrowthRate] = useState<string | null>(null);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [businessModels, setBusinessModels] = useState<string[]>([]);
  
  // Slider values
  const [grossProfitMargin, setGrossProfitMargin] = useState<number[]>([80]);
  const [ebitdaMargin, setEbitdaMargin] = useState<number[]>([75]);
  const [cacLtvRatio, setCacLtvRatio] = useState<number[]>([15]);
  const [revenueGrowth, setRevenueGrowth] = useState<number[]>([15]);

  // Helper function to toggle value in array
  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  return (
    <div className="space-y-10">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-8">Investment Criteria</h2>
        
        <div className="space-y-10">
          {/* Gross Profit Margin */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Gross Profit Margin (%)</h3>
            <div className="pt-4">
              <Slider
                value={grossProfitMargin}
                onValueChange={setGrossProfitMargin}
                max={100}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">0%</span>
                <span className="text-sm text-zinc-400">100%</span>
              </div>
            </div>
          </div>
          
          {/* EBITDA Margin */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">EBITDA Margin (%)</h3>
            <div className="pt-4">
              <Slider
                value={ebitdaMargin}
                onValueChange={setEbitdaMargin}
                max={100}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">0%</span>
                <span className="text-sm text-zinc-400">100%</span>
              </div>
            </div>
          </div>
          
          {/* CAC/LTV Ratio */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">CAC/LTV Ratio</h3>
            <div className="pt-4">
              <Slider
                value={cacLtvRatio}
                onValueChange={setCacLtvRatio}
                max={20}
                min={1}
                step={1}
                className="w-full h-2 bg-zinc-800"
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-zinc-400">1</span>
                <span className="text-sm text-zinc-400">20</span>
              </div>
            </div>
          </div>
          
          {/* Recurring Revenue Switch */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Requires Recurring Revenue</h3>
            <Switch
              checked={requiresRecurringRevenue}
              onCheckedChange={setRequiresRecurringRevenue}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          
          {/* Revenue Growth Rate */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Revenue Growth Rate</h3>
            <RadioGroup value={revenueGrowthRate || ""} onValueChange={setRevenueGrowthRate}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="less-than-5"
                    id="less-than-5"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="less-than-5" className="text-white cursor-pointer">
                    Less than 5%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="5-10"
                    id="5-10"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="5-10" className="text-white cursor-pointer">
                    5% - 10%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="10-20"
                    id="10-20"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="10-20" className="text-white cursor-pointer">
                    10% - 20%
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="more-than-20"
                    id="more-than-20"
                    className="text-violet-600 border-zinc-600"
                  />
                  <label htmlFor="more-than-20" className="text-white cursor-pointer">
                    More than 20%
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Business Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">What kind of businesses do you prefer to invest in?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="startup"
                  checked={businessTypes.includes("startup")}
                  onCheckedChange={() => setBusinessTypes(toggleArrayValue(businessTypes, "startup"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="startup" className="text-white cursor-pointer">
                  Startup
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="small-business"
                  checked={businessTypes.includes("small-business")}
                  onCheckedChange={() => setBusinessTypes(toggleArrayValue(businessTypes, "small-business"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="small-business" className="text-white cursor-pointer">
                  Small Business
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="corporation"
                  checked={businessTypes.includes("corporation")}
                  onCheckedChange={() => setBusinessTypes(toggleArrayValue(businessTypes, "corporation"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="corporation" className="text-white cursor-pointer">
                  Corporation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="non-profit"
                  checked={businessTypes.includes("non-profit")}
                  onCheckedChange={() => setBusinessTypes(toggleArrayValue(businessTypes, "non-profit"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="non-profit" className="text-white cursor-pointer">
                  Non-Profit
                </label>
              </div>
            </div>
          </div>
          
          {/* Business Models */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">What business model has your interest?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ecommerce"
                  checked={businessModels.includes("ecommerce")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "ecommerce"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="ecommerce" className="text-white cursor-pointer">
                  Ecommerce
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online-marketplaces"
                  checked={businessModels.includes("online-marketplaces")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "online-marketplaces"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="online-marketplaces" className="text-white cursor-pointer">
                  Online Marketplaces
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="service-based"
                  checked={businessModels.includes("service-based")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "service-based"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="service-based" className="text-white cursor-pointer">
                  Service Based Businesses
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="software"
                  checked={businessModels.includes("software")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "software"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="software" className="text-white cursor-pointer">
                  Software
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manufacturing"
                  checked={businessModels.includes("manufacturing")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "manufacturing"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="manufacturing" className="text-white cursor-pointer">
                  Manufacturing
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wholesale"
                  checked={businessModels.includes("wholesale")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "wholesale"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="wholesale" className="text-white cursor-pointer">
                  WholeSale
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="franchise"
                  checked={businessModels.includes("franchise")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "franchise"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="franchise" className="text-white cursor-pointer">
                  Franchise
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="real-estate"
                  checked={businessModels.includes("real-estate")}
                  onCheckedChange={() => setBusinessModels(toggleArrayValue(businessModels, "real-estate"))}
                  className="h-5 w-5 border-2 border-zinc-600 text-violet-600 rounded-sm"
                />
                <label htmlFor="real-estate" className="text-white cursor-pointer">
                  Real Estate
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <Button
            variant="outline"
            className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 px-8"
          >
            Back
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Keep the existing metrics content, just push it below the investment criteria */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Monthly Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthlyMetrics.map((metric, index) => (
            <StatsCard 
              key={`monthly-${index}`}
              title={metric.title} 
              value={metric.value} 
              trend={metric.trend} 
              icon={index === 0 ? "deals" : index === 1 ? "money" : index === 2 ? "activity" : "deals"}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Annual Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {annualMetrics.map((metric, index) => (
            <StatsCard 
              key={`annual-${index}`}
              title={metric.title} 
              value={metric.value} 
              trend={metric.trend} 
              icon={index === 0 ? "money" : index === 1 ? "deals" : index === 2 ? "activity" : "meetings"}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">Investment Performance</h2>
          <div className="h-80">
            {/* Chart would be implemented here with a real chart library */}
            <div className="h-full w-full flex items-center justify-center bg-zinc-800 rounded-md">
              <div className="text-zinc-400">
                <p className="text-center mb-2">Investment Growth Over Time</p>
                <div className="flex justify-between w-full px-4">
                  {performanceData.months.map((month, i) => (
                    <div key={month} className="flex flex-col items-center">
                      <div 
                        className="bg-violet-600" 
                        style={{ 
                          height: `${performanceData.values[i] * 5}px`, 
                          width: '8px',
                          borderRadius: '2px'
                        }} 
                      />
                      <span className="text-xs mt-1">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">Sector Allocation</h2>
          <div className="h-80 flex items-center justify-center">
            {/* This would use a real chart library in production */}
            <div className="relative h-60 w-60">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-lg font-medium text-white">100%</div>
              </div>
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {sectorAllocation.map((sector, i) => {
                  // Simple calculation for pie slices
                  const total = sectorAllocation.reduce((sum, item) => sum + item.value, 0);
                  const startAngle = sectorAllocation
                    .slice(0, i)
                    .reduce((sum, item) => sum + (item.value / total) * 360, 0);
                  const endAngle = startAngle + (sector.value / total) * 360;
                  
                  // Convert to radians and calculate coordinates
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  
                  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(' ');
                  
                  return <path key={sector.name} d={pathData} fill={sector.color} />;
                })}
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {sectorAllocation.map((sector) => (
              <div key={sector.name} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: sector.color }}></div>
                <span className="text-sm text-white">{sector.name} ({sector.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 md:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Investment Timeline</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start gap-4 p-3 rounded-md bg-zinc-800/50">
                <div className="h-10 w-10 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-white">TechCorp Series A</h3>
                    <span className="text-sm text-zinc-400">Q{item} 2023</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">Invested $250K at $10M valuation</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-zinc-700 h-1.5 rounded-full">
                      <div 
                        className="bg-violet-600 h-1.5 rounded-full" 
                        style={{ width: `${25 * item}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-zinc-400 whitespace-nowrap">{25 * item}% growth</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">Portfolio Health</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">ROI Target</span>
                <span className="text-white">80%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Risk Score</span>
                <span className="text-white">Low</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Diversification</span>
                <span className="text-white">Excellent</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full">
                <div className="bg-violet-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Cash Flow</span>
                <span className="text-white">Moderate</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function InvestorProfilePage() {
  const [activeTab, setActiveTab] = useState("business");

  // Sample data for components
  const portfolioData = {
    allocation: {
      companies: [
        { name: "Company A", value: 25, color: "#a78bfa" },
        { name: "Company B", value: 30, color: "#818cf8" },
        { name: "Company C", value: 20, color: "#4f46e5" },
        { name: "Others", value: 25, color: "#6366f1" }
      ]
    },
    growth: {
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      values: [7.5, 8.2, 8.8, 9.3, 10.0, 10.5]
    }
  };

  const companyList = [
    { id: "1", name: "TechCo", stage: "Series A", match: 90, industry: "SaaS", lastActivity: "2023-06-15" },
    { id: "2", name: "HealthInc", stage: "Seed", match: 85, industry: "Healthcare", lastActivity: "2023-06-10" },
    { id: "3", name: "EduTech", stage: "Series B", match: 75, industry: "Education", lastActivity: "2023-06-05" }
  ];

  const marketTrends = [
    { id: "1", name: "AI", growth: "+15%", growthValue: 15, relevance: "High" as const },
    { id: "2", name: "Fintech", growth: "+8%", growthValue: 8, relevance: "Medium" as const },
    { id: "3", name: "Cleantech", growth: "-3%", growthValue: -3, relevance: "Low" as const }
  ];

  const founderUpdates = [
    { 
      id: "1", 
      company: "TechCo", 
      date: "2023-06-15", 
      updateType: "Monthly Update", 
      content: "Closed partnership with major client" 
    },
    { 
      id: "2", 
      company: "HealthInc", 
      date: "2023-06-10", 
      updateType: "Partnership", 
      content: "Launched new product feature" 
    }
  ];

  const upcomingMeetings = [
    { 
      id: "1", 
      title: "Quarterly update", 
      company: "EduTech", 
      date: "2023-06-25", 
      time: "2:00 PM" 
    },
    { 
      id: "2", 
      title: "Pitch meeting", 
      company: "NewFinance", 
      date: "2023-06-28", 
      time: "10:00 AM" 
    }
  ];

  const activities: Activity[] = [
    { 
      id: "1", 
      type: "document", 
      company: "TechCo", 
      description: "Discussed growth strategy",
      timestamp: "2 hours ago" 
    },
    { 
      id: "2", 
      type: "view", 
      company: "NewStartup", 
      description: "Received pitch deck from new AI company",
      timestamp: "Yesterday" 
    }
  ];

  const actionItems = [
    { 
      id: "1", 
      task: "Review HealthInc financials", 
      dueDate: "2023-06-22", 
      status: "due today" 
    },
    { 
      id: "2", 
      task: "Schedule call with EduTech CEO", 
      dueDate: "2023-06-20", 
      status: "due tomorrow" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Investor Profile</h1>
      <p className="text-zinc-400 mb-8">Manage your investment profile and preferences</p>
      
      <Tabs defaultValue="business" onValueChange={setActiveTab} className="w-full max-w-full overflow-hidden">
        <TabsList className="flex flex-wrap mb-0 bg-[#111827] border-b border-zinc-800 rounded-t-lg overflow-hidden px-2">
          <TabsTrigger 
            value="profile" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="business" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Business
          </TabsTrigger>
          <TabsTrigger 
            value="mandate" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            <span className="hidden md:inline">Investment </span>Mandate
          </TabsTrigger>
          <TabsTrigger 
            value="metrics" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="match" 
            className="min-w-[80px] flex-1 px-3 py-3 md:px-6 text-sm md:text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=inactive]:text-zinc-400 hover:text-white transition"
          >
            Match
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4 bg-[#111827] rounded-b-lg">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <InvestorProfileInfo />
          </div>
        </TabsContent>
        
        <TabsContent value="business" className="mt-0 bg-[#111827] rounded-b-lg">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {/* Company Logo Upload - added to match screenshot */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#1a2234] border border-zinc-700 flex items-center justify-center cursor-pointer">
                  <div className="text-center text-zinc-400 text-sm p-4">
                    Click here to upload your company logo.
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-8">
                {/* Company Name */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="company-name" className="text-white flex items-center gap-2">
                      Company Name <Check className="w-5 h-5 text-green-500" />
                    </Label>
                  </div>
                  <Input
                    id="company-name"
                    defaultValue="SevenX Capital"
                    className="bg-[#1F2937] border-zinc-700 text-white"
                    placeholder="Enter your company name"
                  />
                </div>
                
                {/* Web URL */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="web-url" className="text-white flex items-center gap-2">
                      Web Url <Check className="w-5 h-5 text-green-500" />
                    </Label>
                  </div>
                  <Input
                    id="web-url"
                    defaultValue="sevenx.capital"
                    className="bg-[#1F2937] border-zinc-700 text-white"
                    placeholder="yourcompany.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Country */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="country" className="text-white flex items-center gap-2">
                  In what country are you located? <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Select>
                <SelectTrigger id="country" className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* City */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="city" className="text-white flex items-center gap-2">
                  In what city are you living? <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Input
                id="city"
                className="bg-[#1F2937] border-zinc-700 text-white"
                placeholder="Enter your city"
              />
            </div>
            
            {/* Category */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="category" className="text-white flex items-center gap-2">
                  I&apos;m categorizing myself as <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Select>
                <SelectTrigger id="category" className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectItem value="vc">Venture Capital</SelectItem>
                  <SelectItem value="angel">Angel Investor</SelectItem>
                  <SelectItem value="pe">Private Equity</SelectItem>
                  <SelectItem value="corporate">Corporate Investor</SelectItem>
                  <SelectItem value="family">Family Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                className="bg-[#1F2937] border-zinc-700 text-white hover:bg-[#2D3748] px-8"
              >
                Back
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white px-8"
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mandate" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-5xl mx-auto">
            <InvestmentMandate />
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <MetricsContent />
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-5xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total Investments" 
                value="$1,025,000" 
                trend={{ value: "+12.5%", positive: true }} 
              />
              <StatsCard 
                title="Active Companies" 
                value="8" 
                trend={{ value: "+2", positive: true }} 
              />
              <StatsCard 
                title="Average ROI" 
                value="24.3%" 
                trend={{ value: "+5.2%", positive: true }} 
              />
            </div>
            <PortfolioOverview data={portfolioData} />
            <div className="mt-8">
              <DealPipeline companies={companyList} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="match" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-5xl mx-auto">
            <p className="text-white">Match content will go here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 