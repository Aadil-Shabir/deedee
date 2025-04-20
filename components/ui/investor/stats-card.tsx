"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart2, 
  Calendar, 
  DollarSign, 
  Eye, 
  FileText, 
  TrendingUp 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: "money" | "deals" | "meetings" | "activity";
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon = "money",
  trend,
}: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "money":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "deals":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "meetings":
        return <Calendar className="h-5 w-5 text-violet-500" />;
      case "activity":
        return <Eye className="h-5 w-5 text-green-500" />;
      default:
        return <BarChart2 className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="bg-[#111827] border-zinc-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
          <div className="rounded-full bg-zinc-800/50 p-2">
            {getIcon()}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          {description && (
            <p className="text-sm text-zinc-400">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 mr-1 ${trend.positive ? "text-green-500" : "text-red-500"}`} />
              <span className={`text-sm ${trend.positive ? "text-green-500" : "text-red-500"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 