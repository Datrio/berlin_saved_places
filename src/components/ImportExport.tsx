'use client';

import { useRef } from 'react';
import { usePlaces } from '@/context/PlacesContext';
import { Place } from '@/types';

export function ImportExport() {
  const { importPlaces, exportData, places } = usePlaces();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Handle different import formats
        if (Array.isArray(data)) {
          // Raw places array
          importPlaces(data as Place[]);
        } else if (data.places && Array.isArray(data.places)) {
          // Full backup format with places and annotations
          importPlaces(data.places);
          // Note: annotations would need to be imported separately if present
        }

        alert(`Imported ${Array.isArray(data) ? data.length : data.places?.length || 0} places successfully!`);
      } catch (error) {
        alert('Failed to import: Invalid JSON file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `berlin-places-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        id="import-file"
      />
      <label
        htmlFor="import-file"
        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
      >
        Import
      </label>
      <button
        onClick={handleExport}
        disabled={places.length === 0}
        className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Export
      </button>
    </div>
  );
}
