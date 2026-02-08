/**
 * Store API Configuration
 *
 * Configuration for public store APIs
 * Credentials and endpoints from Postman collection
 * Store IDs match existing database schema
 */

import type { StoreConfig } from '../types/StoreApi.types';

/**
 * Store configurations for API access
 *
 * All stores use the same API pattern:
 * - GET /api/menu-section - Get categories
 * - GET /api/sub-section - Get subcategories
 * - GET /api/items-by-subsection - Get products with pagination
 */
export const STORE_API_CONFIGS: Record<string, StoreConfig> = {
  // Note: Chase Plus (chase-plus) doesn't have a public API in the Postman collection
  // Using Al-Jadeed instead
  imtiaz: {
    name: "Imtiaz Supermarket",
    slug: "imtiaz", // Matches store ID in database
    baseUrl: "https://shop.imtiaz.com.pk",
    restId: "55126",
    restBrId: "54940",
    appName: "imtiazsuperstore",
  },
  binHashim: {
    name: "Bin Hashim",
    slug: "bin-hashim", // Matches store ID in database
    baseUrl: "https://binhashimonline.pk",
    restId: "55248",
    restBrId: "55203",
    appName: "binhashimpharmacysupermarket",
  },
  alJadeed: {
    name: "Al-Jadeed",
    slug: "al-jadeed", // New store (not in original stores constant)
    baseUrl: "https://www.aljadeed.pk",
    restId: "55232",
    restBrId: "55181",
    appName: "aljadeedsupermarket",
  },
};

/**
 * Get store config by slug
 */
export function getStoreConfig(storeSlug: string): StoreConfig | undefined {
  return STORE_API_CONFIGS[storeSlug];
}

/**
 * Get all store configs
 */
export function getAllStoreConfigs(): StoreConfig[] {
  return Object.values(STORE_API_CONFIGS);
}

/**
 * API endpoints (relative paths)
 */
export const API_ENDPOINTS = {
  MENU_SECTION: '/api/menu-section',
  SUB_SECTION: '/api/sub-section',
  ITEMS_BY_SUBSECTION: '/api/items-by-subsection',
} as const;

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  pageNo: 1,
  perPage: 24,
  start: 0,
  limit: 24,
} as const;

/**
 * Rate limiting between API calls (ms)
 * Be respectful to the store APIs
 */
export const RATE_LIMIT_DELAY = 1000; // 1 second between calls
