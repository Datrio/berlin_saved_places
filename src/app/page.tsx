'use client';

import { Header } from '@/components/Header';
import { FiltersSidebar } from '@/components/FiltersSidebar';
import { PlacesList } from '@/components/PlacesList';
import { SearchBar } from '@/components/SearchBar';
import { SortControl } from '@/components/SortControl';
import { usePlaces } from '@/context/PlacesContext';

export default function Home() {
  const { view } = usePlaces();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <FiltersSidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <SearchBar />
            </div>
            <SortControl />
          </div>

          {view === 'list' ? (
            <PlacesList />
          ) : (
            <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Map view coming soon...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
