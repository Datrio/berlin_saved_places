'use client';

import { usePlaces } from '@/context/PlacesContext';
import { Place } from '@/types';

function PlaceRow({ place }: { place: Place }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {place.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {place.address}
        </p>
        {place.labels && place.labels.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {place.labels.slice(0, 3).map(label => (
              <span key={label} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PlacesList() {
  const { filteredPlaces } = usePlaces();

  if (filteredPlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No places found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      {filteredPlaces.map(place => (
        <PlaceRow key={place.id} place={place} />
      ))}
    </div>
  );
}
