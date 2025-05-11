"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AISearchQuery } from "./types";

interface AISearchBarProps {
  onSearch: (query: AISearchQuery) => void;
  defaultQuery?: string;
  isLoading?: boolean;
}
import { Loader2 } from "lucide-react";

const LOADING_DELAY_MS = 500; // Delay to show loading state
const LoadingSpinner = () => (
  <Loader2 className="h-4 w-4 animate-spin" />
);

const useDelayedLoading = (isLoading: boolean, delay: number) => {
  const [showLoading, setShowLoading] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return showLoading;
};

export function AISearchBar({ onSearch, defaultQuery = "", isLoading = false }: AISearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({ query: searchQuery });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow search on Enter key
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-[#171e2e] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors duration-200 focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-1 px-4">
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I'm seeking for a SaaS company with gross profit margins above 80% and EBITDA levels of 30%..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white py-6 h-auto text-sm md:text-base placeholder:text-zinc-500"
          />
        </div>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !searchQuery.trim()}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-r-none rounded-l-xl m-1 flex items-center gap-2 h-10"
        >
          <Search className="h-4 w-4" />
          <span>Search with AI</span>
        </Button>
      </form>
    </div>
  );
} 