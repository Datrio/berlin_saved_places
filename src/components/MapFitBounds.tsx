'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapFitBoundsProps {
  places: { coordinates: { lat: number; lng: number } }[];
}

export function MapFitBounds({ places }: MapFitBoundsProps) {
  const map = useMap();
  const prevPlacesLength = useRef(places.length);

  useEffect(() => {
    if (places.length === 0) {
      // No places - center on Berlin
      map.setView([52.52, 13.405], 12);
      return;
    }

    if (places.length === 1) {
      // Single place - center on it with reasonable zoom
      map.setView([places[0].coordinates.lat, places[0].coordinates.lng], 15);
      return;
    }

    // Multiple places - fit bounds
    const bounds = L.latLngBounds(
      places.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });

    prevPlacesLength.current = places.length;
  }, [places, map]);

  return null;
}
