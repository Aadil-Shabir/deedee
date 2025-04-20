import React from 'react';
import { Button } from "@/components/ui/button";
import { Target } from 'lucide-react';

export function InvestorMatch() {
  return (
    <div className="w-full py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Investor Match</h1>
        
        <Button className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 px-8 py-6">
          <Target className="h-5 w-5" />
          <span>Find Matches</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-zinc-400">
            Complete your profile to get matched with investors that are interested in your startup.
          </p>
        </div>
      </div>
    </div>
  );
} 