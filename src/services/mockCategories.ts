import type { Category } from '../types/Category.types';
import type { Product } from '../types/Product.types';

/**
 * Mock category data for development
 * This will be replaced with real Supabase data in Story 1.6
 */

export const categories: Category[] = [
  { id: 'all', name: 'All Categories', icon: 'Apps' },
  { id: 'cooking-oil', name: 'Cooking Oil', icon: 'OilBarrel' },
  { id: 'rice-grains', name: 'Rice & Grains', icon: 'RiceBowl' },
  { id: 'pulses', name: 'Pulses', icon: 'Grain' },
  { id: 'flour', name: 'Flour', icon: 'BakeryDining' },
  { id: 'sugar', name: 'Sugar', icon: 'Cube' },
  { id: 'spices', name: 'Spices', icon: 'Spice' },
  { id: 'beverages', name: 'Beverages', icon: 'LocalCafe' },
  { id: 'dairy', name: 'Dairy', icon: 'WaterDrop' },
];

/**
 * Get products filtered by category
 *
 * @param products - All products to filter
 * @param categoryId - Category ID to filter by (null or 'all' returns all products)
 * @returns Filtered products
 */
export function getProductsByCategory(
  products: Product[],
  categoryId: string | null
): Product[] {
  // If no category or "all", return all products
  if (!categoryId || categoryId === 'all') {
    return products;
  }

  // Filter products by category
  return products.filter((product) => {
    const productCategory = product.category.toLowerCase();

    // Map category IDs to product category names
    const categoryMap: Record<string, string[]> = {
      'cooking-oil': ['cooking oil'],
      'rice-grains': ['rice'],
      'pulses': ['daal', 'pulses', 'lentils'],
      'flour': ['flour', 'atta', 'wheat'],
      'sugar': ['sugar'],
      'spices': ['chili', 'spice', 'powder'],
      'beverages': ['tea', 'coffee', 'beverage', 'whitener'],
      'dairy': ['milk', 'dairy', 'yogurt', 'cheese'],
    };

    // Check if product matches any keyword for this category
    const keywords = categoryMap[categoryId] || [];
    return keywords.some((keyword) => productCategory.includes(keyword));
  });
}

/**
 * Get category display name by ID
 *
 * @param categoryId - Category ID
 * @returns Category name or "All Categories" if not found
 */
export function getCategoryName(categoryId: string | null): string {
  if (!categoryId || categoryId === 'all') {
    return 'All Categories';
  }

  const category = categories.find((cat) => cat.id === categoryId);
  return category?.name || 'All Categories';
}
