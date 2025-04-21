"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const industries = [
  { id: "fintech", label: "Fintech" },
  { id: "healthtech", label: "Healthtech" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "blockchain", label: "Blockchain" },
  { id: "cleantech", label: "Cleantech" },
  { id: "edtech", label: "Edtech" },
  { id: "saas", label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "consumer", label: "Consumer" },
  { id: "hardware", label: "Hardware" },
  { id: "biotech", label: "Biotech" },
  { id: "deeptech", label: "Deeptech" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "proptech", label: "Proptech" },
  { id: "agritech", label: "Agritech" },
];

const stages = [
  { id: "pre-seed", label: "Pre-seed" },
  { id: "seed", label: "Seed" },
  { id: "series-a", label: "Series A" },
  { id: "series-b", label: "Series B" },
  { id: "series-c", label: "Series C" },
  { id: "growth", label: "Growth" },
  { id: "late-stage", label: "Late Stage" },
];

const geographies = [
  { id: "north-america", label: "North America" },
  { id: "europe", label: "Europe" },
  { id: "asia", label: "Asia" },
  { id: "latin-america", label: "Latin America" },
  { id: "africa", label: "Africa" },
  { id: "middle-east", label: "Middle East" },
  { id: "oceania", label: "Oceania" },
];

export function InvestmentInterests() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([50000, 500000]);
  const [minInvestment, setMinInvestment] = useState("50,000");
  const [maxInvestment, setMaxInvestment] = useState("500,000");
  const [expectedReturns, setExpectedReturns] = useState("15-25");
  const [isLeadInvestor, setIsLeadInvestor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIndustryChange = (industryId: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industryId]);
    } else {
      setSelectedIndustries(selectedIndustries.filter(id => id !== industryId));
    }
  };

  const handleStageChange = (stageId: string, checked: boolean) => {
    if (checked) {
      setSelectedStages([...selectedStages, stageId]);
    } else {
      setSelectedStages(selectedStages.filter(id => id !== stageId));
    }
  };

  const handleGeographyChange = (geoId: string, checked: boolean) => {
    if (checked) {
      setSelectedGeographies([...selectedGeographies, geoId]);
    } else {
      setSelectedGeographies(selectedGeographies.filter(id => id !== geoId));
    }
  };

  const handleInvestmentRangeChange = (values: number[]) => {
    const [min, max] = values as [number, number];
    setInvestmentRange([min, max]);
    setMinInvestment(min.toLocaleString());
    setMaxInvestment(max.toLocaleString());
  };

  const handleSave = async () => {
    setIsLoading(true);
    // In a real application, this would save to database
    console.log("Saving investment interests...");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Investment interests saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Industries Section */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Industries of Interest</h2>
          <p className="text-zinc-400 text-sm mb-4">Select the industries you are interested in investing in</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <div key={industry.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`industry-${industry.id}`}
                  checked={selectedIndustries.includes(industry.id)}
                  onCheckedChange={(checked) => handleIndustryChange(industry.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`industry-${industry.id}`}
                  className="text-zinc-200"
                >
                  {industry.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Investment Stages Section */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Investment Stages</h2>
          <p className="text-zinc-400 text-sm mb-4">Select the stages youare interested in investing in</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`stage-${stage.id}`}
                  checked={selectedStages.includes(stage.id)}
                  onCheckedChange={(checked) => handleStageChange(stage.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`stage-${stage.id}`}
                  className="text-zinc-200"
                >
                  {stage.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Geographic Focus Section */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Geographic Focus</h2>
          <p className="text-zinc-400 text-sm mb-4">Select the regions youare interested in investing in</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geographies.map((geo) => (
              <div key={geo.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`geo-${geo.id}`}
                  checked={selectedGeographies.includes(geo.id)}
                  onCheckedChange={(checked) => handleGeographyChange(geo.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`geo-${geo.id}`}
                  className="text-zinc-200"
                >
                  {geo.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Investment Details Section */}
        <div className="bg-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Investment Details</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-zinc-200">Investment Range ($)</Label>
                <div className="text-zinc-300 text-sm">
                  ${minInvestment} - ${maxInvestment}
                </div>
              </div>
              <Slider
                value={investmentRange}
                min={10000}
                max={10000000}
                step={10000}
                minStepsBetweenThumbs={1}
                onValueChange={handleInvestmentRangeChange}
                className="my-6"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected-returns" className="text-zinc-200">Expected Returns (%)</Label>
              <Select value={expectedReturns} onValueChange={setExpectedReturns}>
                <SelectTrigger id="expected-returns" className="bg-zinc-700 border-zinc-600 text-zinc-100">
                  <SelectValue placeholder="Select expected returns range" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="0-5">0-5%</SelectItem>
                  <SelectItem value="5-10">5-10%</SelectItem>
                  <SelectItem value="10-15">10-15%</SelectItem>
                  <SelectItem value="15-25">15-25%</SelectItem>
                  <SelectItem value="25-50">25-50%</SelectItem>
                  <SelectItem value="50+">50%+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="lead-investor"
                checked={isLeadInvestor}
                onCheckedChange={(checked) => setIsLeadInvestor(checked as boolean)}
              />
              <Label 
                htmlFor="lead-investor"
                className="text-zinc-200"
              >
                I am willing to lead investment rounds
              </Label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
} 