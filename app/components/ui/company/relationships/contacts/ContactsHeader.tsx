'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload } from "lucide-react";
import { InvestorImportDialog } from "../../../investor-import-dialog";

interface Totals {
  reservations: number;
  investments: number;
}

interface ContactsHeaderProps {
  totals: Totals;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddInvestor: () => void;
  onImportSuccess?: (summary: { imported: number; skipped?: number; failed: number }) => void;
}

export function ContactsHeader({
  totals,
  searchTerm,
  onSearchChange,
  onAddInvestor,
  onImportSuccess,
}: ContactsHeaderProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:items-center">
        {/* Totals */}
        <div className="flex flex-wrap gap-2">
          <div className="text-sm text-pink-500 border border-pink-500/20 px-3 py-1 rounded-full">
            Reservations: ${totals.reservations.toLocaleString()}
          </div>
          <div className="text-sm text-profile-purple border border-profile-purple/20 px-3 py-1 rounded-full">
            Amount Invested: ${totals.investments.toLocaleString()}
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setImportDialogOpen(true)}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>

            <Button
              onClick={onAddInvestor}
              className="bg-primary hover:bg-profile-purple/90 w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Investor
            </Button>
          </div>
        </div>
      </div>

      <InvestorImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImportSuccess={onImportSuccess}
      />
    </>
  );
}
