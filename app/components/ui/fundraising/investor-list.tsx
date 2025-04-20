"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddInvestorForm } from "./add-investor-form";

interface Investor {
  id: string;
  name: string;
  company: string;
  email: string;
  type: string;
  amount: string;
}

interface InvestorListProps {
  investors: Investor[];
  onAddInvestor: (investor: Omit<Investor, "id">) => void;
}

export function InvestorList({ investors = [], onAddInvestor }: InvestorListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddInvestor = (investor: Omit<Investor, "id">) => {
    onAddInvestor(investor);
    setIsDialogOpen(false);
  };

  const filteredInvestors = investors.filter(
    (investor) =>
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-zinc-100">Your Investors</h3>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Investor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search for investors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700"
        />
      </div>

      {filteredInvestors.length > 0 ? (
        <div className="space-y-2">
          {filteredInvestors.map((investor) => (
            <div
              key={investor.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-zinc-200">{investor.name}</h4>
                  <p className="text-sm text-zinc-400">{investor.company}</p>
                  <p className="text-sm text-zinc-400">{investor.email}</p>
                </div>
                <div className="text-right">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs">
                    {investor.type}
                  </span>
                  <p className="text-sm text-zinc-200 mt-1">${investor.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-zinc-400">No investors found</p>
          <p className="text-sm text-zinc-500 mt-1">
            Can not find your investor? <button className="text-primary" onClick={() => setIsDialogOpen(true)}>Add your investor manually</button>
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Add Investor/Firm Manually</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Add a new investor to your pipeline, contacts, and database.
            </DialogDescription>
          </DialogHeader>
          <AddInvestorForm onSubmit={handleAddInvestor} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 