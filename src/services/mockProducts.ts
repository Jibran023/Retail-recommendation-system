import type { Product } from '../types/Product.types';

/**
 * Mock product data for development
 * This will be replaced with real Supabase API calls in Story 1.6
 *
 * Data represents typical Pakistani grocery products
 * with prices from multiple stores
 */
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cooking Oil 5L',
    category: 'Cooking Oil',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 265000, // Rs. 2,650
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 258000, // Rs. 2,580
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 262000, // Rs. 2,620
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Basmati Rice 5kg',
    category: 'Rice',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 185000, // Rs. 1,850
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 178000, // Rs. 1,780
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 182000, // Rs. 1,820
        available: false,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Daal Chana 1kg',
    category: 'Pulses',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 55000, // Rs. 550
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 52000, // Rs. 520
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 54000, // Rs. 540
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Daal Moong 1kg',
    category: 'Pulses',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 62000, // Rs. 620
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 59000, // Rs. 590
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 61000, // Rs. 610
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '5',
    name: 'Wheat Flour (Atta) 5kg',
    category: 'Flour',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 78000, // Rs. 780
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 75000, // Rs. 750
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 77000, // Rs. 770
        available: false,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '6',
    name: 'Sugar 1kg',
    category: 'Sugar',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 18000, // Rs. 180
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 17500, // Rs. 175
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 17800, // Rs. 178
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '7',
    name: 'Red Chili Powder 200g',
    category: 'Spices',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 4500, // Rs. 45
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 4200, // Rs. 42
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 4400, // Rs. 44
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
  {
    id: '8',
    name: 'Tea Whiteners 1kg',
    category: 'Beverages',
    prices: [
      {
        storeId: 'imtiaz',
        storeName: 'Imtiaz Supermarket',
        price: 95000, // Rs. 950
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'chase',
        storeName: 'Chase Plus',
        price: 92000, // Rs. 920
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
      {
        storeId: 'carrefour',
        storeName: 'Carrefour',
        price: 94000, // Rs. 940
        available: true,
        lastUpdated: '2026-02-03T02:00:00Z',
      },
    ],
  },
];

/**
 * Mock search API function
 * Simulates API latency and filters products by query
 *
 * @param query - Search query string
 * @returns Promise resolving to filtered products
 */
export async function searchProductsMock(query: string): Promise<Product[]> {
  // Simulate network delay (200-500ms)
  const delay = Math.random() * 300 + 200;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Filter products by name or category (case-insensitive)
  const normalizedQuery = query.toLowerCase().trim();

  if (normalizedQuery === '') {
    return [];
  }

  return mockProducts.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
    const categoryMatch = product.category.toLowerCase().includes(normalizedQuery);
    return nameMatch || categoryMatch;
  });
}
