'use client';

import { usePlaces } from '@/context/PlacesContext';
import { defaultFilterState } from '@/types';

export function FiltersSidebar() {
  const { filters, setFilters, allLabels } = usePlaces();

  const handleLabelToggle = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label];
    setFilters({ ...filters, labels: newLabels });
  };

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  const hasActiveFilters =
    filters.labels.length > 0 ||
    filters.minGoogleRating > 0 ||
    filters.maxGoogleRating < 5 ||
    filters.minScore > 0 ||
    filters.maxScore < 5 ||
    filters.hasNotes !== null;

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

      {/* Labels */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Labels
        </h3>
        {allLabels.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-gray-500 italic">
            Add labels to places to filter by them
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allLabels.map(label => (
              <button
                key={label}
                onClick={() => handleLabelToggle(label)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${
                  filters.labels.includes(label)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Google Rating */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Google Rating
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minGoogleRating}
            onChange={(e) =>
              setFilters({ ...filters, minGoogleRating: parseFloat(e.target.value) })
            }
            className="flex-1 accent-emerald-500"
          />
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 w-10 text-right">
            {filters.minGoogleRating}+
          </span>
        </div>
      </div>

      {/* My Score */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          My Score
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={filters.minScore}
            onChange={(e) =>
              setFilters({ ...filters, minScore: parseInt(e.target.value) })
            }
            className="flex-1 accent-purple-500"
          />
          <span className="text-sm font-bold text-purple-600 dark:text-purple-400 w-10 text-right">
            {filters.minScore}+
          </span>
        </div>
      </div>

      {/* Has Notes */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Notes
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setFilters({
                ...filters,
                hasNotes: filters.hasNotes === true ? null : true,
              })
            }
            className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
              filters.hasNotes === true
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600'
            }`}
          >
            Has notes
          </button>
          <button
            onClick={() =>
              setFilters({
                ...filters,
                hasNotes: filters.hasNotes === false ? null : false,
              })
            }
            className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
              filters.hasNotes === false
                ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600'
            }`}
          >
            No notes
          </button>
        </div>
      </div>
    </aside>
  );
}
