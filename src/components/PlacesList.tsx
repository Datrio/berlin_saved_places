'use client';

import { usePlaces } from '@/context/PlacesContext';
import { PlaceCard } from './PlaceCard';

export function PlacesList() {
  const { filteredPlaces, isLoading } = usePlaces();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading places...</div>
      </div>
    );
  }

  if (filteredPlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">No places found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Try adjusting your filters or import some places
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPlaces.map(place => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
