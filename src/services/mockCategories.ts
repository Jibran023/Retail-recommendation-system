import type { Category } from '../types/Category.types';
import type { Product } from '../types/Product.types';

/**
 * Category data
 * Maps category IDs to display names and database category values
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
 * Maps category IDs to the actual category names stored in the database
 * This is needed because Supabase stores categories by name, not by ID
 */
export const categoryDatabaseNameMap: Record<string, string[]> = {
  'cooking-oil': ['Cooking Oil', 'cooking oil', 'CookingOil'],
  'rice-grains': ['Rice & Grains', 'Rice', 'Grains', 'rice & grains'],
  'pulses': ['Pulses', 'pulses', 'Daal', 'Lentils'],
  'flour': ['Flour', 'flour', 'Atta', 'Wheat'],
  'sugar': ['Sugar', 'sugar'],
  'spices': ['Spices', 'spices'],
  'beverages': ['Beverages', 'beverages'],
  'dairy': ['Dairy', 'dairy', 'Milk', 'Yogurt'],
};

/**
 * Get the database category name(s) for a given category ID
 * Returns the first (primary) database name for Supabase queries
 */
export function getDatabaseCategoryName(categoryId: string): string {
  if (categoryId === 'all' || !categoryId) {
    return '';
  }

  const names = categoryDatabaseNameMap[categoryId];
  return names ? names[0] : categoryId;
}

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
