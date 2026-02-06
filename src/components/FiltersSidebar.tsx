'use client';

import { useState } from 'react';
import { usePlaces } from '@/context/PlacesContext';
import { defaultFilterState } from '@/types';

// Tag categories
const TAG_CATEGORIES: Record<string, { label: string; color: string; tags: string[] }> = {
  cuisine: {
    label: 'Cuisine',
    color: 'text-red-600',
    tags: ['japanese', 'korean', 'chinese', 'thai', 'vietnamese', 'italian', 'german', 'french', 'mexican', 'georgian', 'yemeni', 'peruvian', 'american', 'european', 'middle-eastern', 'taiwanese', 'sichuan', 'isaan', 'latin', 'russian']
  },
  type: {
    label: 'Type',
    color: 'text-blue-600',
    tags: ['restaurant', 'bar', 'cafe', 'wine-bar', 'brewery', 'bistro', 'izakaya', 'pub', 'bakery', 'street-food', 'takeout', 'fine-dining', 'hotel']
  },
  vibe: {
    label: 'Vibe',
    color: 'text-purple-600',
    tags: ['date-night', 'casual', 'upscale', 'cozy', 'trendy', 'intimate', 'special-occasion', 'nightlife', 'outdoor', 'brunch']
  },
  style: {
    label: 'Style',
    color: 'text-amber-600',
    tags: ['cocktails', 'speakeasy', 'traditional', 'modern', 'authentic', 'fusion', 'natural-wine', 'music', 'vinyl', 'art']
  },
  food: {
    label: 'Food',
    color: 'text-green-600',
    tags: ['ramen', 'sushi', 'pizza', 'tacos', 'bao', 'curry', 'wagyu', 'onigiri', 'khachapuri', 'banh-mi', 'ceviche', 'dim-sum', 'bibimbap', 'mussels', 'seafood', 'meat', 'dumplings', 'pastries', 'snacks', 'tapas', 'spicy', 'omakase', 'all-you-can-eat']
  },
  special: {
    label: 'Special',
    color: 'text-pink-600',
    tags: ['top-rated', 'expensive', 'unique', 'vegan', 'cat-cafe', 'beer', 'sake', 'tea', 'bubble-tea', 'coffee', 'beer-garden', 'himym']
  }
};

function CategorySection({
  category,
  config,
  selectedLabels,
  availableLabels,
  onToggle
}: {
  category: string;
  config: { label: string; color: string; tags: string[] };
  selectedLabels: string[];
  availableLabels: string[];
  onToggle: (label: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Only show tags that exist in the data
  const visibleTags = config.tags.filter(tag => availableLabels.includes(tag));
  const selectedCount = visibleTags.filter(tag => selectedLabels.includes(tag)).length;

  if (visibleTags.length === 0) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-2"
      >
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
          {config.label}
          {selectedCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] normal-case">
              {selectedCount}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map(tag => (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`text-xs px-2 py-1 rounded-full transition-all ${
                selectedLabels.includes(tag)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Category colors for the main list categories
const CATEGORY_COLORS: Record<string, { bg: string; bgActive: string; icon: string }> = {
  food: { bg: 'bg-orange-100 text-orange-700 border-orange-200', bgActive: 'bg-orange-500 text-white', icon: '🍽️' },
  drinks: { bg: 'bg-purple-100 text-purple-700 border-purple-200', bgActive: 'bg-purple-500 text-white', icon: '🍸' },
  coffee: { bg: 'bg-amber-100 text-amber-700 border-amber-200', bgActive: 'bg-amber-500 text-white', icon: '☕' },
};

export function FiltersSidebar() {
  const { filters, setFilters, allLabels } = usePlaces();

  const handleLabelToggle = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label];
    setFilters({ ...filters, labels: newLabels });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  const hasActiveFilters =
    filters.labels.length > 0 ||
    filters.categories.length > 0 ||
    filters.minGoogleRating > 0 ||
    filters.minScore > 0 ||
    filters.hasNotes !== null;

  // Find uncategorized tags
  const categorizedTags = Object.values(TAG_CATEGORIES).flatMap(c => c.tags);
  const uncategorizedTags = allLabels.filter(tag => !categorizedTags.includes(tag));

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-slate-200 dark:border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-pink-600 dark:text-pink-400 hover:underline font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="mb-4 pb-4 border-b border-slate-200 dark:border-gray-700">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Lists</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`text-sm px-3 py-1.5 rounded-full transition-all font-medium border ${
                filters.categories.includes(category)
                  ? colors.bgActive
                  : colors.bg
              }`}
            >
              {colors.icon} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filters */}
      <div className="mb-4 pb-4 border-b border-slate-200 dark:border-gray-700">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Google Rating</span>
            <span className="text-sm font-bold text-emerald-600">{filters.minGoogleRating}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minGoogleRating}
            onChange={(e) => setFilters({ ...filters, minGoogleRating: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Score</span>
            <span className="text-sm font-bold text-purple-600">{filters.minScore}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
            className="w-full accent-purple-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilters({ ...filters, hasNotes: filters.hasNotes === true ? null : true })}
            className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium flex-1 ${
              filters.hasNotes === true
                ? 'bg-amber-400 text-white'
                : 'bg-white dark:bg-gray-700 text-slate-500 border border-slate-200 dark:border-gray-600'
            }`}
          >
            Has notes
          </button>
          <button
            onClick={() => setFilters({ ...filters, hasNotes: filters.hasNotes === false ? null : false })}
            className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium flex-1 ${
              filters.hasNotes === false
                ? 'bg-slate-400 text-white'
                : 'bg-white dark:bg-gray-700 text-slate-500 border border-slate-200 dark:border-gray-600'
            }`}
          >
            No notes
          </button>
        </div>
      </div>

      {/* Tag Categories */}
      <div className="space-y-1">
        {Object.entries(TAG_CATEGORIES).map(([key, config]) => (
          <CategorySection
            key={key}
            category={key}
            config={config}
            selectedLabels={filters.labels}
            availableLabels={allLabels}
            onToggle={handleLabelToggle}
          />
        ))}

        {/* Uncategorized tags */}
        {uncategorizedTags.length > 0 && (
          <CategorySection
            category="other"
            config={{ label: 'Other', color: 'text-slate-500', tags: uncategorizedTags }}
            selectedLabels={filters.labels}
            availableLabels={allLabels}
            onToggle={handleLabelToggle}
          />
        )}
      </div>
    </aside>
  );
}
