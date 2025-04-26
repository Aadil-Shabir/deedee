"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, User, Building } from "lucide-react";
import { CurrencyInput } from "./form-field";

interface InvestorProps {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  type?: string;
  stage?: string;
  amount?: string;
  isInvestment?: boolean;
  country?: string;
  city?: string;
}

interface InvestorListProps {
  investors: InvestorProps[];
  onAddInvestor: (investor: Omit<InvestorProps, "id">) => void;
  onDeleteInvestor?: (investorId: string) => void;
}

export function InvestorList({ investors, onAddInvestor, onDeleteInvestor }: InvestorListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [amount, setAmount] = useState("");
  const [isInvestment, setIsInvestment] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Reset form
    setFirstName("");
    setLastName("");
    setCompany("");
    setEmail("");
    setType("");
    setStage("");
    setCountry("");
    setCity("");
    setAmount("");
    setIsInvestment(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      return; // Don't submit if required fields are empty
    }
    
    const newInvestor = {
      firstName,
      lastName,
      company,
      email,
      type,
      stage,
      country,
      city,
      amount,
      isInvestment,
    };
    
    onAddInvestor(newInvestor);
    handleCloseDialog();
  };
  
  const handleDelete = (investorId: string) => {
    if (onDeleteInvestor) {
      onDeleteInvestor(investorId);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-zinc-200">
            {investors.length > 0
              ? `${investors.length} investor${
                  investors.length !== 1 ? "s" : ""
                } listed`
              : "No investors listed yet"}
          </h3>
          <Button
            onClick={handleOpenDialog}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-zinc-700 hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Add Investor
          </Button>
        </div>

        {investors.length > 0 && (
          <div className="grid gap-3">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary">
                    {investor.type === "company" ? (
                      <Building className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">
                      {investor.firstName} {investor.lastName}
                    </h4>
                    <div className="flex text-xs text-zinc-400">
                      {investor.company && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none">
                          {investor.company}
                        </span>
                      )}
                      {investor.amount && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none text-primary">
                          ${parseInt(investor.amount).toLocaleString()}
                        </span>
                      )}
                      {investor.stage && (
                        <span className="after:content-['•'] after:mx-1.5 last:after:content-none">
                          {investor.stage} stage
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {onDeleteInvestor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(investor.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-100">
              Add Investor
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-zinc-300">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-zinc-300">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-zinc-300">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-zinc-300">Investor Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="angel">Angel</SelectItem>
                    <SelectItem value="vc">VC</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="family">Family Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage" className="text-sm font-medium text-zinc-300">Investment Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="preSeries">Pre-Series A</SelectItem>
                    <SelectItem value="seriesA">Series A</SelectItem>
                    <SelectItem value="seriesB">Series B</SelectItem>
                    <SelectItem value="seriesC">Series C+</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-zinc-300">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-zinc-300">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-zinc-300">Investment Amount</Label>
              <CurrencyInput
                id="amount"
                value={amount}
                onChange={setAmount}
                placeholder="50,000"
              />
            </div>
            
            <div className="flex items-center gap-2 py-2">
              <input
                id="isInvestment"
                type="checkbox"
                checked={isInvestment}
                onChange={(e) => setIsInvestment(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-primary"
              />
              <Label htmlFor="isInvestment" className="text-sm font-medium text-zinc-300">
                Mark as investment (not loan)
              </Label>
            </div>
            
            <DialogFooter className="mt-6 pt-4 border-t border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Investor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}