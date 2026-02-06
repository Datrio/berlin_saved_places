'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Place,
  UserAnnotation,
  PlaceWithAnnotation,
  FilterState,
  SortState,
  defaultFilterState,
  defaultSortState,
} from '@/types';
import { defaultPlaces } from '@/data/places';
import * as storage from '@/lib/storage';
import { getDistrictFromCoordinates, BERLIN_DISTRICTS } from '@/lib/districts';

// Extended type with computed district
interface PlaceWithDistrict extends PlaceWithAnnotation {
  district: string;
}

interface PlacesContextType {
  // Data
  places: Place[];
  annotations: Record<string, UserAnnotation>;
  placesWithAnnotations: PlaceWithDistrict[];
  filteredPlaces: PlaceWithDistrict[];
  allLabels: string[];
  allDistricts: readonly string[];

  // State
  filters: FilterState;
  sort: SortState;
  view: 'list' | 'map';
  selectedPlaceId: string | null;
  isLoading: boolean;
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;

  // Actions
  setFilters: (filters: FilterState) => void;
  setSort: (sort: SortState) => void;
  setView: (view: 'list' | 'map') => void;
  setSelectedPlaceId: (id: string | null) => void;
  updateAnnotation: (placeId: string, annotation: Partial<UserAnnotation>) => void;
  requestLocation: () => void;
  clearLocation: () => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesProvider({ children }: { children: React.ReactNode }) {
  const [places] = useState<Place[]>(defaultPlaces);
  const [annotations, setAnnotations] = useState<Record<string, UserAnnotation>>({});
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [sort, setSort] = useState<SortState>(defaultSortState);
  const [view, setView] = useState<'list' | 'map'>('map');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Load annotations from localStorage on mount
  useEffect(() => {
    const savedAnnotations = storage.getAnnotations();
    setAnnotations(savedAnnotations);
    setIsLoading(false);
  }, []);

  // Get all unique labels from places and annotations
  const allLabels = useMemo(() => {
    const labelsSet = new Set<string>();
    places.forEach(place => {
      // Labels from place data
      place.labels?.forEach(label => labelsSet.add(label));
      // Labels from user annotations
      const annotation = annotations[place.id];
      annotation?.labels.forEach(label => labelsSet.add(label));
    });
    return Array.from(labelsSet).sort();
  }, [places, annotations]);

  // Combine places with their annotations and computed district
  const placesWithAnnotations = useMemo((): PlaceWithDistrict[] => {
    return places.map(place => ({
      ...place,
      annotation: annotations[place.id] || null,
      district: getDistrictFromCoordinates(place.coordinates.lat, place.coordinates.lng),
    }));
  }, [places, annotations]);

  // Apply filters and sorting
  const filteredPlaces = useMemo((): PlaceWithDistrict[] => {
    let result = [...placesWithAnnotations];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(p =>
        p.categories?.some(cat => filters.categories.includes(cat))
      );
    }

    // Filter by districts
    if (filters.districts.length > 0) {
      result = result.filter(p =>
        filters.districts.includes(p.district)
      );
    }

    // Filter by labels (check both place labels and annotation labels)
    if (filters.labels.length > 0) {
      result = result.filter(p => {
        const placeLabels = p.labels || [];
        const annotationLabels = p.annotation?.labels || [];
        const allPlaceLabels = [...placeLabels, ...annotationLabels];
        return filters.labels.some(label => allPlaceLabels.includes(label));
      });
    }

    // Filter by Google rating
    result = result.filter(p => {
      if (p.rating === null) return true;
      return p.rating >= filters.minGoogleRating && p.rating <= filters.maxGoogleRating;
    });

    // Filter by user score
    result = result.filter(p => {
      if (!p.annotation?.score) return filters.minScore === 0;
      return p.annotation.score >= filters.minScore && p.annotation.score <= filters.maxScore;
    });

    // Filter by has notes
    if (filters.hasNotes !== null) {
      result = result.filter(p => {
        const hasNotes = !!p.annotation?.notes;
        return filters.hasNotes ? hasNotes : !hasNotes;
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'score':
          comparison = (a.annotation?.score || 0) - (b.annotation?.score || 0);
          break;
        case 'dateAdded':
          const dateA = a.annotation?.dateAdded || '';
          const dateB = b.annotation?.dateAdded || '';
          comparison = dateA.localeCompare(dateB);
          break;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [placesWithAnnotations, filters, sort]);

  // Update annotation
  const updateAnnotation = useCallback((placeId: string, partial: Partial<UserAnnotation>) => {
    setAnnotations(prev => {
      const existing = prev[placeId] || {
        placeId,
        notes: '',
        labels: [],
        score: null,
        dateAdded: new Date().toISOString(),
      };
      const updated = { ...existing, ...partial };
      const newAnnotations = { ...prev, [placeId]: updated };
      storage.saveAnnotations(newAnnotations);
      return newAnnotations;
    });
  }, []);

  // Request user location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        // Switch to map view when location is shared
        setView('map');
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your browser permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Clear user location
  const clearLocation = useCallback(() => {
    setUserLocation(null);
  }, []);

  const value: PlacesContextType = {
    places,
    annotations,
    placesWithAnnotations,
    filteredPlaces,
    allLabels,
    allDistricts: BERLIN_DISTRICTS,
    filters,
    sort,
    view,
    selectedPlaceId,
    isLoading,
    userLocation,
    isLocating,
    setFilters,
    setSort,
    setView,
    setSelectedPlaceId,
    updateAnnotation,
    requestLocation,
    clearLocation,
  };

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (context === undefined) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
}
