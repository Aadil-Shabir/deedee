"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function BusinessInfo() {
  const [companyName, setCompanyName] = useState("SevenX Capital");
  const [webUrl, setWebUrl] = useState("sevenx.capital");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-2">Investor Profile</h1>
        <p className="text-zinc-400 mb-8">Manage your investment profile and preferences</p>
        
        {/* Tabs Navigation */}
        <div className="bg-[#111827] rounded-lg overflow-hidden">
          <div className="flex border-b border-zinc-800">
            <div className="px-4 py-3 text-zinc-400">Profile</div>
            <div className="px-4 py-3 bg-violet-600 text-white">Business</div>
            <div className="px-4 py-3 text-zinc-400">Investment Mandate</div>
            <div className="px-4 py-3 text-zinc-400">Metrics</div>
            <div className="px-4 py-3 text-zinc-400">Portfolio</div>
            <div className="px-4 py-3 text-zinc-400">Match</div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Company Name */}
            <div className="space-y-4">
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
              />
            </div>
            
            {/* Web URL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="web-url" className="text-white flex items-center gap-2">
                  Web Url <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Input
                id="web-url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                className="bg-[#1F2937] border-zinc-700 text-white"
                placeholder="yourcompany.com"
              />
            </div>
            
            {/* Country */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="country" className="text-white flex items-center gap-2">
                  In what country are you located? <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* City */}
            <div className="space-y-4">
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
              />
            </div>
            
            {/* Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="category" className="text-white flex items-center gap-2">
                  I am categorizing myself as <Check className="w-5 h-5 text-green-500" />
                </Label>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#1F2937] border-zinc-700 text-white">
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
                variant="outline"
                className="bg-[#1F2937] border-zinc-700 text-white hover:bg-[#2D3748] px-8"
              >
                Back
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white px-8"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 