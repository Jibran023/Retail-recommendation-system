import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { SearchState, SearchAction } from '../types/Search.types';
import type { AppError } from '../types/Error.types';

/**
 * Initial search state
 */
const initialSearchState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  resultsCount: 0,
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
      };

    default:
      return state;
  }
}

/**
 * Search context type
 */
interface SearchContextType {
  state: SearchState;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Create Search context
 */
const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * Search context provider component
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Search function (to be implemented with real API in Story 1.6)
  const search = async (query: string): Promise<void> => {
    dispatch({ type: 'SEARCH_START', payload: query });

    try {
      // TODO: Replace with actual API call in Story 1.6
      // For now, use mock service
      const { searchProductsMock } = await import('../services/mockProducts');
      const results = await searchProductsMock(query);

      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: {
          results,
          count: results.length,
        },
      });
    } catch (error) {
      const appError: AppError = {
        code: 'SEARCH_FAILED',
        message: 'Failed to search products. Please try again.',
        details: error,
      };
      dispatch({ type: 'SEARCH_ERROR', payload: appError });
    }
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const value: SearchContextType = {
    state,
    search,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

/**
 * Hook to use search context
 */
export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
}
