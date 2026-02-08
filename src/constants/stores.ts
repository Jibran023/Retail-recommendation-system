/**
 * Store information including coordinates, URLs, and contact details
 *
 * For MVP: Using fixed store locations (approximate Karachi locations)
 * Phase 2: Use real-time geolocation API
 */

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  websiteUrl?: string;
  address: string;
  area: string;
  city: string;
  phone?: string;
  // Coordinates in decimal degrees (latitude, longitude)
  latitude: number;
  longitude: number;
}

/**
 * Store information database
 *
 * Coordinates are approximate locations in Karachi, Pakistan
 * Imtiaz Supermarket - Multiple locations, using main branch
 * Chase Plus - Multiple locations, using main branch
 * Bin Hashim - Main location
 * Al-Jadeed - Main location (has public API)
 */
export const STORES: Record<string, StoreInfo> = {
  imtiaz: {
    id: 'imtiaz',
    name: 'Imtiaz Supermarket',
    slug: 'imtiaz',
    websiteUrl: 'https://shop.imtiaz.com.pk',
    address: 'Main University Rd, Block 7 Gulshan-e-Iqbal',
    area: 'Gulshan-e-Iqbal',
    city: 'Karachi',
    phone: '+92 21 34324143',
    latitude: 24.9326,
    longitude: 67.1041,
  },
  'chase-plus': {
    id: 'chase-plus',
    name: 'Chase Up',
    slug: 'chase-up',
    websiteUrl: 'https://chaseup.com.pk',
    address: 'Shop # G-1, G-2, Creek Club, Main Clifton Rd',
    area: 'Clifton',
    city: 'Karachi',
    phone: '+92 21 35831371',
    latitude: 24.8014,
    longitude: 67.0316,
  },
  'bin-hashim': {
    id: 'bin-hashim',
    name: 'Bin Hashim',
    slug: 'bin-hashim',
    websiteUrl: 'https://binhashimonline.pk',
    address: 'Main Shahrah-e-Pakistan',
    area: 'North Nazimabad',
    city: 'Karachi',
    phone: '+92 21 36612020',
    latitude: 24.9397,
    longitude: 67.0619,
  },
  'al-jadeed': {
    id: 'al-jadeed',
    name: 'Al-Jadeed',
    slug: 'al-jadeed',
    websiteUrl: 'https://www.aljadeed.pk',
    address: 'Main Shahrah-e-Pakistan',
    area: 'North Nazimabad',
    city: 'Karachi',
    phone: '+92 21 36612020',
    latitude: 24.9350,
    longitude: 67.0680,
  },
} as const;

/**
 * Get store info by store ID (matches storeName in ProductPrice)
 * Uses a case-insensitive search for flexibility
 */
export function getStoreInfo(storeName: string): StoreInfo | undefined {
  // Try exact match first
  if (storeName in STORES) {
    return STORES[storeName];
  }

  // Try case-insensitive match
  const lowerName = storeName.toLowerCase();
  for (const [key, store] of Object.entries(STORES)) {
    if (key.toLowerCase() === lowerName || store.name.toLowerCase() === lowerName) {
      return store;
    }
  }

  return undefined;
}

/**
 * Get all available stores as an array
 */
export function getAllStores(): StoreInfo[] {
  return Object.values(STORES);
}

/**
 * Default user location for distance calculation
 * For MVP: Using a central Karachi location
 * Phase 2: Get real user location from browser Geolocation API
 */
export const DEFAULT_USER_LOCATION = {
  latitude: 24.8607, // Central Karachi (Saddar area)
  longitude: 67.0011,
};

/**
 * Format distance for display
 * Examples: 2.5 km, < 1 km
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return '< 1 km';
  }
  return `${distanceKm.toFixed(1)} km`;
}
