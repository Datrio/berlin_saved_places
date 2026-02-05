'use client';

import { useEffect, useState } from 'react';
import { usePlaces } from '@/context/PlacesContext';

// Dynamic import for Leaflet (SSR issues)
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export function MapView() {
  const { filteredPlaces, setSelectedPlaceId } = usePlaces();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate center from places or default to Berlin
  const center = filteredPlaces.length > 0
    ? {
        lat: filteredPlaces.reduce((sum, p) => sum + p.coordinates.lat, 0) / filteredPlaces.length,
        lng: filteredPlaces.reduce((sum, p) => sum + p.coordinates.lng, 0) / filteredPlaces.length,
      }
    : { lat: 52.52, lng: 13.405 }; // Berlin center

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            eventHandlers={{
              click: () => setSelectedPlaceId(place.id),
            }}
          >
            <Popup>
              <div className="min-w-[150px]">
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-sm text-gray-600">{place.address}</p>
                {place.rating && (
                  <p className="text-sm">★ {place.rating.toFixed(1)}</p>
                )}
                {place.annotation?.score && (
                  <p className="text-sm">My score: {place.annotation.score}/5</p>
                )}
                <button
                  onClick={() => setSelectedPlaceId(place.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
