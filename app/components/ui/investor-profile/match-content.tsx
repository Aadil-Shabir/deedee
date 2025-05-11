"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Plus, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCompanyMatches, getMatchHistory, saveCompanyMatch } from "@/actions/match-actions";

// Type interfaces based on the companies table schema
interface Company {
  id: string;
  owner_id: string;
  company_name: string;
  web_url?: string;
  short_description: string;
  full_description?: string;
  products_count?: number;
  logo_url?: string;
  updated_at?: string;
  created_at?: string;
  match_score?: number; // Added for matching results
}

interface MatchPreference {
  type: 'industry' | 'stage' | 'location';
  value: string;
}

interface MatchHistoryItem {
  id: string;
  investor_id: string;
  search_query?: string;
  search_criteria?: any;
  results_count: number;
  saved_count: number;
  created_at: string;
}

export function MatchContent() {
  const queryClient = useQueryClient();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchResults, setMatchResults] = useState<Company[]>([]);
  
  // User preferences 
  const [preferences, setPreferences] = useState<MatchPreference[]>([
    { type: 'industry', value: 'Software' },
    { type: 'industry', value: 'Health Tech' },
    { type: 'stage', value: 'Seed' },
    { type: 'location', value: 'San Francisco' },
  ]);
  
  // Fetch match history when component loads or history is expanded
  const { 
    data: matchHistory = [], 
    isLoading: isLoadingHistory 
  } = useQuery({
    queryKey: ['matchHistory'],
    queryFn: getMatchHistory,
    enabled: isHistoryExpanded, // Only fetch when history is expanded
  });

  // Handle matching companies
  const { mutate: findMatches, isPending: isMatchingCompanies } = useMutation({
    mutationFn: async () => {
      const criteria = {
        keywords: searchCriteria,
        notes: additionalNotes,
        industries: preferences.filter(p => p.type === 'industry').map(p => p.value),
        stages: preferences.filter(p => p.type === 'stage').map(p => p.value),
        locations: preferences.filter(p => p.type === 'location').map(p => p.value),
      };
      
      setIsSearching(true);
      const result = await getCompanyMatches(criteria);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      setMatchResults(data || []);
      toast.success(`Found ${data?.length || 0} matching companies`);
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
    },
    onError: (error) => {
      toast.error("Failed to find matches", { description: error.message });
    },
    onSettled: () => {
      setIsSearching(false);
    }
  });

  // Handle saving a matched company
  const { mutate: saveMatch } = useMutation({
    mutationFn: async (companyId: string) => {
      const result = await saveCompanyMatch(companyId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Company saved to your matches");
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
    },
    onError: (error) => {
      toast.error("Failed to save company", { description: error.message });
    }
  });

  // Handle removing a preference
  const handleRemovePreference = (type: string, value: string) => {
    setPreferences(preferences.filter(p => !(p.type === type && p.value === value)));
  };

  // Handle adding a preference (simplified - would need a proper dialog in production)
  const handleAddPreference = (type: 'industry' | 'stage' | 'location') => {
    // This is a placeholder - in a real app, you'd show a dialog or input field
    const newValue = prompt(`Add new ${type}`);
    if (newValue && newValue.trim()) {
      setPreferences([...preferences, { type, value: newValue.trim() }]);
    }
  };

  // Get color for preference badge based on type
  const getColorForType = (type: string) => {
    switch (type) {
      case 'industry':
        return 'bg-violet-900 text-violet-100';
      case 'stage':
        return 'bg-blue-900 text-blue-100';
      case 'location':
        return 'bg-green-900 text-green-100';
      default:
        return 'bg-zinc-800 text-zinc-100';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - AI Match */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-start gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Match</h2>
              <p className="text-zinc-400 mt-1">
                Our AI will analyze your investor profile, investment mandate, and preferences to match you with the most promising startups for your portfolio.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <div>
              <label htmlFor="search-criteria" className="block text-sm font-medium text-zinc-300 mb-2">
                Search criteria (optional)
              </label>
              <Input
                id="search-criteria"
                placeholder="e.g., AI, SaaS, sustainable energy"
                className="bg-[#1F2937] border-zinc-700 text-white h-12"
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="additional-notes" className="block text-sm font-medium text-zinc-300 mb-2">
                Additional notes
              </label>
              <Textarea
                id="additional-notes"
                placeholder="Add any specific requirements or preferences..."
                className="bg-[#1F2937] border-zinc-700 text-white min-h-[120px]"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-purple-700 hover:bg-purple-600 text-white py-6 text-lg font-medium"
            onClick={() => findMatches()}
            disabled={isMatchingCompanies}
          >
            {isMatchingCompanies ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Finding Matches...
              </>
            ) : (
              "Find Matching Companies"
            )}
          </Button>
        </div>

        {/* Match Results Section */}
        {(isSearching || matchResults.length > 0) && (
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4">Match Results</h2>
            
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400 mb-4" />
                <p className="text-zinc-400">Finding the best matches for you...</p>
              </div>
            ) : matchResults.length > 0 ? (
              <div className="space-y-6">
                {matchResults.map(company => (
                  <div key={company.id} className="bg-zinc-800/50 rounded-lg p-4 flex gap-4">
                    <div className="w-16 h-16 rounded bg-zinc-700 flex-shrink-0 overflow-hidden">
                      {company.logo_url ? (
                        <img 
                          src={company.logo_url} 
                          alt={`${company.company_name} logo`}
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xl font-bold">
                          {company.company_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-white">{company.company_name}</h3>
                        <span className="px-2 py-1 bg-violet-900/40 text-violet-300 rounded text-xs font-medium">
                          {company.match_score ? `${Math.round(company.match_score)}% match` : 'Match'}
                        </span>
                      </div>
                      
                      {company.web_url && (
                        <a href={company.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
                          {company.web_url.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                      
                      <p className="text-zinc-300 text-sm mt-2 line-clamp-2">
                        {company.short_description}
                      </p>
                      
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-violet-700 text-violet-400 hover:bg-violet-900/30"
                          onClick={() => saveMatch(company.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Save Match
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-400">
                No matches found. Try adjusting your search criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column - Preferences and History */}
      <div className="space-y-6">
        {/* Preferences */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 className="text-xl font-bold text-white mb-4">Your Preferences</h2>
          
          <div className="space-y-6">
            {/* Industries */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Industries</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.filter(p => p.type === 'industry').map((pref, index) => (
                  <Badge key={`industry-${index}`} className={`${getColorForType('industry')} px-3 py-1 flex items-center gap-1`}>
                    {pref.value}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => handleRemovePreference('industry', pref.value)}
                    />
                  </Badge>
                ))}
                <Badge 
                  className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors"
                  onClick={() => handleAddPreference('industry')}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Badge>
              </div>
            </div>

            {/* Stages */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Stages</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.filter(p => p.type === 'stage').map((pref, index) => (
                  <Badge key={`stage-${index}`} className={`${getColorForType('stage')} px-3 py-1 flex items-center gap-1`}>
                    {pref.value}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => handleRemovePreference('stage', pref.value)}
                    />
                  </Badge>
                ))}
                <Badge 
                  className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors"
                  onClick={() => handleAddPreference('stage')}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Badge>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Locations</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.filter(p => p.type === 'location').map((pref, index) => (
                  <Badge key={`location-${index}`} className={`${getColorForType('location')} px-3 py-1 flex items-center gap-1`}>
                    {pref.value}
                    <X 
                      className="h-3.5 w-3.5 ml-1 cursor-pointer" 
                      onClick={() => handleRemovePreference('location', pref.value)}
                    />
                  </Badge>
                ))}
                <Badge 
                  className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors"
                  onClick={() => handleAddPreference('location')}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add
                </Badge>
              </div>
            </div>

            {/* Investment Range */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Investment Range</h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-900/30 text-amber-300 rounded-md font-medium">
                  $500K - $2M
                </span>
                <Button variant="outline" size="sm" className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Match History */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div 
            className="p-6 cursor-pointer flex justify-between items-center"
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          >
            <h2 className="text-xl font-bold text-white">Match History</h2>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              {isHistoryExpanded ? 
                <ChevronDown className="h-5 w-5 text-zinc-400" /> : 
                <ChevronRight className="h-5 w-5 text-zinc-400" />
              }
            </Button>
          </div>
          
          {isHistoryExpanded && (
            <div className="p-6 pt-0 border-t border-zinc-800">
              <p className="text-zinc-400 mb-4">
                Your recent match searches and saved companies will appear here.
              </p>
              
              {isLoadingHistory ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              ) : matchHistory.length > 0 ? (
                <div className="space-y-4">
                  {matchHistory.map((item) => (
                    <div key={item.id} className="bg-zinc-800 rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{item.search_query || "Custom search"}</h3>
                        <span className="text-xs text-zinc-400">{formatDate(item.created_at)}</span>
                      </div>
                      <div className="text-sm text-zinc-400 flex items-center gap-4">
                        <span>{item.results_count} results</span>
                        <span>{item.saved_count} saved</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-zinc-500">
                  No match history found.
                </div>
              )}
              
              {matchHistory.length > 0 && (
                <Button 
                  className="w-full mt-4 bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
                >
                  View Full History
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}