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
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Labels */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Labels
        </h3>
        {allLabels.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No labels yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {allLabels.map(label => (
              <button
                key={label}
                onClick={() => handleLabelToggle(label)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  filters.labels.includes(label)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Google Rating
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minGoogleRating}
            onChange={(e) =>
              setFilters({ ...filters, minGoogleRating: parseFloat(e.target.value) })
            }
            className="flex-1"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
            {filters.minGoogleRating}+
          </span>
        </div>
      </div>

      {/* My Score */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          My Score
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={filters.minScore}
            onChange={(e) =>
              setFilters({ ...filters, minScore: parseInt(e.target.value) })
            }
            className="flex-1"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
            {filters.minScore}+
          </span>
        </div>
      </div>

      {/* Has Notes */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filters.hasNotes === true
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filters.hasNotes === false
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            No notes
          </button>
        </div>
      </div>
    </aside>
  );
}
