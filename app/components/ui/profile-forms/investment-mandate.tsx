"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function InvestmentMandate() {
  // State for form values
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

  // Helper function to toggle a value in an array
  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  return (
    <div className="space-y-8">
      {/* How many deals per year */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">How many deals do you do per year?</h3>
        <RadioGroup value={dealsPerYear || ""} onValueChange={setDealsPerYear} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="less-than-5" 
              id="less-than-5" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="less-than-5" className="text-white cursor-pointer">Less than 5 deals per year</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="between-5-10" 
              id="between-5-10" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="between-5-10" className="text-white cursor-pointer">Between 5 & 10 deals per year</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="between-10-20" 
              id="between-10-20" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="between-10-20" className="text-white cursor-pointer">Between 10 - 20 deals per year</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Amount funded/financed */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">In the last 24 months I&apos;ve funded/financed</h3>
        <Input
          value={fundedAmount}
          onChange={(e) => setFundedAmount(e.target.value)}
          placeholder="Enter amount"
          className="bg-zinc-900 border-zinc-700 text-white h-11 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-violet-500 transition-colors"
        />
      </div>

      {/* Regions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">In what regions do you invest?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="north-america" 
              checked={regions.includes("north-america")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "north-america"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="north-america" className="text-white cursor-pointer">North America & Canada</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="south-asia" 
              checked={regions.includes("south-asia")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "south-asia"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="south-asia" className="text-white cursor-pointer">South Asia</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="south-east-asia" 
              checked={regions.includes("south-east-asia")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "south-east-asia"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="south-east-asia" className="text-white cursor-pointer">South East Asia</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="europe" 
              checked={regions.includes("europe")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "europe"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="europe" className="text-white cursor-pointer">Europe</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="south-america" 
              checked={regions.includes("south-america")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "south-america"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="south-america" className="text-white cursor-pointer">South America</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="oceania" 
              checked={regions.includes("oceania")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "oceania"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="oceania" className="text-white cursor-pointer">Oceania</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="mena" 
              checked={regions.includes("mena")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "mena"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="mena" className="text-white cursor-pointer">Mena</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="global" 
              checked={regions.includes("global")}
              onCheckedChange={() => setRegions(toggleArrayValue(regions, "global"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="global" className="text-white cursor-pointer">Global</Label>
          </div>
        </div>
      </div>
      
      {/* Sectors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What are your desired sectors?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="b2b" 
              checked={sectors.includes("b2b")}
              onCheckedChange={() => setSectors(toggleArrayValue(sectors, "b2b"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="b2b" className="text-white cursor-pointer">B2B</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="b2c" 
              checked={sectors.includes("b2c")}
              onCheckedChange={() => setSectors(toggleArrayValue(sectors, "b2c"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="b2c" className="text-white cursor-pointer">B2C</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="b2g" 
              checked={sectors.includes("b2g")}
              onCheckedChange={() => setSectors(toggleArrayValue(sectors, "b2g"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="b2g" className="text-white cursor-pointer">B2G</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="b2b2c" 
              checked={sectors.includes("b2b2c")}
              onCheckedChange={() => setSectors(toggleArrayValue(sectors, "b2b2c"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="b2b2c" className="text-white cursor-pointer">B2B2C</Label>
          </div>
        </div>
      </div>

      {/* Business Types */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What kind of businesses do you prefer to invest in?</h3>
        <RadioGroup value={businessTypes || ""} onValueChange={setBusinessTypes} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="startup" 
              id="startup" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="startup" className="text-white cursor-pointer">Startup</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="small-business" 
              id="small-business" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="small-business" className="text-white cursor-pointer">Small Business</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="corporation" 
              id="corporation" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="corporation" className="text-white cursor-pointer">Corporation</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="non-profit" 
              id="non-profit" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="non-profit" className="text-white cursor-pointer">Non-Profit</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Investment Stages */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What business stage do you invest in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="concept" 
              checked={investmentStages.includes("concept")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "concept"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="concept" className="text-white cursor-pointer">Concept</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="pre-revenue" 
              checked={investmentStages.includes("pre-revenue")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "pre-revenue"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="pre-revenue" className="text-white cursor-pointer">Pre-Revenue</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="post-revenue" 
              checked={investmentStages.includes("post-revenue")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "post-revenue"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="post-revenue" className="text-white cursor-pointer">Post-Revenue</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="break-even" 
              checked={investmentStages.includes("break-even")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "break-even"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="break-even" className="text-white cursor-pointer">Break Even</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="profitable" 
              checked={investmentStages.includes("profitable")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "profitable"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="profitable" className="text-white cursor-pointer">Profitable</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="scaling" 
              checked={investmentStages.includes("scaling")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "scaling"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="scaling" className="text-white cursor-pointer">Scaling</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="early-revenue" 
              checked={investmentStages.includes("early-revenue")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "early-revenue"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="early-revenue" className="text-white cursor-pointer">Early Revenue</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="growth" 
              checked={investmentStages.includes("growth")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "growth"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="growth" className="text-white cursor-pointer">Growth</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="acquisitions" 
              checked={investmentStages.includes("acquisitions")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "acquisitions"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="acquisitions" className="text-white cursor-pointer">Acquisitions</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="seed" 
              checked={investmentStages.includes("seed")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "seed"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="seed" className="text-white cursor-pointer">Seed</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="pre-series-a" 
              checked={investmentStages.includes("pre-series-a")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "pre-series-a"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="pre-series-a" className="text-white cursor-pointer">Pre-Series A</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="series-a" 
              checked={investmentStages.includes("series-a")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "series-a"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="series-a" className="text-white cursor-pointer">Series A</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="angel" 
              checked={investmentStages.includes("angel")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "angel"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="angel" className="text-white cursor-pointer">Angel</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox 
              id="pre-seed" 
              checked={investmentStages.includes("pre-seed")}
              onCheckedChange={() => setInvestmentStages(toggleArrayValue(investmentStages, "pre-seed"))}
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors rounded-sm"
            />
            <Label htmlFor="pre-seed" className="text-white cursor-pointer">Pre-Seed</Label>
          </div>
        </div>
      </div>

      {/* Investment Range */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What is your investment range?</h3>
        <RadioGroup value={investmentRange || ""} onValueChange={setInvestmentRange} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="less-than-25k" 
              id="less-than-25k" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="less-than-25k" className="text-white cursor-pointer">Less than $25,000</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="25k-100k" 
              id="25k-100k" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="25k-100k" className="text-white cursor-pointer">Between $25,000 - $100,000</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="100k-500k" 
              id="100k-500k" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="100k-500k" className="text-white cursor-pointer">Between $100,000 - $500,000</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="500k-1m" 
              id="500k-1m" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="500k-1m" className="text-white cursor-pointer">Between $500,000 - $1,000,000</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="1m-plus" 
              id="1m-plus" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="1m-plus" className="text-white cursor-pointer">$1,000,000 or more</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sweet Spot */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">What is your sweet spot?</h3>
        <Input
          value={sweetSpot}
          onChange={(e) => setSweetSpot(e.target.value)}
          placeholder="Enter amount"
          className="bg-zinc-900 border-zinc-700 text-white h-11 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-violet-500 transition-colors"
        />
      </div>

      {/* Time to Act */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">How fast can you act on investments?</h3>
        <RadioGroup value={timeToAct || ""} onValueChange={setTimeToAct} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="under-4-weeks" 
              id="under-4-weeks" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="under-4-weeks" className="text-white cursor-pointer">Under 4 weeks</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="4-8-weeks" 
              id="4-8-weeks" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="4-8-weeks" className="text-white cursor-pointer">Within 4 - 8 weeks</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="8-12-weeks" 
              id="8-12-weeks" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="8-12-weeks" className="text-white cursor-pointer">Within 8 - 12 weeks</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Anonymity */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">I want to stay anonymous for founders</h3>
        <RadioGroup value={anonymity || ""} onValueChange={setAnonymity} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="until-match" 
              id="until-match" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="until-match" className="text-white cursor-pointer">Until there is a match between founders and me</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="no-show-profile" 
              id="no-show-profile" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="no-show-profile" className="text-white cursor-pointer">No, show my profile</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Dealflow Frequency */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">I&apos;d like to receive dealflow</h3>
        <Select 
          value={dealflowFrequency || ""}
          onValueChange={setDealflowFrequency}
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-11 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-violet-500 transition-colors">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
            <SelectItem value="daily" className="focus:bg-zinc-800 focus:text-white">Daily</SelectItem>
            <SelectItem value="weekly" className="focus:bg-zinc-800 focus:text-white">Weekly</SelectItem>
            <SelectItem value="monthly" className="focus:bg-zinc-800 focus:text-white">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invest alongside others */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">I&apos;d like to invest alongside other investors in SPV&apos;s</h3>
        <RadioGroup value={investWithOthers || ""} onValueChange={setInvestWithOthers} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="yes" 
              id="invest-with-others-yes" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="invest-with-others-yes" className="text-white cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="no" 
              id="invest-with-others-no" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="invest-with-others-no" className="text-white cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Invest in Pre-IPOs */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">I&apos;d like to invest in Pre-IPOs</h3>
        <RadioGroup value={investInPreIPOs || ""} onValueChange={setInvestInPreIPOs} className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="yes" 
              id="invest-in-pre-ipos-yes" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="invest-in-pre-ipos-yes" className="text-white cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem 
              value="no" 
              id="invest-in-pre-ipos-no" 
              className="h-5 w-5 border-2 border-zinc-600 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-black hover:border-violet-500 transition-colors"
            />
            <Label htmlFor="invest-in-pre-ipos-no" className="text-white cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          className="bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 px-8 transition-colors"
        >
          Back
        </Button>
        <Button
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 transition-colors"
        >
          Next
        </Button>
      </div>

      <div className="space-y-4 pt-8">
        <Button 
          type="submit" 
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-md transition-colors"
        >
          Save Investment Mandate
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-zinc-600 text-white hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
} 