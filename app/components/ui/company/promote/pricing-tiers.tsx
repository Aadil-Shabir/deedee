
import { PricingTier, PricingTierProps } from "./pricing-tier";

export function PricingTiers() {
  const tiers: (PricingTierProps & { isHighlighted?: boolean })[] = [
    {
      name: "Starter",
      price: "$99/month",
      subtitle: "Basic Access for Beginners",
      description: "For founders who want to test the waters but will need more traction to secure funding.",
      features: [
        "Max outreach 150 p/m",
        "DeeDee profile Verification Badge",
        "Basic profile visibility",
        "Limited investor matching (only within their category)",
        "Standard analytics (views, clicks, and basic engagement)",
        "Email support"
      ],
      negativeFeatures: [
        "No direct investor outreach",
        "No priority placement in investor dashboards",
        "No personalized promotion"
      ]
    },
    {
      name: "Founder+",
      price: "$199/month",
      subtitle: "Fast-Track to Investor Matching",
      description: "For founders serious about funding who need priority matching and hands-on support.",
      features: [
        "Max outreach 250 p/m",
        "DeeDee Profile Verification Badge",
        "Enhanced profile visibility",
        "Priority investor matching (Access to a wider, more engaged investor pool)",
        "Advanced analytics dashboard (Investor activity insights)",
        "Priority email & chat support",
        "Monthly strategy call with an investor specialist",
        "Included in DeeDee's Investor Newsletter for wider exposure"
      ],
      negativeFeatures: [
        "No warm investor introductions",
        "No dedicated outreach campaign",
        "No VIP investor matching"
      ],
      isHighlighted: true
    },
    {
      name: "Dealmaker",
      price: "$499/month",
      subtitle: "The Fast-Track Funding Engine 🚀",
      description: "For founders who want to raise money ASAP and get maximum exposure to investors.",
      features: [
        "Max Outreach unlimited",
        "DeeDee Profile Verification Badge",
        "Maximum profile visibility (Top of investor dashboards)",
        "VIP investor matching",
        "Real-time analytics & insights (Who's viewing, engaging, and interested)",
        "24/7 dedicated support (Direct response team for fundraising)",
        "Weekly strategy calls (Investor outreach planning)",
        "Custom marketing campaign (Social media & PR push to highlight their deal)",
        "Featured listing position (Top placements in DeeDee's investor marketplace)",
        "Optional Warm introductions to DeeDee's network of investors 4%",
        "Personalized email outreach campaign to targeted investors"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">3 Ways to Promote Your Deal</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <PricingTier
            key={tier.name}
            name={tier.name}
            price={tier.price}
            subtitle={tier.subtitle}
            description={tier.description}
            features={tier.features}
            negativeFeatures={tier.negativeFeatures}
            isHighlighted={tier.isHighlighted}
          />
        ))}
      </div>
    </div>
  );
}
