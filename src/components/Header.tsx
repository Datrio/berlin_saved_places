'use client';

import { usePlaces } from '@/context/PlacesContext';

export function Header() {
  const { view, setView, filteredPlaces, places } = usePlaces();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Berlin Places
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPlaces.length} of {places.length} places
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'map'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
