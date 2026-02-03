import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

/**
 * Custom hook to access category filter from search context
 *
 * Provides access to category filtering functionality:
 * - selectedCategory: Currently selected category ID
 * - setCategory: Function to filter by category
 * - clearCategory: Function to clear category filter
 *
 * @throws Error if used outside SearchProvider
 * @returns Category filter functions and state
 */
export function useCategoryFilter(): {
  selectedCategory: string | null;
  setCategory: (categoryId: string | null) => Promise<void>;
  clearCategory: () => void;
} {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useCategoryFilter must be used within a SearchProvider');
  }

  return {
    selectedCategory: context.state.selectedCategory,
    setCategory: context.filterByCategory,
    clearCategory: context.clearCategoryFilter,
  };
}
