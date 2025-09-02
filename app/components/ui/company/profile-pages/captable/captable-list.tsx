"use client";

import { CaptableInvestor } from "@/types/captable";

interface CaptableListProps {
  investors: CaptableInvestor[];
}

export function CaptableList({ investors }: CaptableListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getSecurityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "equity":
        return "bg-green-900 text-green-200 border-green-700";
      case "safe":
        return "bg-blue-900 text-blue-200 border-blue-700";
      case "convertible":
        return "bg-yellow-900 text-yellow-200 border-yellow-700";
      default:
        return "bg-zinc-700 text-zinc-300 border-zinc-600";
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-400";
    if (growth < 0) return "text-red-400";
    return "text-zinc-400";
  };

  if (investors.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>No investors found for this company&apos;s cap table.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">
              Investor
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">
              Investment Date
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">
              Round Type
            </th>
            <th className="text-left py-4 px-6 text-sm font-medium text-zinc-300">
              Security Type
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Valuation
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Share Price
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Shares
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Investment
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Ownership %
            </th>
            <th className="text-right py-4 px-6 text-sm font-medium text-zinc-300">
              Growth %
            </th>
          </tr>
        </thead>
        <tbody>
          {investors.map((investor) => (
            <tr
              key={investor.id}
              className="border-b border-zinc-700 hover:bg-zinc-750"
            >
              <td className="py-4 px-6">
                <div className="font-medium text-zinc-100">
                  {investor.investor_name}
                </div>
              </td>
              <td className="py-4 px-6 text-zinc-300">
                {investor.investment_date}
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-700 text-zinc-300 border border-zinc-600">
                  {investor.round_type}
                </span>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSecurityTypeColor(
                    investor.security_type
                  )}`}
                >
                  {investor.security_type}
                </span>
              </td>
              <td className="py-4 px-6 text-right text-zinc-300">
                {formatCurrency(investor.valuation)}
              </td>
              <td className="py-4 px-6 text-right text-zinc-300">
                {formatCurrency(investor.share_price)}
              </td>
              <td className="py-4 px-6 text-right text-zinc-300">
                {formatNumber(investor.shares)}
              </td>
              <td className="py-4 px-6 text-right font-medium text-zinc-100">
                {formatCurrency(investor.investment_amount)}
              </td>
              <td className="py-4 px-6 text-right text-zinc-300">
                {investor.ownership_percentage}%
              </td>
              <td className="py-4 px-6 text-right">
                <span
                  className={`font-medium ${getGrowthColor(
                    investor.growth_percentage
                  )}`}
                >
                  {investor.growth_percentage > 0 ? "+" : ""}
                  {investor.growth_percentage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
