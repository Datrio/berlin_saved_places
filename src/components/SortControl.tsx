'use client';

import { usePlaces } from '@/context/PlacesContext';
import { SortField, SortDirection } from '@/types';

export function SortControl() {
  const { sort, setSort } = usePlaces();

  const handleFieldChange = (field: SortField) => {
    if (sort.field === field) {
      // Toggle direction
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  const fields: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Google Rating' },
    { value: 'score', label: 'My Score' },
    { value: 'dateAdded', label: 'Date Added' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
      <select
        value={sort.field}
        onChange={(e) => handleFieldChange(e.target.value as SortField)}
        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {fields.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          setSort({
            ...sort,
            direction: sort.direction === 'asc' ? 'desc' : 'asc',
          })
        }
        className="p-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        title={sort.direction === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sort.direction === 'asc' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
}
