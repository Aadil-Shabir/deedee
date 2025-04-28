import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export interface TierFeature {
  text: string;
  isPositive: boolean;
}

export interface PricingTierProps {
  name: string;
  price: string;
  subtitle?: string;
  description?: string;
  features: string[];
  negativeFeatures?: string[];
  isHighlighted?: boolean;
}

export function PricingTier({
  name,
  price,
  subtitle,
  description,
  features,
  negativeFeatures,
  isHighlighted = false,
}: PricingTierProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b ${
        isHighlighted 
          ? 'from-violet-900/30 to-zinc-900/90 shadow-xl' 
          : 'from-zinc-800/50 to-zinc-900/90'
      } rounded-xl p-6 backdrop-blur-sm border ${
        isHighlighted ? "border-violet-500/50" : "border-zinc-700/40"
      } transition-all hover:shadow-lg hover:scale-[1.01] duration-200`}
    >
      {isHighlighted && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold py-1 px-3 transform rotate-0 origin-top-right">
          POPULAR
        </div>
      )}
      
      <div className="text-xl font-bold mb-1">{name}</div>
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300 mb-2">
        {price}
      </div>
      
      {subtitle && (
        <div className="text-sm font-semibold text-violet-300 mb-3">
          {subtitle}
        </div>
      )}
      
      {description && (
        <div className="text-sm text-zinc-300 mb-4 pb-4 border-b border-zinc-700/40">
          💡 {description}
        </div>
      )}
      
      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <span className="text-emerald-400 mt-0.5">
              <Check className="h-4 w-4" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
        {negativeFeatures && negativeFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="text-red-500 mt-0.5">
              <X className="h-4 w-4" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        className={`w-full ${
          isHighlighted 
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md"
            : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60"
        } transition-all duration-200`}
      >
        Select Plan
      </Button>
    </div>
  );
}
