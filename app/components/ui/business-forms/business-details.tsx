"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyContext } from "@/context/company-context";

interface BusinessDetailsProps {
  onNext?: () => void;
  onBack?: () => void;
}

export function BusinessDetails({ onNext, onBack }: BusinessDetailsProps = {}) {
  const { 
    // State getters
    isLoading,
    isSubmitting,
    formMode,
    
    // Business details
    headquarters,
    incorporationDate,
    businessType,
    salesType,
    businessStage,
    businessModel,
    
    // Setters
    setHeadquarters,
    setIncorporationDate,
    setBusinessType,
    setSalesType,
    setBusinessStage,
    setBusinessModel,
    
    // Actions
    submitBusinessDetails,
    nextStep,
    previousStep
  } = useCompanyContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitBusinessDetails();
    if (success) {
      if (onNext) {
        onNext();
      } else {
        nextStep();
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      previousStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isLoading && formMode === 'edit' ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-zinc-400">Loading business details...</div>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Business Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Headquarters Location
                </label>
                <Select value={headquarters} onValueChange={setHeadquarters}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Countries</SelectLabel>
                      <div className="px-3 pb-2">
                        <input
                          className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-zinc-700"
                          placeholder="Search country..."
                          onChange={(e) => {
                            const input = e.target as HTMLInputElement;
                            const searchBox = input.closest(".select-content");
                            const items = searchBox?.querySelectorAll(".select-item");
                            items?.forEach((item) => {
                              if (
                                item.textContent
                                  ?.toLowerCase()
                                  .includes(input.value.toLowerCase())
                              ) {
                                item.classList.remove("hidden");
                              } else {
                                item.classList.add("hidden");
                              }
                            });
                          }}
                        />
                      </div>
                      <SelectItem value="af">Afghanistan</SelectItem>
                      <SelectItem value="al">Albania</SelectItem>
                      <SelectItem value="dz">Algeria</SelectItem>
                      {/* ...other countries... */}
                      <SelectItem value="gb">United Kingdom</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="vn">Vietnam</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Incorporation Date
                </label>
                <Input
                  type="date"
                  value={incorporationDate}
                  onChange={(e) => setIncorporationDate(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Business Type
                </label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Small Business", "Service Based Startup", "Startup", "Enterprise"].map((type, index) => (
                      <SelectItem value={type} key={index}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Sales Type
                </label>
                <Select value={salesType} onValueChange={setSalesType}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select sales type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b2c">B2C (Business to Consumer)</SelectItem>
                    <SelectItem value="b2b">B2B (Business to Business)</SelectItem>
                    <SelectItem value="both">Both B2B & B2C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Business Stage
                </label>
                <Select value={businessStage} onValueChange={setBusinessStage}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Idea/Prototype", "BreakEven", "Profitable", "Scaling"].map((type, index) => (
                      <SelectItem value={type} key={index}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-200">
                  Business Model
                </label>
                <Select value={businessModel} onValueChange={setBusinessModel}>
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Select business model" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Real Estate", "MarketPlace", "Franchise", "Off-line Retail", "Service based business", "Consulting", "E-commerce"].map((type, index) => (
                      <SelectItem value={type} key={index}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}