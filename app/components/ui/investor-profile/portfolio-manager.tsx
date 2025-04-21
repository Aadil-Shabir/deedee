"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";

interface Company {
  id: string;
  name: string;
  website: string;
  investmentDate: string;
  investmentAmount: number;
  stage: string;
  ownershipPercentage: number;
  industry: string;
  location: string;
  notes?: string;
  logoUrl?: string;
}

export function PortfolioManager() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});

  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleAddCompany = () => {
    if (!formData.name) return;
    
    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name || '',
      website: formData.website || '',
      investmentDate: formData.investmentDate || '',
      investmentAmount: formData.investmentAmount || 0,
      stage: formData.stage || '',
      ownershipPercentage: formData.ownershipPercentage || 0,
      industry: formData.industry || '',
      location: formData.location || '',
      notes: formData.notes || '',
      logoUrl: formData.logoUrl || '',
    };
    
    setCompanies([...companies, newCompany]);
    setFormData({});
    setModalOpen(false);
  };

  const AddCompanyModal = () => (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="bg-[#171e2e] border-zinc-800 text-white sm:max-w-[550px] p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-zinc-800">
          <DialogTitle className="text-xl font-semibold text-white">Add Portfolio Company</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-[#171e2e] transition-opacity hover:opacity-100">
            <X className="h-5 w-5" />
          </DialogClose>
        </div>
        
        <div className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/5 flex justify-center">
              <div className="h-32 w-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors">
                <p className="text-sm text-zinc-400 text-center p-2">Click to upload company logo</p>
              </div>
            </div>
            
            <div className="w-full md:w-3/5 space-y-4">
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-zinc-300 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="company-name"
                  placeholder="Acme Inc."
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="company-website" className="block text-sm font-medium text-zinc-300 mb-1">
                  Company Website
                </label>
                <Input 
                  id="company-website"
                  placeholder="https://example.com"
                  className="bg-[#1F2937] border-zinc-700 text-white"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="investment-date" className="block text-sm font-medium text-zinc-300 mb-1">
                Investment Date
              </label>
              <Input 
                id="investment-date"
                type="date"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.investmentDate || ''}
                onChange={(e) => handleInputChange('investmentDate', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="investment-amount" className="block text-sm font-medium text-zinc-300 mb-1">
                Investment Amount
              </label>
              <Input 
                id="investment-amount"
                type="number"
                placeholder="100000"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.investmentAmount || ''}
                onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
              />
            </div>
            
            <div>
              <label htmlFor="investment-stage" className="block text-sm font-medium text-zinc-300 mb-1">
                Investment Stage
              </label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleInputChange('stage', value)}
              >
                <SelectTrigger id="investment-stage" className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F2937] border-zinc-700 text-white">
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="ownership-percentage" className="block text-sm font-medium text-zinc-300 mb-1">
                Ownership Percentage
              </label>
              <Input 
                id="ownership-percentage"
                type="number"
                placeholder="5"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.ownershipPercentage || ''}
                onChange={(e) => handleInputChange('ownershipPercentage', Number(e.target.value))}
              />
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-zinc-300 mb-1">
                Industry
              </label>
              <Input 
                id="industry"
                placeholder="Fintech"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">
                Location
              </label>
              <Input 
                id="location"
                placeholder="Singapore"
                className="bg-[#1F2937] border-zinc-700 text-white"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-1">
              Notes
            </label>
            <Textarea 
              id="notes"
              placeholder="Any additional notes about this investment..."
              className="bg-[#1F2937] border-zinc-700 text-white min-h-[120px]"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleAddCompany}
            >
              Add Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EmptyState = () => (
    <div className="border border-dashed border-zinc-700 rounded-lg p-10 text-center">
      <p className="text-lg text-zinc-400 mb-6">Your portfolio is empty. Add companies you have invested in.</p>
      <Button 
        onClick={() => setModalOpen(true)}
        className="bg-violet-600 hover:bg-violet-700 text-white"
      >
        Add Your First Company
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">My Portfolio Companies</h2>
        <Button 
          onClick={() => setModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <div key={company.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">{company.name}</h3>
                <p className="text-sm text-zinc-400">{company.industry} • {company.location}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-zinc-500">Investment</p>
                    <p className="text-white">${company.investmentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Ownership</p>
                    <p className="text-white">{company.ownershipPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Stage</p>
                    <p className="text-white">{company.stage}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Date</p>
                    <p className="text-white">{company.investmentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCompanyModal />
      
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
        >
          Back
        </Button>
        <Button
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 