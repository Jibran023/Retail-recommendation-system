/**
 * Data Transformer Service
 *
 * Transforms store API responses into our internal Product format
 * and prepares data for loading into Supabase
 */

import type {
  StoreProduct,
  UnifiedProduct,
} from '../types/StoreApi.types';
import type { Product, ProductPrice } from '../types/Product.types';

/**
 * Convert price string to cents
 * Example: "79.00" -> 7900
 */
export function priceToCents(priceString: string): number {
  const price = parseFloat(priceString);
  if (isNaN(price)) {
    return 0;
  }
  return Math.round(price * 100);
}

/**
 * Convert cents to price string (PKR)
 * Example: 7900 -> "Rs. 79"
 */
export function centsToPrice(cents: number): string {
  return `Rs. ${(cents / 100).toFixed(0)}`;
}

/**
 * Transform store product to unified product format
 */
export function transformStoreProduct(
  storeProduct: StoreProduct,
  storeSlug: string,
  categoryName: string,
  subcategoryName: string
): UnifiedProduct {
  return {
    id: `${storeSlug}_${storeProduct.id}`,
    storeProductId: storeProduct.id,
    storeId: storeSlug,
    name: storeProduct.name,
    description: storeProduct.desc || '',
    category: categoryName,
    subcategory: subcategoryName,
    brand: storeProduct.brand_name || '',
    priceCents: priceToCents(storeProduct.price),
    available: storeProduct.availability === 1,
    imageUrl: storeProduct.img_url || '',
    searchTags: storeProduct.search_tags ? storeProduct.search_tags.split(',') : [],
    lastUpdated: storeProduct.lastUpdateAt,
    subsectionId: storeProduct.subsectionId,
  };
}

/**
 * Transform unified product to Supabase Product format
 */
export function transformToSupabaseProduct(unifiedProduct: UnifiedProduct): Product {
  // Create a price entry for the store
  const price: ProductPrice = {
    storeId: unifiedProduct.storeId,
    storeName: getStoreDisplayName(unifiedProduct.storeId),
    price: unifiedProduct.priceCents,
    available: unifiedProduct.available,
    lastUpdated: unifiedProduct.lastUpdated,
  };

  return {
    id: unifiedProduct.id,
    name: unifiedProduct.name,
    category: unifiedProduct.category,
    prices: [price],
  };
}

/**
 * Get display name for store slug
 */
function getStoreDisplayName(storeSlug: string): string {
  const names: Record<string, string> = {
    'imtiaz': 'Imtiaz Supermarket',
    'bin-hashim': 'Bin Hashim',
    'al-jadeed': 'Al-Jadeed',
  };
  return names[storeSlug] || storeSlug;
}

/**
 * Batch transform multiple store products
 */
export function batchTransformStoreProducts(
  products: StoreProduct[],
  storeSlug: string,
  categoryName: string,
  subcategoryName: string
): UnifiedProduct[] {
  return products.map(product =>
    transformStoreProduct(product, storeSlug, categoryName, subcategoryName)
  );
}

/**
 * Group unified products by product name (for multi-store comparison)
 * Products with same name from different stores are grouped together
 */
export function groupProductsByName(products: UnifiedProduct[]): Map<string, UnifiedProduct[]> {
  const grouped = new Map<string, UnifiedProduct[]>();

  for (const product of products) {
    // Normalize product name for grouping (lowercase, trim)
    const key = product.name.toLowerCase().trim();

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(product);
  }

  return grouped;
}

/**
 * Merge products with same name from different stores
 * Creates a single Product with multiple prices
 */
export function mergeProductsForComparison(groupedProducts: Map<string, UnifiedProduct[]>): Product[] {
  const mergedProducts: Product[] = [];

  for (const [_name, products] of groupedProducts.entries()) {
    // Use the first product's details as base
    const baseProduct = products[0];

    // Create price entries for each store
    const prices: ProductPrice[] = products.map(p => ({
      storeId: p.storeId,
      storeName: getStoreDisplayName(p.storeId),
      price: p.priceCents,
      available: p.available,
      lastUpdated: p.lastUpdated,
    }));

    // Sort by price (cheapest first)
    prices.sort((a, b) => a.price - b.price);

    mergedProducts.push({
      id: baseProduct.id, // Use first product's ID
      name: baseProduct.name,
      category: baseProduct.category,
      prices,
    });
  }

  return mergedProducts;
}

/**
 * Extract categories from store menu sections
 */
export function extractCategories(menuSections: any[]): string[] {
  const categories: string[] = [];

  for (const section of menuSections) {
    if (section.name && section.status === 1) {
      categories.push(section.name);
    }
  }

  return categories.sort();
}

/**
 * Extract subcategories from store sections
 */
export function extractSubcategories(sections: any[]): string[] {
  const subcategories: string[] = [];

  for (const section of sections) {
    if (section.name && section.status === 1) {
      subcategories.push(section.name);
    }
  }

  return subcategories.sort();
}
