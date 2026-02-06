import { UserAnnotation } from '@/types';
import { defaultPlaces } from './places';

// Generate default labels based on place name and type
function generateLabels(name: string, address: string, category: string): string[] {
  const labels: string[] = [];
  const nameLower = name.toLowerCase();
  const addressLower = address.toLowerCase();

  // Cuisine types
  if (addressLower.includes('japanese') || nameLower.includes('izakaya') || nameLower.includes('sushi')) labels.push('japanese');
  if (addressLower.includes('korean') || nameLower.includes('korean')) labels.push('korean');
  if (addressLower.includes('chinese') || nameLower.includes('chinese')) labels.push('chinese');
  if (addressLower.includes('vietnamese') || nameLower.includes('viet') || nameLower.includes('pho')) labels.push('vietnamese');
  if (addressLower.includes('thai')) labels.push('thai');
  if (addressLower.includes('italian') || nameLower.includes('pizza') || nameLower.includes('osteria') || nameLower.includes('ristorante')) labels.push('italian');
  if (addressLower.includes('german')) labels.push('german');
  if (addressLower.includes('mexican') || nameLower.includes('taco') || nameLower.includes('taqueria')) labels.push('mexican');
  if (addressLower.includes('georgian')) labels.push('georgian');
  if (addressLower.includes('french') || addressLower.includes('bistro')) labels.push('french');
  if (addressLower.includes('indian')) labels.push('indian');
  if (addressLower.includes('turkish')) labels.push('turkish');
  if (addressLower.includes('lebanese') || addressLower.includes('middle eastern')) labels.push('middle-eastern');
  if (addressLower.includes('persian')) labels.push('persian');
  if (addressLower.includes('taiwanese')) labels.push('taiwanese');
  if (addressLower.includes('nepalese')) labels.push('nepalese');
  if (addressLower.includes('eastern european')) labels.push('european');
  if (addressLower.includes('american')) labels.push('american');
  if (addressLower.includes('austrian')) labels.push('austrian');
  if (addressLower.includes('spanish') || addressLower.includes('tapas')) labels.push('spanish');
  if (addressLower.includes('sicilian')) labels.push('italian');

  // Place types
  if (addressLower.includes('ramen') || nameLower.includes('ramen')) labels.push('ramen');
  if (addressLower.includes('pizza') || nameLower.includes('pizza')) labels.push('pizza');
  if (addressLower.includes('bar') || nameLower.includes('bar')) labels.push('bar');
  if (addressLower.includes('cafe') || nameLower.includes('cafe') || nameLower.includes('café')) labels.push('cafe');
  if (addressLower.includes('wine bar') || nameLower.includes('wine') || nameLower.includes('vino')) labels.push('wine-bar');
  if (addressLower.includes('cocktail')) labels.push('cocktails');
  if (addressLower.includes('brewery') || nameLower.includes('brew')) labels.push('brewery');
  if (addressLower.includes('bistro')) labels.push('bistro');
  if (addressLower.includes('pub')) labels.push('pub');
  if (addressLower.includes('bakery')) labels.push('bakery');
  if (addressLower.includes('fine dining')) labels.push('fine-dining', 'upscale', 'special-occasion');
  if (addressLower.includes('coffee shop')) labels.push('coffee');
  if (addressLower.includes('tea house') || nameLower.includes('tea') || nameLower.includes('tee')) labels.push('tea');
  if (addressLower.includes('ice cream')) labels.push('dessert');
  if (addressLower.includes('brunch')) labels.push('brunch');
  if (addressLower.includes('beer garden') || addressLower.includes('beer hall')) labels.push('beer-garden', 'beer');
  if (addressLower.includes('hamburger')) labels.push('burgers');
  if (addressLower.includes('doner kebab')) labels.push('kebab', 'street-food');
  if (addressLower.includes('barbecue')) labels.push('bbq');
  if (addressLower.includes('steak')) labels.push('steak');
  if (addressLower.includes('seafood')) labels.push('seafood');
  if (addressLower.includes('vegetarian') || addressLower.includes('vegan')) labels.push('vegan');
  if (addressLower.includes('sandwich')) labels.push('sandwich');
  if (addressLower.includes('fast food')) labels.push('fast-food');
  if (addressLower.includes('health food')) labels.push('healthy');

  // Special names
  if (nameLower.includes('omakase') || nameLower.includes('shiori')) labels.push('omakase');
  if (nameLower.includes('speakeasy')) labels.push('speakeasy');
  if (nameLower.includes('cookies')) labels.push('dessert');
  if (nameLower.includes('cheesecake')) labels.push('dessert');

  // Category-based defaults
  if (category === 'coffee') {
    if (!labels.includes('cafe') && !labels.includes('coffee') && !labels.includes('tea')) {
      labels.push('cafe');
    }
  }
  if (category === 'drinks') {
    if (!labels.includes('bar') && !labels.includes('pub') && !labels.includes('beer-garden') && !labels.includes('wine-bar')) {
      labels.push('bar');
    }
  }
  if (category === 'food') {
    if (!labels.some(l => ['japanese', 'korean', 'chinese', 'vietnamese', 'thai', 'italian', 'german', 'mexican', 'georgian', 'french', 'indian', 'turkish', 'middle-eastern', 'persian', 'taiwanese', 'nepalese', 'american', 'austrian', 'spanish', 'european'].includes(l))) {
      if (!labels.includes('restaurant')) labels.push('restaurant');
    }
  }

  return [...new Set(labels)]; // Remove duplicates
}

// Generate annotations for all places
export const defaultAnnotations: Record<string, UserAnnotation> = {};

defaultPlaces.forEach(place => {
  const labels = generateLabels(place.name, place.address, place.category || '');
  if (labels.length > 0) {
    defaultAnnotations[place.id] = {
      placeId: place.id,
      notes: '',
      labels,
      score: null,
    };
  }
});
