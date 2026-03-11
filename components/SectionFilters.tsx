'use client';

import { Search, X } from 'lucide-react';

interface SectionFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearFilters: () => void;
  categories: string[];
  searchPlaceholder?: string;
}

export default function SectionFilters({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
  categories,
  searchPlaceholder = 'Search items...'
}: SectionFiltersProps) {
  const hasActiveFilters = searchTerm || selectedCategories.length > 0;

  return (
    <div className="mb-12 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-white rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-french-blue transition-colors"
        />
      </div>

      {/* Category Filters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-french-blue text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-400">
          {searchTerm && <span>Searching for "{searchTerm}"</span>}
          {searchTerm && selectedCategories.length > 0 && <span> • </span>}
          {selectedCategories.length > 0 && (
            <span>{selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected</span>
          )}
        </div>
      )}
    </div>
  );
}
