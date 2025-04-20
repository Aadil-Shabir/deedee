"use client";

import { CheckIcon } from "lucide-react";

export interface PricingTierProps {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

export function PricingTier({
  id,
  title,
  price,
  description,
  features,
  isPopular = false,
  isSelected = false,
  onSelect,
}: PricingTierProps) {
  return (
    <div
      className={`
        relative flex flex-col p-6 bg-zinc-900/60 rounded-2xl backdrop-blur-sm transition-all duration-300
        ${isPopular ? 'border-2 border-violet-500/50 shadow-lg shadow-violet-500/20' : 'border border-zinc-800/50'}
        ${isSelected ? 'ring-2 ring-violet-400 shadow-lg shadow-violet-400/30 transform scale-[1.02]' : 'hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10'}
      `}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg animate-pulse">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm mb-4">{description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{price}</span>
          {price !== "Custom" && <span className="text-zinc-500">/month</span>}
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-zinc-300">
            <span className="text-violet-400 mt-0.5">
              <CheckIcon size={16} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => onSelect(id)}
        className={`
          mt-auto w-full py-2.5 rounded-lg font-medium transition-all
          ${isSelected 
            ? 'bg-violet-600 text-white shadow-md shadow-violet-600/50' 
            : 'bg-zinc-800 text-zinc-300 hover:bg-violet-600/80 hover:text-white hover:shadow-md hover:shadow-violet-600/30'
          }
        `}
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </button>
    </div>
  );
} 