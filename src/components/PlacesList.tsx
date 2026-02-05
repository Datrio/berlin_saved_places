'use client';

import { usePlaces } from '@/context/PlacesContext';
import { PlaceWithAnnotation } from '@/types';

function PlaceRow({ place }: { place: PlaceWithAnnotation }) {
  const { setSelectedPlaceId } = usePlaces();

  // Color based on rating
  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-gray-100 text-gray-600';
    if (rating >= 4.8) return 'bg-emerald-500 text-white';
    if (rating >= 4.5) return 'bg-green-500 text-white';
    if (rating >= 4.0) return 'bg-lime-500 text-white';
    return 'bg-yellow-500 text-white';
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-200 text-gray-500';
    if (score >= 5) return 'bg-purple-500 text-white';
    if (score >= 4) return 'bg-indigo-500 text-white';
    if (score >= 3) return 'bg-blue-500 text-white';
    return 'bg-sky-400 text-white';
  };

  // Category color from address
  const getCategoryColor = (address: string) => {
    const cat = address.toLowerCase();
    if (cat.includes('japanese') || cat.includes('sushi') || cat.includes('ramen')) return 'bg-red-100 text-red-700 border-red-200';
    if (cat.includes('korean')) return 'bg-pink-100 text-pink-700 border-pink-200';
    if (cat.includes('chinese')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (cat.includes('thai')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (cat.includes('italian')) return 'bg-green-100 text-green-700 border-green-200';
    if (cat.includes('bar') || cat.includes('cocktail')) return 'bg-violet-100 text-violet-700 border-violet-200';
    if (cat.includes('cafe') || cat.includes('coffee')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const category = place.address.split(',')[0];

  return (
    <div
      onClick={() => setSelectedPlaceId(place.id)}
      className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors"
    >
      {/* Rating badge */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${getRatingColor(place.rating)}`}>
        {place.rating ? place.rating.toFixed(1) : '—'}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {place.name}
          </h3>
          {place.annotation?.score && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getScoreColor(place.annotation.score)}`}>
              {place.annotation.score}★
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(place.address)}`}>
            {category}
          </span>
          {place.annotation?.labels.slice(0, 2).map(label => (
            <span key={label} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Notes indicator */}
      {place.annotation?.notes && (
        <div className="text-gray-400" title={place.annotation.notes}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Arrow */}
      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

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
