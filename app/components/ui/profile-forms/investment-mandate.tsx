"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useInvestorMandateQuery, useUpdateInvestorMandate } from "@/hooks/query-hooks/use-investorMandate";

export default function InvestmentMandate() {
  // Form state
  const [dealsPerYear, setDealsPerYear] = useState<string | null>(null);
  const [fundedAmount, setFundedAmount] = useState<string>("");
  const [regions, setRegions] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string | null>(null);
  const [investmentStages, setInvestmentStages] = useState<string[]>([]);
  const [investmentRange, setInvestmentRange] = useState<string | null>(null);
  const [sweetSpot, setSweetSpot] = useState<string>("");
  const [timeToAct, setTimeToAct] = useState<string | null>(null);
  const [anonymity, setAnonymity] = useState<string | null>(null);
  const [dealflowFrequency, setDealflowFrequency] = useState<string | null>(null);
  const [investWithOthers, setInvestWithOthers] = useState<string | null>(null);
  const [investInPreIPOs, setInvestInPreIPOs] = useState<string | null>(null);

  const router = useRouter();

  // TanStack Query hooks
  const { 
    data: mandateData, 
    isLoading, 
    error,
    isError 
  } = useInvestorMandateQuery({
    onError: (error: any) => {
      console.error("Error fetching mandate data:", error);
      toast.error("Error loading investment mandate data. You can still fill out the form.", {
        duration: 5000,
        id: 'mandate-load-error'
      });
    }
  });

  const { mutate: updateMandate, isPending } = useUpdateInvestorMandate();

  // Load existing data if available
  useEffect(() => {
    if (mandateData) {
      // Load main data
      if (mandateData.mainData && typeof mandateData.mainData === 'object') {
        const mainData = mandateData.mainData as Record<string, any>;
        setDealsPerYear(mainData.deal_frequency || null);
        setFundedAmount(mainData.funded_amount?.toString() || "");
        setInvestmentRange(mainData.investment_range || null);
        setSweetSpot(mainData.investment_sweet_spot?.toString() || "");
        setTimeToAct(mainData.investment_speed || null);
        setAnonymity(mainData.anonymity_preference || null);
        setDealflowFrequency(mainData.dealflow_frequency || null);
        setInvestWithOthers(mainData.invest_in_spvs ? "yes" : "no");
        setInvestInPreIPOs(mainData.invest_in_pre_ipos ? "yes" : "no");
      }
      
      // Set business type from the businessTypes array (which is extracted from industries)
      const businessTypes = mandateData.businessTypes || [];
      if (businessTypes.length > 0) {
        setBusinessTypes(businessTypes[0]);
      }
      
      // Load related data
      setRegions(mandateData.regions || []);
      setSectors(mandateData.sectors || []);
      setInvestmentStages(mandateData.stages || []);
    }
  }, [mandateData]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading toast
    toast.loading('Updating investment mandate...', {
      id: 'mandate-updating',
      duration: 3000
    });
    
    // Convert boolean values
    const mainData = {
      deal_frequency: dealsPerYear,
      funded_amount: fundedAmount ? parseFloat(fundedAmount) : null,
      investment_range: investmentRange,
      investment_sweet_spot: sweetSpot ? parseFloat(sweetSpot) : null,
      investment_speed: timeToAct,
      anonymity_preference: anonymity,
      dealflow_frequency: dealflowFrequency,
      invest_in_spvs: investWithOthers === "yes",
      invest_in_pre_ipos: investInPreIPOs === "yes"
    };
    
    // Combine all industries, sectors, and business types together
    const allIndustries = [
      ...sectors,
      ...(businessTypes ? [businessTypes] : []), // Add the selected business type
      ...mandateData?.industries || []
    ];
    
    // Update investment mandate
    updateMandate({ 
      mainData,
      regions,
      industries: allIndustries,
      stages: investmentStages
    }, {
      onSuccess: () => {
        // Navigate to metrics tab
        setTimeout(() => {
          router.push('/investor/profile?tab=metrics');
        }, 1500);
      },
      onSettled: () => {
        // Dismiss loading toast if it's still active
        toast.dismiss('mandate-updating');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Deal Frequency */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">How many deals do you do per year?</h3>
        <RadioGroup
          value={dealsPerYear || ""}
          onValueChange={setDealsPerYear}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="less-than-5" id="less-than-5" className="text-violet-600" />
            <Label htmlFor="less-than-5" className="text-white">Less than 5 deals per year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5-10" id="5-10" className="text-violet-600" />
            <Label htmlFor="5-10" className="text-white">Between 5 & 10 deals per year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10-20" id="10-20" className="text-violet-600" />
            <Label htmlFor="10-20" className="text-white">Between 10 - 20 deals per year</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Investment Amount */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">In the last 24 months I have funded/financed</h3>
        <Input 
          type="text"
          placeholder="Enter amount"
          value={fundedAmount}
          onChange={(e) => setFundedAmount(e.target.value)}
          className="max-w-md bg-zinc-900 border-zinc-700 text-white"
        />
      </div>

      {/* Investment Regions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">In what regions do you invest?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "North America & Canada",
            "South Asia",
            "South East Asia",
            "Europe",
            "South America",
            "Oceania",
            "Mena",
            "Global"
          ].map((region) => (
            <div className="flex items-center space-x-2" key={region}>
              <Checkbox 
                id={region}
                checked={regions.includes(region)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setRegions([...regions, region]);
                  } else {
                    setRegions(regions.filter(r => r !== region));
                  }
                }}
                className="border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600"
              />
              <Label htmlFor={region} className="text-white cursor-pointer">{region}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sectors */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">What are your desired sectors?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["B2B", "B2C", "B2G", "B2B2C"].map((sector) => (
            <div className="flex items-center space-x-2" key={sector}>
              <Checkbox 
                id={sector}
                checked={sectors.includes(sector)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSectors([...sectors, sector]);
                  } else {
                    setSectors(sectors.filter(s => s !== sector));
                  }
                }}
                className="border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600"
              />
              <Label htmlFor={sector} className="text-white cursor-pointer">{sector}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Business Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">What kind of businesses do you prefer to invest in?</h3>
        <RadioGroup
          value={businessTypes || ""}
          onValueChange={setBusinessTypes}
          className="space-y-2"
        >
          {["Startup", "Small Business", "Corporation", "Non-Profit"].map((type) => (
            <div className="flex items-center space-x-2" key={type}>
              <RadioGroupItem value={type} id={type} className="text-violet-600" />
              <Label htmlFor={type} className="text-white">{type}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Business Stage */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">What business stage do you invest in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Concept",
            "Pre-Revenue",
            "Post-Revenue",
            "Break Even",
            "Profitable",
            "Scaling",
            "Early Revenue",
            "Growth",
            "Acquisitions",
            "Seed",
            "Pre-Series A",
            "Series A",
            "Angel",
            "Pre-Seed"
          ].map((stage) => (
            <div className="flex items-center space-x-2" key={stage}>
              <Checkbox 
                id={stage}
                checked={investmentStages.includes(stage)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setInvestmentStages([...investmentStages, stage]);
                  } else {
                    setInvestmentStages(investmentStages.filter(s => s !== stage));
                  }
                }}
                className="border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600"
              />
              <Label htmlFor={stage} className="text-white cursor-pointer">{stage}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Range */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">What is your investment range?</h3>
        <RadioGroup
          value={investmentRange || ""}
          onValueChange={setInvestmentRange}
          className="space-y-2"
        >
          {[
            "Less than $25,000",
            "Between $25,000 - $100,000",
            "Between $100,000 - $500,000",
            "Between $500,000 - $1,000,000",
            "$1,000,000 or more"
          ].map((range) => (
            <div className="flex items-center space-x-2" key={range}>
              <RadioGroupItem value={range} id={range} className="text-violet-600" />
              <Label htmlFor={range} className="text-white">{range}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Sweet Spot */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">What is your sweet spot?</h3>
        <Input 
          type="text"
          placeholder="Enter amount"
          value={sweetSpot}
          onChange={(e) => setSweetSpot(e.target.value)}
          className="max-w-md bg-zinc-900 border-zinc-700 text-white"
        />
      </div>

      {/* Investment Speed */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">How fast can you act on investments?</h3>
        <RadioGroup
          value={timeToAct || ""}
          onValueChange={setTimeToAct}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under-4-weeks" id="under-4-weeks" className="text-violet-600" />
            <Label htmlFor="under-4-weeks" className="text-white">Under 4 weeks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-8-weeks" id="4-8-weeks" className="text-violet-600" />
            <Label htmlFor="4-8-weeks" className="text-white">Within 4 - 8 weeks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="8-12-weeks" id="8-12-weeks" className="text-violet-600" />
            <Label htmlFor="8-12-weeks" className="text-white">Within 8 - 12 weeks</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Anonymity */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">I want to stay anonymous for founders</h3>
        <RadioGroup
          value={anonymity || ""}
          onValueChange={setAnonymity}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="until-match" id="until-match" className="text-violet-600" />
            <Label htmlFor="until-match" className="text-white">Until there is a match between founders and me</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="show-profile" id="show-profile" className="text-violet-600" />
            <Label htmlFor="show-profile" className="text-white">No, show my profile</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Dealflow Frequency */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">I would like to receive dealflow</h3>
        <RadioGroup
          value={dealflowFrequency || ""}
          onValueChange={setDealflowFrequency}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" className="text-violet-600" />
            <Label htmlFor="daily" className="text-white">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" className="text-violet-600" />
            <Label htmlFor="weekly" className="text-white">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bi-weekly" id="bi-weekly" className="text-violet-600" />
            <Label htmlFor="bi-weekly" className="text-white">Bi-Weekly</Label>
          </div>
        </RadioGroup>
      </div>

      {/* SPV Investment */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">I would like to invest alongside other investors in SPVs</h3>
        <RadioGroup
          value={investWithOthers || ""}
          onValueChange={setInvestWithOthers}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="invest-with-others-yes" className="text-violet-600" />
            <Label htmlFor="invest-with-others-yes" className="text-white">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="invest-with-others-no" className="text-violet-600" />
            <Label htmlFor="invest-with-others-no" className="text-white">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Pre-IPO Investment */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">I would like to invest in Pre-IPOs</h3>
        <RadioGroup
          value={investInPreIPOs || ""}
          onValueChange={setInvestInPreIPOs}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="invest-in-pre-ipos-yes" className="text-violet-600" />
            <Label htmlFor="invest-in-pre-ipos-yes" className="text-white">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="invest-in-pre-ipos-no" className="text-violet-600" />
            <Label htmlFor="invest-in-pre-ipos-no" className="text-white">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 px-8"
          onClick={() => router.push('/investor/profile?tab=business')}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-8"
          disabled={isPending}
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
    </form>
  );
}