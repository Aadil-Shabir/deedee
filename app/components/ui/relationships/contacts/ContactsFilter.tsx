
import { Contact } from "@/types/contact";
import { useMemo } from "react";
// import { Contact } from "@/types/contacts";

interface ContactsFilterProps {
  contacts: Contact[];
  searchTerm: string;
}

export function ContactsFilter({ contacts, searchTerm }: ContactsFilterProps) {
  const filteredContacts = useMemo(() => {
    // Use all contacts instead of filtering out investor_type contacts
    let result = [...contacts];

    // Clear out any full_name field that contains semicolons (incorrect investor data)
    result = result.map(contact => {
      if (contact.full_name && contact.full_name.includes(';')) {
        return {
          ...contact,
          full_name: '', // Clear the full name field to start fresh
          // We're keeping the company_name as is
        };
      }
      return contact;
    });

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(contact => 
        contact.company_name?.toLowerCase().includes(searchLower) ||
        contact.full_name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.stage?.toLowerCase().includes(searchLower) ||
        contact.hq_geography?.toLowerCase().includes(searchLower) ||
        contact.investor_type?.toLowerCase().includes(searchLower) ||
        contact.notes?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [contacts, searchTerm]);

  return { filteredContacts };
}
