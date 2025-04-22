import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Fetch ALL companies for this user
      const { data: companies, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id);

      if (companyError) {
        throw companyError;
      }

      let companyId;

      if (!companies || companies.length === 0) {
        // No company found - create a new one
        const { data: newCompany, error: createError } = await supabase
          .from("companies")
          .insert([
            {
              owner_id: user.id,
              company_name: "My Company", // Default name
            },
          ])
          .select("id")
          .single();

        if (createError) {
          throw createError;
        }

        companyId = newCompany?.id;
      } else {
        // Use the first company found
        companyId = companies[0].id;

        // If multiple companies exist, we'll just work with the first one
        if (companies.length > 1) {
          console.warn(
            `Multiple companies found for user ${user.id}. Using the first one.`
          );
        }
      }

      if (!companyId) {
        throw new Error("Could not get or create company ID");
      }

      // 2. Now upsert the business details
      const { error } = await supabase
        .from("business_details")
        .upsert(
          {
            company_id: companyId,
            headquarters_location: headquarters,
            incorporation_date: incorporationDate || null,
            business_type: businessType,
            sales_type: salesType,
            business_stage: businessStage,
            business_model: businessModel,
          },
          {
            onConflict: 'company_id' // This tells Supabase to update if this company_id already exists
          }
        );

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Business details saved successfully",
        variant: "success",
      });

      onNext();
    } catch (error) {
      console.error("Error saving business details:", error);
      toast({
        title: "Error",
        description: "Failed to save business details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadBusinessDetails() {
      if (!user) return;

      try {
        // 1. Fetch ALL companies for this user
        const { data: companies, error: companyError } = await supabase
          .from("companies")
          .select("id")
          .eq("owner_id", user.id);

        if (companyError) {
          console.error("Error fetching company ID:", companyError);
          return;
        }

        if (!companies || companies.length === 0) {
          console.log("No company found for this user");
          return;
        }

        // Use the first company found
        const companyId = companies[0].id;

        // If multiple companies exist, we'll just work with the first one
        if (companies.length > 1) {
          console.warn(`Multiple companies found for user ${user.id}. Using the first one.`);
        }

        // 2. Fetch business details
        const { data, error } = await supabase
          .from("business_details")
          .select("*")
          .eq("company_id", companyId)
          .maybeSingle(); // Use maybeSingle instead of single

        if (error) {
          console.error("Error loading business details:", error);
          return;
        }

        if (data) {
          setHeadquarters(data.headquarters_location || "");
          setIncorporationDate(data.incorporation_date || "");
          setBusinessType(data.business_type || "");
          setSalesType(data.sales_type || "");
          setBusinessStage(data.business_stage || "");
          setBusinessModel(data.business_model || "");
        }
      } catch (error) {
        console.error("Error in loadBusinessDetails:", error);
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
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  <div className="px-3 pb-2">
                    <input
                      className="flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      placeholder="Search country..."
                      onChange={(e) => {
                        const input = e.target as HTMLInputElement;
                        const searchBox = input.closest(".select-content");
                        const items = searchBox?.querySelectorAll(".select-item");
                        items?.forEach((item) => {
                          if (
                            item.textContent
                              ?.toLowerCase()
                              .includes(input.value.toLowerCase())
                          ) {
                            item.classList.remove("hidden");
                          } else {
                            item.classList.add("hidden");
                          }
                        });
                      }}
                    />
                  </div>
                  <SelectItem value="af">Afghanistan</SelectItem>
                  <SelectItem value="al">Albania</SelectItem>
                  <SelectItem value="dz">Algeria</SelectItem>
                  {/* ...other countries... */}
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="vn">Vietnam</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
                {["Small Business","Service Based Startup", "Startup", "Enterprise"].map((type,index)=>(
                  <SelectItem value={type} key={index}>{type}</SelectItem>
                ))}
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
              {["Idea/Prototype","BreakEven", "Profitable", "Scaling"].map((type,index)=>(
                  <SelectItem value={type} key={index}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-200">
              Business Model
            </label>
            <Select value={businessModel} onValueChange={setBusinessModel}>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Select business model" />
              </SelectTrigger>
              {/* . Real Estate, marketplace, Franchise, Off-line Retail, Service based business, Consulting, Ecommerece etc.  */}
              <SelectContent>
              {["Real Estate","MarketPlace", "Franchise", "Off-line Retail", "Service based business", "Consulting", "E-commerece"].map((type,index)=>(
                  <SelectItem value={type} key={index}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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