"use client";

import { Slider } from "@/components/ui/slider";

interface PaymentProgressProps {
  value: number;
  onChange: (value: number) => void;
}

export function PaymentProgress({ value, onChange }: PaymentProgressProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Slider
          defaultValue={[value]}
          max={100}
          step={1}
          onValueChange={(values) => onChange(values[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-primary font-medium">
        <span>{value}%</span>
        <span>{100 - value}%</span>
      </div>
    </div>
  );
} 