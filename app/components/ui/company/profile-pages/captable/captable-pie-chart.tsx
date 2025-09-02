"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CaptableInvestor } from "@/types/captable";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CaptablePieChartProps {
  investors: CaptableInvestor[];
}

export function CaptablePieChart({ investors }: CaptablePieChartProps) {
  const { chartData, config, totalInvestment } = useMemo(() => {
    if (!investors || investors.length === 0) {
      return { chartData: [], config: {}, totalInvestment: 0 };
    }


    const totalInvestment = investors.reduce((sum, investor) => sum + investor.investment_amount, 0);

    
    const chartData = investors
      .filter(investor => investor.ownership_percentage > 0) 
      .map(investor => ({
        name: investor.investor_name,
        value: investor.ownership_percentage,
        investment_amount: investor.investment_amount,
        round_type: investor.round_type,
      }))
      .sort((a, b) => b.value - a.value);

    
    const colors = [
      '#8b5cf6', // violet-500 
      '#10b981', // green-500 
      '#f59e0b', // amber-500 
      '#ef4444', // red-500 
      '#3b82f6', // blue-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
      '#f97316', // orange-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
    ];

    const config = chartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      };
      return acc;
    }, {} as any);

    return { chartData, config, totalInvestment };
  }, [investors]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-zinc-100 mb-1">{data.name}</p>
          <p className="text-zinc-300 text-sm">
            Ownership: {data.value.toFixed(1)}%
          </p>
          <p className="text-zinc-300 text-sm">
            Investment: {formatCurrency(data.investment_amount)}
          </p>
          <p className="text-zinc-300 text-sm">
            Round: {data.round_type}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>No investment data available for the pie chart.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="h-96">
        <ChartContainer config={config} className="h-full w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config[entry.name]?.color} 
                />
              ))}
            </Pie>
            <ChartTooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-zinc-300">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </div>


      <div className="text-center mt-4 mb-6">
        <p className="text-lg font-semibold text-zinc-100">
          Total Investment: {formatCurrency(totalInvestment)}
        </p>
      </div>


      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-1"
              style={{ backgroundColor: config[item.name]?.color }}
            />
            <p className="text-sm font-medium text-zinc-100">{item.name}</p>
            <p className="text-xs text-zinc-400">{item.value.toFixed(1)}% ownership</p>
            <p className="text-xs text-zinc-500">{formatCurrency(item.investment_amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
