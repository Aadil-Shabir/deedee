"use client";

import { DealflowFilters } from "./types";

interface SearchResultsFiltersProps {
  filters: DealflowFilters;
  totalResults: number;
}

export function SearchResultsFilters({ filters, totalResults }: SearchResultsFiltersProps) {
  // Format revenue range display
  const formatRevenueRange = (min: number, max: number) => {
    if (min === 0 && max === 0) return "Any";
    if (max === Infinity) return `$${min}M+`;
    return `$${min}M - $${max}M`;
  };

  return (
    <div className="bg-[#171e2e] rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4">AI Search Results ({totalResults} matches)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-zinc-400">Location:</p>
          <p className="text-white font-medium">{filters.location || "Any"}</p>
        </div>
        
        <div>
          <p className="text-sm text-zinc-400">Business Type:</p>
          <p className="text-white font-medium">
            {filters.businessType && filters.businessType.length > 0 
              ? filters.businessType.join(", ") 
              : "Any"}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-zinc-400">Revenue Range:</p>
          <p className="text-white font-medium">
            {filters.revenueRange 
              ? formatRevenueRange(filters.revenueRange.min || 0, filters.revenueRange.max || 0) 
              : "Any"}
          </p>
        </div>
      </div>
    </div>
  );
} 