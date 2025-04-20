"use client";

import { useState, useEffect } from "react";
import { BasicInfo } from "@/app/components/ui/business-forms/basic-info";
import { BusinessDetails } from "@/app/components/ui/business-forms/business-details";
import { IndustryInfo } from "@/app/components/ui/business-forms/industry-info";
import { StepIndicator } from "@/app/components/ui/step-indicator";
import { ProfileTabs } from "@/app/components/ui/profile-tabs";
import ProfileInfo from "@/app/components/ui/profile-forms/profile-info";
import { TeamInfo } from "@/app/components/ui/profile-forms/team-info";
import { FundraisingInfo } from "@/app/components/ui/profile-forms/fundraising-info";
import { TractionInfo } from "@/app/components/ui/profile-forms/traction-info";
import { StackInfo } from "@/app/components/ui/profile-forms/stack-info";
import { ProfileLink } from "@/app/components/ui/promote/profile-link";
import { PricingPlans } from "@/app/components/ui/promote/pricing-plans";
import { FastTrack } from "@/app/components/ui/promote/fast-track";
import { InvestmentReport } from "@/app/components/ui/reports/investment-report";
import { ReviewsSection } from "@/app/components/ui/reviews/reviews-section";
import { InvestorMatch } from "@/app/components/ui/match/investor-match";

const steps = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Business Details" },
  { id: 3, label: "Industry Information" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentStep, setCurrentStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the URL has a hash for tab navigation
    if (window.location.hash) {
      const tabId = window.location.hash.replace('#', '');
      const validTabs = ["profile", "business", "team", "fundraising", "traction", "stack", "promote", "reports", "reviews", "match"];
      if (validTabs.includes(tabId)) {
        setActiveTab(tabId);
      }
    }
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleComplete = () => {
    // Here you would typically save all the form data
    console.log("Form completed");
  };

  // Define tabs that use special styling
  const specialTabs = ['promote', 'reports', 'reviews', 'match'];

  // Render the promote section with the modular components matching the screenshots
  const renderPromoteSection = () => {
    if (!mounted) return null;
    
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <ProfileLink />
        <PricingPlans />
        <FastTrack />
      </div>
    );
  };

  // Render the reports section with the investment report component
  const renderReportsSection = () => {
    if (!mounted) return null;
    
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <InvestmentReport />
      </div>
    );
  };

  // Render the reviews section
  const renderReviewsSection = () => {
    if (!mounted) return null;
    
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <ReviewsSection />
      </div>
    );
  };

  // Render the match section
  const renderMatchSection = () => {
    if (!mounted) return null;
    
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <InvestorMatch />
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${specialTabs.includes(activeTab) ? 'min-h-screen bg-zinc-900 p-0' : 'min-h-full'}`}>
      {/* Tab Navigation */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      {activeTab === 'promote' ? (
        <div className="w-full">
          {renderPromoteSection()}
        </div>
      ) : activeTab === 'reports' ? (
        <div className="w-full">
          {renderReportsSection()}
        </div>
      ) : activeTab === 'reviews' ? (
        <div className="w-full">
          {renderReviewsSection()}
        </div>
      ) : activeTab === 'match' ? (
        <div className="w-full">
          {renderMatchSection()}
        </div>
      ) : (
        <div className="flex-1 py-8 px-6">
          {activeTab === "profile" ? (
            <ProfileInfo />
          ) : activeTab === "business" ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">Business Details</h1>
              </div>

              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />

              <div className="mt-8">
                {currentStep === 1 && <BasicInfo onNext={handleNext} />}
                {currentStep === 2 && (
                  <BusinessDetails onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 3 && (
                  <IndustryInfo onSubmit={handleComplete} onBack={handleBack} />
                )}
              </div>
            </div>
          ) : activeTab === "team" ? (
            <TeamInfo />
          ) : activeTab === "fundraising" ? (
            <FundraisingInfo />
          ) : activeTab === "traction" ? (
            <TractionInfo />
          ) : activeTab === "stack" ? (
            <StackInfo />
          ) : (
            <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
              <p className="text-zinc-400 text-lg">This section is under development</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 