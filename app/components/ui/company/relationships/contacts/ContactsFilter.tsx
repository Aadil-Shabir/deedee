import { Contact } from "@/types/contacts";
import { useMemo } from "react";

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
      return contact; // Return unchanged contact if no semicolons
    });

    // Filter by search term if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (contact) =>
          (contact.full_name && contact.full_name.toLowerCase().includes(term)) ||
          (contact.email && contact.email.toLowerCase().includes(term)) ||
          (contact.company_name && contact.company_name.toLowerCase().includes(term)) ||
          (contact.investor_type && contact.investor_type.toLowerCase().includes(term))
      );
    }

    return result;
  }, [contacts, searchTerm]);

  return { filteredContacts };
}
