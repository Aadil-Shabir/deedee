"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Share2, UserPlus, DollarSign, MessageCircle, Mail } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Company {
  id: string;
  name: string;
  founderId: string;
  founderName: string;
  country: string;
  logo?: string;
  investment: number;
  currentValue: number;
  growthPercentage: number;
  security: string;
  securityValue: number;
  securityGrowth: number;
  isActive: boolean;
}

interface PortfolioCardProps {
  company: Company;
  onViewDetails: (companyId: string) => void;
  onSellPosition: (companyId: string) => void;
}

export function PortfolioCard({ company, onViewDetails, onSellPosition }: PortfolioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const formatted = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    return formatted;
  };

  return (
    <div className="bg-[#0f1724] border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex gap-3">
            <div className="h-14 w-14 rounded-md bg-zinc-800 overflow-hidden flex items-center justify-center">
              {company.logo ? (
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-violet-900/30 flex items-center justify-center">
                  <span className="text-lg font-semibold text-violet-400">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{company.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-zinc-400">{company.founderName}</p>
                <span className="text-zinc-600">•</span> 
                <p className="text-sm text-zinc-400">{company.country}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="inline-block px-2 py-1 rounded-full bg-green-950 text-green-400 text-xs font-medium">
              Active
            </span>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-zinc-800">
                  <MoreVertical className="h-5 w-5 text-zinc-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#171e2e] border-zinc-800 text-white">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800">
                  <Share2 className="h-4 w-4" />
                  <span>Share Portfolio</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800">
                  <Eye className="h-4 w-4" />
                  <span>Visit Company Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Investors</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800 text-red-400"
                  onClick={() => onSellPosition(company.id)}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Sell Position</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111827] rounded-lg p-4">
            <p className="text-sm text-zinc-400 mb-1">Investment vs Portfolio Value</p>
            <div className="flex items-baseline">
              <p className="text-zinc-400 mr-2">{formatCurrency(company.investment)}</p>
              <span className="text-zinc-400">→</span>
              <h4 className="text-xl font-bold text-white ml-2">{formatCurrency(company.currentValue)}</h4>
              <span className={`ml-2 text-sm ${company.growthPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(company.growthPercentage)}
              </span>
            </div>
          </div>

          <div className="bg-[#111827] rounded-lg p-4">
            <p className="text-sm text-zinc-400 mb-1">Security: {company.security}</p>
            <div className="flex items-baseline">
              <p className="text-zinc-400 mr-2">${company.securityValue}</p>
              <span className="text-zinc-400">→</span>
              <h4 className="text-xl font-bold text-white ml-2">${Math.round(company.securityValue * (1 + company.securityGrowth / 100))}</h4>
              <span className={`ml-2 text-sm ${company.securityGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(company.securityGrowth)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="outline"
            className="w-full flex justify-center items-center h-12 bg-violet-600/10 border-violet-600/20 text-violet-400 hover:bg-violet-600/20"
            onClick={() => onViewDetails(company.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Company Details
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center h-12 bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10"
            onClick={() => onSellPosition(company.id)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Sell Position
          </Button>
        </div>

        <div className="flex mt-4 gap-3">
          <button className="p-2 rounded-full bg-transparent hover:bg-zinc-800 text-zinc-400">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full bg-transparent hover:bg-zinc-800 text-zinc-400">
            <Mail className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 