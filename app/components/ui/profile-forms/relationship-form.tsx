'use client';
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PageVisit } from "@/types/visits";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useVisitDetails } from "../company/relationships/hooks/useVisitDetails";
import { useInvestorsData } from "../company/relationships/hooks/useInvestorsData";
import { RelationshipsTabs } from "../company/relationships/RelationshipsTabs";
import { PitchTrackerTab } from "../company/relationships/PitchTrackerTab";
import { ContactsTab } from "../company/relationships/contacts/ContactsTab";
import { ProfileVisitsTab } from "../company/relationships/ProfileVisitsTab";
import { ContactsHeader } from "../company/relationships/contacts/ContactsHeader";
import { RelationshipsDialogs } from "../company/relationships/relationship-dialog";
import { toast } from "sonner";
import { Contact } from "@/types/contact";
import { Investor, InvestorDetails } from "@/types/investors";

// Update the import summary interface to include skipped
interface ImportSummary {
  imported: number;
  failed: number;
  skipped?: number; // Make it optional for backward compatibility
}

const stages = [
  { id: "interested", label: "Interested", count: 1 },
  { id: "discovery", label: "Discovery", count: 1 },
  { id: "pitch", label: "Pitch", count: 0 },
  { id: "analysis", label: "Analysis", count: 3 },
  { id: "investor", label: "Investor", count: 2 },
  { id: "lost", label: "Lost", count: 2 },
];

const defaultPageVisits: PageVisit[] = [
  {
    id: "1",
    investorName: "John Doe",
    company: "Acme Inc",
    stage: "Discovery",
    score: 85,
    visits: {
      overview: 5,
      dealSummary: 3,
      reviews: 2,
      questions: 1,
      updates: 4,
      dataRoom: 2,
      captable: 1,
    },
  },
];

export default function Relationships() {
  const { user } = useUser();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("pitchtracker");
  const [mode, setMode] = useState("fan");
  const [searchTerm, setSearchTerm] = useState("");
  const [addInvestorOpen, setAddInvestorOpen] = useState(false);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>(defaultPageVisits);
  const [totals, setTotals] = useState({ reservations: 0, investments: 0 });

  const { visitDetails, setVisitDetails, handleVisitClick } = useVisitDetails();

  const {
    investors,
    contacts,
    selectedInvestor,
    detailsOpen,
    setDetailsOpen,
    selectedContact,
    setSelectedContact,
    handleAddInvestor,
    handleDragEnd,
    handleCardClick,
    handleEditContact,
    refreshData,
    fetchInvestors // This is now properly typed
  } = useInvestorsData(user);
  
  const fetchTotals = () => {
    // Implement totals fetching logic here
    console.log("Fetching totals");
    // This is a placeholder - you should implement actual logic to fetch totals
  };

  const handleContactUpdated = () => {
    console.log("Contact updated, refreshing data");
    refreshData();
  };

  const handleImportSuccess = (summary: ImportSummary) => {
    fetchTotals();
    fetchInvestors();
    
    // Create a detailed message
    let message = `Successfully imported ${summary.imported} investors.`;
    
    // Check if skipped property exists and is greater than 0
    if (summary.skipped && summary.skipped > 0) {
      message += ` ${summary.skipped} duplicate${summary.skipped !== 1 ? 's' : ''} skipped.`;
    }
    
    if (summary.failed > 0) {
      message += ` ${summary.failed} record${summary.failed !== 1 ? 's' : ''} failed to import.`;
    }
    
    // Display toast with appropriate status
    if (summary.failed > 0) {
      toast.info(message);
    } else if (summary.skipped && summary.skipped > 0) {
      toast.info(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F111A] text-white">
      <div className="container mx-auto px-4 py-6">
        <ContactsHeader
          totals={totals}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddInvestor={() => setAddInvestorOpen(true)}
          onImportSuccess={handleImportSuccess}
        />

        <RelationshipsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
          onModeChange={setMode}
        >
          <TabsContent value="pitchtracker">
            <PitchTrackerTab
              investors={investors}
              stages={stages}
              onDragEnd={handleDragEnd}
              onCardClick={handleCardClick}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab
              contacts={contacts}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddInvestor={() => {
                setSelectedContact(null);
                setAddInvestorOpen(true);
              }}
              onEditContact={(contact: Contact) => { // Properly typed parameter
                handleEditContact(contact);
                setAddInvestorOpen(true);
              }}
              onContactUpdated={handleContactUpdated}
            />
          </TabsContent>

          <TabsContent value="profile-visits">
            <ProfileVisitsTab
              pageVisits={pageVisits}
              onVisitClick={handleVisitClick}
            />
          </TabsContent>
        </RelationshipsTabs>
      </div>

      <RelationshipsDialogs
        addInvestorOpen={addInvestorOpen}
        setAddInvestorOpen={(open) => {
          setAddInvestorOpen(open);
          if (!open) {
            refreshData();
          }
        }}
        visitDetails={visitDetails}
        setVisitDetails={setVisitDetails}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedInvestor={selectedInvestor}
        selectedContact={selectedContact}
        onAddInvestor={(investor: InvestorDetails) => { // Properly typed parameter
          if (investor) {
            handleAddInvestor(investor);
          }
          refreshData();
        }}
        onFetchTotals={fetchTotals}
      />
    </div>
  );
}
