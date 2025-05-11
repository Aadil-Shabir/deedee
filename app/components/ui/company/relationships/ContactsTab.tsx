'use client'
import { useState, useEffect, useCallback } from "react";
import { Contact } from "@/types/contacts";
// import { useAuth } from "@/components/AuthProvider";
import { ContactsHeader } from "./contacts/ContactsHeader";
import { ContactsTable } from "./contacts/ContactsTable";
import { DeleteContactDialog } from "./contacts/DeleteContactDialog";
import { ImportContactsDialog } from "./contacts/ImportContactsDialog";
import { useContactsState } from "./contacts/useContactsState";
import { ContactsFilter } from "./contacts/ContactsFilter";
import { SendGroupUpdatesDialog } from "./contacts/SendGroupUpdatesDialog";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

interface ContactsTabProps {
  contacts: Contact[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddInvestor: () => void;
  onImport: () => void;
  onEditContact?: (contact: Contact) => void;
  onContactUpdated?: () => void;
}

export function ContactsTab({ 
  contacts, 
  searchTerm, 
  onSearchChange, 
  onAddInvestor, 
  onImport,
  onEditContact,
  onContactUpdated
}: ContactsTabProps) {
  // const navigate = useRouter();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [sendUpdatesDialogOpen, setSendUpdatesDialogOpen] = useState(false);
  const { user } = useUser();

  const {
    selectedContact,
    setSelectedContact,
    deleteDialogOpen,
    setDeleteDialogOpen,
    totals,
    sortConfig,
    filteredAndSortedContacts,
    fetchTotals,
    handleSort,
    handleDelete,
    handleChangeToLost,
    selectedContacts,
    setSelectedContacts,
  } = useContactsState(contacts);

  const { filteredContacts } = ContactsFilter({ 
    contacts: filteredAndSortedContacts, 
    searchTerm 
  });

  // Improved dependency tracking for useEffect
  useEffect(() => {
    if (user && contacts.length > 0) {
      fetchTotals();
    }
  }, [contacts, fetchTotals, user]);

  // Memoized callback for handling contact updates
  const handleContactUpdate = useCallback(() => {
    if (onContactUpdated) {
      console.log("Refreshing contacts after update");
      onContactUpdated();
    }
    fetchTotals();
  }, [onContactUpdated, fetchTotals]);

  const handleEditContact = useCallback((contact: Contact) => {
    console.log("Edit contact:", contact);
    if (onEditContact) {
      onEditContact(contact);
    } else {
      onAddInvestor();
    }
  }, [onEditContact, onAddInvestor]);

  const handleDeleteComplete = async () => {
    await handleDelete();
    handleContactUpdate();
  };

  const handleChangeToLostComplete = async () => {
    await handleChangeToLost();
    handleContactUpdate();
  };

  const handleSendGroupUpdates = () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one investor to send updates to");
      return;
    }
    setSendUpdatesDialogOpen(true);
  };

  const handleSendUpdatesComplete = () => {
    // Reset selections after sending updates
    setSelectedContacts([]);
    setSendUpdatesDialogOpen(false);
    toast.success("Updates sent successfully");
    handleContactUpdate();
  };

  return (
    <div className="space-y-4">
      <ContactsHeader
        totals={totals}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAddInvestor={onAddInvestor}
        onImport={() => setImportDialogOpen(true)}
        onSendGroupUpdates={handleSendGroupUpdates}
        hasSelectedContacts={selectedContacts.length > 0}
      />

      <ContactsTable
        contacts={filteredContacts}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEditClick={handleEditContact}
        onDeleteClick={(contact) => {
          setSelectedContact(contact);
          setDeleteDialogOpen(true);
        }}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
      />

      <DeleteContactDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteComplete}
        onChangeToLost={handleChangeToLostComplete}
      />

      <ImportContactsDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={handleContactUpdate}
      />

      <SendGroupUpdatesDialog 
        open={sendUpdatesDialogOpen}
        onOpenChange={setSendUpdatesDialogOpen}
        selectedContacts={selectedContacts.map(id => 
          contacts.find(contact => contact.id === id)
        ).filter(Boolean) as Contact[]}
        onSend={handleSendUpdatesComplete}
      />
    </div>
  );
}
