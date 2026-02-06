/**
 * Filter state types
 */

export interface FilterState {
  inStockOnly: boolean;
  selectedStores: string[];
  priceRange?: { min: number; max: number }; // Optional: in cents
}

export type FilterAction =
  | { type: 'SET_IN_STOCK_ONLY'; payload: boolean }
  | { type: 'TOGGLE_STORE'; payload: string }
  | { type: 'SET_STORES'; payload: string[] }
  | { type: 'CLEAR_STORES' }
  | { type: 'SET_PRICE_RANGE'; payload: { min: number; max: number } | undefined }
  | { type: 'CLEAR_ALL_FILTERS' };
