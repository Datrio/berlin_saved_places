'use client';

import { PlaceWithAnnotation } from '@/types';
import { usePlaces } from '@/context/PlacesContext';

interface PlaceCardProps {
  place: PlaceWithAnnotation;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { setSelectedPlaceId } = usePlaces();

  return (
    <div
      onClick={() => setSelectedPlaceId(place.id)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate flex-1">
          {place.name}
        </h3>
        <div className="flex items-center gap-2 ml-2">
          {place.rating && (
            <span className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded">
              ★ {place.rating.toFixed(1)}
            </span>
          )}
          {place.annotation?.score && (
            <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
              {place.annotation.score}/5
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
        {place.address}
      </p>

      {place.annotation?.labels && place.annotation.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {place.annotation.labels.slice(0, 3).map(label => (
            <span
              key={label}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full"
            >
              {label}
            </span>
          ))}
          {place.annotation.labels.length > 3 && (
            <span className="text-xs text-gray-500">
              +{place.annotation.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {place.annotation?.notes && (
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate italic">
          "{place.annotation.notes}"
        </p>
      )}
    </div>
  );
}
