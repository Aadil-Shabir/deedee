"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Check } from "lucide-react";
import { createClient } from "@/supabase/supabase";
import { useToast } from "@/components/ui/toast-provider";
import { useCompanyContext } from "@/context/company-context";

interface IndustryInfoProps {
  onBack?: () => void;
  onSubmit?: () => void;
}

interface IndustryCategory {
  id: string;
  label: string;
}

interface IndustrySubcategory {
  id: string;
  category_id: string;
  subcategory_name: string;
}

const supabase = createClient();

export function IndustryInfo({ onBack, onSubmit }: IndustryInfoProps = {}) {
  const { 
    isLoading,
    isSubmitting,
    formMode,
    selectedIndustryCategories,
    handleCategorySelect,
    handleRemoveCategory,
    submitIndustryInfo,
    previousStep,
    backToCompanyList
  } = useCompanyContext();

  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [subcategories, setSubcategories] = useState<IndustrySubcategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const { toast } = useToast();
  const didInitialLoad = useRef(false);

  // Fetch industry categories and subcategories from Supabase only once
  useEffect(() => {
    async function fetchIndustryData() {
      if (didInitialLoad.current) return; // Only load once
      
      try {
        setLoadingCategories(true);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("industry_categories")
          .select("id, label");

        if (categoriesError) throw categoriesError;

        // Fetch all subcategories
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from("industry_subcategories")
          .select("id, category_id, subcategory_name");

        if (subcategoriesError) throw subcategoriesError;

        setCategories(categoriesData || []);
        setSubcategories(subcategoriesData || []);
        
        // Open first selected category if any
        const selectedCategoryIds = Object.keys(selectedIndustryCategories || {});
        if (selectedCategoryIds.length > 0) {
          setOpenCategory(selectedCategoryIds[0]);
        }
        
        didInitialLoad.current = true;
      } catch (error) {
        console.error("Error fetching industry data:", error);
        toast({
          title: "Error",
          description: "Failed to load industry data",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchIndustryData();
  }, [toast]); // Remove selectedIndustryCategories from the dependency array

  // Update open category when selected categories change
  useEffect(() => {
    // Open first selected category if any and no category is currently open
    if (openCategory === null) {
      const selectedCategoryIds = Object.keys(selectedIndustryCategories || {});
      if (selectedCategoryIds.length > 0) {
        setOpenCategory(selectedCategoryIds[0]);
      }
    }
  }, [selectedIndustryCategories, openCategory]);

  const handleCategoryClick = (categoryId: string) => {
    const selectedCategories = selectedIndustryCategories || {};
    
    if (Object.keys(selectedCategories).length >= 3 && !selectedCategories[categoryId]) {
      toast({
        title: "Limit Reached",
        description: "You can select up to 3 industry categories",
        variant: "default",
      });
      return; // Don't allow more than 3 categories
    }

    // If this category isn't selected yet, add it
    if (!selectedCategories[categoryId]) {
      handleCategorySelect(categoryId, []);
    }
    
    // Toggle category open/close state
    if (openCategory === categoryId) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryId);
    }
  };

  const handleSubCategorySelect = (categoryId: string, subcategoryId: string) => {
    // Get current subcategories for this category
    const currentSubcategories = selectedIndustryCategories[categoryId] || [];
    
    // Toggle the subcategory
    let updatedSubcategories: string[];
    if (currentSubcategories.includes(subcategoryId)) {
      updatedSubcategories = currentSubcategories.filter(id => id !== subcategoryId);
    } else {
      updatedSubcategories = [...currentSubcategories, subcategoryId];
    }
    
    // Update context with the new selection
    handleCategorySelect(categoryId, updatedSubcategories);
  };

  // Helper function to get subcategory name by ID
  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
    if (!subcategory) {
      console.warn(`Subcategory not found for ID: ${subcategoryId}`);
      return `Unknown Subcategory (${subcategoryId})`;
    }
    return subcategory.subcategory_name;
  };

  // Helper function to get category label by ID
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) {
      console.warn(`Category not found for ID: ${categoryId}`);
      return `Unknown Category (${categoryId})`;
    }
    return category.label;
  };

  // Helper function to get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  const handleSubmit = async () => {
    // Make sure at least one category is selected
    if (Object.keys(selectedIndustryCategories).length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one industry category",
        variant: "destructive",
      });
      return;
    }
    
    const success = await submitIndustryInfo();
    
    if (success) {
      if (onSubmit) {
        onSubmit();
      } else {
        backToCompanyList();
      }
    }
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else {
      previousStep();
    }
  };

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-zinc-400">Loading industry data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-medium text-zinc-200">
          Select up to 3 industry combinations
        </Label>
        <p className="text-sm text-zinc-400">
          You can select up to 3 industry items in total (each category or subcategory counts as one item)
        </p>

        {/* Selected Categories with Subcategories */}
        <div className="space-y-3">
          {Object.entries(selectedIndustryCategories || {}).map(([categoryId, subcategoryIds]) => {
            return (
              <div key={categoryId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 text-primary rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
                    <span>{getCategoryLabel(categoryId)}</span>
                    <button
                      onClick={() => handleRemoveCategory(categoryId)}
                      className="hover:text-primary/80"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {subcategoryIds && subcategoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-4">
                    {subcategoryIds.map((subcategoryId) => (
                      <div
                        key={subcategoryId}
                        className="bg-zinc-800/50 text-zinc-200 rounded-lg px-3 py-1 text-sm flex items-center gap-2"
                      >
                        <span>{getSubcategoryName(subcategoryId)}</span>
                        <button
                          onClick={() => handleSubCategorySelect(categoryId, subcategoryId)}
                          className="hover:text-zinc-400"
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Categories List */}
        <div className="space-y-2 mt-6">
          <h3 className="text-zinc-300 font-medium">Available Industry Categories</h3>
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedIndustryCategories && selectedIndustryCategories[category.id]
                    ? "bg-primary/20 text-primary"
                    : "bg-zinc-800/50 text-zinc-200 hover:bg-zinc-800"
                } ${
                  selectedIndustryCategories && Object.keys(selectedIndustryCategories).length >= 3 &&
                  !(selectedIndustryCategories && selectedIndustryCategories[category.id])
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  selectedIndustryCategories && Object.keys(selectedIndustryCategories).length >= 3 &&
                  !(selectedIndustryCategories && selectedIndustryCategories[category.id])
                }
              >
                <span>{category.label}</span>
                {selectedIndustryCategories && selectedIndustryCategories[category.id] && (
                  <Check className="h-4 w-4" />
                )}
              </button>

              {/* Sub-categories */}
              {openCategory === category.id && (
                <div className="ml-4 grid grid-cols-2 gap-2 p-2">
                  {getSubcategoriesForCategory(category.id).map((subcategory) => (
                    <button
                      type="button"
                      key={subcategory.id}
                      onClick={() => handleSubCategorySelect(category.id, subcategory.id)}
                      className={`px-3 py-2 text-sm rounded-md text-left transition-colors flex items-center justify-between ${
                        selectedIndustryCategories && 
                        selectedIndustryCategories[category.id]?.includes(subcategory.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-zinc-800/30 text-zinc-300 hover:bg-zinc-800/50"
                      }`}
                    >
                      <span>{subcategory.subcategory_name}</span>
                      {selectedIndustryCategories && 
                       selectedIndustryCategories[category.id]?.includes(subcategory.id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackAction}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90"
          disabled={
            !selectedIndustryCategories || 
            Object.keys(selectedIndustryCategories).length === 0 || 
            isSubmitting
          }
        >
          {isSubmitting ? "Saving..." : "Complete"}
        </Button>
      </div>
    </div>
  );
}