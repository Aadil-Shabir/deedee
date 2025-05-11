"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface InvestorType {
  id: string;
  label: string;
}

interface InvestorTypesProps {
  types: InvestorType[];
  selectedTypes: string[];
  onToggle: (type: string) => void;
}

const investorTypes = [
  { id: "self_funded", label: "Self funded" },
  { id: "angel", label: "Angel" },
  { id: "pre_seed", label: "Pre-Seed" },
  { id: "pre_series_a", label: "Pre-Series A" },
  { id: "series_b", label: "Series B" },
  { id: "series_d", label: "Series D" },
  { id: "early_revenue", label: "Early Revenue" },
  { id: "private_equity", label: "Private Equity" },
  { id: "friends_family", label: "Friends & family" },
  { id: "institutional", label: "Institutional Investors" },
  { id: "seed", label: "Seed" },
  { id: "series_a", label: "Series A" },
  { id: "series_c", label: "Series C" },
  { id: "pre_ipo", label: "Pre-IPO" },
  { id: "n_f", label: "N/F" },
];

export function InvestorTypes({
  selectedTypes,
  onToggle,
}: {
  selectedTypes: string[];
  onToggle: (type: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {investorTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox
              id={type.id}
              checked={selectedTypes.includes(type.id)}
              onCheckedChange={() => onToggle(type.id)}
              className="border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor={type.id} className="text-zinc-300 cursor-pointer">
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
} 