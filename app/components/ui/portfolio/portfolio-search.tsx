"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface SortOption {
  id: string;
  label: string;
}

interface PortfolioSearchProps {
  onSearch: (query: string) => void;
  onAddPortfolio: () => void;
  onFilterChange?: (filters: Record<string, FilterOption[]>) => void;
  onSortChange?: (sortId: string) => void;
  initialQuery?: string;
}

export function PortfolioSearch({ 
  onSearch, 
  onAddPortfolio, 
  onFilterChange, 
  onSortChange,
  initialQuery = ""
}: PortfolioSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<string>("company-name");

  // Example filter options - these could be passed as props instead
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({
    status: [
      { id: "active", label: "Active", checked: true },
      { id: "exited", label: "Exited", checked: false },
    ],
    value: [
      { id: "under-1m", label: "Under $1M", checked: false },
      { id: "1m-10m", label: "1M - 10M", checked: false },
      { id: "over-10m", label: "Over $10M", checked: false },
    ],
  });

  const sortOptions: SortOption[] = [
    { id: "company-name", label: "Company Name" },
    { id: "current-value", label: "Current Value" },
    { id: "date-added", label: "Date Added" },
  ];

  // Update search as user types
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300); // Debounce search for better performance
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleFilterChange = (category: string, itemId: string, checked: boolean) => {
    const updatedFilters = {
      ...filterOptions,
      [category]: filterOptions[category].map(item => 
        item.id === itemId ? { ...item, checked } : item
      )
    };
    
    setFilterOptions(updatedFilters);
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleSortChange = (sortId: string) => {
    setSortBy(sortId);
    
    if (onSortChange) {
      onSortChange(sortId);
    }
  };

  const getActiveSort = () => {
    return sortOptions.find(option => option.id === sortBy)?.label || "Sort by";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search portfolio company"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 bg-[#171e2e] border-zinc-700 text-white w-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      
      <div className="flex flex-1 justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
              {getActiveSort()}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#171e2e] border-zinc-800 text-white min-w-[200px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-700" />
            {sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={sortBy === option.id}
                onCheckedChange={() => handleSortChange(option.id)}
                className="cursor-pointer hover:bg-zinc-800"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#171e2e] border-zinc-800 text-white min-w-[200px]">
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category}>
                <DropdownMenuLabel className="capitalize">{category}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                {options.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={option.checked}
                    onCheckedChange={(checked) => handleFilterChange(category, option.id, !!checked)}
                    className="cursor-pointer hover:bg-zinc-800"
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator className="bg-zinc-700" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          onClick={onAddPortfolio}
          className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Portfolio</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
} 