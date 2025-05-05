'use client';
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PageVisit } from "@/types/visits";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useVisitDetails } from "../relationships/hooks/useVisitDetails";
import { useInvestorsData } from "../relationships/hooks/useInvestorsData";
import { RelationshipsTabs } from "../relationships/RelationshipsTabs";
import { PitchTrackerTab } from "../relationships/PitchTrackerTab";
import { ContactsTab } from "../relationships/ContactsTab";
import { ProfileVisitsTab } from "../relationships/ProfileVisitsTab";
import { RelationshipsDialogs } from "../relationships/RelationshipsDialogs";

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
      captable: 1
    }
  }
];

export default function Relationships() {
  const { user } = useUser();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("pitchtracker");
  const [mode, setMode] = useState("fan");
  const [searchTerm, setSearchTerm] = useState("");
  const [addInvestorOpen, setAddInvestorOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>(defaultPageVisits);
  
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
    refreshData
  } = useInvestorsData(user);

  const handleChatClick = (contact: any) => {
    navigate.push('/pulse');
  };

  const handleEmailClick = (contact: any) => {
    navigate.push('/pulse');
  };

  const handleContactUpdated = () => {
    console.log("Contact updated, refreshing data");
    refreshData();
  };

  return (
    <div className="min-h-screen w-full bg-[#0F111A] text-white">
      <div className="container mx-auto px-4 py-6">
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
              onImport={() => setImportDialogOpen(true)}
              onEditContact={(contact) => {
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
            // Refresh data when dialog closes, in case changes were made
            refreshData();
          }
        }}
        importDialogOpen={importDialogOpen}
        setImportDialogOpen={setImportDialogOpen}
        visitDetails={visitDetails}
        setVisitDetails={setVisitDetails}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedInvestor={selectedInvestor}
        selectedContact={selectedContact}
        onAddInvestor={(investor) => {
          if (investor) {
            handleAddInvestor(investor);
          }
          refreshData(); // Ensure UI is refreshed after adding
        }}
      />
    </div>
  );
}
