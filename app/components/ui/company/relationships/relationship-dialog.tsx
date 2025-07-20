import { InvestorDetails } from "@/types/investors";
import { Contact } from "@/types/contacts";
import { InvestorDetailsDialog } from "../../investor-details-dialog";
import { VisitDetailsDialog } from "../../visit-details-dialog";
import { AddInvestorDialog } from "../../add-investor-dialog";
import { InvestorFormData } from "@/types/investor-form"; // Add this import

interface RelationshipsDialogsProps {
  addInvestorOpen: boolean;
  setAddInvestorOpen: (open: boolean) => void;
  visitDetails: {
    open: boolean;
    investorName: string;
    company: string;
    pageName: string;
    visits: any[];
  };
  setVisitDetails: (details: any) => void;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
  selectedInvestor: InvestorDetails | null;
  selectedContact: Contact | null;
  onAddInvestor: (investor: InvestorFormData) => void; // Changed to InvestorFormData
  onFetchTotals?: () => void;
}

export function RelationshipsDialogs({
  addInvestorOpen,
  setAddInvestorOpen,
  visitDetails,
  setVisitDetails,
  detailsOpen,
  setDetailsOpen,
  selectedInvestor,
  selectedContact,
  onAddInvestor,
  onFetchTotals
}: RelationshipsDialogsProps) {
  return (
    <>
      <AddInvestorDialog
        open={addInvestorOpen}
        onOpenChange={setAddInvestorOpen}
        onAdd={(investor: InvestorFormData) => {
          // Call onAddInvestor with the investor data
          onAddInvestor(investor);
          
          // Refresh totals if the function exists
          if (onFetchTotals) {
            setTimeout(() => {
              onFetchTotals();
            }, 100);
          }
        }}
        selectedContact={selectedContact}
      />

      <VisitDetailsDialog
        open={visitDetails.open}
        onOpenChange={(open) => setVisitDetails({ ...visitDetails, open })}
        investorName={visitDetails.investorName}
        company={visitDetails.company}
        pageName={visitDetails.pageName}
        visits={visitDetails.visits}
      />

      <InvestorDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        investor={selectedInvestor}
      />
    </>
  );
}