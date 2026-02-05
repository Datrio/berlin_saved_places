// Place data from Google Maps (immutable after scraping)
export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number | null;
  reservationUrl: string | null;
  // Additional fields that might come from scraping
  imageUrl?: string;
  placeUrl?: string;
  category?: string;
}

// User's personal annotations (mutable)
export interface UserAnnotation {
  placeId: string;
  notes: string;
  labels: string[];
  score: number | null; // 1-5 personal rating
  dateAdded?: string;
  lastVisited?: string;
}

// Combined place with annotations for display
export interface PlaceWithAnnotation extends Place {
  annotation: UserAnnotation | null;
}

// Filter state
export interface FilterState {
  labels: string[];
  minGoogleRating: number;
  maxGoogleRating: number;
  minScore: number;
  maxScore: number;
  hasNotes: boolean | null;
  searchQuery: string;
}

// Sort options
export type SortField = 'name' | 'rating' | 'score' | 'dateAdded';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

// App state
export interface AppState {
  places: Place[];
  annotations: Record<string, UserAnnotation>; // keyed by placeId
  filters: FilterState;
  sort: SortState;
  view: 'list' | 'map';
  selectedPlaceId: string | null;
}

// Default filter state
export const defaultFilterState: FilterState = {
  labels: [],
  minGoogleRating: 0,
  maxGoogleRating: 5,
  minScore: 0,
  maxScore: 5,
  hasNotes: null,
  searchQuery: '',
};

// Default sort state
export const defaultSortState: SortState = {
  field: 'name',
  direction: 'asc',
};
