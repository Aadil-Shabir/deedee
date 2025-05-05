
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Totals {
  reservations: number;
  investments: number;
}

interface ContactsHeaderProps {
  totals: Totals;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddInvestor: () => void;
  onImport: () => void;
  onSendGroupUpdates: () => void;
  hasSelectedContacts: boolean;
}

export function   ContactsHeader({ 
  totals,
  searchTerm,
  onSearchChange,
  onAddInvestor,
  onImport,
  onSendGroupUpdates,
  hasSelectedContacts
}: ContactsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="text-sm text-pink-500 border border-pink-500/20 px-3 py-1 rounded-full">
          Reservations: ${totals.reservations.toLocaleString()}
        </div>
        <div className="text-sm text-profile-purple border border-profile-purple/20 px-3 py-1 rounded-full">
          Amount Invested: ${totals.investments.toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Input
          type="search"
          placeholder="Search for contacts"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-profile-purple hover:bg-profile-purple/90">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-gray-700">
            <DropdownMenuItem 
              onClick={onAddInvestor}
              className="text-white hover:bg-gray-800 cursor-pointer"
            >
              Add Manual Investor
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onImport}
              className="text-white hover:bg-gray-800 cursor-pointer"
            >
              Import Bulk Investors
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem 
              onClick={onSendGroupUpdates}
              disabled={!hasSelectedContacts}
              className={`${!hasSelectedContacts ? 'text-gray-500 pointer-events-none' : 'text-white hover:bg-gray-800 cursor-pointer'}`}
            >
              Send Group Updates
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
