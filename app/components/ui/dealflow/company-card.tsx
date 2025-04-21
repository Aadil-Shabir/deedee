"use client";

import React from 'react';
import { useState } from "react";
import { Company, MatchCategory, MatchCategoryType } from "./types";
import { 
  ChevronRightIcon,
  FlameIcon
} from "lucide-react";
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  category: MatchCategoryType;
  onViewDetails: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, category, onViewDetails }) => {
  const [hovered, setHovered] = useState(false);

  const getMatchColor = (category: MatchCategoryType) => {
    switch (category) {
      case 'ultimate':
        return 'bg-purple-100 text-purple-700';
      case 'super':
        return 'bg-blue-100 text-blue-700';
      case 'strong':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lead':
        return 'bg-yellow-100 text-yellow-700';
      case 'Contact Made':
        return 'bg-blue-100 text-blue-700';
      case 'Due Diligence':
        return 'bg-purple-100 text-purple-700';
      case 'Term Sheet':
        return 'bg-orange-100 text-orange-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getGrowthColor = (percentage: number) => {
    return percentage >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatLastContact = (days: number) => {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const formatMatchPercentage = (percentage: number) => {
    return `${Math.round(percentage)}%`;
  };

  const formatRevenue = (value: number, label: string) => {
    return `$${value}M ${label}`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails(company)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {company.logo ? (
            <div className="w-10 h-10 rounded-full mr-3 overflow-hidden">
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold text-sm">
                {company.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center">
              {company.name}
              {company.isHot && (
                <FlameIcon className="w-4 h-4 text-orange-500 ml-1" />
              )}
            </h3>
            <div className="text-sm text-gray-500">{company.location}</div>
          </div>
        </div>
        <div className="flex items-center">
          <span className={cn("text-sm rounded-full px-2 py-1 font-medium", getMatchColor(category))}>
            {company.matchPercentage}% Match
          </span>
          <ChevronRightIcon className="w-5 h-5 text-gray-400 ml-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <div>
          <div className="text-xs text-gray-500">Revenue</div>
          <div className="font-medium">{company.revenue}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">EBITDA</div>
          <div className="font-medium">
            {company.ebitda}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Growth</div>
          <div className="font-medium">
            {company.revenueGrowth}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Stage</div>
          <div className="font-medium">{company.stage}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(company.status))}>
          {company.status}
        </span>
        <div className="text-xs text-gray-500">
          Last {company.lastContactDate} days ago
        </div>
      </div>
    </div>
  );
};

export default CompanyCard; 