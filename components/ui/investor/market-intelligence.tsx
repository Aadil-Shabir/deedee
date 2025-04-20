"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketTrend {
  id: string;
  name: string;
  growth: string;
  growthValue: number;
  relevance: "High" | "Medium" | "Low";
}

interface MarketIntelligenceProps {
  trends: MarketTrend[];
}

export function MarketIntelligence({ trends }: MarketIntelligenceProps) {
  const getGrowthColor = (value: number) => {
    if (value >= 20) return "text-green-500";
    if (value >= 10) return "text-green-400";
    if (value >= 0) return "text-green-300";
    return "text-red-500";
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case "High":
        return "bg-violet-500";
      case "Medium":
        return "bg-blue-500";
      case "Low":
        return "bg-zinc-500";
      default:
        return "bg-zinc-500";
    }
  };

  return (
    <Card className="bg-[#0f1729] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-400">
          Market Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Trend</th>
                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Growth</th>
                <th className="text-right py-3 px-4 text-zinc-400 font-medium">Relevance</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr key={trend.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                  <td className="py-4 px-4">
                    <span className="font-medium text-white">{trend.name}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${getGrowthColor(trend.growthValue)}`}>
                      {trend.growth}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRelevanceColor(trend.relevance)} text-white`}>
                      {trend.relevance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-zinc-500 text-sm mt-4">
          Industry benchmark data and peer comparisons available in detailed reports.
        </p>
      </CardContent>
    </Card>
  );
} 