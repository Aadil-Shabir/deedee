"use client";

import { CaptableSummary } from "@/types/captable";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface CaptableSummaryCardsProps {
  summary?: CaptableSummary;
}

export function CaptableSummaryCards({ summary }: CaptableSummaryCardsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Equity",
      amount: summary?.total_equity || 0,
      icon: TrendingUp,
      iconColor: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Total Debt",
      amount: summary?.total_debt || 0,
      icon: TrendingDown,
      iconColor: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
    {
      title: "Open for Investment",
      amount: summary?.open_for_investment || 0,
      icon: DollarSign,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-zinc-800 rounded-lg border border-zinc-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-zinc-100">
                  {formatAmount(card.amount)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
