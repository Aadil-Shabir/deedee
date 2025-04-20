"use client";

import { useState } from "react";
import { ProfileLinkCard } from "./profile-link-card";
import { PricingTier, Feature } from "./pricing-tier";

const freeTierFeatures: Feature[] = [
  { text: "Public profile", included: true },
  { text: "Basic analytics", included: true },
  { text: "Profile customization", included: false },
  { text: "Featured listing", included: false },
  { text: "Priority support", included: false },
];

const proTierFeatures: Feature[] = [
  { text: "Public profile", included: true },
  { text: "Advanced analytics", included: true },
  { text: "Profile customization", included: true },
  { text: "Featured listing", included: true },
  { text: "Priority support", included: true },
];

export function PromoteSection() {
  const [selectedTier, setSelectedTier] = useState<"free" | "pro">("free");
  const profileUrl = "https://example.com/profile/johndoe"; // This would come from actual user data

  const handleSelectTier = (tier: "free" | "pro") => {
    setSelectedTier(tier);
  };

  return (
    <div className="space-y-8 animate-slideIn">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
          Promote Your Profile
        </h2>
        <p className="text-zinc-400 mt-2">
          Share your profile or upgrade to enhance your visibility.
        </p>
      </div>

      <ProfileLinkCard profileUrl={profileUrl} />

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-zinc-100 mb-6">
          Choose Your Visibility Plan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingTier
            name="Free"
            price="$0"
            description="Basic profile visibility to get you started"
            features={freeTierFeatures}
            isActive={selectedTier === "free"}
            onSelect={() => handleSelectTier("free")}
          />
          
          <PricingTier
            name="Pro"
            price="$19/month"
            description="Enhanced visibility for maximum exposure"
            highlightText="Most Popular"
            features={proTierFeatures}
            isActive={selectedTier === "pro"}
            onSelect={() => handleSelectTier("pro")}
          />
        </div>
      </div>
    </div>
  );
} 