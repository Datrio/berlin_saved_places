// Tag categories for filtering places
export const TAG_CATEGORIES: Record<string, { label: string; color: string; tags: string[] }> = {
  cuisine: {
    label: 'Cuisine',
    color: 'text-red-600',
    tags: ['japanese', 'korean', 'chinese', 'thai', 'vietnamese', 'italian', 'german', 'french', 'mexican', 'georgian', 'yemeni', 'peruvian', 'american', 'european', 'middle-eastern', 'taiwanese', 'sichuan', 'isaan', 'latin', 'russian']
  },
  type: {
    label: 'Type',
    color: 'text-blue-600',
    tags: ['restaurant', 'bar', 'cafe', 'wine-bar', 'brewery', 'bistro', 'izakaya', 'pub', 'bakery', 'street-food', 'takeout', 'fine-dining', 'hotel']
  },
  vibe: {
    label: 'Vibe',
    color: 'text-purple-600',
    tags: ['date-night', 'casual', 'upscale', 'cozy', 'trendy', 'intimate', 'special-occasion', 'nightlife', 'outdoor', 'brunch']
  },
  style: {
    label: 'Style',
    color: 'text-amber-600',
    tags: ['cocktails', 'speakeasy', 'traditional', 'modern', 'authentic', 'fusion', 'natural-wine', 'music', 'vinyl', 'art']
  },
  food: {
    label: 'Food',
    color: 'text-green-600',
    tags: ['ramen', 'sushi', 'pizza', 'tacos', 'bao', 'curry', 'wagyu', 'onigiri', 'khachapuri', 'banh-mi', 'ceviche', 'dim-sum', 'bibimbap', 'mussels', 'seafood', 'meat', 'dumplings', 'pastries', 'snacks', 'tapas', 'spicy', 'omakase', 'all-you-can-eat']
  },
  special: {
    label: 'Special',
    color: 'text-pink-600',
    tags: ['top-rated', 'expensive', 'unique', 'vegan', 'cat-cafe', 'beer', 'sake', 'tea', 'bubble-tea', 'coffee', 'beer-garden', 'himym']
  }
};

// Category colors for the main list categories (food, drinks, coffee)
export const CATEGORY_COLORS: Record<string, { bg: string; bgActive: string; icon: string }> = {
  food: { bg: 'bg-orange-100 text-orange-700 border-orange-200', bgActive: 'bg-orange-500 text-white', icon: '🍽️' },
  drinks: { bg: 'bg-purple-100 text-purple-700 border-purple-200', bgActive: 'bg-purple-500 text-white', icon: '🍸' },
  coffee: { bg: 'bg-amber-100 text-amber-700 border-amber-200', bgActive: 'bg-amber-500 text-white', icon: '☕' },
};
