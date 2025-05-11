"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { List } from "lucide-react";
import { AddCompanyData, Company, PortfolioTab, SellPositionData } from "@/app/components/ui/company/portfolio/types";
import { PortfolioTabs } from "@/app/components/ui/company/portfolio/portfolio-tabs";
import { PortfolioSearch } from "@/app/components/ui/company/portfolio/portfolio-search";
import { AddPortfolioModal } from "@/app/components/ui/company/portfolio/add-portfolio-modal";
import { SellPositionModal } from "@/app/components/ui/company/portfolio/sell-position-modal";
import { PortfolioCard } from "@/app/components/ui/company/portfolio/portfolio-card";

function PortfolioContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<PortfolioTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("company-name");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Goodboy Indonesia",
      founderId: "jane-doe",
      founderName: "Jane Doe",
      country: "Indonesia",
      investment: 800000,
      currentValue: 3200000,
      growthPercentage: 1.85,
      security: "Equity",
      securityValue: 80,
      securityGrowth: 18,
      isActive: true,
      dateAdded: "2023-01-15"
    },
    {
      id: "2",
      name: "Grey Wolves",
      founderId: "john-smith",
      founderName: "John Smith",
      country: "Singapore",
      investment: 1000000,
      currentValue: 5400000,
      growthPercentage: 2.11,
      security: "Equity",
      securityValue: 100,
      securityGrowth: 23,
      isActive: true,
      dateAdded: "2023-03-22"
    }
  ]);

  // Portfolio tabs configuration
  const tabs = [
    { id: 'active', label: 'Active', count: companies.filter(c => c.isActive).length },
    { id: 'exits', label: 'Exits', count: 0 },
    { id: 'returns', label: 'Returns' }
  ];

  // Use effect to handle URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['active', 'exits', 'returns'].includes(tabParam)) {
      setActiveTab(tabParam as PortfolioTab);
    }
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as PortfolioTab);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle sort change
  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  // Handle adding a new portfolio company
  const handleAddCompany = (data: AddCompanyData) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      name: data.companyName,
      founderId: `${data.founderFirstName.toLowerCase()}-${data.founderLastName.toLowerCase()}`,
      founderName: `${data.founderFirstName} ${data.founderLastName}`,
      country: data.country,
      investment: parseFloat(data.investmentAmount) || 0,
      currentValue: parseFloat(data.investmentAmount) || 0,
      growthPercentage: 0,
      security: data.securityType,
      securityValue: parseFloat(data.sharePrice) || 0,
      securityGrowth: 0,
      isActive: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setCompanies([...companies, newCompany]);
  };

  // Handle selling a position
  const handleSellPosition = (data: SellPositionData) => {
    console.log("Selling position:", data);
    // In a real app, you would make an API call to list the position for sale
  };

  // Handle view company details
  const handleViewDetails = (companyId: string) => {
    // In a real app, you might navigate to a company details page
    console.log("View details for company:", companyId);
  };

  // Handle opening the sell modal for a specific company
  const openSellModal = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setIsSellModalOpen(true);
    }
  };

  // Filter and sort companies based on active tab, search query, and sort option
  const filteredAndSortedCompanies = useMemo(() => {
    // First filter the companies
    const filtered = companies.filter(company => {
      // Filter by tab
      if (activeTab === 'active' && !company.isActive) return false;
      if (activeTab === 'exits' && company.isActive) return false;

      // Filter by search query (case-insensitive)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          company.name.toLowerCase().includes(query) ||
          company.founderName.toLowerCase().includes(query) ||
          company.country.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Then sort the filtered companies
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'company-name':
          return a.name.localeCompare(b.name);
        case 'current-value':
          return b.currentValue - a.currentValue; // Higher values first
        case 'date-added':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(); // Newest first
        default:
          return 0;
      }
    });
  }, [companies, activeTab, searchQuery, sortBy]);

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
        <h1 className="text-3xl font-bold mb-6">Portfolio</h1>
        
        <div className="grid grid-cols-1 md:flex md:justify-between md:items-start gap-6 mb-6">
          <div className="w-auto md:w-[250px]">
            <PortfolioTabs 
              tabs={tabs} 
              defaultActiveTab="active"
              onTabChange={handleTabChange}
            />
          </div>
          
          <div className="flex-1">
            <PortfolioSearch 
              onSearch={handleSearch}
              onAddPortfolio={() => setIsAddModalOpen(true)}
              onSortChange={handleSortChange}
              initialQuery={searchQuery}
            />
          </div>
        </div>

        {filteredAndSortedCompanies.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <List className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-medium text-white">No companies found</h3>
            <p className="text-zinc-500 mt-2 max-w-md mx-auto">
              {searchQuery 
                ? `No companies match your search '${searchQuery}'. Try a different search term.`
                : "You don't have any companies in your portfolio yet. Add your first company to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredAndSortedCompanies.map(company => (
              <PortfolioCard 
                key={company.id}
                company={company}
                onViewDetails={handleViewDetails}
                onSellPosition={openSellModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddPortfolioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCompany={handleAddCompany}
      />

      <SellPositionModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSell={handleSellPosition}
        companyId={selectedCompany?.id}
        companyName={selectedCompany?.name}
        currentValue={selectedCompany?.currentValue}
      />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1424] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-t-2 border-violet-500 rounded-full"></div>
    </div>}>
      <PortfolioContent />
    </Suspense>
  );
}