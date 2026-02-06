'use client';

import { usePlaces } from '@/context/PlacesContext';

export function Header() {
  const { view, setView, filteredPlaces, places, userLocation, isLocating, requestLocation, clearLocation } = usePlaces();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Berlin Places
          </h1>
          <p className="text-sm text-indigo-100">
            {filteredPlaces.length} of {places.length} places
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Location button */}
          <button
            onClick={userLocation ? clearLocation : requestLocation}
            disabled={isLocating}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              userLocation
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            } ${isLocating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isLocating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Locating...
              </>
            ) : userLocation ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Near me
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Share location
              </>
            )}
          </button>

          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                view === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                view === 'map'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-white hover:bg-white/10'
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
