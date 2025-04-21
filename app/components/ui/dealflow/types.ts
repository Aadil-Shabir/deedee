export type MatchCategoryType = 'all' | 'ultimate' | 'super' | 'strong' | 'match';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  location: string;
  description: string;
  industry: string;
  founded: number;
  stage: string;
  match: number;
  matchCategory: MatchCategoryType;
  matchPercentage: number;
  revenue: number;
  revenueGrowth: number;
  ebitda: number;
  lastContactDate: string;
  status: 'active' | 'pending' | 'declined' | 'completed';
  isHot?: boolean, 
}

export interface DealflowFilters {
  location?: string;
  businessType?: string[];
  revenueRange?: {
    min?: number;
    max?: number;
  };
  stage?: string[];
  status?: string[];
  [key: string]: any;
}

export interface AISearchQuery {
  query: string;
}

export interface CompanyCardProps {
  company: Company;
  category?: MatchCategoryType;
  onViewDetails: (company: Company) => void;
}

export interface MatchCategory {
  type: MatchCategoryType;
  count: number;
}

export interface MatchCategoryProps {
  category: MatchCategoryType;
  count: number;
  isActive: boolean;
  onClick: (category: MatchCategoryType) => void;
}

export interface MatchCategoriesProps {
  categories: MatchCategory[];
  activeCategory: MatchCategoryType;
  onCategoryChange: (category: MatchCategoryType) => void;
}

export interface CompanyDetailsModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface AISearchBarProps {
  onSearch: (searchQuery: AISearchQuery) => void;
  defaultQuery?: string;
  isLoading?: boolean;
}

export interface SearchResultsFiltersProps {
  filters: DealflowFilters;
  totalResults: number;
}

export interface DealflowFilterProps {
  industries: string[];
  stages: string[];
  activeFilters: {
    industries: string[];
    stages: string[];
    matchCategories: MatchCategoryType[];
  };
  onFilterChange: (type: 'industries' | 'stages', value: string) => void;
}

export interface DealflowCategoriesProps {
  categories: Array<{
    category: MatchCategoryType;
    count: number;
  }>;
  activeCategory: MatchCategoryType;
  onCategoryChange: (category: MatchCategoryType) => void;
} 