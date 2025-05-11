// app/components/ui/investor/investor-business.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  useInvestorBusinessQuery, 
  useUpdateInvestorBusiness, 
  useUploadCompanyLogo,
  type InvestorBusinessData 
} from "@/hooks/query-hooks/investor-business";

export default function InvestorBusinessInfo() {
  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  
  const router = useRouter();
  
  // TanStack Query hooks with better error handling
  const { 
    data: businessData, 
    isLoading, 
    error,
    isError
  } = useInvestorBusinessQuery({
    // Don't treat empty data as an error
    onError: (error: any) => {
      console.error("Error fetching business data:", error);
      // Just log the error, don't show error UI
      toast.error("Error loading business data. You can still fill out the form.", {
        duration: 5000,
        id: 'business-load-error'
      });
    }
  });
  
  const { mutate: updateBusiness, isPending } = useUpdateInvestorBusiness();
  const { mutate: uploadLogo, isPending: isUploading } = useUploadCompanyLogo();
  
  // Load existing data if available
  useEffect(() => {
    // Only attempt to populate form if we have valid data
    if (businessData && typeof businessData === 'object') {
      let hasData = false;
      
      // Company name
      if (businessData.company_name) {
        setCompanyName(businessData.company_name);
        hasData = true;
      }
      
      // Company URL
      if (businessData.company_url) {
        setCompanyUrl(businessData.company_url);
        hasData = true;
      }
      
      // Company logo - FIX HERE: was using company_url instead of company_logo_url
      if (businessData.company_logo_url) {
        setCompanyLogo(businessData.company_logo_url);
        setPreviewLogo(businessData.company_logo_url); // Also set the preview
        console.log("Found existing logo:", businessData.company_logo_url);
        hasData = true;
      }
      
      // Country
      if (businessData.country) {
        setCountry(businessData.country);
        hasData = true;
      }
      
      // City
      if (businessData.city) {
        setCity(businessData.city);
        hasData = true;
      }
      
      // Investor category
      if (businessData.investor_category) {
        setCategory(businessData.investor_category);
        hasData = true;
      }
      
      // Track if we found any existing data
      setHasExistingData(hasData);
      
      // Show a welcome back message if we have a company name
      if (businessData.company_name) {
        toast.success(`Welcome back to ${businessData.company_name}`, {
          id: 'welcome-back',
          duration: 3000
        });
      }
    }
  }, [businessData]);
  
  // Handle company logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File size validation
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size too large', {
        description: 'Please select an image under 2MB',
        duration: 5000
      });
      return;
    }
    
    // Show file preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewLogo(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload the logo
    uploadLogo(formData, {
      onSuccess: (url: any) => {
        console.log("Logo uploaded successfully, URL:", url);
        if (url) {
          setCompanyLogo(url);
          
          // IMPORTANT: Immediately update the database with the new logo URL
          // This ensures the URL is saved even if user doesn't click "Next"
          const immediateUpdate: InvestorBusinessData = {
            company_name: companyName,
            company_url: companyUrl,
            company_logo_url: url, // Use the new URL
            country,
            city,
            investor_category: category
          };
          
          // Only update if we have at least a company name
          if (companyName) {
            updateBusiness(immediateUpdate, {
              onSuccess: () => {
                console.log("Company logo URL saved to database:", url);
                toast.success('Company logo updated', {
                  id: 'logo-update-success',
                  duration: 3000
                });
              },
              onError: (error) => {
                console.error("Failed to save logo URL to database:", error);
              }
            });
          }
        }
      },
      onError: (error) => {
        console.error("Logo upload failed:", error);
      }
    });
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!companyName || !country || !city || !category) {
      toast.error('Required fields missing', {
        description: 'Please fill in all required fields',
        duration: 5000
      });
      return;
    }
    
    // Prepare data for update - match database schema exactly
    const businessData: InvestorBusinessData = {
      company_name: companyName,
      company_url: companyUrl,
      company_logo_url: companyLogo,
      country,
      city,
      investor_category: category
    };
    
    // Show loading toast
    toast.loading('Updating business profile...', {
      id: 'business-updating',
      duration: 3000
    });
    
    // Update business profile
    updateBusiness(businessData, {
      onSuccess: () => {
        toast.success('Business profile updated successfully!', {
          id: 'business-update-success',
          duration: 4000
        });
        
        // Navigate to mandate tab after a short delay
        setTimeout(() => {
          router.push('/investor/profile?tab=mandate');
        }, 1500);
      },
      onSettled: () => {
        // Dismiss loading toast if it's still active
        toast.dismiss('business-updating');
      }
    });
  };
  
  // Just show a loading spinner while fetching initial data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }
  
  // Always show the form, whether there's data or not
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Show welcome/intro message only for new users */}
      {!hasExistingData && (
        <div className="mb-8 bg-violet-900/20 border border-violet-800/30 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-1">Complete Your Business Profile</h3>
          <p className="text-gray-300 text-sm">
            Tell us about your company or investment firm to help founders understand who you are.
          </p>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Company Logo Upload */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#1a2234] border border-zinc-700 flex items-center justify-center cursor-pointer">
              {isUploading ? (
                <div className="flex items-center justify-center h-full w-full">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                </div>
              ) : previewLogo ? (
                <img 
                  src={previewLogo} 
                  alt="Company Logo Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.error("Error loading preview image");
                    e.currentTarget.src = "/placeholder-logo.png"; // Fallback image
                  }}
                />
              ) : companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading company logo:", companyLogo);
                    e.currentTarget.src = "/placeholder-logo.png"; // Fallback image
                  }}
                />
              ) : (
                <div className="text-center text-zinc-400 text-sm p-4">
                  Click here to upload your company logo.
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-8">
            {/* Company Name */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="company-name" className="text-white flex items-center gap-2">
                  Company Name <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-[#1F2937] border-zinc-700 text-white"
                placeholder="Enter your company name"
                required
              />
            </div>
            
            {/* Web URL */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="web-url" className="text-white flex items-center gap-2">
                  Web Url <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Input
                id="web-url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className="bg-[#1F2937] border-zinc-700 text-white"
                placeholder="yourcompany.com"
              />
            </div>
          </div>
        </div>
        
        {/* Country */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="country" className="text-white flex items-center gap-2">
              In what country are you located? <Check className="w-5 h-5 text-green-500" />
            </Label>
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country" className="bg-[#1F2937] border-zinc-700 text-white">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="ae">United Arab Emirates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* City */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="city" className="text-white flex items-center gap-2">
              In what city are you living? <Check className="w-5 h-5 text-green-500" />
            </Label>
          </div>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-[#1F2937] border-zinc-700 text-white"
            placeholder="Enter your city"
            required
          />
        </div>
        
        {/* Category */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="category" className="text-white flex items-center gap-2">
              I&apos;m categorizing myself as <Check className="w-5 h-5 text-green-500" />
            </Label>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="bg-[#1F2937] border-zinc-700 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
              <SelectItem value="vc">Venture Capital</SelectItem>
              <SelectItem value="angel">Angel Investor</SelectItem>
              <SelectItem value="pe">Private Equity</SelectItem>
              <SelectItem value="corporate">Corporate Investor</SelectItem>
              <SelectItem value="family">Family Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            className="bg-[#1F2937] border-zinc-700 text-white hover:bg-[#2D3748] px-8"
            onClick={() => router.push('/investor/profile?tab=profile')}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
            disabled={isPending || isUploading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}