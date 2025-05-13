'use client'

import { useEffect, useCallback } from "react";
import { Contact } from "@/types/contacts";
import { useUser } from "@/hooks/use-user";
import { useContactsState } from "./useContactsState";
import { ContactsFilter } from "./ContactsFilter";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsTable } from "./ContactsTable";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface ContactsTabProps {
  contacts: Contact[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditContact?: (contact: Contact) => void;
  onContactUpdated?: () => void;
  onAddInvestor: () => void; // Added this prop to match ContactsHeader
}

export function ContactsTab({ 
  contacts, 
  searchTerm, 
  onSearchChange, 
  onEditContact,
  onContactUpdated,
  onAddInvestor // Added to match expected prop
}: ContactsTabProps) {
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

  // Use the filteredContacts from ContactsFilter component
  const filteredContactsResult = ContactsFilter({ 
    contacts: filteredAndSortedContacts, 
    searchTerm 
  });
  
  // Extract filteredContacts from the result (ensuring it has the correct type)
  const filteredContacts = Array.isArray(filteredContactsResult.filteredContacts) 
    ? filteredContactsResult.filteredContacts 
    : [];

  // Fetch totals when contacts change
  useEffect(() => {
    if (user && contacts.length > 0) {
      fetchTotals();
    }
  }, [contacts, fetchTotals, user]);

  // Handle contact update
  const handleContactUpdate = useCallback(() => {
    if (onContactUpdated) {
      onContactUpdated();
    }
    fetchTotals();
  }, [onContactUpdated, fetchTotals]);

  // Handle editing a contact
  const handleEditContact = useCallback((contact: Contact) => {
    if (onEditContact) {
      onEditContact(contact);
    }
  }, [onEditContact]);

  // Handle deleting a contact
  const handleDeleteComplete = async () => {
    await handleDelete();
    handleContactUpdate();
  };

  // Handle changing contact status to lost
  const handleChangeToLostComplete = async () => {
    await handleChangeToLost();
    handleContactUpdate();
  };

  return (
    <div className="space-y-4">
      <ContactsHeader
        totals={totals}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAddInvestor={onAddInvestor} // Pass through the prop
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
    </div>
  );
}
