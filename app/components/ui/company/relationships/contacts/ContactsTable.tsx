
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact } from "@/types/contact";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactsTableProps {
  contacts: Contact[];
  onEditClick: (contact: Contact) => void;
  onDeleteClick: (contact: Contact) => void;
  onSort: (key: keyof Contact) => void;
  sortConfig: {
    key: keyof Contact | null;
    direction: 'asc' | 'desc';
  };
  selectedContacts: string[];
  setSelectedContacts: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ContactsTable({ 
  contacts, 
  onEditClick, 
  onDeleteClick, 
  onSort,
  sortConfig,
  selectedContacts,
  setSelectedContacts
}: ContactsTableProps) {
  const handleCheckboxChange = (contactId: string) => {
    setSelectedContacts((prev: string[]) => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const getSortIcon = (key: keyof Contact) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getSortDirection = (key: keyof Contact) => {
    if (sortConfig.key !== key) return 'text-gray-400';
    return 'text-white font-medium';
  };

  return (
    <div className="overflow-x-auto rounded-md border border-gray-800 mt-4">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-800 text-gray-300">
          <tr>
            <th className="px-4 py-3 w-10">
              <Checkbox 
                checked={contacts.length > 0 && selectedContacts.length === contacts.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedContacts(contacts.map(contact => contact.id));
                  } else {
                    setSelectedContacts([]);
                  }
                }}
              />
            </th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => onSort('full_name')}
            >
              <span className={getSortDirection('full_name')}>
                Full Name{getSortIcon('full_name')}
              </span>
            </th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => onSort('investor_type')}
            >
              <span className={getSortDirection('investor_type')}>
                Investor Type{getSortIcon('investor_type')}
              </span>
            </th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => onSort('company_name')}
            >
              <span className={getSortDirection('company_name')}>
                Company{getSortIcon('company_name')}
              </span>
            </th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => onSort('email')}
            >
              <span className={getSortDirection('email')}>
                Email{getSortIcon('email')}
              </span>
            </th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => onSort('stage')}
            >
              <span className={getSortDirection('stage')}>
                Stage{getSortIcon('stage')}
              </span>
            </th>
            <th className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr className="bg-gray-900 border-b border-gray-800">
              <td colSpan={7} className="px-4 py-4 text-center text-gray-400">
                No contacts found
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800">
                <td className="px-4 py-3 w-10">
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)} 
                    onCheckedChange={() => handleCheckboxChange(contact.id)}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {contact.full_name || 'Unknown'}
                </td>
                <td className="px-4 py-3">
                  {contact.investor_type || 'Not specified'}
                </td>
                <td className="px-4 py-3">
                  {contact.company_name || 'Not specified'}
                </td>
                <td className="px-4 py-3">
                  {contact.email || 'Not specified'}
                </td>
                <td className="px-4 py-3">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      contact.stage === 'Investor' ? 'bg-green-900/30 text-green-400' :
                      contact.stage === 'Analysis' ? 'bg-blue-900/30 text-blue-400' :
                      contact.stage === 'Discovery' ? 'bg-yellow-900/30 text-yellow-400' :
                      contact.stage === 'Pitch' ? 'bg-purple-900/30 text-purple-400' :
                      contact.stage === 'Lost' ? 'bg-red-900/30 text-red-400' :
                      'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {contact.stage || 'Not set'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => onEditClick(contact)}
                        className="text-white hover:bg-gray-800 cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteClick(contact)}
                        className="text-red-500 hover:bg-gray-800 cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
