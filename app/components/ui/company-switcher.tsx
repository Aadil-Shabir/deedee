"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  short_description: string | null;
}

interface CompanySwitcherProps {
  companies: Company[];
  onCompanySelect: (companyId: string) => void;
  onCreateNew: () => void;
}

export function CompanySwitcher({ 
  companies, 
  onCompanySelect, 
  onCreateNew 
}: CompanySwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < companies.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleSelectCurrentCompany = () => {
    if (companies.length > 0) {
      onCompanySelect(companies[activeIndex].id);
    }
  };

  // No companies state
  if (companies.length === 0) {
    return (
      <div className="bg-zinc-800/30 rounded-lg p-8 flex flex-col items-center justify-center space-y-6">
        <div className="bg-zinc-800/50 rounded-full p-4">
          <PlusCircle className="h-10 w-10 text-primary/70" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium text-zinc-100">No companies yet</h3>
          <p className="text-zinc-400 max-w-md">
            You have not created any companies yet. Get started by creating your first company profile.
          </p>
        </div>
        <Button onClick={onCreateNew} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Company
        </Button>
      </div>
    );
  }

  // Multiple companies state
  const activeCompany = companies[activeIndex];

  return (
    <div className="bg-zinc-800/30 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-100">Your Companies</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800/70 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-400">
            {activeIndex + 1} of {companies.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={activeIndex === companies.length - 1}
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800/70 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={onCreateNew}
            className="border-zinc-700 text-zinc-100 hover:bg-zinc-800/70 ml-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Company
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0 bg-zinc-800 rounded-lg h-20 w-20 flex items-center justify-center overflow-hidden">
          {activeCompany.logo_url ? (
            <Image
              src={activeCompany.logo_url}
              alt={activeCompany.company_name}
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-2xl font-bold text-zinc-500">
              {activeCompany.company_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-zinc-100 mb-1">
            {activeCompany.company_name}
          </h3>
          {activeCompany.short_description && (
            <p className="text-sm text-zinc-400">
              {activeCompany.short_description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSelectCurrentCompany}
          className="bg-primary hover:bg-primary/90"
        >
          Edit Company Profile
        </Button>
      </div>
    </div>
  );
}