
import React from "react";
import { PageVisit } from "@/types/visits";

interface ProfileVisitsTableRowProps {
  visit: PageVisit;
  onVisitClick: (
    investorName: string,
    company: string,
    pageName: string,
    visitCount: number
  ) => void;
}

export const ProfileVisitsTableRow = ({ 
  visit, 
  onVisitClick 
}: ProfileVisitsTableRowProps) => {
  return (
    <tr
      key={visit.id}
      className="border-b border-gray-800 hover:bg-gray-900/50"
    >
      <td className="px-4 py-3 text-white">{visit.investorName}</td>
      <td className="px-4 py-3 text-white">{visit.company}</td>
      <td className="px-4 py-3 text-white">{visit.stage}</td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
              visit.score > 75
                ? "bg-green-500"
                : visit.score > 50
                ? "bg-yellow-500"
                : visit.score > 25
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
          >
            {visit.score}
          </div>
        </div>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Overview",
            visit.visits.overview
          )
        }
      >
        <span
          className={
            visit.visits.overview > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.overview}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Deal Summary",
            visit.visits.dealSummary
          )
        }
      >
        <span
          className={
            visit.visits.dealSummary > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.dealSummary}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Reviews",
            visit.visits.reviews
          )
        }
      >
        <span
          className={
            visit.visits.reviews > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.reviews}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Questions",
            visit.visits.questions
          )
        }
      >
        <span
          className={
            visit.visits.questions > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.questions}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Updates",
            visit.visits.updates
          )
        }
      >
        <span
          className={
            visit.visits.updates > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.updates}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Data Room",
            visit.visits.dataRoom
          )
        }
      >
        <span
          className={
            visit.visits.dataRoom > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.dataRoom}
        </span>
      </td>
      <td
        className="px-4 py-3 text-center cursor-pointer hover:underline"
        onClick={() =>
          onVisitClick(
            visit.investorName,
            visit.company,
            "Cap Table",
            visit.visits.captable
          )
        }
      >
        <span
          className={
            visit.visits.captable > 0
              ? "text-profile-purple font-medium"
              : "text-gray-500"
          }
        >
          {visit.visits.captable}
        </span>
      </td>
    </tr>
  );
};
