import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast-provider";
import { createClient } from "@/supabase/supabase";


const supabase = createClient();
interface BusinessDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export function BusinessDetails({ onNext, onBack }: BusinessDetailsProps) {
  const [headquarters, setHeadquarters] = useState("");
  const [productsCount, setProductsCount] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [salesType, setSalesType] = useState("");
  const [businessStage, setBusinessStage] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save business details",
        variant: "destructive"
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // 1. Fetch the company ID
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single();
  
      if (companyError) {
        throw companyError;
      }
  
      const companyId = companyData?.id;
      if (!companyId) {
        throw new Error("Company not found for this user");
      }
  
      // 2. Now upsert the business details
      const { error } = await supabase
        .from('business_details')
        .upsert({
          company_id: companyId,
          headquarters_location: headquarters,
          product_count: productsCount ? parseInt(productsCount) : null,
          incorporation_date: incorporationDate || null,
          business_type: businessType,
          sales_type: salesType,
          business_stage: businessStage,
          business_model: businessModel
        });
  
      if (error) {
        throw error;
      }
  
      toast({
        title: "Success",
        description: "Business details saved successfully",
        variant: "success"
      });
  
      onNext();
    } catch (error) {
      console.error('Error saving business details:', error);
      toast({
        title: "Error",
        description: "Failed to save business details",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadBusinessDetails() {
      if (!user) return;
    
      try {
        // 1. Fetch the company ID
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .single();
    
        if (companyError) {
          console.error('Error fetching company ID:', companyError);
          return;
        }
    
        const companyId = companyData?.id;
        if (!companyId) {
          console.error('Company not found for this user');
          return;
        }
    
        // 2. Fetch business details
        const { data, error } = await supabase
          .from('business_details')
          .select('*')
          .eq('company_id', companyId)
          .single();
    
        if (error) {
          console.error('Error loading business details:', error);
          return;
        }
    
        if (data) {
          setHeadquarters(data.headquarters_location || '');
          setProductsCount(data.products_count);
          setIncorporationDate(data.incorporation_date || '');
          setBusinessType(data.business_type || '');
          setSalesType(data.sales_type || '');
          setBusinessStage(data.business_stage || '');
          setBusinessModel(data.business_model || '');
        }
      } catch (error) {
        console.error('Error in loadBusinessDetails:', error);
      }
    }
    
    if (!loading) {
      loadBusinessDetails();
    }
  }, [user, loading]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-200">
              Number of Products/Services
            </label>
            <Input
              type="number"
              value={productsCount}
              onChange={(e) => setProductsCount(e.target.value)}
              placeholder="Enter number"
              className="bg-zinc-800/50 border-zinc-700"
            />
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
                <SelectItem value="small">Small Business</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
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
                <SelectItem value="concept">Concept</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="early">Early Stage</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="mature">Mature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="block text-sm font-medium text-zinc-200">
            Business Model
          </label>
          <Select value={businessModel} onValueChange={setBusinessModel}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
              <SelectValue placeholder="Select business model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS - Software as a Service</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onBack}
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
    </form>
  );
} 