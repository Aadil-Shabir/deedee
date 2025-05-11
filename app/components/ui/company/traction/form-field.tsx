"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  helpText?: string;
  isCompleted?: boolean;
}

export function FormField({
  id,
  label,
  children,
  helpText,
  isCompleted = false,
}: FormFieldProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-lg font-medium text-zinc-100">
            {label}
          </Label>
          {isCompleted && (
            <div className="bg-green-900/30 w-6 h-6 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
      </div>
      {helpText && <p className="text-sm text-zinc-500 mb-3">{helpText}</p>}
      {children}
    </div>
  );
}

interface RecurringRevenueProps {
  hasRecurring: boolean;
  onToggle: (value: boolean) => void;
}

export function RecurringRevenueToggle({ hasRecurring, onToggle }: RecurringRevenueProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="recurring-yes"
          checked={hasRecurring}
          onChange={() => onToggle(true)}
          className="h-4 w-4 text-primary"
        />
        <label htmlFor="recurring-yes" className="text-zinc-300">
          Yes
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="recurring-no"
          checked={!hasRecurring}
          onChange={() => onToggle(false)}
          className="h-4 w-4 text-primary"
        />
        <label htmlFor="recurring-no" className="text-zinc-300">
          No
        </label>
      </div>
    </div>
  );
} 