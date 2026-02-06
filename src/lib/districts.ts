// Berlin district boundaries (approximate)
// Based on rough coordinate ranges

export const BERLIN_DISTRICTS = [
  'Mitte',
  'Prenzlauer Berg',
  'Friedrichshain',
  'Kreuzberg',
  'Neukölln',
  'Charlottenburg',
  'Schöneberg',
  'Wedding',
  'Moabit',
  'Tiergarten',
] as const;

export type BerlinDistrict = typeof BERLIN_DISTRICTS[number];

// Determine district from coordinates
export function getDistrictFromCoordinates(lat: number, lng: number): BerlinDistrict {
  // Rough boundaries - Berlin center is around 52.52, 13.405

  // Prenzlauer Berg: north-east of center
  if (lat > 52.53 && lng > 13.40 && lng < 13.46) {
    return 'Prenzlauer Berg';
  }

  // Wedding: north-west
  if (lat > 52.54 && lng < 13.38) {
    return 'Wedding';
  }

  // Moabit: north-west, south of Wedding
  if (lat > 52.52 && lat <= 52.54 && lng < 13.36) {
    return 'Moabit';
  }

  // Friedrichshain: east of center
  if (lat > 52.50 && lat <= 52.53 && lng > 13.43) {
    return 'Friedrichshain';
  }

  // Kreuzberg: south-east of center
  if (lat <= 52.50 && lat > 52.48 && lng > 13.38 && lng < 13.45) {
    return 'Kreuzberg';
  }

  // Neukölln: south, east of Kreuzberg
  if (lat <= 52.49 && lng > 13.42) {
    return 'Neukölln';
  }

  // Schöneberg: south-west
  if (lat <= 52.50 && lng < 13.38) {
    return 'Schöneberg';
  }

  // Charlottenburg: west
  if (lng < 13.33) {
    return 'Charlottenburg';
  }

  // Tiergarten: central-west
  if (lat > 52.50 && lat <= 52.52 && lng >= 13.33 && lng < 13.38) {
    return 'Tiergarten';
  }

  // Default to Mitte (central)
  return 'Mitte';
}

// District colors for UI
export const DISTRICT_COLORS: Record<BerlinDistrict, string> = {
  'Mitte': 'bg-red-100 text-red-700 border-red-200',
  'Prenzlauer Berg': 'bg-green-100 text-green-700 border-green-200',
  'Friedrichshain': 'bg-blue-100 text-blue-700 border-blue-200',
  'Kreuzberg': 'bg-purple-100 text-purple-700 border-purple-200',
  'Neukölln': 'bg-pink-100 text-pink-700 border-pink-200',
  'Charlottenburg': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Schöneberg': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Wedding': 'bg-orange-100 text-orange-700 border-orange-200',
  'Moabit': 'bg-teal-100 text-teal-700 border-teal-200',
  'Tiergarten': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};
