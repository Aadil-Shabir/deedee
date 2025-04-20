"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DealStage {
  name: string;
  color: string;
}

interface Company {
  id: string;
  name: string;
  stage: string;
  match: number;
  industry: string;
  lastActivity: string;
}

const stages: Record<string, DealStage> = {
  "Initial Review": { name: "Initial Review", color: "bg-blue-600" },
  "Discovery": { name: "Discovery", color: "bg-blue-500" },
  "Due Diligence": { name: "Due Diligence", color: "bg-violet-600" },
  "Negotiation": { name: "Negotiation", color: "bg-green-600" },
  "Closed": { name: "Closed", color: "bg-zinc-500" },
};

interface DealPipelineProps {
  companies: Company[];
}

export function DealPipeline({ companies }: DealPipelineProps) {
  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-violet-600";
    if (match >= 80) return "bg-violet-500";
    if (match >= 70) return "bg-blue-600";
    return "bg-blue-500";
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="bg-[#0f1729] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-400">
          Deal Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Company</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Stage</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Match</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Industry</th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                  <td className="py-4 px-4">
                    <span className="font-medium text-white">{company.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${stages[company.stage]?.color || 'bg-gray-500'} text-white`}>
                      {company.stage}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getMatchColor(company.match)} text-white`}>
                      {company.match}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-zinc-300">{company.industry}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-zinc-400">{company.lastActivity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 