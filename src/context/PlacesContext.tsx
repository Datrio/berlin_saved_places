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
import { defaultAnnotations } from '@/data/defaultAnnotations';
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

  // Actions
  setFilters: (filters: FilterState) => void;
  setSort: (sort: SortState) => void;
  setView: (view: 'list' | 'map') => void;
  setSelectedPlaceId: (id: string | null) => void;
  updateAnnotation: (placeId: string, annotation: Partial<UserAnnotation>) => void;
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

  // Load annotations from localStorage on mount, merged with defaults
  useEffect(() => {
    const savedAnnotations = storage.getAnnotations();
    // Merge: user saved annotations override defaults
    const merged = { ...defaultAnnotations };
    Object.keys(savedAnnotations).forEach(key => {
      merged[key] = {
        ...defaultAnnotations[key],
        ...savedAnnotations[key],
        // Merge labels arrays, keeping unique values
        labels: [...new Set([
          ...(defaultAnnotations[key]?.labels || []),
          ...(savedAnnotations[key]?.labels || [])
        ])]
      };
    });
    setAnnotations(merged);
    setIsLoading(false);
  }, []);

  // Get all unique labels
  const allLabels = useMemo(() => {
    const labelsSet = new Set<string>();
    Object.values(annotations).forEach(annotation => {
      annotation.labels.forEach(label => labelsSet.add(label));
    });
    return Array.from(labelsSet).sort();
  }, [annotations]);

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
        filters.categories.includes(p.category || '')
      );
    }

    // Filter by districts
    if (filters.districts.length > 0) {
      result = result.filter(p =>
        filters.districts.includes(p.district)
      );
    }

    // Filter by labels
    if (filters.labels.length > 0) {
      result = result.filter(p =>
        filters.labels.some(label => p.annotation?.labels.includes(label))
      );
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
    setFilters,
    setSort,
    setView,
    setSelectedPlaceId,
    updateAnnotation,
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
