import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

export function InvestmentReport() {
  return (
    <div className="w-full py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Investment Report</h1>
        
        <Button className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 px-5 py-6">
          <FileText className="h-5 w-5" />
          <span>Generate Investment Report</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-zinc-400">No reports generated yet. Click Generate Investment Report to create your first report.</p>
      </div>
    </div>
  );
} 