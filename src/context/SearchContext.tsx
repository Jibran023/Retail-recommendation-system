import { createContext, useReducer, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { SearchState, SearchAction, SortOption } from '../types/Search.types';
import type { AppError } from '../types/Error.types';
import type { ApiErrorResponse } from '../services/apiClient';

/**
 * Initial search state
 */
const initialSearchState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  resultsCount: 0,
  selectedCategory: null,
  sortBy: 'default',
};

/**
 * Search reducer to handle state transitions
 */
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        query: action.payload,
        loading: true,
        error: null,
      };

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        results: action.payload.results,
        resultsCount: action.payload.count,
        error: null,
      };

    case 'SEARCH_ERROR':
      return {
        ...state,
        loading: false,
        results: [],
        resultsCount: 0,
        error: action.payload,
      };

    case 'CLEAR_SEARCH':
      return {
        ...initialSearchState,
        selectedCategory: state.selectedCategory, // Preserve category filter
      };

    case 'FILTER_BY_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        loading: true,
        error: null,
      };

    case 'CLEAR_CATEGORY_FILTER':
      return {
        ...state,
        selectedCategory: null,
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Search context type
 */
export interface SearchContextType {
  state: SearchState;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  filterByCategory: (categoryId: string | null) => Promise<void>;
  clearCategoryFilter: () => void;
  setSort: (sortBy: SortOption) => void;
}

/**
 * Create Search context
 */
export const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * Search context provider component
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Search function with real Supabase API integration
  // Memoized with useCallback to prevent infinite re-renders
  const search = useCallback(async (query: string): Promise<void> => {
    dispatch({ type: 'SEARCH_START', payload: query });

    try {
      // TODO: Replace with actual API call in Story 1.6
      // For now, use API client with mock data
      const { searchProducts } = await import('../services/apiClient');
      const response = await searchProducts(query);

      if (response.success) {
        dispatch({
          type: 'SEARCH_SUCCESS',
          payload: {
            results: response.data,
            count: response.data.length,
          },
        });
      } else {
        // Type narrowing for error response
        const errorResponse = response as ApiErrorResponse;
        dispatch({ type: 'SEARCH_ERROR', payload: errorResponse.error });
      }
    } catch (error) {
      const appError: AppError = {
        code: 'SEARCH_FAILED',
        message: 'Failed to search products. Please try again.',
        details: error,
      };
      dispatch({ type: 'SEARCH_ERROR', payload: appError });
    }
  }, []); // Empty deps - dispatch is stable from useReducer

  // Memoized to prevent infinite re-renders
  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []); // Empty deps - dispatch is stable from useReducer

  // Filter by category - memoized to prevent infinite re-renders
  const filterByCategory = useCallback(async (categoryId: string | null): Promise<void> => {
    // Clear the search query when filtering by category to avoid confusion
    dispatch({ type: 'CLEAR_SEARCH' });

    if (!categoryId || categoryId === 'all') {
      // Clear filter if no category selected - don't set loading since we're not fetching
      dispatch({ type: 'CLEAR_CATEGORY_FILTER' });
      return;
    }

    // Set the category and loading state
    dispatch({ type: 'FILTER_BY_CATEGORY', payload: categoryId });

    try {
      // Get products by category from Supabase
      const { getProductsByCategory: fetchByCategory } = await import('../services/apiClient');
      const response = await fetchByCategory(categoryId);

      if (response.success) {
        dispatch({
          type: 'SEARCH_SUCCESS',
          payload: {
            results: response.data,
            count: response.data.length,
          },
        });
      } else {
        const errorResponse = response as ApiErrorResponse;
        dispatch({ type: 'SEARCH_ERROR', payload: errorResponse.error });
      }
    } catch (error) {
      const appError: AppError = {
        code: 'CATEGORY_FILTER_FAILED',
        message: 'Failed to filter by category. Please try again.',
        details: error,
      };
      dispatch({ type: 'SEARCH_ERROR', payload: appError });
    }
  }, []); // No dependencies - categoryId is passed as parameter

  // Clear category filter - memoized to prevent infinite re-renders
  const clearCategoryFilter = useCallback(() => {
    dispatch({ type: 'CLEAR_CATEGORY_FILTER' });
  }, []);

  // Set sort option - memoized to prevent infinite re-renders
  const setSort = useCallback((sortBy: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: SearchContextType = useMemo(() => ({
    state,
    search,
    clearSearch,
    filterByCategory,
    clearCategoryFilter,
    setSort,
  }), [state, search, clearSearch, filterByCategory, clearCategoryFilter, setSort]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
