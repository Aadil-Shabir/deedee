"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface IndustryInfoProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface Category {
  id: string;
  label: string;
  isOpen?: boolean;
  subCategories: string[];
}

const industries: Category[] = [
  {
    id: "healthcare",
    label: "Healthcare",
    subCategories: [
      "Digital Health",
      "Medical Devices",
      "Biotechnology",
      "Healthcare Services",
      "Mental Health",
      "Pharmaceuticals"
    ]
  },
  {
    id: "technology",
    label: "Technology",
    subCategories: [
      "AI/ML",
      "SaaS",
      "Cybersecurity",
      "Cloud Computing",
      "IoT",
      "Big Data"
    ]
  },
  {
    id: "financial",
    label: "Financial Services",
    subCategories: [
      "Banking",
      "Investment & Wealth Management",
      "Insurance",
      "Payment Processing",
      "Blockchain",
      "Lending"
    ]
  },
  {
    id: "retail",
    label: "Retail & Consumer Goods",
    subCategories: [
      "E-commerce",
      "Fashion",
      "Consumer Products",
      "Food & Beverage",
      "Luxury Goods"
    ]
  },
  {
    id: "education",
    label: "Education",
    subCategories: [
      "EdTech",
      "Online Learning",
      "K-12 Education",
      "Higher Education",
      "Professional Training"
    ]
  },
  {
    id: "entertainment",
    label: "Entertainment & Media",
    subCategories: [
      "Gaming",
      "Streaming Services",
      "Social Media",
      "Digital Content",
      "AR/VR"
    ]
  },
  {
    id: "realestate",
    label: "Real Estate & Construction",
    subCategories: [
      "Property Development",
      "Property Management",
      "Construction",
      "Commercial Real Estate",
      "Residential Real Estate"
    ]
  }
];

export function IndustryInfo({ onBack, onSubmit }: IndustryInfoProps) {
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: string[];
  }>({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    if (Object.keys(selectedCategories).length >= 3 && !selectedCategories[category.id]) {
      return; // Don't allow more than 3 categories
    }
    
    if (openCategory === category.id) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category.id);
    }
  };

  const handleSubCategorySelect = (categoryId: string, subCategory: string) => {
    setSelectedCategories(prev => {
      const updatedCategories = { ...prev };
      if (!updatedCategories[categoryId]) {
        updatedCategories[categoryId] = [];
      }
      
      if (updatedCategories[categoryId].includes(subCategory)) {
        updatedCategories[categoryId] = updatedCategories[categoryId].filter(
          sc => sc !== subCategory
        );
        if (updatedCategories[categoryId].length === 0) {
          delete updatedCategories[categoryId];
        }
      } else {
        updatedCategories[categoryId] = [...updatedCategories[categoryId], subCategory];
      }
      
      return updatedCategories;
    });
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

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
          {Object.entries(selectedCategories).map(([categoryId, subCategories]) => (
            <div key={categoryId} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 text-primary rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
                  <span>{industries.find(i => i.id === categoryId)?.label}</span>
                  <button
                    onClick={() => removeCategory(categoryId)}
                    className="hover:text-primary/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-4">
                  {subCategories.map((subCategory) => (
                    <div
                      key={subCategory}
                      className="bg-zinc-800/50 text-zinc-200 rounded-lg px-3 py-1 text-sm flex items-center gap-2"
                    >
                      <span>{subCategory}</span>
                      <button
                        onClick={() => handleSubCategorySelect(categoryId, subCategory)}
                        className="hover:text-zinc-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {industries.map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => handleCategoryClick(category)}
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
                  {category.subCategories.map((subCategory) => (
                    <button
                      key={subCategory}
                      onClick={() => handleSubCategorySelect(category.id, subCategory)}
                      className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${
                        selectedCategories[category.id]?.includes(subCategory)
                          ? "bg-primary/20 text-primary"
                          : "bg-zinc-800/30 text-zinc-300 hover:bg-zinc-800/50"
                      }`}
                    >
                      {subCategory}
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
          onClick={onSubmit}
          className="bg-primary hover:bg-primary/90"
          disabled={Object.keys(selectedCategories).length === 0}
        >
          Complete
        </Button>
      </div>
    </div>
  );
} 