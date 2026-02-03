/**
 * Error types for the application
 * Follows Architecture pattern for structured errors
 */

export interface AppError {
  code: string;      // e.g., 'SEARCH_FAILED', 'NETWORK_ERROR', 'PRODUCT_NOT_FOUND'
  message: string;   // User-friendly message
  details?: unknown; // Additional diagnostic info
}

export function createAppError(
  code: string,
  message: string,
  details?: unknown
): AppError {
  return { code, message, details };
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}
