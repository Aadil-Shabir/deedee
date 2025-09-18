'use client'

import { Button } from "@/components/ui/button";
import { useCompanyContext } from "@/context/company-context";
import { HandHeart, TrendingUp, Users } from "lucide-react";

interface PurposeSelectionProps {
  onNext?: () => void;
}

const purposes = [
  {
    id: "acquisition",
    title: "Acquisition",
    description: "Looking to be acquired by a strategic partner",
    icon: HandHeart,
    color: "text-blue-500"
  },
  {
    id: "fundraising", 
    title: "Fundraising",
    description: "Seeking investment to scale and grow",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    id: "both",
    title: "Both",
    description: "Open to either acquisition or fundraising opportunities",
    icon: Users,
    color: "text-purple-500"
  }
];

export function PurposeSelection({ onNext }: PurposeSelectionProps = {}) {
  const { 
    purpose,
    setPurpose,
    nextStep
  } = useCompanyContext();

  const handlePurposeSelect = (selectedPurpose: string) => {
    setPurpose(selectedPurpose);
  };

  const handleNext = () => {
    if (!purpose) return;
    
    if (onNext) {
      onNext();
    } else {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">
          What&apos;s your purpose?
        </h2>
        <p className="text-zinc-400 mb-8">
          Help us understand your goals so we can better match you with the right opportunities.
        </p>

        <div className="grid gap-6">
          {purposes.map((purposeOption) => {
            const Icon = purposeOption.icon;
            const isSelected = purpose === purposeOption.id;
            
            return (
              <div
                key={purposeOption.id}
                className={`
                  relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800/70'
                  }
                `}
                onClick={() => handlePurposeSelect(purposeOption.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-primary/20' : 'bg-zinc-700/50'}
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : purposeOption.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-primary' : 'text-zinc-100'}`}>
                      {purposeOption.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {purposeOption.description}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90"
          disabled={!purpose}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}