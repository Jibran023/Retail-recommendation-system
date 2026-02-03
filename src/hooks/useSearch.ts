import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';
import type { SearchContextType } from '../context/SearchContext';

/**
 * Custom hook to access search context
 *
 * Provides access to search state and actions:
 * - state: Current search state (query, results, loading, error, resultsCount)
 * - search: Function to perform product search
 * - clearSearch: Function to clear search results
 *
 * @throws Error if used outside SearchProvider
 * @returns SearchContextType object with state and actions
 */
export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
}
