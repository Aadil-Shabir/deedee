"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Plus, ChevronRight, ChevronDown } from "lucide-react";

interface MatchPreference {
  type: 'industry' | 'stage' | 'location';
  value: string;
}

interface MatchHistoryItem {
  id: string;
  date: string;
  query: string;
  results: number;
  saved: number;
}

export function MatchContent() {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([
    {
      id: "1",
      date: "June 15, 2023",
      query: "AI, SaaS, Fintech",
      results: 24,
      saved: 3
    },
    {
      id: "2",
      date: "May 28, 2023",
      query: "Cleantech, Sustainable Energy",
      results: 12,
      saved: 2
    },
    {
      id: "3",
      date: "April 10, 2023",
      query: "Healthcare, BioTech",
      results: 18,
      saved: 5
    }
  ]);

  const preferences: MatchPreference[] = [
    { type: 'industry', value: 'Software' },
    { type: 'industry', value: 'Health Tech' },
    { type: 'industry', value: 'Fintech' },
    { type: 'stage', value: 'Seed' },
    { type: 'stage', value: 'Series A' },
    { type: 'location', value: 'San Francisco' },
    { type: 'location', value: 'New York' },
    { type: 'location', value: 'Remote' }
  ];

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
              />
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white py-6 text-lg font-medium"
          >
            Find Matching Companies
          </Button>
        </div>
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
                    <X className="h-3.5 w-3.5 ml-1 cursor-pointer" />
                  </Badge>
                ))}
                <Badge className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors">
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
                    <X className="h-3.5 w-3.5 ml-1 cursor-pointer" />
                  </Badge>
                ))}
                <Badge className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors">
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
                    <X className="h-3.5 w-3.5 ml-1 cursor-pointer" />
                  </Badge>
                ))}
                <Badge className="bg-transparent border border-dashed border-zinc-700 text-zinc-400 px-3 py-1 flex items-center cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-colors">
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
              
              <div className="space-y-4">
                {matchHistory.map((item) => (
                  <div key={item.id} className="bg-zinc-800 rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{item.query}</h3>
                      <span className="text-xs text-zinc-400">{item.date}</span>
                    </div>
                    <div className="text-sm text-zinc-400 flex items-center gap-4">
                      <span>{item.results} results</span>
                      <span>{item.saved} saved</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4 bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
              >
                View History
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 