/**
 * Product interface
 */

export interface ProductPrice {
  storeId: string;
  storeName: string;
  price: number;  // in cents
  available: boolean;
  lastUpdated: string;  // ISO date string
  distance?: number;  // Distance in kilometers (calculated dynamically)
}

export interface Product {
  id: string;
  name: string;
  base_product_name?: string;
  category: string;
  size_display?: string;
  brand_name?: string;
  image_url?: string;
  prices: ProductPrice[];
}
