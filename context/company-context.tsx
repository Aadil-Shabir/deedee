"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/supabase/supabase";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";

// Types for company data
interface CompanyBasicInfo {
  id: string;
  company_name: string;
  web_url: string;
  short_description: string | null;
  products_count: number | null;
  full_description: string | null;
  logo_url: string | null;
}

interface BusinessDetails {
  headquarters_location: string | null;
  incorporation_date: string | null;
  business_type: string | null;
  sales_type: string | null;
  business_stage: string | null;
  business_model: string | null;
}

interface IndustryInfo {
  categories: Record<string, string[]>; // Category ID -> Array of selected subcategory IDs
}

// Form modes
type FormMode = 'view' | 'edit' | 'create';

// Context type definition
interface CompanyContextType {
  // State getters
  activeCompanyId: string | null;
  allUserCompanies: CompanyBasicInfo[];
  isLoading: boolean;
  formMode: FormMode;
  currentStepIndex: number;
  temporaryId: string | null;
  
  // Form data
  companyName: string;
  webUrl: string;
  shortDescription: string;
  productsCount: string;
  fullDescription: string;
  companyLogo: string | null;
  
  // Business details
  headquarters: string;
  incorporationDate: string;
  businessType: string;
  salesType: string;
  businessStage: string;
  businessModel: string;
  
  // Industry info
  selectedIndustryCategories: Record<string, string[]>;
  
  // Form submission state
  isSubmitting: boolean;
  
  // Actions and setters
  setActiveCompanyId: (id: string | null) => void;
  setCurrentStepIndex: (index: number) => void;
  createNewCompany: () => void;
  editCompany: (companyId: string) => void;
  backToCompanyList: () => void;
  nextStep: () => void;
  previousStep: () => void;
  refreshCompanyData: () => Promise<void>;
  
  // Basic info form setters
  setCompanyName: (name: string) => void;
  setWebUrl: (url: string) => void;
  setShortDescription: (desc: string) => void;
  setProductsCount: (count: string) => void;
  setFullDescription: (desc: string) => void;
  setCompanyLogo: (logo: string | null) => void;
  uploadLogo: (file: File) => Promise<string | null>;
  
  // Business details form setters
  setHeadquarters: (location: string) => void;
  setIncorporationDate: (date: string) => void;
  setBusinessType: (type: string) => void;
  setSalesType: (type: string) => void;
  setBusinessStage: (stage: string) => void;
  setBusinessModel: (model: string) => void;
  
  // Industry form actions
  setSelectedIndustryCategories: (categories: Record<string, string[]>) => void;
  handleCategorySelect: (categoryId: string, subcategoryIds: string[]) => void;
  handleRemoveCategory: (categoryId: string) => void;
  
  // Form submissions
  submitBasicInfo: () => Promise<boolean>;
  submitBusinessDetails: () => Promise<boolean>;
  submitIndustryInfo: () => Promise<boolean>;
  resetForm: () => void;
}

// Create the context with default values
const CompanyContext = createContext<CompanyContextType>({} as CompanyContextType);

// Hook to use the context
export const useCompanyContext = () => useContext(CompanyContext);

interface CompanyContextProviderProps {
  children: ReactNode;
}

export function CompanyContextProvider({ children }: CompanyContextProviderProps) {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  
  // Core company state
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [allUserCompanies, setAllUserCompanies] = useState<CompanyBasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('view');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [temporaryId, setTemporaryId] = useState<string | null>(null);
  
  // Basic info form state
  const [companyName, setCompanyName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [productsCount, setProductsCount] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  // Business details form state
  const [headquarters, setHeadquarters] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [salesType, setSalesType] = useState("");
  const [businessStage, setBusinessStage] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  
  // Industry form state
  const [selectedIndustryCategories, setSelectedIndustryCategories] = useState<Record<string, string[]>>({});
  
  // Update the loadCompanies function inside the useEffect
  useEffect(() => {
    async function loadCompanies() {
      if (!user || loading) {
        console.log("Skipping company load: User not ready or still loading", { user, loading });
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Loading companies for user:", user.id);
        const supabase = createClient();
        
        // First, check if user is actually authenticated with Supabase
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Authentication verification failed:", authError);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          return;
        }
        
        if (!authData?.user) {
          console.error("No authenticated user found in Supabase");
          return;
        }
        
        // Get all companies for this user with more detailed error logging
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('owner_id', user.id);
          
        if (error) {
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          
          // Handle specific error types
          if (error.code === 'PGRST301') {
            toast({
              title: "Database Error",
              description: "You don't have permission to access this data",
              variant: "destructive",
            });
          } else if (error.code === '42P01') {
            toast({
              title: "Database Error",
              description: "The companies table doesn't exist",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error Loading Companies",
              description: error.message || "Unknown error occurred",
              variant: "destructive",
            });
          }
          throw error;
        }
        
        console.log("Successfully loaded companies:", data?.length || 0);
        setAllUserCompanies(data || []);
        
        // If we have companies, set the first one as active by default
        if (data && data.length > 0) {
          console.log("Setting active company:", data[0].id);
          setActiveCompanyId(data[0].id);
        } else {
          console.log("No companies found for this user");
        }
      } catch (error: any) {
        console.error('Error loading companies:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          details: error.details,
          code: error.code
        });
        
        toast({
          title: "Error Loading Companies",
          description: error.message || "Please check console for details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCompanies();
  }, [user, loading, toast]);
  
  // Load company data when active company changes
  useEffect(() => {
    if (formMode === 'view' || formMode === 'create' || !activeCompanyId) return;
    
    const loadCompanyData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Load basic info
        const { data: basicData, error: basicError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', activeCompanyId)
          .single();
          
        if (basicError) throw basicError;
        
        if (basicData) {
          // Set basic info form state
          setCompanyName(basicData.company_name || "");
          setWebUrl(basicData.web_url || "");
          setShortDescription(basicData.short_description || "");
          setProductsCount(basicData.products_count?.toString() || "");
          setFullDescription(basicData.full_description || "");
          setCompanyLogo(basicData.logo_url);
        }
        
        // Load business details
        const { data: detailsData } = await supabase
          .from('business_details')
          .select('*')
          .eq('company_id', activeCompanyId)
          .single();
          
        if (detailsData) {
          setHeadquarters(detailsData.headquarters_location || "");
          setIncorporationDate(detailsData.incorporation_date || "");
          setBusinessType(detailsData.business_type || "");
          setSalesType(detailsData.sales_type || "");
          setBusinessStage(detailsData.business_stage || "");
          setBusinessModel(detailsData.business_model || "");
        }
        
        // Load industry info - UPDATED CODE to match database schema
        const { data: industriesData, error: industriesError } = await supabase
          .from('company_industries')
          .select('category_id, subcategory_id')
          .eq('company_id', activeCompanyId);
          
        if (industriesError) {
          console.error('Error loading industry data:', industriesError);
        }
        
        if (industriesData && industriesData.length > 0) {
          const categories: Record<string, string[]> = {};
          
          // Group subcategories by category
          industriesData.forEach(item => {
            if (item.category_id) {
              if (!categories[item.category_id]) {
                categories[item.category_id] = [];
              }
              
              // Only add subcategory_id if it exists (it's a UUID)
              if (item.subcategory_id) {
                categories[item.category_id].push(item.subcategory_id);
              }
            }
          });
          
          console.log('Loaded industry categories:', categories);
          setSelectedIndustryCategories(categories);
        } else {
          console.log('No industry data found for company');
          setSelectedIndustryCategories({});
        }
        
      } catch (error) {
        console.error('Error loading company data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanyData();
  }, [activeCompanyId, formMode, user]);
  
  // Methods to manage form state
  const resetForm = useCallback(() => {
    // Reset basic info
    setCompanyName("");
    setWebUrl("");
    setShortDescription("");
    setProductsCount("");
    setFullDescription("");
    setCompanyLogo(null);
    
    // Reset business details
    setHeadquarters("");
    setIncorporationDate("");
    setBusinessType("");
    setSalesType("");
    setBusinessStage("");
    setBusinessModel("");
    
    // Reset industry info
    setSelectedIndustryCategories({});
  }, []);
  
  // Methods to manage company state
  const createNewCompany = useCallback(() => {
    // Reset all form data
    setCompanyName('');
    setWebUrl('');
    setShortDescription('');
    setProductsCount('');
    setFullDescription('');
    setCompanyLogo(null);
    
    setHeadquarters('');
    setIncorporationDate('');
    setBusinessType('');
    setSalesType('');
    setBusinessStage('');
    setBusinessModel('');
    
    setSelectedIndustryCategories({});
    
    // Clear active company ID
    setActiveCompanyId(null);
    
    // Set form mode and current step
    setFormMode('create');
    setCurrentStepIndex(0);
    
    // Navigate to profile page if needed
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/company/profile') {
        window.location.href = '/company/profile';
      }
    }
  }, []);
  
  const editCompany = useCallback((companyId: string) => {
    console.log(`Editing company with ID: ${companyId}`, activeCompanyId);
    setFormMode('edit');
    setActiveCompanyId(companyId);
    setCurrentStepIndex(0);
    setTemporaryId(null);
  }, []);
  
  const backToCompanyList = useCallback(() => {
    setFormMode('view');
    resetForm();
  }, [resetForm]);
  
  const nextStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      // Allow stepping to 0, 1, or 2 (for a 3-step process)
      const nextIndex = prevIndex + 1;
      console.log(`Moving from step ${prevIndex} to ${nextIndex}`);
      return Math.min(nextIndex, 2); // Cap at 2 (0-indexed for 3 steps)
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      const nextIndex = Math.max(prevIndex - 1, 0);
      console.log(`Moving from step ${prevIndex} to ${nextIndex}`);
      return nextIndex;
    });
  }, []);
  
  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string, subcategoryIds: string[]) => {
    setSelectedIndustryCategories(prev => {
      const updated = { ...prev };
      if (subcategoryIds.length === 0) {
        delete updated[categoryId];
      } else {
        updated[categoryId] = subcategoryIds;
      }
      return updated;
    });
  }, []);
  
  const handleRemoveCategory = useCallback((categoryId: string) => {
    setSelectedIndustryCategories(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  }, []);
  
  // Logo upload helper
  const uploadLogo = useCallback(async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.storage
        .from("company-logos")
        .upload(`${user.id}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Logo upload error:", error);
        toast({
          title: "Warning",
          description: "Failed to upload logo",
          variant: "destructive",
        });
        return null;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("company-logos")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      return null;
    }
  }, [user, toast]);
  
  // Form submissions
  const submitBasicInfo = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save company information",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      // Prepare company data
      const companyData: {
        owner_id: string;
        company_name: string;
        web_url: string;
        short_description: string;
        products_count: number;
        full_description: string;
        logo_url: string | null;
        updated_at: string;
        id?: string;  // Optional id property
      } = {
        owner_id: user.id,
        company_name: companyName,
        web_url: webUrl,
        short_description: shortDescription,
        products_count: parseInt(productsCount || "0"),
        full_description: fullDescription,
        logo_url: companyLogo,
        updated_at: new Date().toISOString()
      };
      
      // For existing companies, add the ID for upsert
      if (formMode === 'edit' && activeCompanyId) {
        companyData.id = activeCompanyId;
      }
      
      // Save or update company
      const { data, error } = await supabase
        .from("companies")
        .upsert(companyData)
        .select("id")
        .single();

      if (error) throw error;
      
      // Always set the new company as the active company
      const newCompanyId = data.id;
      if (newCompanyId) {
        setActiveCompanyId(newCompanyId);
        
        // Log the current active company ID for debugging
        console.log("Company created/updated with ID:", newCompanyId);
      } else {
        console.error("No company ID returned from upsert operation");
        return false;
      }
      
      toast({
        title: "Success",
        description: "Company information saved successfully",
        variant: "success",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving company basic info:", error);
      toast({
        title: "Error",
        description: "Failed to save company information",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, companyName, webUrl, shortDescription, productsCount, fullDescription, companyLogo, formMode, activeCompanyId, toast]);

  const submitBusinessDetails = useCallback(async (): Promise<boolean> => {
    if (!user || (!activeCompanyId && formMode !== 'create')) {
      toast({
        title: "Error",
        description: "Please complete company basic information first",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      // If we're creating a new company and no activeCompanyId exists yet,
      // it means basic info wasn't saved properly
      if (formMode === 'create' && !activeCompanyId) {
        toast({
          title: "Error", 
          description: "Please save company basic information first",
          variant: "destructive",
        });
        return false;
      }
      
      const companyId = activeCompanyId;
      if (!companyId) {
        throw new Error("No company ID available");
      }
      
      // Clean up any existing business details for this company
      await supabase
        .from("business_details")
        .delete()
        .eq("company_id", companyId);
      
      // Insert new business details
      const { error } = await supabase
        .from("business_details")
        .insert({
          company_id: companyId,
          headquarters_location: headquarters,
          incorporation_date: incorporationDate,
          business_type: businessType,
          sales_type: salesType,
          business_stage: businessStage,
          business_model: businessModel
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Business details saved successfully",
        variant: "success",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving business details:", error);
      toast({
        title: "Error",
        description: "Failed to save business details",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, activeCompanyId, formMode, headquarters, incorporationDate, businessType, salesType, businessStage, businessModel, toast]);
  
  // Refresh all company data
 const refreshCompanyData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Get all companies for this user
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name, web_url, short_description, products_count, full_description, logo_url')
        .eq('owner_id', user.id);
        
      if (error) throw error;
      
      setAllUserCompanies(data || []);
    } catch (error) {
      console.error('Error refreshing companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  const submitIndustryInfo = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save industry information",
        variant: "destructive",
      });
      return false;
    }
    
    if (!activeCompanyId) {
      toast({
        title: "Error",
        description: "No company selected. Please complete previous steps first.",
        variant: "destructive",
      });
      return false;
    }
    
    if (Object.keys(selectedIndustryCategories).length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one industry",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      const companyId = activeCompanyId;
      console.log("Saving industry info for company:", companyId);
      
      // Delete existing industry data
      await supabase
        .from("company_industries")
        .delete()
        .eq("company_id", companyId);
      
      // Prepare new industry data
      const industryEntries: Array<{
        company_id: string;
        category_id: string;
        subcategory_id: string | null;
      }> = [];
      
      // Count total industries (all subcategories + categories without subcategories)
      let totalIndustriesCount = 0;
      
      // Create individual entries for each category-subcategory pair
      // But limit to a maximum of 3 total entries
      for (const [categoryId, subcategoryIds] of Object.entries(selectedIndustryCategories)) {
        if (subcategoryIds && subcategoryIds.length > 0) {
          // Add entries for each subcategory up to the limit
          for (const subcategoryId of subcategoryIds) {
            if (totalIndustriesCount >= 3) {
              console.warn('Reached maximum of 3 industries, skipping remaining subcategories');
              break;
            }
            
            // Validate that subcategoryId is a valid UUID
            if (subcategoryId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subcategoryId)) {
              industryEntries.push({
                company_id: companyId,
                category_id: categoryId,
                subcategory_id: subcategoryId
              });
              totalIndustriesCount++;
            } else {
              console.warn(`Skipping invalid subcategory ID: ${subcategoryId}`);
            }
          }
        } else {
          // For categories without subcategories, add a single entry with null subcategory
          if (totalIndustriesCount >= 3) {
            console.warn('Reached maximum of 3 industries, skipping category with no subcategories');
            continue;
          }
          
          industryEntries.push({
            company_id: companyId,
            category_id: categoryId,
            subcategory_id: null
          });
          totalIndustriesCount++;
        }
        
        // If we've reached the limit, stop adding more
        if (totalIndustriesCount >= 3) {
          break;
        }
      }
      
      // Insert the new entries (if any)
      if (industryEntries.length > 0) {
        console.log('Saving industry entries:', industryEntries);
        const { error } = await supabase
          .from("company_industries")
          .insert(industryEntries);
          
        if (error) {
          console.error("Error inserting industry data:", error);
          throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Industry information saved successfully",
        variant: "success",
      });
      
      // Complete the form process
      refreshCompanyData();
      setFormMode('view');
        
      return true;
    } catch (error) {
      console.error("Error saving industry information:", error);
      toast({
        title: "Error",
        description: "Failed to save industry information", 
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, activeCompanyId, selectedIndustryCategories, refreshCompanyData, toast]);
  

  return (
    <CompanyContext.Provider value={{
      // State getters
      activeCompanyId,
      allUserCompanies,
      isLoading,
      formMode,
      currentStepIndex,
      temporaryId,
      
      // Form data
      companyName,
      webUrl,
      shortDescription,
      productsCount,
      fullDescription,
      companyLogo,
      
      // Business details
      headquarters,
      incorporationDate,
      businessType,
      salesType,
      businessStage,
      businessModel,
      
      // Industry info
      selectedIndustryCategories,
      
      // Form submission state
      isSubmitting,
      
      // Actions and setters
      setActiveCompanyId,
      setCurrentStepIndex,
      createNewCompany,
      editCompany,
      backToCompanyList,
      nextStep,
      previousStep,
      refreshCompanyData,
      
      // Basic info form setters
      setCompanyName,
      setWebUrl,
      setShortDescription,
      setProductsCount,
      setFullDescription,
      setCompanyLogo,
      uploadLogo,
      
      // Business details form setters
      setHeadquarters,
      setIncorporationDate,
      setBusinessType,
      setSalesType,
      setBusinessStage,
      setBusinessModel,
      
      // Industry form actions
      setSelectedIndustryCategories,
      handleCategorySelect,
      handleRemoveCategory,
        
      // Form submissions
      submitBasicInfo,
      submitBusinessDetails,
      submitIndustryInfo,
      resetForm
    }}>
      {children}
    </CompanyContext.Provider>
  );
}