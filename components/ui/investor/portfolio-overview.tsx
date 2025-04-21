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
  data?: PortfolioData;
}

export function PortfolioOverview({ data }: PortfolioOverviewProps) {
  const [activeTab, setActiveTab] = useState("summary");

  // Handle case when data is not provided
  const defaultData: PortfolioData = {
    allocation: {
      companies: [
        { name: "Default Company", value: 100, color: "#8b5cf6" }
      ]
    },
    growth: {
      months: ["Jan", "Feb", "Mar"],
      values: [5.0, 6.0, 7.0]
    }
  };

  // Use provided data or default
  const portfolioData = data || defaultData;
  
  // Calculate total for percentage
  const totalAllocation = portfolioData.allocation.companies.reduce(
    (sum, company) => sum + company.value, 0
  );
  
  // Generate segments for pie chart
  const generatePieSegments = () => {
    let currentAngle = 0;
    return portfolioData.allocation.companies.map((company, index) => {
      const percentage = (company.value / totalAllocation) * 100;
      const startAngle = currentAngle;
      const endAngle = currentAngle + (percentage / 100) * 360;
      currentAngle = endAngle;
      
      // Calculate SVG path for arc
      const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
      const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
      const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
      const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
      
      // Determine if the arc is large or small (> 180 degrees)
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
      
      return {
        company,
        path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
        percentage
      };
    });
  };

  const pieSegments = generatePieSegments();

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
                <div className="relative w-full h-64 flex items-center justify-center">
                  {/* Improved pie chart with proper segments */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {pieSegments.map((segment, index) => (
                      <path 
                        key={segment.company.name}
                        d={segment.path}
                        fill={segment.company.color}
                        stroke="#0f1729"
                        strokeWidth="1"
                        className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      />
                    ))}
                    {/* Center circle for donut effect */}
                    <circle cx="50" cy="50" r="20" fill="#0f1729" />
                  </svg>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {portfolioData.allocation.companies.map((company, index) => (
                    <div key={company.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: company.color }}></div>
                        <span className="text-zinc-200 text-sm">{company.name}</span>
                      </div>
                      <span className="text-zinc-300 font-medium">{pieSegments[index].percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-4">Portfolio Growth</h3>
                <div className="h-64 relative">
                  {/* Improved area chart */}
                  <svg 
                    className="w-full h-full overflow-visible" 
                    viewBox={`0 0 ${portfolioData.growth.months.length * 60} 240`}
                    preserveAspectRatio="none"
                  >
                    {/* Y-axis grid lines */}
                    {[0, 25, 50, 75, 100].map((percent) => (
                      <line 
                        key={percent}
                        x1="0" 
                        y1={240 - (percent * 2.4)} 
                        x2={portfolioData.growth.months.length * 60} 
                        y2={240 - (percent * 2.4)}
                        stroke="#374151" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                      />
                    ))}
                    
                    {/* Create the line chart */}
                    <polyline
                      points={portfolioData.growth.values.map((value, index) => {
                        const x = 30 + (index * 60);
                        const normalizedValue = (value - Math.min(...portfolioData.growth.values)) / 
                                            (Math.max(...portfolioData.growth.values) - Math.min(...portfolioData.growth.values));
                        const y = 240 - (normalizedValue * 200);
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Add data points */}
                    {portfolioData.growth.values.map((value, index) => {
                      const x = 30 + (index * 60);
                      const normalizedValue = (value - Math.min(...portfolioData.growth.values)) / 
                                          (Math.max(...portfolioData.growth.values) - Math.min(...portfolioData.growth.values));
                      const y = 240 - (normalizedValue * 200);
                      return (
                        <g key={index}>
                          <circle 
                            cx={x} 
                            cy={y} 
                            r="6" 
                            fill="#8b5cf6" 
                            stroke="#0f1729" 
                            strokeWidth="2"
                          />
                          {/* X-axis labels */}
                          <text 
                            x={x} 
                            y="240" 
                            textAnchor="middle" 
                            fill="#9ca3af" 
                            fontSize="12"
                            dy="15"
                          >
                            {portfolioData.growth.months[index]}
                          </text>
                          {/* Value labels */}
                          <text 
                            x={x} 
                            y={y - 15} 
                            textAnchor="middle" 
                            fill="#d1d5db" 
                            fontSize="12"
                          >
                            ${value.toFixed(1)}M
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Area under the line */}
                    <path
                      d={`
                        M ${30 + (0 * 60)},240 
                        ${portfolioData.growth.values.map((value, index) => {
                          const x = 30 + (index * 60);
                          const normalizedValue = (value - Math.min(...portfolioData.growth.values)) / 
                                              (Math.max(...portfolioData.growth.values) - Math.min(...portfolioData.growth.values));
                          const y = 240 - (normalizedValue * 200);
                          return `L ${x},${y}`;
                        }).join(' ')}
                        L ${30 + ((portfolioData.growth.values.length - 1) * 60)},240 Z
                      `}
                      fill="url(#gradientArea)"
                      opacity="0.3"
                    />
                    
                    {/* Gradient for the area */}
                    <defs>
                      <linearGradient id="gradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-70">
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
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 space-y-4">
              <div className="w-full max-w-md bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-violet-400 mb-3">Industry Distribution</h3>
                <div className="space-y-3">
                  {[
                    { industry: "SaaS", percentage: 35, color: "#8b5cf6" },
                    { industry: "Fintech", percentage: 25, color: "#6366f1" },
                    { industry: "Health Tech", percentage: 20, color: "#ec4899" },
                    { industry: "AI & ML", percentage: 15, color: "#10b981" },
                    { industry: "Others", percentage: 5, color: "#f59e0b" }
                  ].map(item => (
                    <div key={item.industry} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.industry}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 space-y-4">
              <div className="w-full grid grid-cols-3 gap-4">
                {[
                  { metric: "Total Return", value: "+32.5%", color: "text-green-500" },
                  { metric: "Annual Growth", value: "+12.8%", color: "text-green-500" },
                  { metric: "Benchmark Diff", value: "+8.3%", color: "text-green-500" },
                  { metric: "Liquidity Events", value: "2", color: "text-violet-400" },
                  { metric: "Avg. Hold Period", value: "3.2 yrs", color: "text-blue-400" },
                  { metric: "Portfolio Beta", value: "1.2", color: "text-yellow-500" },
                ].map(item => (
                  <div key={item.metric} className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-zinc-400">{item.metric}</p>
                    <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="irr">
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 space-y-4">
              <div className="w-full max-w-md">
                <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-medium text-violet-400 mb-1">Portfolio IRR</h3>
                  <p className="text-4xl font-bold text-green-500">24.6%</p>
                  <p className="text-sm text-zinc-400 mt-1">Above target by 8.2%</p>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-zinc-400">Best Performer</p>
                    <p className="text-lg font-medium text-zinc-200">Grey Wolves</p>
                    <p className="text-green-500 font-semibold">IRR: 37.2%</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <p className="text-sm text-zinc-400">Portfolio Risk</p>
                    <p className="text-lg font-medium text-zinc-200">Moderate</p>
                    <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                      <div className="h-2 rounded-full bg-yellow-500" style={{width: "65%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 