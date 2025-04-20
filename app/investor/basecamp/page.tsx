"use client";

import { StatsCard } from "@/components/ui/investor/stats-card";
import { PortfolioOverview } from "@/components/ui/investor/portfolio-overview";
import { DealPipeline } from "@/components/ui/investor/deal-pipeline";
import { MarketIntelligence } from "@/components/ui/investor/market-intelligence";
import { FounderEngagement } from "@/components/ui/investor/founder-engagement";
import { ActivityDashboard } from "@/components/ui/investor/activity-dashboard";

export default function InvestorBasecamp() {
  // Sample data - in a real application, this would come from an API or database
  const portfolioData = {
    allocation: {
      companies: [
        { name: "Grey Wolves", value: 60, color: "#a78bfa" },
        { name: "Goodboy Indonesia", value: 40, color: "#818cf8" },
      ],
    },
    growth: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      values: [7.5, 8.2, 8.8, 9.3, 10.0],
    },
  };

  const companyList = [
    { id: "1", name: "TechVentures AI", stage: "Due Diligence", match: 92, industry: "AI", lastActivity: "15/05/2023" },
    { id: "2", name: "BlockSphere", stage: "Discovery", match: 88, industry: "Blockchain", lastActivity: "12/05/2023" },
    { id: "3", name: "EcoSolutions", stage: "Negotiation", match: 85, industry: "CleanTech", lastActivity: "10/05/2023" },
    { id: "4", name: "HealthConnect", stage: "Initial Review", match: 79, industry: "HealthTech", lastActivity: "08/05/2023" },
  ];

  const marketTrends = [
    { id: "1", name: "AI integration in SaaS platforms", growth: "+24%", growthValue: 24, relevance: "High" },
    { id: "2", name: "Fintech consolidation", growth: "+8%", growthValue: 8, relevance: "Medium" },
    { id: "3", name: "Enterprise blockchain adoption", growth: "+15%", growthValue: 15, relevance: "Medium" },
    { id: "4", name: "Southeast Asia e-commerce expansion", growth: "+32%", growthValue: 32, relevance: "High" },
  ];

  const companyUpdates = [
    { 
      id: "1", 
      company: "Grey Wolves", 
      date: "12/05/2023", 
      updateType: "Monthly Update", 
      content: "Revenue up 12%, New partnership with Amazon" 
    },
    { 
      id: "2", 
      company: "Goodboy Indonesia", 
      date: "08/05/2023", 
      updateType: "Funding Milestone", 
      content: "Closed $1.5M bridge round" 
    },
  ];

  const upcomingMeetings = [
    { 
      id: "1", 
      title: "Pitch Meeting - BlockSphere", 
      company: "BlockSphere", 
      date: "Today", 
      time: "3:00 PM" 
    },
    { 
      id: "2", 
      title: "Due Diligence - TechVentures AI", 
      company: "TechVentures AI", 
      date: "Tomorrow", 
      time: "10:00 AM" 
    },
    { 
      id: "3", 
      title: "Board Meeting - Grey Wolves", 
      company: "Grey Wolves", 
      date: "May 20", 
      time: "2:00 PM" 
    },
  ];

  const recentActivities = [
    { 
      id: "1", 
      type: "view", 
      company: "TechVentures AI", 
      description: "viewed your profile", 
      timestamp: "2 hours ago" 
    },
    { 
      id: "2", 
      type: "document", 
      company: "BlockSphere", 
      description: "viewed your pitch deck", 
      timestamp: "Yesterday" 
    },
    { 
      id: "3", 
      type: "message", 
      company: "Grey Wolves", 
      description: "sent you a message", 
      timestamp: "2 days ago" 
    },
  ];

  const actionItems = [
    { 
      id: "1", 
      task: "Review TechVentures AI financials", 
      dueDate: "2023-05-15", 
      status: "due today" 
    },
    { 
      id: "2", 
      task: "Schedule follow-up with BlockSphere", 
      dueDate: "2023-05-16", 
      status: "due tomorrow" 
    },
    { 
      id: "3", 
      task: "Prepare board materials for Grey Wolves", 
      dueDate: "2023-05-18", 
      status: "Due May 18" 
    },
  ];

  return (
    <div className="bg-zinc-900 min-h-screen pb-12">
      <div className="py-8 px-6 max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-violet-400">Investor Basecamp</h1>
          <p className="text-zinc-400">Your investment command center</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            title="Portfolio Value"
            value="$8.6M"
            icon="money"
            trend={{ value: "8.5% growth", positive: true }}
          />
          
          <StatsCard 
            title="Active Deals"
            value="12"
            description="4 in due diligence"
            icon="deals"
          />
          
          <StatsCard 
            title="Upcoming Meetings"
            value="3"
            description="Next: Today, 3:00 PM"
            icon="meetings"
          />
          
          <StatsCard 
            title="Profile Activity"
            value="24"
            trend={{ value: "6 new views", positive: true }}
            icon="activity"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <PortfolioOverview data={portfolioData} />
          </div>
          <div>
            <FounderEngagement 
              updates={companyUpdates}
              meetings={upcomingMeetings}
            />
          </div>
        </div>

        <div className="mb-10">
          <DealPipeline companies={companyList} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketIntelligence trends={marketTrends} />
          <ActivityDashboard 
            activities={recentActivities}
            actionItems={actionItems}
          />
        </div>
      </div>
    </div>
  );
} 