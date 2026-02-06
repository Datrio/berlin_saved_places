'use client';

import { usePlaces } from '@/context/PlacesContext';

interface HeaderProps {
  onOpenFilters?: () => void;
}

export function Header({ onOpenFilters }: HeaderProps) {
  const { view, setView, filteredPlaces, places, userLocation, isLocating, requestLocation, clearLocation } = usePlaces();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 md:px-6 py-3 md:py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Berlin Places
            </h1>
            <p className="text-xs md:text-sm text-indigo-100">
              {filteredPlaces.length} of {places.length} places
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Location button */}
          <button
            onClick={userLocation ? clearLocation : requestLocation}
            disabled={isLocating}
            className={`p-2 md:px-4 md:py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              userLocation
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            } ${isLocating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isLocating ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="hidden md:inline">
              {isLocating ? 'Locating...' : userLocation ? 'Near me' : 'Share location'}
            </span>
          </button>

          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                view === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="hidden md:inline">List</span>
              <svg className="md:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                view === 'map'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="hidden md:inline">Map</span>
              <svg className="md:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
