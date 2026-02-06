import { Place } from '@/types';
import rawPlaces from './places.json';

interface RawPlace {
  name: string;
  address: string;
  geo: [number, number];
  id?: string;
  category: string;
  labels?: string[];
}

// Convert raw places to proper Place format, merging categories for duplicates
const placesMap = new Map<string, Place>();
(rawPlaces as RawPlace[]).forEach(raw => {
  const id = raw.id || raw.name.toLowerCase().replace(/\s+/g, '-');
  const existing = placesMap.get(id);

  if (existing) {
    // Add category to existing place if not already present
    if (!existing.categories?.includes(raw.category)) {
      existing.categories = [...(existing.categories || []), raw.category];
    }
    // Merge labels
    if (raw.labels) {
      existing.labels = [...new Set([...(existing.labels || []), ...raw.labels])];
    }
  } else {
    placesMap.set(id, {
      id,
      name: raw.name,
      address: raw.address,
      coordinates: {
        lat: raw.geo[0],
        lng: raw.geo[1],
      },
      rating: null,
      reservationUrl: null,
      categories: [raw.category],
      labels: raw.labels || [],
    });
  }
});

export const defaultPlaces: Place[] = Array.from(placesMap.values());
