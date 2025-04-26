"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  helpText?: string;
  isCompleted?: boolean;
};

export function FormField({
  id,
  label,
  children,
  helpText,
  isCompleted = false,
}: FormFieldProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-2">
        <div className="space-y-1">
          <Label htmlFor={id} className="text-zinc-200">
            {label}
          </Label>
          {helpText && <p className="text-xs text-zinc-400">{helpText}</p>}
        </div>
        
        <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
          isCompleted 
            ? "bg-primary/20 border-primary" 
            : "bg-transparent border-zinc-700"
        }`}>
          {isCompleted && <Check className="h-4 w-4 text-primary" />}
        </div>
      </div>
      {children}
    </div>
  );
}

// Currency Input Component
interface CurrencyInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencyInput({ id, value, onChange, placeholder }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and commas
    const newValue = e.target.value.replace(/[^\d,]/g, "");
    onChange(newValue);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-zinc-400">$</span>
      </div>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-8 bg-zinc-800/50 border-zinc-700"
      />
    </div>
  );
}

// Percentage Input Component
interface PercentageInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PercentageInput({
  id,
  value,
  onChange,
  placeholder,
}: PercentageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, decimal point, and limit to 2 decimal places
    const val = e.target.value.replace(/[^\d.]/g, "");
    const parts = val.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      onChange(parts.join("."));
    } else {
      onChange(val);
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-8 bg-zinc-800/50 border-zinc-700"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-zinc-400">%</span>
      </div>
    </div>
  );
}