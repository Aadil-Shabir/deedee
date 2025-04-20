"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  children?: ReactNode;
  helpText?: string;
  isCompleted?: boolean;
  fullWidth?: boolean;
}

export function FormField({
  id,
  label,
  children,
  helpText,
  isCompleted = false,
  fullWidth = true,
}: FormFieldProps) {
  return (
    <div className={`mb-6 ${fullWidth ? "w-full" : ""}`}>
      <div className="flex items-center mb-2">
        <Label htmlFor={id} className="font-medium text-zinc-100">
          {label}
        </Label>
        {isCompleted && (
          <div className="ml-2 bg-green-900/30 w-6 h-6 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {helpText && <p className="text-xs text-zinc-500 mb-2">{helpText}</p>}
      {children}
    </div>
  );
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "",
  required = false,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
        $
      </div>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="pl-8 bg-zinc-800/50 border-zinc-700 focus:border-primary"
      />
    </div>
  );
}

export function PercentageInput({
  value,
  onChange,
  placeholder = "",
  required = false,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="pr-8 bg-zinc-800/50 border-zinc-700 focus:border-primary"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
        %
      </div>
    </div>
  );
} 