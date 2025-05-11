"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField, CurrencyInput } from "./form-field";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface InvestorFormData {
  name: string;
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  stage: string;
  country: string;
  city: string;
  amount: string;
  isInvestment: boolean;
}

interface AddInvestorFormProps {
  onSubmit: (data: InvestorFormData) => void;
}

export function AddInvestorForm({ onSubmit }: AddInvestorFormProps) {
  const [formData, setFormData] = useState<InvestorFormData>({
    name: "",
    company: "",
    email: "",
    firstName: "",
    lastName: "",
    type: "",
    stage: "interested",
    country: "",
    city: "",
    amount: "",
    isInvestment: false,
  });

  const handleInputChange = (field: keyof InvestorFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company/Fund Name</Label>
          <Input
            id="company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="bg-zinc-800/50 border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="bg-zinc-800/50 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="bg-zinc-800/50 border-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-zinc-800/50 border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Investor Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger id="type" className="bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Select investor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="angel">Angel</SelectItem>
                <SelectItem value="vc">VC</SelectItem>
                <SelectItem value="family_office">Family Office</SelectItem>
                <SelectItem value="institutional">Institutional</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => handleInputChange("stage", value)}
            >
              <SelectTrigger id="stage" className="bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="meeting">Meeting Scheduled</SelectItem>
                <SelectItem value="dd">Due Diligence</SelectItem>
                <SelectItem value="committed">Committed</SelectItem>
                <SelectItem value="invested">Invested</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-4">
        <h3 className="font-medium text-zinc-100 mb-4">Location Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="country">In what country are you located?</Label>
              <div className="h-5 w-5 bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger id="country" className="bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="id">Indonesia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="city">In what city are you living?</Label>
              <div className="h-5 w-5 bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-green-500" />
              </div>
            </div>
            <Input
              id="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="bg-zinc-800/50 border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-4">
        <h3 className="font-medium text-zinc-100 mb-4">Investment Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Is this an investment or a reservation?</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!formData.isInvestment ? "text-primary" : "text-zinc-500"}`}>
                Reservation
              </span>
              <Switch
                checked={formData.isInvestment}
                onCheckedChange={(checked) => handleInputChange("isInvestment", checked)}
              />
              <span className={`text-sm ${formData.isInvestment ? "text-primary" : "text-zinc-500"}`}>
                Investment
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              {formData.isInvestment ? "Investment Amount" : "Reservation Amount"}
            </Label>
            <CurrencyInput
              id="amount"
              value={formData.amount}
              onChange={(value) => handleInputChange("amount", value)}
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" className="border-zinc-700 text-zinc-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Add Investor
        </Button>
      </div>
    </form>
  );
} 