'use client';

import { useState, useEffect } from 'react';
import { usePlaces } from '@/context/PlacesContext';

export function PlaceDetail() {
  const { selectedPlaceId, setSelectedPlaceId, placesWithAnnotations, updateAnnotation } = usePlaces();

  const place = placesWithAnnotations.find(p => p.id === selectedPlaceId);

  const [notes, setNotes] = useState('');
  const [labelsInput, setLabelsInput] = useState('');
  const [score, setScore] = useState<number | null>(null);

  // Sync state when place changes
  useEffect(() => {
    if (place) {
      setNotes(place.annotation?.notes || '');
      setLabelsInput(place.annotation?.labels.join(', ') || '');
      setScore(place.annotation?.score || null);
    }
  }, [place]);

  if (!place) return null;

  const handleSave = () => {
    const labels = labelsInput
      .split(',')
      .map(l => l.trim().toLowerCase())
      .filter(l => l.length > 0);

    updateAnnotation(place.id, {
      placeId: place.id,
      notes,
      labels,
      score,
    });
  };

  const handleClose = () => {
    handleSave();
    setSelectedPlaceId(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{place.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{place.address}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm">
            {place.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-gray-700 dark:text-gray-300">{place.rating.toFixed(1)} Google</span>
              </div>
            )}
            {place.reservationUrl && (
              <a
                href={place.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reserve
              </a>
            )}
            {place.placeUrl && (
              <a
                href={place.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on Maps
              </a>
            )}
          </div>
        </div>

        {/* My Score */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            My Score
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setScore(score === value ? null : value)}
                className={`w-10 h-10 rounded-full font-bold transition-colors ${
                  score === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Labels (comma-separated)
          </label>
          <input
            type="text"
            value={labelsInput}
            onChange={(e) => setLabelsInput(e.target.value)}
            placeholder="e.g., italian, date-night, outdoor"
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Your thoughts about this place..."
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
