'use client';

import { useEffect, useState, useMemo } from 'react';
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

// Dynamically import the FitBounds component that uses useMap hook
const FitBoundsComponent = dynamic(
  () => import('./MapFitBounds').then((mod) => mod.MapFitBounds),
  { ssr: false }
);

// Category colors and icons
const CATEGORY_CONFIG: Record<string, { color: string; emoji: string }> = {
  food: { color: '#f97316', emoji: '🍽️' },    // orange
  drinks: { color: '#a855f7', emoji: '🍸' },  // purple
  coffee: { color: '#eab308', emoji: '☕' },  // yellow
};

// Create custom marker icon for each category (must be called client-side only)
const createCategoryIcon = (L: typeof import('leaflet'), category: string) => {
  const config = CATEGORY_CONFIG[category] || { color: '#6b7280', emoji: '📍' };
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${config.color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">${config.emoji}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Create user location marker icon
const createUserLocationIcon = (L: typeof import('leaflet')) => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: -8px;
          width: 40px;
          height: 40px;
          background-color: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function MapView() {
  const { filteredPlaces, setSelectedPlaceId, userLocation } = usePlaces();
  const [isClient, setIsClient] = useState(false);
  const [categoryIcons, setCategoryIcons] = useState<Record<string, unknown> | null>(null);
  const [userLocationIcon, setUserLocationIcon] = useState<unknown>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet and create icons
    import('leaflet').then((L) => {
      setCategoryIcons({
        food: createCategoryIcon(L, 'food'),
        drinks: createCategoryIcon(L, 'drinks'),
        coffee: createCategoryIcon(L, 'coffee'),
        default: createCategoryIcon(L, 'default'),
      });
      setUserLocationIcon(createUserLocationIcon(L));
    });
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
    <div className="h-full min-h-[400px] rounded-lg overflow-hidden">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .custom-marker, .user-location-marker {
          background: transparent !important;
          border: none !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsComponent places={filteredPlaces} userLocation={userLocation} />
        {userLocation && userLocationIcon ? (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon={userLocationIcon as any}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">You are here</p>
              </div>
            </Popup>
          </Marker>
        ) : null}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon={categoryIcons ? (categoryIcons[place.categories?.[0] || 'default'] || categoryIcons.default) as any : undefined}
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
