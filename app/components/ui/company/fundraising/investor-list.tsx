"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, User, Building } from "lucide-react";
import { AddInvestorDialog } from "../../add-investor-dialog";

interface InvestorProps {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  type?: string;
  stage?: string;
  amount?: string;
  isInvestment?: boolean;
  country?: string;
  city?: string;
}

interface InvestorListProps {
  investors: InvestorProps[];
  onAddInvestor: (investor: any) => void;
  onDeleteInvestor?: (investorId: string) => void;
  onFetchTotals?: () => void;
}

export function InvestorList({ 
  investors, 
  onAddInvestor, 
  onDeleteInvestor,
  onFetchTotals
}: InvestorListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleDelete = (investorId: string) => {
    if (onDeleteInvestor) {
      onDeleteInvestor(investorId);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-zinc-200">
            {investors.length > 0
              ? `${investors.length} investor${investors.length !== 1 ? "s" : ""} listed`
              : "No investors listed yet"}
          </h3>
          <Button
            onClick={handleOpenDialog}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-zinc-700 hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Add Investor
          </Button>
        </div>

        {investors.length > 0 && (
          <div className="grid gap-3">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary">
                    {investor.type === "company" ? (
                      <Building className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">
                      {investor.firstName} {investor.lastName}
                    </h4>
                    <div className="flex text-xs text-zinc-400">
                      {investor.company && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none">
                          {investor.company}
                        </span>
                      )}
                      {investor.amount && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none text-primary">
                          ${parseInt(investor.amount).toLocaleString()}
                        </span>
                      )}
                      {investor.stage && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none">
                          {investor.stage} stage
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {onDeleteInvestor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(investor.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Use the AddInvestorDialog component */}
      <AddInvestorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={(investor) => {
          // Call the provided onAddInvestor callback
          onAddInvestor(investor);
          
          // Refresh totals if needed
          if (onFetchTotals) {
            setTimeout(onFetchTotals, 100);
          }
        }}
        selectedContact={null} // No contact selected by default
      />
    </>
  );
}