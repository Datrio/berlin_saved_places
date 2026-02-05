import { Place, UserAnnotation } from '@/types';

const PLACES_KEY = 'berlin_places_data';
const ANNOTATIONS_KEY = 'berlin_places_annotations';

// Places storage
export function getPlaces(): Place[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PLACES_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePlaces(places: Place[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLACES_KEY, JSON.stringify(places));
}

export function importPlaces(places: Place[]): void {
  savePlaces(places);
}

// Annotations storage
export function getAnnotations(): Record<string, UserAnnotation> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(ANNOTATIONS_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveAnnotations(annotations: Record<string, UserAnnotation>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
}

export function getAnnotation(placeId: string): UserAnnotation | null {
  const annotations = getAnnotations();
  return annotations[placeId] || null;
}

export function saveAnnotation(annotation: UserAnnotation): void {
  const annotations = getAnnotations();
  annotations[annotation.placeId] = annotation;
  saveAnnotations(annotations);
}

export function deleteAnnotation(placeId: string): void {
  const annotations = getAnnotations();
  delete annotations[placeId];
  saveAnnotations(annotations);
}

// Export all data for backup
export function exportAllData(): { places: Place[]; annotations: Record<string, UserAnnotation> } {
  return {
    places: getPlaces(),
    annotations: getAnnotations(),
  };
}

// Import all data from backup
export function importAllData(data: { places: Place[]; annotations: Record<string, UserAnnotation> }): void {
  savePlaces(data.places);
  saveAnnotations(data.annotations);
}

// Get all unique labels from annotations
export function getAllLabels(): string[] {
  const annotations = getAnnotations();
  const labelsSet = new Set<string>();
  Object.values(annotations).forEach(annotation => {
    annotation.labels.forEach(label => labelsSet.add(label));
  });
  return Array.from(labelsSet).sort();
}
