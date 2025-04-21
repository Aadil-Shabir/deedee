"use client";

import { Company } from "./types";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ThumbsUp, ThumbsDown, X, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Extended interface for company details in modal
interface ExtendedCompany extends Omit<Company, 'matchPercentage' | 'revenue' | 'ebitda'> {
  matchPercentage?: number;
  category?: string;
  growth?: {
    percentage: number;
    timeframe: string;
  };
  revenue?: {
    value: number;
    label: string;
  } | number;
  ebitda?: {
    percentage: number;
  } | number;
}

interface CompanyDetailsModalProps {
  company: ExtendedCompany | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsModal({ 
  company, 
  isOpen, 
  onClose 
}: CompanyDetailsModalProps) {
  if (!company) return null;

  const getGrowthColor = (percentage: number) => {
    return percentage >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#171e2e] border-zinc-800 text-white sm:max-w-[550px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#171e2e] border-b border-zinc-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-zinc-800 overflow-hidden flex items-center justify-center">
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
              <DialogTitle className="text-xl font-bold text-white">{company.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {company.category && (
                  <span className="text-sm text-zinc-400">{company.category}</span>
                )}
                {company.location && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-sm text-zinc-400">{company.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DialogClose className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-800">
            <X className="h-4 w-4 text-zinc-400" />
          </DialogClose>
        </div>

        <div className="p-4 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Revenue</p>
              <p className="text-lg font-medium text-white">
                {typeof company.revenue === 'object' && company.revenue.value ? 
                  `$${company.revenue.value}M ${company.revenue.label}` : 
                  `$${(typeof company.revenue === 'number' ? company.revenue : 0)/1000000}M ARR`}
              </p>
            </div>
            
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">EBITDA</p>
              <p className="text-lg font-medium text-white">
                {typeof company.ebitda === 'object' && company.ebitda.percentage ? 
                  `${company.ebitda.percentage}%` : 
                  `${typeof company.ebitda === 'number' ? company.ebitda : 0}%`}
              </p>
            </div>
            
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Growth</p>
              <p className={`text-lg font-medium ${
                typeof company.growth === 'object' && company.growth ? 
                  getGrowthColor(company.growth.percentage) : 
                  getGrowthColor(company.revenueGrowth)
              }`}>
                {typeof company.growth === 'object' && company.growth ? 
                  `${company.growth.percentage}% ${company.growth.timeframe}` : 
                  `${company.revenueGrowth}% YoY`}
              </p>
            </div>
          </div>

          {/* Match score */}
          <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3">
            <div>
              <p className="text-sm text-zinc-400">Match Score</p>
              <p className="text-xl font-bold text-white">
                {company.matchPercentage ? company.matchPercentage : company.match}%
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent border-green-600/30 text-green-500 hover:bg-green-900/20 h-8">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-red-600/30 text-red-500 hover:bg-red-900/20 h-8">
                <ThumbsDown className="h-4 w-4 mr-1" />
                Pass
              </Button>
            </div>
          </div>

          {/* Company description */}
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-sm text-zinc-400 mb-2">About</p>
            <p className="text-sm text-white">
              {company.description || `${company.name} is a leading provider of ${
                company.category ? company.category.toLowerCase() : company.industry.toLowerCase()
              } solutions. Their innovative technology has helped businesses improve decision-making and reduce costs.`}
            </p>
          </div>

          {/* Status */}
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-zinc-400">Status</p>
              <Badge 
                className={`
                  ${company.status === 'active' ? 'bg-green-950 text-green-400' : 
                  company.status === 'pending' ? 'bg-amber-950 text-amber-400' : 
                  company.status === 'completed' ? 'bg-blue-950 text-blue-400' : 
                  'bg-red-950 text-red-400'}
                  px-2 py-1
                `}
              >
                {company.status}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
            <Button variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 