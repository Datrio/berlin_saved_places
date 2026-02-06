'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { FiltersSidebar } from '@/components/FiltersSidebar';
import { PlacesList } from '@/components/PlacesList';
import { SearchBar } from '@/components/SearchBar';
import { SortControl } from '@/components/SortControl';
import { MapView } from '@/components/MapView';
import { usePlaces } from '@/context/PlacesContext';

export default function Home() {
  const { view } = usePlaces();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header onOpenFilters={() => setIsMobileFiltersOpen(true)} />

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <FiltersSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw]">
              <FiltersSidebar onClose={() => setIsMobileFiltersOpen(false)} />
            </div>
          </div>
        )}

        <main className={`flex-1 p-4 md:p-6 flex flex-col ${view === 'list' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <div className="flex items-center gap-2 md:gap-4 mb-4 flex-shrink-0">
            <div className="flex-1">
              <SearchBar />
            </div>
            <SortControl />
          </div>

          <div className="flex-1 min-h-0">
            {view === 'list' ? <PlacesList /> : <MapView />}
          </div>
        </main>
      </div>
    </div>
  );
}
