'use client';

import { useState } from 'react';
import { usePlaces } from '@/context/PlacesContext';
import { defaultFilterState } from '@/types';
import { DISTRICT_COLORS, type BerlinDistrict } from '@/lib/districts';
import { TAG_CATEGORIES, CATEGORY_COLORS } from '@/config/tags';

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

export function FiltersSidebar() {
  const { filters, setFilters, allLabels, allDistricts, placesWithAnnotations } = usePlaces();

  // Count places by category (a place can be in multiple categories)
  const categoryCounts = placesWithAnnotations.reduce((acc, place) => {
    (place.categories || []).forEach(cat => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Count places by district
  const districtCounts = placesWithAnnotations.reduce((acc, place) => {
    acc[place.district] = (acc[place.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const handleDistrictToggle = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter(d => d !== district)
      : [...filters.districts, district];
    setFilters({ ...filters, districts: newDistricts });
  };

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  const hasActiveFilters =
    filters.labels.length > 0 ||
    filters.categories.length > 0 ||
    filters.districts.length > 0 ||
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
              {colors.icon} {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* District Filters */}
      <div className="mb-4 pb-4 border-b border-slate-200 dark:border-gray-700">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Districts
          {filters.districts.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">
              {filters.districts.length}
            </span>
          )}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {allDistricts.map(district => {
            const colors = DISTRICT_COLORS[district as BerlinDistrict] || 'bg-gray-100 text-gray-700 border-gray-200';
            const isSelected = filters.districts.includes(district);
            return (
              <button
                key={district}
                onClick={() => handleDistrictToggle(district)}
                className={`text-xs px-2 py-1 rounded-full transition-all border ${
                  isSelected
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : colors
                }`}
              >
                {district} ({districtCounts[district] || 0})
              </button>
            );
          })}
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
