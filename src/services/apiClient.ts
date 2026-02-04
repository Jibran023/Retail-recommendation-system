import type { AppError } from '../types/Error.types';
import type { Product } from '../types/Product.types';

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
 * Uses Supabase REST API for product data
 */

/**
 * Search products by query
 *
 * @param query - Search query string
 * @returns Promise with API response format
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  try {
    // Import Supabase client dynamically
    const { searchProducts: supabaseSearch } = await import('./supabaseClient');
    const results = await supabaseSearch(query);

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
 * Get products by category
 *
 * @param category - Category name
 * @returns Promise with API response format
 */
export async function getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
  try {
    const { getProductsByCategory: supabaseGetByCategory } = await import('./supabaseClient');
    const results = await supabaseGetByCategory(category);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    const appError: AppError = {
      code: 'CATEGORY_FETCH_FAILED',
      message: 'Failed to load products in this category. Please try again.',
      details: error,
    };

    return {
      success: false,
      error: appError,
    };
  }
}

/**
 * Get all categories
 *
 * @returns Promise with API response format
 */
export async function getCategories(): Promise<ApiResponse<string[]>> {
  try {
    const { getCategories: supabaseGetCategories } = await import('./supabaseClient');
    const categories = await supabaseGetCategories();

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    const appError: AppError = {
      code: 'CATEGORIES_FETCH_FAILED',
      message: 'Failed to load categories. Please try again.',
      details: error,
    };

    return {
      success: false,
      error: appError,
    };
  }
}
