"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CompanySwitcher } from "../company-switcher";
import { BasicInfo } from "./basic-info";
import { BusinessDetails } from "./business-details";
import { IndustryInfo } from "./industry-info";
import { StepIndicator } from "@/app/components/ui/step-indicator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useCompanyContext } from "@/context/company-context";

// Define step structure for better type safety
const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Business Details" },
  { id: 3, label: "Industry" }
];

export default function CompanyProfilePage({onComplete}: {onComplete: ()=> void}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const {
    formMode,
    currentStepIndex,
    allUserCompanies,
    isLoading,
    createNewCompany,
    editCompany,
    backToCompanyList,
    setCurrentStepIndex
  } = useCompanyContext();
  
  // Check for URL parameters that might trigger create new company
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      createNewCompany();
      // Clear the URL parameter
      router.replace('/company/profile');
    }
  }, [searchParams, createNewCompany, router]);
  
  // Handle step indicator clicks
  const handleStepClick = (stepId: number) => {
    // Convert from 1-indexed to 0-indexed
    setCurrentStepIndex(stepId - 1);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">Loading company data...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {formMode === 'view' ? (
        <>
          <h1 className="text-3xl font-bold text-zinc-100 mb-6">
            Your Companies
          </h1>
          <CompanySwitcher
            companies={allUserCompanies}
            onCompanySelect={editCompany}
            onCreateNew={createNewCompany}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-zinc-100">
              {formMode === 'create' ? "Create New Company" : "Edit Company"}
            </h1>
            <Button
              variant="outline"
              onClick={backToCompanyList}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </div>

          {/* Steps indicator */}
          <div className="mb-8">
            <StepIndicator
              steps={STEPS}
              currentStep={currentStepIndex + 1} // Convert from 0-indexed to 1-indexed for display
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form steps - Match currentStepIndex (0, 1, 2) to the appropriate form */}
          {currentStepIndex === 0 && <BasicInfo />}
          {currentStepIndex === 1 && <BusinessDetails />}
          {currentStepIndex === 2 && <IndustryInfo />}
        </>
      )}
    </div>
  );
}