import type { Product } from './Product.types';
import type { AppError } from './Error.types';

/**
 * Search state types
 */

export interface SearchState {
  query: string;
  results: Product[];
  loading: boolean;
  error: AppError | null;
  resultsCount: number;
  selectedCategory: string | null; // Category filter
}

export type SearchAction =
  | { type: 'SEARCH_START'; payload: string }
  | { type: 'SEARCH_SUCCESS'; payload: { results: Product[]; count: number } }
  | { type: 'SEARCH_ERROR'; payload: AppError }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'FILTER_BY_CATEGORY'; payload: string | null }
  | { type: 'CLEAR_CATEGORY_FILTER' };
