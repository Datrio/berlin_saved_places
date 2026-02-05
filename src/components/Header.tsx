'use client';

import { usePlaces } from '@/context/PlacesContext';

export function Header() {
  const { view, setView, filteredPlaces, places } = usePlaces();

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
