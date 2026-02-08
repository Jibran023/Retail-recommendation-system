/**
 * Store API Types
 *
 * Types for the public store APIs (Imtiaz, Bin Hashim, Al-Jadeed)
 * All stores use the same API structure
 */

/**
 * Store configuration for API access
 */
export interface StoreConfig {
  name: string;
  slug: string;
  baseUrl: string;
  restId: string;
  restBrId: string;
  appName: string;
}

/**
 * Menu Section (Category) API Response
 */
export interface MenuSectionResponse {
  status: number;
  msg: string;
  data: MenuSection[];
}

export interface MenuSection {
  id: number;
  restId: number;
  name: string;
  desc: string | null;
  openingtime: string;
  closingtime: string;
  img_url: string;
  status: number;
  priority: number;
  section: Section[];
  updated_at: string;
}

/**
 * Section (Subcategory) within a Menu Section
 */
export interface Section {
  id: number;
  name: string;
  img_url: string;
  desc: string;
  restId: number;
  priority: number;
  status: number;
  available_from: string;
  available_till: string;
  pivot: {
    menuId: number;
    sectionId: number;
  };
}

/**
 * Sub Section API Response
 */
export interface SubSectionResponse {
  status: number;
  msg: string;
  data: SubSection[];
}

export interface SubSection {
  id: number;
  name: string;
  img_url: string;
  desc: string;
  restId: number;
  priority: number;
  status: number;
  menu_section_id: number;
  updated_at: string;
}

/**
 * Items (Products) API Response
 */
export interface ItemsResponse {
  status: number;
  msg: string;
  data: StoreProduct[];
  total?: number;
  per_page?: number;
  current_page?: number;
}

/**
 * Product from Store API
 */
export interface StoreProduct {
  id: number;
  tp_product_code: string | null;
  brand_name: string;
  name: string;
  desc: string;
  restId: number;
  price: string; // Price as string (e.g., "79.00")
  base_price: string;
  discount_price: string;
  img_url: string;
  search_tags: string; // Comma-separated tags
  availability: number; // 1 = available, 0 = not available
  status: number;
  priority: number;
  subsectionId: number;
  lastUpdateAt: string; // ISO datetime
  created_at: string;
  dish_branch_stock?: {
    id: number;
    dishId: number;
    rest_brId: number;
    stock: number;
    updated_at: string;
  };
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  status: number;
  msg: string;
  error?: string;
}

/**
 * Fetch parameters for products
 */
export interface FetchProductsParams {
  subSectionId: string | number;
  pageNo?: number;
  perPage?: number;
  start?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'priority';
  sort?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  brandName?: string;
}

/**
 * Unified Product format after transformation
 * Converts StoreProduct to our internal Product format
 */
export interface UnifiedProduct {
  id: string; // Composite key: {storeId}_{productId}
  storeProductId: number; // Original product ID from store API
  storeId: string; // Store slug (e.g., 'imtiaz')
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  priceCents: number; // Price in cents (79.00 -> 7900)
  available: boolean;
  imageUrl: string;
  searchTags: string[];
  lastUpdated: string; // ISO datetime
  subsectionId: number;
}
