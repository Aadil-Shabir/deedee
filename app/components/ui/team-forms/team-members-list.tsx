"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Mail, X } from "lucide-react";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  email?: string;
  linkedinUrl?: string;
  isFounder?: boolean;
}

interface TeamMembersListProps {
  members: TeamMember[];
  onDelete: (id: string) => void;
}

export function TeamMembersList({ members, onDelete }: TeamMembersListProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(members.length / itemsPerPage));
  
  // Get current page items
  const currentMembers = members.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );
  
  // Handle pagination
  const nextPage = () => setPage(Math.min(page + 1, totalPages));
  const prevPage = () => setPage(Math.max(page - 1, 1));
  
  if (members.length === 0) {
    return (
      <div className="py-6 text-center text-zinc-400 border border-dashed border-zinc-700 rounded-lg">
        No team members added yet
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {currentMembers.map((member) => (
          <div
            key={member.id}
            className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 relative"
          >
            <button
              type="button"
              onClick={() => onDelete(member.id)}
              className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="space-y-2">
              <div>
                <h3 className="font-medium text-zinc-200">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-zinc-400">{member.function}</p>
              </div>
              
              {member.isFounder && (
                <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
                  Founder
                </span>
              )}
              
              {member.email && (
                <div className="flex items-center text-sm text-zinc-400">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={prevPage}
            disabled={page === 1}
            className="h-8 w-8 p-0 border-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-zinc-400">
            {page} / {totalPages}
          </span>
          
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={nextPage}
            disabled={page === totalPages}
            className="h-8 w-8 p-0 border-zinc-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}