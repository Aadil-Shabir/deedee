"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioOptionsProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioOptions({ options, value, onChange, name }: RadioOptionsProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="flex flex-col space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-zinc-300 cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
} 