/**
 * Supabase Client Configuration
 *
 * Provides direct REST API access to Supabase backend
 * Follows Architecture specification for API layer
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase configuration. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Create and export the Supabase client for components that need SDK-style queries
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Supabase REST API headers
 */
const getHeaders = () => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
});

/**
 * Base fetch wrapper for Supabase REST API
 */
async function supabaseFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    console.error('SUPABASE ERROR:', error);
    console.error('URL:', url);
    console.error('Status:', response.status);
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search products by name with prices from all stores
 *
 * Uses Supabase REST API with RPC to join products, prices, and stores
 *
 * @param query - Search query string
 * @returns Promise with products and their prices
 */
export async function searchProducts(query: string): Promise<Product[]> {
  // Using Supabase REST API to search products with related prices
  // We need to fetch products and then enrich with prices from stores

  const encodedQuery = encodeURIComponent(query);

  // Fetch products matching the query (case-insensitive)
  const products = await supabaseFetch<any[]>(
    `products?name=ilike.*${encodedQuery}*&select=*&order=name.asc`
  );

  if (!products.length) {
    return [];
  }

  // Fetch all prices for these products
  // Use 'eq.' for single ID, 'in.' for multiple IDs (Supabase REST API requirement)
  const productIds = products.map((p) => p.id);
  const productFilter = productIds.length === 1
    ? `product_id=eq.${productIds[0]}`
    : `product_id=in.(${productIds.join(',')})`;

  // DEBUG: Log the API call
  console.log('DEBUG: Products found:', products);
  console.log('DEBUG: Product IDs:', productIds);
  console.log('DEBUG: Product filter:', productFilter);
  console.log('DEBUG: Full API call:', `prices?${productFilter}&select=*&order=price_cents.asc`);

  const prices = await supabaseFetch<any[]>(
    `prices?${productFilter}&select=*&order=price_cents.asc`
  );

  // Fetch all stores referenced in prices
  const storeIds = [...new Set(prices.map((p) => p.store_id))];
  const storeFilter = storeIds.length === 1
    ? `id=eq.${storeIds[0]}`
    : `id=in.(${storeIds.join(',')})`;

  // DEBUG: Log the stores API call
  console.log('DEBUG: Prices found:', prices);
  console.log('DEBUG: Store IDs:', storeIds);
  console.log('DEBUG: Store filter:', storeFilter);
  console.log('DEBUG: Full stores API call:', `stores?${storeFilter}&select=*`);

  const stores = await supabaseFetch<any[]>(
    `stores?${storeFilter}&select=*`
  );

  // Build a map of stores for quick lookup
  const storeMap = new Map(stores.map((s) => [s.id, s]));

  // Combine products with their prices
  return products.map((product) => {
    const productPrices = prices
      .filter((p) => p.product_id === product.id)
      .map((price) => {
        const store = storeMap.get(price.store_id);
        return {
          storeId: price.store_id,
          storeName: store?.name || 'Unknown Store',
          price: price.price_cents, // in cents
          available: price.availability,
          lastUpdated: price.scraped_at,
        };
      });

    return {
      id: product.id,
      name: product.name,
      base_product_name: product.base_product_name,
      category: product.category,
      size_display: product.size_display,
      brand_name: product.brand_name,
      image_url: product.image_url,
      prices: productPrices,
    };
  });
}

/**
 * Get all products in a specific category
 *
 * @param category - Category name from database
 * @returns Promise with products in the category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  console.log('DEBUG [getProductsByCategory]: Fetching products for category:', category);
  console.log('DEBUG [getProductsByCategory]: Category value:', category);

  if (category === 'all' || !category) {
    console.log('DEBUG [getProductsByCategory]: Category is "all" or empty, returning empty');
    return [];
  }

  try {
    // Use exact match with the category name from the database
    // The category parameter is the exact category value from the database
    const encodedCategory = encodeURIComponent(category);

    console.log('DEBUG [getProductsByCategory]: Query: products?category=eq.' + encodedCategory + '&select=*&order=name.asc');

    // Use exact match (eq.) instead of ILIKE since we have the exact category name
    const products = await supabaseFetch<any[]>(
      `products?category=eq.${encodedCategory}&select=*&order=name.asc`
    );

    console.log('DEBUG [getProductsByCategory]: Fetched', products.length, 'products');
    console.log('DEBUG [getProductsByCategory]: Products:', products.map(p => ({ name: p.name, category: p.category })));

    if (!products.length) {
      console.log('DEBUG [getProductsByCategory]: ❌ No products found for category:', category);
      return [];
    }

    // Continue with fetching prices and stores...
    const productIds = products.map((p) => p.id);
    const productFilter = productIds.length === 1
      ? `product_id=eq.${productIds[0]}`
      : `product_id=in.(${productIds.join(',')})`;

    console.log('DEBUG [getProductsByCategory]: Product IDs:', productIds);
    console.log('DEBUG [getProductsByCategory]: Product filter:', productFilter);

    const prices = await supabaseFetch<any[]>(
      `prices?${productFilter}&select=*&order=price_cents.asc`
    );

    console.log('DEBUG [getProductsByCategory]: Fetched', prices.length, 'prices');

    const storeIds = [...new Set(prices.map((p) => p.store_id))];
    const storeFilter = storeIds.length === 1
      ? `id=eq.${storeIds[0]}`
      : `id=in.(${storeIds.join(',')})`;

    console.log('DEBUG [getProductsByCategory]: Store IDs:', storeIds);
    console.log('DEBUG [getProductsByCategory]: Store filter:', storeFilter);

    const stores = await supabaseFetch<any[]>(
      `stores?${storeFilter}&select=*`
    );

    console.log('DEBUG [getProductsByCategory]: Fetched', stores.length, 'stores');

    const storeMap = new Map(stores.map((s) => [s.id, s]));

    return products.map((product) => {
      const productPrices = prices
        .filter((p) => p.product_id === product.id)
        .map((price) => {
          const store = storeMap.get(price.store_id);
          return {
            storeId: price.store_id,
            storeName: store?.name || 'Unknown Store',
            price: price.price_cents,
            available: price.availability,
            lastUpdated: price.scraped_at,
          };
        });

      return {
        id: product.id,
        name: product.name,
        base_product_name: product.base_product_name,
        category: product.category,
        size_display: product.size_display,
        brand_name: product.brand_name,
        image_url: product.image_url,
        prices: productPrices,
      };
    });

  } catch (error) {
    console.error('ERROR [getProductsByCategory]: Failed to fetch products for category', category, error);
    return [];
  }
}

/**
 * Get all distinct categories from the database
 *
 * @returns Promise with list of category names
 */
export async function getCategories(): Promise<string[]> {
  // Supabase doesn't have a direct DISTINCT endpoint in REST API
  // We'll fetch all products and extract unique categories
  // For production, consider creating a dedicated RPC function or a categories table

  const products = await supabaseFetch<any[]>(
    'products?select=name,category&order=category.asc'
  );

  console.log('DEBUG [getCategories]: All products with categories:', products);

  // Extract unique categories
  const categories = new Set(products.map((p) => p.category));
  const categoryArray = Array.from(categories).sort();

  console.log('DEBUG [getCategories]: Unique categories found:', categoryArray);

  return categoryArray;
}

/**
 * Get all products with prices from all stores
 *
 * @returns Promise with all products and their prices
 */
export async function getAllProducts(): Promise<Product[]> {
  console.log('DEBUG [getAllProducts]: Fetching all products');

  // Fetch all products
  const products = await supabaseFetch<any[]>(
    'products?select=*&order=name.asc'
  );

  console.log('DEBUG [getAllProducts]: Fetched', products.length, 'products');

  if (!products.length) {
    return [];
  }

  // Fetch all prices
  const productIds = products.map((p) => p.id);
  const productFilter = productIds.length === 1
    ? `product_id=eq.${productIds[0]}`
    : `product_id=in.(${productIds.join(',')})`;

  console.log('DEBUG [getAllProducts]: Product IDs:', productIds);

  const prices = await supabaseFetch<any[]>(
    `prices?${productFilter}&select=*&order=price_cents.asc`
  );

  console.log('DEBUG [getAllProducts]: Fetched', prices.length, 'prices');

  // Fetch all stores
  const storeIds = [...new Set(prices.map((p) => p.store_id))];
  const storeFilter = storeIds.length === 1
    ? `id=eq.${storeIds[0]}`
    : `id=in.(${storeIds.join(',')})`;

  console.log('DEBUG [getAllProducts]: Store IDs:', storeIds);

  const stores = await supabaseFetch<any[]>(
    `stores?${storeFilter}&select=*`
  );

  console.log('DEBUG [getAllProducts]: Fetched', stores.length, 'stores');

  const storeMap = new Map(stores.map((s) => [s.id, s]));

  return products.map((product) => {
    const productPrices = prices
      .filter((p) => p.product_id === product.id)
      .map((price) => {
        const store = storeMap.get(price.store_id);
        return {
          storeId: price.store_id,
          storeName: store?.name || 'Unknown Store',
          price: price.price_cents,
          available: price.availability,
          lastUpdated: price.scraped_at,
        };
      });

    return {
      id: product.id,
      name: product.name,
      base_product_name: product.base_product_name,
      category: product.category,
      size_display: product.size_display,
      brand_name: product.brand_name,
      image_url: product.image_url,
      prices: productPrices,
    };
  });
}

/**
 * Get all stores
 *
 * @returns Promise with list of stores
 */
export async function getStores(): Promise<Store[]> {
  return await supabaseFetch('stores?select=*&order=name.asc');
}

/**
 * Type definitions for API responses
 */
interface Product {
  id: string;
  name: string;
  category: string;
  prices: {
    storeId: string;
    storeName: string;
    price: number;
    available: boolean;
    lastUpdated: string;
  }[];
}

interface Store {
  id: string;
  name: string;
  location?: string;
  website?: string;
}
