import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useCompanyContext } from "@/context/company-context";

interface ProfileLinkProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileLink({ isLoading, setIsLoading }: ProfileLinkProps) {
  const { user } = useUser();
  const { activeCompanyId, allUserCompanies } = useCompanyContext();
  const [profileLink, setProfileLink] = useState("https://deedee.ai/company/...");
  
  // Use company data from context instead of making separate database call
  useEffect(() => {
    const generateProfileLink = () => {
      try {
        setIsLoading(true);
        
        // Find active company from context
        const activeCompany = allUserCompanies?.find(company => company.id === activeCompanyId);
        
        if (activeCompany && activeCompany.company_name) {
          // Format company name for URL (replace spaces with dashes, remove special chars)
          const formattedName = activeCompany.company_name
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase();
            
          // Generate profile link
          setProfileLink(`https://deedee.ai/company/${formattedName}`);
        } else {
          // Fallback if company data isn't available
          setProfileLink("https://deedee.ai/company/profile");
        }
      } catch (error) {
        console.error("Error generating profile link:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Generate profile link if we have company data
    if (allUserCompanies?.length && activeCompanyId) {
      generateProfileLink();
    } else {
      // If no company data, stop loading state
      setIsLoading(false);
    }
  }, [activeCompanyId, allUserCompanies, setIsLoading]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    toast.success("Link copied to clipboard!");
  };
  
  const handleVisitProfile = () => {
    window.open(profileLink, "_blank");
  };

  // Get company name for display
  const activeCompany = allUserCompanies?.find(company => company.id === activeCompanyId);
  const companyName = activeCompany?.company_name || "Your Company";

  return (
    <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/80 rounded-xl p-6 shadow-lg border border-zinc-700/40">
      <h2 className="text-xl font-semibold mb-4">
        Here is your DeeDee profile link for {" "}
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          {companyName}
        </span>
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-zinc-800/90 rounded-lg p-3 font-mono text-sm border border-zinc-700/60">
          {isLoading ? "Loading..." : profileLink}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 transition-colors"
          onClick={handleCopyLink}
          disabled={isLoading}
        >
          <Copy className="h-4 w-4 text-violet-300" />
        </Button>
      </div>
      <Button
        className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200 flex items-center gap-2 px-6"
        onClick={handleVisitProfile}
        disabled={isLoading}
      >
        <ExternalLink className="h-4 w-4" />
        Visit Profile
      </Button>
    </div>
  );
}
