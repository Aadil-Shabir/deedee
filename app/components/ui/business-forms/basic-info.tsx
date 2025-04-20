import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast-provider";
import { supabase } from "@/supabase/supabase";

interface BasicInfoProps {
  onNext: () => void;
}

export function BasicInfo({ onNext }: BasicInfoProps) {
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [productsCount, setProductsCount] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadBusinessData() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user.id)
        .single();
        
      if (error) {
        console.error('Error loading business data:', error);
        return;
      }
      
      if (data) {
        console.log('data');
        console.log(data);
        setCompanyName(data.company_name || '');
        setWebUrl(data.web_url || '');
        setShortDescription(data.short_description || '');
        setProductsCount(data.products_count?.toString() || '');
        setFullDescription(data.full_description || '');
        
        if (data.logo_url) {
          setCompanyLogo(data.logo_url);
        }
      }
    }
    
    if (!loading) {
      loadBusinessData();
    }
  }, [user, loading]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save company information",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload logo if it exists
      let logoUrl = companyLogo;
      
      // Only upload if it's a new image (data URL) and not an existing URL
      if (companyLogo && companyLogo.startsWith('data:')) {
        // Convert the data URL to a file
        const arr = companyLogo.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        const file = new File([u8arr], `logo-${user.id}-${Date.now()}.jpeg`, { type: mime });
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('company-logos')
          .upload(`${user.id}/${file.name}`, file, {
            contentType: mime,
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) {
          console.error('Logo upload error:', error);
          toast({
            title: "Warning",
            description: "Failed to upload logo but continuing with form submission",
            variant: "destructive"
          });
        } else {
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('company-logos')
            .getPublicUrl(data.path);
            
          logoUrl = urlData.publicUrl;
          console.log('Successfully uploaded logo:', logoUrl);
        }
      } else if (companyLogo && !companyLogo.includes('supabase')) {
        // Skip non-Supabase URLs (like localhost URLs)
        console.log('Skipping non-Supabase URL:', companyLogo.substring(0, 30) + '...');
        logoUrl = null;
      }
      
      // Save business details to database
      const { error } = await supabase
        .from('companies')
        .upsert({
          owner_id: user.id,
          company_name: companyName,
          web_url: webUrl,
          short_description: shortDescription,
          products_count: parseInt(productsCount || '0'),
          full_description: fullDescription,
          logo_url: logoUrl
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Company information saved successfully",
        variant: "success"
      });
      
      // Continue to next step
      onNext();
      
    } catch (error) {
      console.error('Error saving business details:', error);
      toast({
        title: "Error",
        description: "Failed to save company information",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Basic Information</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-200">
              Company Logo
            </label>
            <div className="flex items-center justify-center">
              <div 
                className="relative w-40 h-40 rounded-lg overflow-hidden bg-zinc-800/50 border-2 border-dashed border-zinc-700 hover:border-primary transition-colors cursor-pointer"
                onClick={triggerFileInput}
              >
                {companyLogo ? (
                  <Image
                    src={companyLogo}
                    alt="Company Logo"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-4">
                    <svg
                      className="w-12 h-12 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-primary hover:text-primary/90"
                    >
                      Upload Logo
                    </Button>
                    <p className="text-xs text-zinc-500 text-center mt-2">
                      Accepted formats: JPG, PNG, GIF, SVG. Max size: 2MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200">
                Company Name <span className="text-primary">*</span>
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200">
                Web Url <span className="text-primary">*</span>
              </label>
              <Input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://"
                className="bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200">
                Describe Your Business in one sentence <span className="text-primary">*</span>
              </label>
              <Input
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A brief one-sentence description of your business"
                className="bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200">
                How many products/services does your business offer? <span className="text-primary">*</span>
              </label>
              <Input
                type="number"
                value={productsCount}
                onChange={(e) => setProductsCount(e.target.value)}
                placeholder="Enter number"
                className="bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200">
                Describe your business in a 4 sentence blurb <span className="text-primary">*</span>
              </label>
              <Textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Tech Innovators Inc. is a leading provider of cutting-edge technology solutions designed to streamline business operations and enhance productivity..."
                className="min-h-[120px] bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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