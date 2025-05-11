
import React from "react";
import { PageVisit } from "@/types/visits";
import { ProfileVisitsTableRow } from "./ProfileVisitsTableRow";

interface ProfileVisitsTableProps {
  pageVisits: PageVisit[];
  onVisitClick: (
    investorName: string,
    company: string,
    pageName: string,
    visitCount: number
  ) => void;
}

export const ProfileVisitsTable = ({ 
  pageVisits, 
  onVisitClick 
}: ProfileVisitsTableProps) => {
  if (pageVisits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No profile visits recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            {[
              { id: 'investor', label: 'Investor', align: 'left' },
              { id: 'company', label: 'Company', align: 'left' },
              { id: 'stage', label: 'Stage', align: 'left' },
              { id: 'score', label: 'Score', align: 'center' },
              { id: 'overview', label: 'Overview', align: 'center' },
              { id: 'dealSummary', label: 'Deal Summary', align: 'center' },
              { id: 'reviews', label: 'Reviews', align: 'center' },
              { id: 'questions', label: 'Questions', align: 'center' },
              { id: 'updates', label: 'Updates', align: 'center' },
              { id: 'dataRoom', label: 'Data Room', align: 'center' },
              { id: 'capTable', label: 'Cap Table', align: 'center' },
            ].map((header) => (
              <th 
                key={header.id} 
                className={`px-4 py-3 text-${header.align} text-gray-400 font-medium`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageVisits.map((visit) => (
            <ProfileVisitsTableRow 
              key={visit.id} 
              visit={visit} 
              onVisitClick={onVisitClick} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
