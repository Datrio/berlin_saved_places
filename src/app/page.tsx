'use client';

import { Header } from '@/components/Header';
import { FiltersSidebar } from '@/components/FiltersSidebar';
import { PlacesList } from '@/components/PlacesList';
import { SearchBar } from '@/components/SearchBar';
import { SortControl } from '@/components/SortControl';
import { MapView } from '@/components/MapView';
import { usePlaces } from '@/context/PlacesContext';

export default function Home() {
  const { view } = usePlaces();

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 min-h-0">
        <FiltersSidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <SearchBar />
            </div>
            <SortControl />
          </div>

          {view === 'list' ? <PlacesList /> : <MapView />}
        </main>
      </div>
    </div>
  );
}
