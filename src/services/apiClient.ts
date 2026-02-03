import type { AppError } from '../types/Error.types';

/**
 * API Response Types following Architecture specification
 *
 * Success Response: { success: true, data: T }
 * Error Response: { success: false, error: AppError }
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: AppError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API Client for backend communication
 *
 * Implements the {success, data/error} wrapper pattern per Architecture
 * This will be integrated with real Supabase API in Story 1.6
 *
 * Current implementation uses mock data for development
 */

/**
 * Search products by query
 *
 * @param query - Search query string
 * @returns Promise with API response format
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  try {
    // TODO: Replace with actual API call in Story 1.6
    // For now, use mock service
    const { searchProductsMock } = await import('./mockProducts');
    const results = await searchProductsMock(query);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    const appError: AppError = {
      code: 'SEARCH_FAILED',
      message: 'Failed to search products. Please try again.',
      details: error,
    };

    return {
      success: false,
      error: appError,
    };
  }
}

/**
 * Type definition for Product (will be imported from types in Story 1.6)
 * TODO: Remove this type when proper imports are established
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
