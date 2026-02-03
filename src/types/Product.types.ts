/**
 * Product interface
 */

export interface ProductPrice {
  storeId: string;
  storeName: string;
  price: number;  // in cents
  available: boolean;
  lastUpdated: string;  // ISO date string
}

export interface Product {
  id: string;
  name: string;
  category: string;
  prices: ProductPrice[];
}
