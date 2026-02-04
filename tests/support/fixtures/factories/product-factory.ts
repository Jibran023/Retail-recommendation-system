/**
 * Product Factory
 *
 * Creates test data for products with realistic values.
 * Uses faker-js for generating realistic test data.
 */

import { Product } from '../../../../src/types/Product.types';

export class ProductFactory {
  /**
   * Create a mock product with optional overrides
   */
  static createProduct(overrides: Partial<Product> = {}): Product {
    return {
      id: overrides.id || '1',
      name: overrides.name || 'Cooking Oil 5kg - Habib',
      category: overrides.category || 'Cooking Oil & Ghee',
      prices: overrides.prices || [
        {
          storeId: '1',
          storeName: 'Imtiaz Supermarket',
          price: 225000,
          available: true,
          lastUpdated: new Date().toISOString(),
        },
        {
          storeId: '2',
          storeName: 'Chase Plus',
          price: 219900,
          available: true,
          lastUpdated: new Date().toISOString(),
        },
      ],
      ...overrides,
    };
  }

  /**
   * Create multiple mock products
   */
  static createProducts(count: number, overrides: Partial<Product> = {}): Product[] {
    return Array.from({ length: count }, (_, i) =>
      this.createProduct({
        id: String(i + 1),
        name: `Product ${i + 1}`,
        ...overrides,
      })
    );
  }

  /**
   * Create a product with no prices (out of stock scenario)
   */
  static createProductWithNoPrices(): Product {
    return this.createProduct({
      id: '999',
      name: 'Unavailable Product',
      prices: [],
    });
  }

  /**
   * Create a product with specific price data
   */
  static createProductWithPrices(storeName: string, price: number): Product {
    return this.createProduct({
      prices: [
        {
          storeId: '1',
          storeName,
          price,
          available: true,
          lastUpdated: new Date().toISOString(),
        },
      ],
    });
  }
}
