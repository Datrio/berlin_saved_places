'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapFitBoundsProps {
  places: { id: string; coordinates: { lat: number; lng: number } }[];
  userLocation: { lat: number; lng: number } | null;
}

export function MapFitBounds({ places, userLocation }: MapFitBoundsProps) {
  const map = useMap();

  // Create a stable key from place IDs to detect actual changes
  const placesKey = useMemo(() => {
    return places.map(p => p.id).sort().join(',');
  }, [places]);

  const prevPlacesKey = useRef(placesKey);
  const prevUserLocation = useRef(userLocation);

  // Handle user location changes - zoom to user location
  useEffect(() => {
    if (userLocation && userLocation !== prevUserLocation.current) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
    prevUserLocation.current = userLocation;
  }, [userLocation, map]);

  // Handle places changes - fit bounds
  useEffect(() => {
    // Skip if user location is active (don't override user location zoom)
    if (userLocation) {
      prevPlacesKey.current = placesKey;
      return;
    }

    // Only fit bounds if the places actually changed
    if (prevPlacesKey.current === placesKey) {
      return;
    }
    prevPlacesKey.current = placesKey;

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
  }, [places, placesKey, userLocation, map]);

  return null;
}
