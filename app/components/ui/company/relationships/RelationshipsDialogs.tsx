
// import { VisitDetailsDialog } from "@/components/VisitDetailsDialog";
// import { InvestorDetailsDialog } from "@/components/InvestorDetailsDialog";
// import { AddInvestorDialog } from "@/components/AddInvestorDialog";
// import { ImportContactsDialog } from "@/components/relationships/contacts/ImportContactsDialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { InvestorDetails } from "@/types/investors";
import { Contact } from "@/types/contacts";
import { AddInvestorDialog } from "../../add-investor-dialog";
import { VisitDetailsDialog } from "../../visit-details-dialog";
import { InvestorDetailsDialog } from "../../investor-details-dialog";
// import { AddInvestorDialog } from "../add-investor-dialog";
// import { VisitDetailsDialog } from "../visit-details-dialog";
// import { InvestorDetailsDialog } from "../investor-details-dialog";

interface RelationshipsDialogsProps {
  addInvestorOpen: boolean;
  setAddInvestorOpen: (open: boolean) => void;
  importDialogOpen: boolean;
  setImportDialogOpen: (open: boolean) => void;
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
  onAddInvestor: (investor?: any) => void; // Updated to make the parameter optional
  onFetchTotals?: () => void;
}

export function RelationshipsDialogs({
  addInvestorOpen,
  setAddInvestorOpen,
  importDialogOpen,
  setImportDialogOpen,
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
        onAdd={onAddInvestor}
        selectedContact={selectedContact}
      />

      <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Upload New Investor Contacts</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span>Download sample file here:</span>
              <Button variant="outline" className="border-gray-700">
                Sample CSV File
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">Upload CSV file</p>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setImportDialogOpen(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button className="bg-profile-purple hover:bg-profile-purple/90">
                Upload
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

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
