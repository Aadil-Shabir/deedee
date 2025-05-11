import React from 'react';
import { MatchCategoriesProps, MatchCategoryType } from './types';
import MatchCategory from './match-category';

export function MatchCategories({
  categories,
  activeCategory,
  onCategoryChange,
}: MatchCategoriesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {categories.map((category) => (
        <MatchCategory
          key={category.type}
          category={category.type}
          count={category.count}
          isActive={category.type === activeCategory}
          onClick={onCategoryChange}
        />
      ))}
    </div>
  );
} 