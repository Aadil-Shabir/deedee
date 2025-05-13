import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building, Mail, Phone, ExternalLink, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactsListProps {
  contacts: any[];
  onContactSelect: (contact: any) => void;
}

export function ContactsList({ contacts, onContactSelect }: ContactsListProps) {
  // If no contacts, show empty state
  if (!contacts || contacts.length === 0) {
    return (
      <Card className="bg-[#1A1D29] border-gray-800 text-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Investor Contacts</CardTitle>
          <CardDescription className="text-gray-400">
            No investor contacts found.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-gray-800 p-3">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-300">No contacts yet</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              When you add investor contacts, they will appear here. Click the Add Investor button to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show contacts table
  return (
    <div className="rounded-md border border-gray-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800/30">
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="text-gray-400">Investor</TableHead>
            <TableHead className="text-gray-400">Contact Info</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-right text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow 
              key={contact.id || contact.email} 
              className="border-gray-800 hover:bg-gray-800/30 cursor-pointer"
              onClick={() => onContactSelect(contact)}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {contact.name || contact.full_name || "Unnamed Contact"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {contact.company || contact.company_name || "No company"}
                  </span>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-xs">
                    <Mail className="h-3 w-3 mr-1.5 text-gray-500" />
                    <span className="text-gray-300">{contact.email || "No email"}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center text-xs">
                      <Phone className="h-3 w-3 mr-1.5 text-gray-500" />
                      <span className="text-gray-300">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="text-xs border-profile-purple text-profile-purple">
                  {contact.investor_type || contact.type || "Unknown"}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge 
                  className={`
                    text-xs ${getStatusStyles(contact.stage || contact.status || "Discovery")}
                  `}
                >
                  {contact.stage || contact.status || "Discovery"}
                </Badge>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-1">
                  {contact.linkedin_url && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" asChild>
                      <a 
                        href={contact.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContactSelect(contact);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function to get status badge styles
function getStatusStyles(status: string): string {
  const statusMap: Record<string, string> = {
    "Discovery": "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "Outreach": "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    "Pitch": "bg-amber-500/10 border-amber-500/20 text-amber-400",
    "Due Diligence": "bg-violet-500/10 border-violet-500/20 text-violet-400", 
    "Negotiation": "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    "Closed": "bg-green-500/10 border-green-500/20 text-green-400",
    "Lost": "bg-gray-500/10 border-gray-500/20 text-gray-400"
  };

  return statusMap[status] || "bg-gray-500/10 border-gray-500/20 text-gray-400";
}