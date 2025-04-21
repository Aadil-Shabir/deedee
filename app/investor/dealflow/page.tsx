"use client";

import { ActionButton } from "../../components/ui/dealflow/action-button";
import { AISearchBar } from "../../components/ui/dealflow/ai-search-bar";
import { CompanyDetailsModal } from "../../components/ui/dealflow/company-details-modal";
import { 
  DealflowFilters, 
  AISearchQuery, 
  Company as DealflowCompany,
  MatchCategoryType
} from "../../components/ui/dealflow/types";
import { SearchResultsFilters } from "../../components/ui/dealflow/search-results-filters";
import { ViewMode, ViewToggle } from "../../components/ui/dealflow/view-toggle";
import { useState } from "react";
import MatchCategory from "../../components/ui/dealflow/match-category";

// Define a custom company interface for the dealflow page
interface DealflowPageCompany {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description: string;
  industry: string;
  founded: number;
  stage: string;
  match: number;
  matchCategory: MatchCategoryType;
  matchPercentage: number;
  isHot?: boolean;
  revenue: {
    value: number;
    label: string;
  };
  ebitda: {
    percentage: number;
  };
  growth: {
    percentage: number;
    timeframe: string;
  };
  category?: string;
  lastContact: {
    days: number;
    type: string;
  };
  revenueGrowth: number;
  lastContactDate: string;
  status: 'active' | 'pending' | 'declined' | 'completed';
}

interface CategorySectionProps {
  title: string;
  category: MatchCategoryType;
  companies: DealflowPageCompany[];
  resultCount: number;
  onViewDetails: (company: DealflowPageCompany) => void;
}

// Update the CategorySection component to match the design in the image
function CategorySection({ 
  title, 
  category, 
  companies, 
  resultCount, 
  onViewDetails 
}: CategorySectionProps) {
  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {title} <span className="text-gray-400 ml-2">({resultCount})</span>
        </h2>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {companies.map(company => (
          <div 
            key={company.id}
            className="bg-[#151b29] border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            onClick={() => onViewDetails(company)}
          >
            <div className="p-4">
              {/* Company header with logo and match */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-lg font-semibold text-indigo-400">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {company.isHot && <span className="text-orange-500">🔥</span>}
                  <span className={company.matchPercentage >= 95 ? "text-orange-500 font-medium" : "text-blue-500 font-medium"}>
                    {company.matchPercentage}%
                  </span>
                </div>
              </div>
              
              {/* Financial metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-[#1b222f] p-2 rounded">
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-sm font-medium text-white">
                    ${company.revenue.value}M {company.revenue.label}
                  </p>
                </div>
                <div className="bg-[#1b222f] p-2 rounded">
                  <p className="text-xs text-gray-500 mb-1">EBITDA</p>
                  <p className="text-sm font-medium text-white">
                    {company.ebitda.percentage}%
                  </p>
                </div>
                <div className="bg-[#1b222f] p-2 rounded">
                  <p className="text-xs text-gray-500 mb-1">Growth</p>
                  <p className={`text-sm font-medium ${company.growth.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {company.growth.percentage}% {company.growth.timeframe}
                  </p>
                </div>
              </div>
              
              {/* Company info */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                  {company.stage}
                </span>
                {company.category && (
                  <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                    {company.category}
                  </span>
                )}
                <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                  {company.location.split(',')[0]}
                </span>
              </div>
              
              {/* Deal status and last contact */}
              <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Status:</p>
                  <p className="text-sm text-white">
                    {company.status === 'active' ? 'Due Diligence' : 
                     company.status === 'pending' ? 'Term Sheet' :
                     company.status === 'completed' ? 'Closed' : 'Declined'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last Contact: {company.lastContact.days} {company.lastContact.days === 1 ? 'day' : 'days'} ago
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DealflowPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCompany, setSelectedCompany] = useState<DealflowPageCompany | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    activeSearch: boolean;
    query: string;
    filters: DealflowFilters;
    totalResults: number;
  }>({
    activeSearch: false,
    query: "",
    filters: {},
    totalResults: 0
  });

  // Sample data for ultimate matches
  const ultimateMatches: DealflowPageCompany[] = [
    {
      id: "1",
      name: "TechStart Inc",
      matchPercentage: 95,
      isHot: true,
      revenue: {
        value: 2.5,
        label: "ARR"
      },
      ebitda: {
        percentage: 25
      },
      growth: {
        percentage: 150,
        timeframe: "YoY"
      },
      stage: "Seed",
      category: "SaaS",
      location: "San Francisco, USA",
      status: "active",
      lastContact: {
        days: 2,
        type: "meeting"
      },
      description: "SaaS platform for startups",
      industry: "Software",
      founded: 2020,
      match: 95,
      matchCategory: "ultimate",
      revenueGrowth: 150,
      lastContactDate: "2023-07-29"
    },
    {
      id: "2",
      name: "DataFlow Analytics",
      matchPercentage: 94,
      isHot: true,
      revenue: {
        value: 2,
        label: "ARR"
      },
      ebitda: {
        percentage: 20
      },
      growth: {
        percentage: 150,
        timeframe: "YoY"
      },
      stage: "Series A",
      category: "Data Analytics",
      location: "New York, USA",
      status: "active",
      lastContact: {
        days: 5,
        type: "email"
      },
      description: "Data analytics platform",
      industry: "Data",
      founded: 2019,
      match: 94,
      matchCategory: "ultimate",
      revenueGrowth: 150,
      lastContactDate: "2023-07-26"
    },
    {
      id: "3",
      name: "AI Solutions Co",
      matchPercentage: 92,
      isHot: true,
      revenue: {
        value: 3,
        label: "ARR"
      },
      ebitda: {
        percentage: 30
      },
      growth: {
        percentage: 200,
        timeframe: "YoY"
      },
      stage: "Series B",
      category: "AI/ML",
      location: "Toronto, Canada",
      status: "active",
      lastContact: {
        days: 1,
        type: "message"
      },
      description: "AI solutions for businesses",
      industry: "Artificial Intelligence",
      founded: 2018,
      match: 92,
      matchCategory: "ultimate",
      revenueGrowth: 200,
      lastContactDate: "2023-07-30"
    },
    {
      id: "4",
      name: "RoboTech Industries",
      matchPercentage: 91,
      revenue: {
        value: 3,
        label: "ARR"
      },
      ebitda: {
        percentage: 30
      },
      growth: {
        percentage: 90,
        timeframe: "YoY"
      },
      stage: "Series C",
      category: "Robotics",
      location: "Tokyo, Japan",
      status: "pending",
      lastContact: {
        days: 1,
        type: "meeting"
      },
      description: "Robotic automation solutions",
      industry: "Robotics",
      founded: 2015,
      match: 91,
      matchCategory: "ultimate",
      revenueGrowth: 90,
      lastContactDate: "2023-07-30"
    }
  ];

  // Sample data for super matches
  const superMatches: DealflowPageCompany[] = [
    {
      id: "5",
      name: "Quantum Systems",
      matchPercentage: 89,
      isHot: true,
      revenue: {
        value: 1.8,
        label: "ARR"
      },
      ebitda: {
        percentage: 22
      },
      growth: {
        percentage: 120,
        timeframe: "YoY"
      },
      stage: "Series A",
      category: "Quantum Computing",
      location: "Boston, USA",
      status: "active",
      lastContact: {
        days: 3,
        type: "meeting"
      },
      description: "Quantum computing solutions",
      industry: "Quantum Computing",
      founded: 2018,
      match: 89,
      matchCategory: "super",
      revenueGrowth: 120,
      lastContactDate: "2023-07-28"
    },
    {
      id: "6",
      name: "CloudTech Solutions",
      matchPercentage: 88,
      revenue: {
        value: 4.2,
        label: "ARR"
      },
      ebitda: {
        percentage: 18
      },
      growth: {
        percentage: 85,
        timeframe: "YoY"
      },
      stage: "Series B",
      category: "Cloud Infrastructure",
      location: "Seattle, USA",
      status: "pending",
      lastContact: {
        days: 4,
        type: "email"
      },
      description: "Cloud infrastructure provider",
      industry: "Cloud Computing",
      founded: 2017,
      match: 88,
      matchCategory: "super",
      revenueGrowth: 85,
      lastContactDate: "2023-07-27"
    },
    {
      id: "7",
      name: "BlockChain Innovations",
      matchPercentage: 85,
      isHot: true,
      revenue: {
        value: 1.2,
        label: "ARR"
      },
      ebitda: {
        percentage: 15
      },
      growth: {
        percentage: 180,
        timeframe: "YoY"
      },
      stage: "Seed",
      category: "Blockchain",
      location: "Singapore",
      status: "active",
      lastContact: {
        days: 7,
        type: "message"
      },
      description: "Blockchain solutions",
      industry: "Blockchain",
      founded: 2020,
      match: 85,
      matchCategory: "super",
      revenueGrowth: 180,
      lastContactDate: "2023-07-24"
    },
    {
      id: "8",
      name: "GreenEnergy Tech",
      matchPercentage: 82,
      revenue: {
        value: 5.5,
        label: "ARR"
      },
      ebitda: {
        percentage: 28
      },
      growth: {
        percentage: 60,
        timeframe: "YoY"
      },
      stage: "Series C",
      category: "CleanTech",
      location: "Berlin, Germany",
      status: "completed",
      lastContact: {
        days: 2,
        type: "meeting"
      },
      description: "Renewable energy solutions",
      industry: "Clean Energy",
      founded: 2016,
      match: 82,
      matchCategory: "super",
      revenueGrowth: 60,
      lastContactDate: "2023-07-29"
    },
    {
      id: "9",
      name: "HealthTech Solutions",
      matchPercentage: 80,
      revenue: {
        value: 3.1,
        label: "ARR"
      },
      ebitda: {
        percentage: 24
      },
      growth: {
        percentage: 75,
        timeframe: "YoY"
      },
      stage: "Series A",
      category: "HealthTech",
      location: "London, UK",
      status: "declined",
      lastContact: {
        days: 6,
        type: "email"
      },
      description: "Healthcare technology provider",
      industry: "Healthcare",
      founded: 2018,
      match: 80,
      matchCategory: "super",
      revenueGrowth: 75,
      lastContactDate: "2023-07-25"
    }
  ];

  const handleViewCompanyDetails = (company: DealflowPageCompany) => {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
  };

  const handleAISearch = (searchQuery: AISearchQuery) => {
    // In a real app, you would make an API call to search for companies
    // For now, we'll just simulate a search by setting some sample filters
    setSearchResults({
      activeSearch: true,
      query: searchQuery.query,
      filters: {
        location: "San Francisco Bay Area",
        businessType: ["SaaS", "AI/ML"],
        revenueRange: {
          min: 1,
          max: 5
        }
      },
      totalResults: 23
    });
  };

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // Implement the action handlers here
  };

  return (
    <div className="min-h-screen bg-[#0d1424] text-white">
      <header className="border-b border-zinc-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">DeeDee</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="bg-transparent border-none text-white py-2 pl-2 pr-8 appearance-none focus:outline-none">
                <option>Goodboy Indonesia</option>
              </select>
            </div>
            <button className="bg-violet-600 text-white px-4 py-2 rounded-md">
              Upgrade
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-sm">A</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dealflow</h1>
          <div className="flex items-center gap-3">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <ActionButton onAction={handleAction} />
          </div>
        </div>

        <AISearchBar 
          onSearch={handleAISearch} 
          defaultQuery={searchResults.query}
        />

        {searchResults.activeSearch && (
          <SearchResultsFilters 
            filters={searchResults.filters} 
            totalResults={searchResults.totalResults}
          />
        )}

        {!searchResults.activeSearch && (
          <>
            <CategorySection 
              title="Ultimate Matches (90%+)" 
              category="ultimate"
              companies={ultimateMatches}
              resultCount={ultimateMatches.length}
              onViewDetails={handleViewCompanyDetails}
            />
            
            <CategorySection 
              title="Super Matches (75-90%)" 
              category="super"
              companies={superMatches}
              resultCount={superMatches.length}
              onViewDetails={handleViewCompanyDetails}
            />
          </>
        )}

        {searchResults.activeSearch && (
          <div className="mt-8 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Search Results <span className="text-gray-400 ml-2">({searchResults.totalResults})</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...ultimateMatches, ...superMatches].slice(0, 6).map(company => (
                <div 
                  key={company.id}
                  className="bg-[#151b29] border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
                  onClick={() => handleViewCompanyDetails(company)}
                >
                  <div className="p-4">
                    {/* Company header with logo and match */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img 
                              src={company.logo} 
                              alt={company.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-900/30 flex items-center justify-center">
                              <span className="text-lg font-semibold text-indigo-400">
                                {company.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {company.isHot && <span className="text-orange-500">🔥</span>}
                        <span className={company.matchPercentage >= 95 ? "text-orange-500 font-medium" : "text-blue-500 font-medium"}>
                          {company.matchPercentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Financial metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-[#1b222f] p-2 rounded">
                        <p className="text-xs text-gray-500 mb-1">Revenue</p>
                        <p className="text-sm font-medium text-white">
                          ${company.revenue.value}M {company.revenue.label}
                        </p>
                      </div>
                      <div className="bg-[#1b222f] p-2 rounded">
                        <p className="text-xs text-gray-500 mb-1">EBITDA</p>
                        <p className="text-sm font-medium text-white">
                          {company.ebitda.percentage}%
                        </p>
                      </div>
                      <div className="bg-[#1b222f] p-2 rounded">
                        <p className="text-xs text-gray-500 mb-1">Growth</p>
                        <p className={`text-sm font-medium ${company.growth.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {company.growth.percentage}% {company.growth.timeframe}
                        </p>
                      </div>
                    </div>
                    
                    {/* Company info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                        {company.stage}
                      </span>
                      {company.category && (
                        <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                          {company.category}
                        </span>
                      )}
                      <span className="inline-block bg-[#1b222f] text-gray-300 text-xs px-2 py-1 rounded">
                        {company.location.split(',')[0]}
                      </span>
                    </div>
                    
                    {/* Deal status and last contact */}
                    <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Status:</p>
                        <p className="text-sm text-white">
                          {company.status === 'active' ? 'Due Diligence' : 
                           company.status === 'pending' ? 'Term Sheet' :
                           company.status === 'completed' ? 'Closed' : 'Declined'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Last Contact: {company.lastContact.days} {company.lastContact.days === 1 ? 'day' : 'days'} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedCompany && (
        <CompanyDetailsModal 
          company={selectedCompany} 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
} 