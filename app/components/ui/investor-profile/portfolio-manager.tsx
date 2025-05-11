"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Import server actions
import { 
  getPortfolioCompanies,
  addPortfolioCompany,
  updatePortfolioCompany,
  deletePortfolioCompany,
  uploadCompanyLogo
} from "@/actions/portfolio-actions";

// Component interface that matches the server action types
interface PortfolioCompany {
  id: string;
  name: string;
  website?: string;
  investmentDate?: string;
  investmentAmount?: number;
  stage?: string;
  ownershipPercentage?: number;
  industry?: string;
  location?: string;
  notes?: string;
  logoUrl?: string;
}

// Form state interface (separate from API interface)
interface FormState {
  name: string;
  website: string;
  investmentDate: string;
  investmentAmount: string;
  stage: string;
  ownershipPercentage: string;
  industry: string;
  location: string;
  notes: string;
}

export function InvestorPortfolioForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<PortfolioCompany | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Initialize form state
  const [formData, setFormData] = useState<FormState>({
    name: "",
    website: "",
    investmentDate: "",
    investmentAmount: "",
    stage: "",
    ownershipPercentage: "",
    industry: "",
    location: "",
    notes: ""
  });

  // Fetch portfolio companies with TanStack Query
  const { 
    data: portfolioCompanies = [], 
    isLoading: initialLoading 
  } = useQuery({
    queryKey: ['portfolioCompanies'],
    queryFn: async () => {
      const result = await getPortfolioCompanies();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    }
  });

  // Add company mutation
  const { mutate: addCompany, isPending: isAddingCompany } = useMutation({
    mutationFn: async () => {
      // First handle logo upload if there is one
      let logoUrl = null;
      if (logoFile) {
        console.log("Starting logo upload process for new company");
        const formData = new FormData();
        formData.append("file", logoFile);
        
        const uploadResult = await uploadCompanyLogo(logoFile);
        if (uploadResult.error) {
          console.error("Logo upload error:", uploadResult.error);
          throw new Error(uploadResult.error);
        }
        logoUrl = uploadResult.url;
        console.log("Logo uploaded successfully, URL:", logoUrl);
      }

      // Prepare data for server action
      const company: Partial<PortfolioCompany> = {
        name: formData.name,
        website: formData.website || undefined,
        investmentDate: formData.investmentDate || undefined,
        investmentAmount: formData.investmentAmount ? Number(formData.investmentAmount) : undefined,
        stage: formData.stage || undefined,
        ownershipPercentage: formData.ownershipPercentage ? Number(formData.ownershipPercentage) : undefined,
        industry: formData.industry || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        logoUrl: logoUrl || undefined  // Make sure this is properly set
      };

      console.log("Adding portfolio company with data:", JSON.stringify(company, null, 2));
      
      const result = await addPortfolioCompany(company);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Company added to portfolio");
      resetForm();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['portfolioCompanies'] });
    },
    onError: (error) => {
      toast.error("Failed to add company", { description: error.message });
    }
  });

  // Update company mutation
  const { mutate: updateCompany, isPending: isUpdatingCompany } = useMutation({
    mutationFn: async () => {
      if (!editingCompany) {
        throw new Error("No company selected for update");
      }

      // Handle logo upload if changed
      let logoUrl = editingCompany.logoUrl;
      if (logoFile) {
        console.log("Starting logo upload for company update");
        
        const uploadResult = await uploadCompanyLogo(logoFile);
        if (uploadResult.error) {
          console.error("Logo upload error:", uploadResult.error);
          throw new Error(uploadResult.error);
        }
        logoUrl = uploadResult.url as string;
        console.log("Logo uploaded successfully for update, URL:", logoUrl);
      }

      // Prepare data for server action
      const company: Partial<PortfolioCompany> = {
        id: editingCompany.id,
        name: formData.name,
        website: formData.website || undefined,
        investmentDate: formData.investmentDate || undefined,
        investmentAmount: formData.investmentAmount ? Number(formData.investmentAmount) : undefined,
        stage: formData.stage || undefined,
        ownershipPercentage: formData.ownershipPercentage ? Number(formData.ownershipPercentage) : undefined,
        industry: formData.industry || undefined,
        location: formData.location || undefined,
        notes: formData.notes || undefined,
        logoUrl: logoUrl || undefined  // Make sure this is properly set
      };

      console.log("Updating portfolio company with data:", JSON.stringify(company, null, 2));
      
      const result = await updatePortfolioCompany(company);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Portfolio company updated successfully");
      resetForm();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['portfolioCompanies'] });
    },
    onError: (error) => {
      toast.error("Failed to update company", { description: error.message });
    }
  });

  // Delete company mutation
  const { mutate: removeCompany, isPending: isRemovingCompany } = useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePortfolioCompany(id);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Company removed from portfolio");
      queryClient.invalidateQueries({ queryKey: ['portfolioCompanies'] });
    },
    onError: (error) => {
      toast.error("Failed to remove company", { description: error.message });
    }
  });

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      website: "",
      investmentDate: "",
      investmentAmount: "",
      stage: "",
      ownershipPercentage: "",
      industry: "",
      location: "",
      notes: ""
    });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingCompany(null);
  }, []);

  // Handle editing a company
  const handleEditCompany = useCallback((company: PortfolioCompany) => {
    setEditingCompany(company);
    
    // Convert API model to form model
    setFormData({
      name: company.name || "",
      website: company.website || "",
      investmentDate: company.investmentDate || "",
      investmentAmount: company.investmentAmount ? company.investmentAmount.toString() : "",
      stage: company.stage || "",
      ownershipPercentage: company.ownershipPercentage ? company.ownershipPercentage.toString() : "",
      industry: company.industry || "",
      location: company.location || "",
      notes: company.notes || ""
    });
    
    // Set logo preview if available
    if (company.logoUrl) {
      setLogoPreview(company.logoUrl);
    } else {
      setLogoPreview(null);
    }
    
    setDialogOpen(true);
  }, []);

  // Handle delete confirmation and deletion
  const handleDeleteCompany = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this company from your portfolio?")) {
      removeCompany(id);
    }
  }, [removeCompany]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    
    if (editingCompany) {
      updateCompany();
    } else {
      addCompany();
    }
  }, [formData, editingCompany, updateCompany, addCompany]);

  // Handle logo upload
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large", { description: "Please select an image smaller than 5MB" });
      return;
    }

    // Log file info for debugging
    console.log("Selected file:", file.name, "size:", file.size, "type:", file.type);

    // Store file for later upload with the server action
    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      console.log("Preview generated for selected file");
    };
    reader.readAsDataURL(file);
  }, []);

  // Loading state
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mr-2"></div>
        <span className="text-white">Loading portfolio...</span>
      </div>
    );
  }

  // Input change handler with batched updates for better performance
  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const isSubmitting = isAddingCompany || isUpdatingCompany;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Portfolio Companies</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button 
              className="bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-2"
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              <Plus size={16} />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Edit Portfolio Company" : "Add Portfolio Company"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="flex gap-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600 cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {!logoPreview ? (
                    <div className="text-center text-sm text-gray-400 p-2">
                      Click to upload company logo
                    </div>
                  ) : (
                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800/50 border-gray-700 mt-1"
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="bg-gray-800/50 border-gray-700 mt-1"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentDate">Investment Date</Label>
                  <Input
                    id="investmentDate"
                    type="date"
                    value={formData.investmentDate}
                    onChange={(e) => handleInputChange('investmentDate', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="investmentAmount">Investment Amount</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={formData.investmentAmount}
                    onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 mt-1"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">Investment Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleInputChange('stage', value)}
                  >
                    <SelectTrigger id="stage" className="bg-gray-800/50 border-gray-700 mt-1">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                      <SelectItem value="series-c">Series C</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="pre-ipo">Pre-IPO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ownershipPercentage">Ownership Percentage</Label>
                  <Input
                    id="ownershipPercentage"
                    type="number"
                    value={formData.ownershipPercentage}
                    onChange={(e) => handleInputChange('ownershipPercentage', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 mt-1"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 mt-1"
                    placeholder="Fintech"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 mt-1"
                    placeholder="Singapore"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="bg-gray-800/50 border-gray-700 mt-1 min-h-[100px]"
                  placeholder="Any additional notes about this investment..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  className="bg-purple-700 hover:bg-purple-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingCompany ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingCompany ? "Update Company" : "Add Company"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {portfolioCompanies.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/40 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">Your portfolio is empty. Add companies you have invested in.</p>
          <Button 
            className="mt-4 bg-purple-700 hover:bg-purple-600 text-white"
            onClick={() => setDialogOpen(true)}
          >
            Add Your First Company
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioCompanies.map(company => (
            <Card key={company.id} className="bg-gray-900/60 border-gray-800 overflow-hidden">
              <div className="h-24 bg-gray-800 flex items-center justify-center p-2">
                {company.logoUrl ? (
                  <img 
                    src={company.logoUrl} 
                    alt={company.name} 
                    className="max-h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500 text-lg font-medium">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white">{company.name}</h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => handleEditCompany(company)}
                      disabled={isRemovingCompany}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={isRemovingCompany}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 text-sm flex items-center gap-1 mb-2 hover:underline"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                    <ExternalLink size={12} />
                  </a>
                )}
                
                <div className="text-sm text-gray-400 space-y-1">
                  {company.stage && (
                    <div className="flex items-center justify-between">
                      <span>Stage:</span>
                      <span className="text-white">{company.stage}</span>
                    </div>
                  )}
                  
                  {company.investmentAmount && (
                    <div className="flex items-center justify-between">
                      <span>Investment:</span>
                      <span className="text-white">${company.investmentAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {company.ownershipPercentage && (
                    <div className="flex items-center justify-between">
                      <span>Ownership:</span>
                      <span className="text-white">{company.ownershipPercentage}%</span>
                    </div>
                  )}
                  
                  {company.industry && (
                    <div className="flex items-center justify-between">
                      <span>Industry:</span>
                      <span className="text-white">{company.industry}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="border-gray-700 text-white hover:bg-gray-800"
          onClick={() => {
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              const event = new CustomEvent('navigateTab', { detail: { tab: 'metrics' } });
              window.dispatchEvent(event);
            }
          }}
        >
          Back
        </Button>
        <Button
          type="button"
          className="bg-purple-700 hover:bg-purple-600 text-white"
          onClick={() => {
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              const event = new CustomEvent('navigateTab', { detail: { tab: 'match' } });
              window.dispatchEvent(event);
            }
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}