"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { createClient } from "@/supabase/supabase";
import { useToast } from "@/components/ui/toast-provider";
import { saveCompanyIndustries } from "@/actions/actions.industries";
import { useUser } from "@/hooks/use-user";
import { getCompanyIndustries } from "@/actions/actions.industries";

interface IndustryInfoProps {
  onBack: () => void;
  onSubmit: () => void;
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

export function IndustryInfo({ onBack, onSubmit }: IndustryInfoProps) {
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [subcategories, setSubcategories] = useState<IndustrySubcategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: string[];
  }>({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch industry categories and subcategories from Supabase
  useEffect(() => {
    async function fetchIndustryData() {
      try {
        setLoading(true);

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
      } catch (error) {
        console.error("Error fetching industry data:", error);
        toast({
          title: "Error",
          description: "Failed to load industry data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchIndustryData();
  }, [toast]);

  useEffect(() => {
    async function loadSavedIndustries() {
      if (!user) return;

      try {
        const result = await getCompanyIndustries(user.id);

        if (result.success && result.data) {
          setSelectedCategories(result.data);
        }
      } catch (error) {
        console.error("Error loading saved industry data:", error);
      }
    }

    if (user && !loading) {
      loadSavedIndustries();
    }
  }, [user, loading]);

  const handleCategoryClick = (categoryId: string) => {
    if (Object.keys(selectedCategories).length >= 3 && !selectedCategories[categoryId]) {
      return; // Don't allow more than 3 categories
    }

    if (openCategory === categoryId) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryId);
    }
  };

  const handleSubCategorySelect = (categoryId: string, subcategoryId: string) => {
    setSelectedCategories((prev) => {
      const updatedCategories = { ...prev };

      if (!updatedCategories[categoryId]) {
        updatedCategories[categoryId] = [];
      }

      if (updatedCategories[categoryId].includes(subcategoryId)) {
        updatedCategories[categoryId] = updatedCategories[categoryId].filter(
          (id) => id !== subcategoryId
        );

        if (updatedCategories[categoryId].length === 0) {
          delete updatedCategories[categoryId];
        }
      } else {
        updatedCategories[categoryId] = [...updatedCategories[categoryId], subcategoryId];
      }

      return updatedCategories;
    });
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  // Helper function to get subcategory name by ID
  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
    if (!subcategory) {
      console.warn(`Subcategory not found for ID: ${subcategoryId}`);
      return `Unknown Subcategory`;
    }
    return subcategory.subcategory_name;
  };

  // Helper function to get category label by ID
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) {
      console.warn(`Category not found for ID: ${categoryId}`);
      return `Unknown Category`;
    }
    return category.label;
  };

  // Helper function to get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter((sub) => sub.category_id === categoryId);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save industry information",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(selectedCategories).length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one industry",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveCompanyIndustries(user.id, selectedCategories);

      if (result.success) {
        toast({
          title: "Success",
          description: "Industry information saved successfully",
          variant: "success",
        });
        onSubmit(); // Continue with the form flow
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save industry information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving industry information:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
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
          Select up to 3 industries that best describe your business
        </Label>
        <p className="text-sm text-zinc-400">
          {3 - Object.keys(selectedCategories).length} categories remaining
        </p>

        {/* Selected Categories with Subcategories */}
        <div className="space-y-3">
          {Object.entries(selectedCategories).map(([categoryId, subcategoryIds]) => {
            return (
              <div key={categoryId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 text-primary rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
                    <span>{getCategoryLabel(categoryId)}</span>
                    <button
                      onClick={() => removeCategory(categoryId)}
                      className="hover:text-primary/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {subcategoryIds.length > 0 && (
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
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedCategories[category.id]
                    ? "bg-primary/20 text-primary"
                    : "bg-zinc-800/50 text-zinc-200 hover:bg-zinc-800"
                } ${
                  Object.keys(selectedCategories).length >= 3 &&
                  !selectedCategories[category.id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  Object.keys(selectedCategories).length >= 3 &&
                  !selectedCategories[category.id]
                }
              >
                {category.label}
              </button>

              {/* Sub-categories */}
              {openCategory === category.id && (
                <div className="ml-4 grid grid-cols-2 gap-2 p-2">
                  {getSubcategoriesForCategory(category.id).map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubCategorySelect(category.id, subcategory.id)}
                      className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                        selectedCategories[category.id]?.includes(subcategory.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-zinc-800/30 text-zinc-300 hover:bg-zinc-800/50"
                      }`}
                    >
                      {subcategory.subcategory_name}
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
          onClick={onBack}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90"
          disabled={Object.keys(selectedCategories).length === 0 || isSaving}
        >
          {isSaving ? "Saving..." : "Complete"}
        </Button>
      </div>
    </div>
  );
}