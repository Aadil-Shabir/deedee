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
import { MetricsContent } from "@/app/components/ui/investor-profile/metrics-content";
import { PortfolioManager } from "@/app/components/ui/investor-profile/portfolio-manager";
import { MatchContent } from "@/app/components/ui/investor-profile/match-content";

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
        <TabsList className="flex flex-wrap mb-0 bg-[#111827] border-b border-zinc-800 rounded-t-lg overflow-hidden px-2 pb-12">
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
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <PortfolioManager />
          </div>
        </TabsContent>
        
        <TabsContent value="match" className="mt-4">
          <div className="bg-[#111827] rounded-lg p-6 md:p-8 max-w-7xl mx-auto">
            <MatchContent />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 