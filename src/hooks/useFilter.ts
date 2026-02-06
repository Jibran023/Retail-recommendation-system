import { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';
import type { FilterContextType } from '../context/FilterContext';

/**
 * Custom hook to access filter context
 *
 * Provides access to filter state and actions:
 * - state: Current filter state (inStockOnly, selectedStores, priceRange)
 * - setInStockOnly: Toggle in-stock only filter
 * - toggleStore: Toggle a store selection
 * - setStores: Set multiple stores
 * - clearStores: Clear all store selections
 * - setPriceRange: Set price range filter
 * - clearAllFilters: Clear all filters
 * - hasActiveFilters: Boolean indicating if any filters are active
 *
 * @throws Error if used outside FilterProvider
 * @returns FilterContextType object with state and actions
 */
export function useFilter(): FilterContextType {
  const context = useContext(FilterContext);

  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }

  return context;
}
