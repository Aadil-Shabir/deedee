"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface RevenueInputProps {
  values: { [key: string]: string };
  onChange: (key: string, value: string) => void;
}

export function RevenueInput({ values, onChange }: RevenueInputProps) {
  const periods = [
    { key: "thisMonth", label: "This Month <$>" },
    { key: "lastMonth", label: "Last Month <$>" },
    { key: "priorMonth", label: "Prior to last Month <$>" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {periods.map((period) => (
          <div key={period.key} className="space-y-2">
            <Label htmlFor={period.key} className="text-zinc-300">
              {period.label}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
                $
              </div>
              <Input
                id={period.key}
                type="text"
                value={values[period.key] || ""}
                onChange={(e) => onChange(period.key, e.target.value)}
                className="pl-8 bg-zinc-800/50 border-zinc-700 focus:border-primary"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientsInput({ values, onChange }: RevenueInputProps) {
  const periods = [
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "priorMonth", label: "Prior to last Month" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {periods.map((period) => (
          <div key={period.key} className="space-y-2">
            <Label htmlFor={`clients-${period.key}`} className="text-zinc-300">
              {period.label}
            </Label>
            <Input
              id={`clients-${period.key}`}
              type="text"
              value={values[period.key] || ""}
              onChange={(e) => onChange(period.key, e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 focus:border-primary"
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface MetricInputProps {
  value: string;
  onChange: (value: string) => void;
  id: string;
  isCompleted?: boolean;
}

export function MetricInput({ value, onChange, id, isCompleted = false }: MetricInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {isCompleted && (
          <div className="ml-2 bg-green-900/30 w-5 h-5 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-green-500" />
          </div>
        )}
      </div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
          $
        </div>
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 bg-zinc-800/50 border-zinc-700 focus:border-primary"
          placeholder="0"
        />
      </div>
    </div>
  );
}

export function PercentMetricInput({ value, onChange, id, isCompleted = false }: MetricInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {isCompleted && (
          <div className="ml-2 bg-green-900/30 w-5 h-5 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-green-500" />
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-8 bg-zinc-800/50 border-zinc-700 focus:border-primary"
          placeholder="0"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
          %
        </div>
      </div>
    </div>
  );
} 