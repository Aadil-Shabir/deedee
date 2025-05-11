import { useState, useEffect } from "react";
// import { ProfileLink } from "../promote/profile-link";
// import { PricingTiers } from "../promote/pricing-tiers";
// import { PremiumServices } from "../promote/premium-services";
import { useCompanyContext } from "@/context/company-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileLink } from "../company/promote/profile-link";
import { PricingTiers } from "../company/promote/pricing-tiers";
import { PremiumServices } from "../company/promote/premium-services";

export function PromoteForm({onComplete}: {onComplete: ()=> void}) {
  const [isLoading, setIsLoading] = useState(true);
  const { allUserCompanies, activeCompanyId } = useCompanyContext();

  // Check if company data is loaded
  const companyDataLoaded = Boolean(allUserCompanies?.length && activeCompanyId);

  // Add effect to ensure we're not showing loading state indefinitely
  useEffect(() => {
    // If company data is loaded, we can potentially set loading to false earlier
    if (companyDataLoaded) {
      setIsLoading(false);
      return;
    }
    if (onComplete) {
        onComplete();
      }
    // Fallback timeout to ensure we don't show loading forever
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [companyDataLoaded]);

  // If we're still loading and don't have company data yet, show a skeleton UI
  if (isLoading && !companyDataLoaded) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
        Promote Your Company
      </h1>
      <p className="text-zinc-300">Expand your reach and connect with the right investors to accelerate your funding journey.</p>

      {/* Profile Link Section */}
      <ProfileLink isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* Promotion Tiers Section */}
      <PricingTiers />
      
      {/* Premium Services Section */}
      <PremiumServices />
    </div>
  );
}
