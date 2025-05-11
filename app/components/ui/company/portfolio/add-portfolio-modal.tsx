"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (companyData: any) => void;
}

export function AddPortfolioModal({ isOpen, onClose, onAddCompany }: AddPortfolioModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    investmentDate: "",
    country: "",
    founderFirstName: "",
    founderLastName: "",
    founderEmail: "",
    investmentAmount: "",
    securityType: "equity",
    valuation: "",
    sharesAcquired: "",
    sharePrice: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCompany(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#171e2e] border-zinc-800 text-white sm:max-w-[650px] p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <div>
            <DialogTitle className="text-xl font-bold text-white">Add Portfolio Company</DialogTitle>
            <DialogDescription className="text-zinc-400 mt-1">
              Add a new company to your investment portfolio.
            </DialogDescription>
          </div>
          <DialogClose className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-800">
            <X className="h-4 w-4 text-zinc-400" />
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <Label htmlFor="company-name" className="text-white mb-2 block">
                Company Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="company-name"
                placeholder="Acme Inc."
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Date */}
              <div>
                <Label htmlFor="investment-date" className="text-white mb-2 block">
                  Investment Date
                </Label>
                <Input
                  id="investment-date"
                  type="date"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.investmentDate}
                  onChange={(e) => handleInputChange("investmentDate", e.target.value)}
                />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country" className="text-white mb-2 block">
                  Country
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange("country", value)}
                  value={formData.country}
                >
                  <SelectTrigger id="country" className="bg-[#1F2937] border-zinc-700 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#171e2e] border-zinc-700 text-white">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Founder First Name */}
              <div>
                <Label htmlFor="founder-first-name" className="text-white mb-2 block">
                  Founder First Name
                </Label>
                <Input
                  id="founder-first-name"
                  placeholder="John"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.founderFirstName}
                  onChange={(e) => handleInputChange("founderFirstName", e.target.value)}
                />
              </div>

              {/* Founder Last Name */}
              <div>
                <Label htmlFor="founder-last-name" className="text-white mb-2 block">
                  Founder Last Name
                </Label>
                <Input
                  id="founder-last-name"
                  placeholder="Doe"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.founderLastName}
                  onChange={(e) => handleInputChange("founderLastName", e.target.value)}
                />
              </div>
            </div>

            {/* Founder Email */}
            <div>
              <Label htmlFor="founder-email" className="text-white mb-2 block">
                Founder Email
              </Label>
              <Input
                id="founder-email"
                type="email"
                placeholder="john.doe@example.com"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.founderEmail}
                onChange={(e) => handleInputChange("founderEmail", e.target.value)}
              />
            </div>

            {/* Investment Amount */}
            <div>
              <Label htmlFor="investment-amount" className="text-white mb-2 block">
                Investment Amount
              </Label>
              <Input
                id="investment-amount"
                type="number"
                placeholder="100000"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.investmentAmount}
                onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
              />
            </div>

            {/* Security Type */}
            <div>
              <Label htmlFor="security-type" className="text-white mb-2 block">
                Security Type
              </Label>
              <Select
                onValueChange={(value) => handleInputChange("securityType", value)}
                value={formData.securityType}
              >
                <SelectTrigger id="security-type" className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectValue placeholder="Select security type" />
                </SelectTrigger>
                <SelectContent className="bg-[#171e2e] border-zinc-700 text-white">
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="safe">SAFE</SelectItem>
                  <SelectItem value="convertible-note">Convertible Note</SelectItem>
                  <SelectItem value="debt">Debt</SelectItem>
                  <SelectItem value="revenue-share">Revenue Share</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Valuation */}
              <div>
                <Label htmlFor="valuation" className="text-white mb-2 block">
                  Valuation (at investment)
                </Label>
                <Input
                  id="valuation"
                  type="number"
                  placeholder="1000000"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.valuation}
                  onChange={(e) => handleInputChange("valuation", e.target.value)}
                />
              </div>

              {/* Shares Acquired */}
              <div>
                <Label htmlFor="shares-acquired" className="text-white mb-2 block">
                  Shares Acquired
                </Label>
                <Input
                  id="shares-acquired"
                  type="number"
                  placeholder="10000"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.sharesAcquired}
                  onChange={(e) => handleInputChange("sharesAcquired", e.target.value)}
                />
              </div>

              {/* Share Price */}
              <div>
                <Label htmlFor="share-price" className="text-white mb-2 block">
                  Share Price
                </Label>
                <Input
                  id="share-price"
                  type="number"
                  placeholder="10"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.sharePrice}
                  onChange={(e) => handleInputChange("sharePrice", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 