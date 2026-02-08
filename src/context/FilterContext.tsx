import { createContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FilterState, FilterAction } from '../types/Filter.types';

/**
 * Initial filter state
 */
const initialFilterState: FilterState = {
  inStockOnly: false,
  selectedStores: [],
  priceRange: undefined,
};

/**
 * Load filter state from localStorage
 */
function loadFilterState(): FilterState {
  try {
    const saved = localStorage.getItem('filter-state');
    if (saved) {
      return { ...initialFilterState, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load filter state from localStorage:', error);
  }
  return initialFilterState;
}

/**
 * Save filter state to localStorage
 */
function saveFilterState(state: FilterState): void {
  try {
    localStorage.setItem('filter-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save filter state to localStorage:', error);
  }
}

/**
 * Filter reducer to handle state transitions
 */
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_IN_STOCK_ONLY':
      return { ...state, inStockOnly: action.payload };

    case 'TOGGLE_STORE': {
      const storeId = action.payload;
      const isSelected = state.selectedStores.includes(storeId);
      const newSelectedStores = isSelected
        ? state.selectedStores.filter((s) => s !== storeId)
        : [...state.selectedStores, storeId];
      return { ...state, selectedStores: newSelectedStores };
    }

    case 'SET_STORES':
      return { ...state, selectedStores: action.payload };

    case 'CLEAR_STORES':
      return { ...state, selectedStores: [] };

    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };

    case 'CLEAR_ALL_FILTERS':
      return { ...initialFilterState };

    default:
      return state;
  }
}

/**
 * Filter context type
 */
export interface FilterContextType {
  state: FilterState;
  setInStockOnly: (inStockOnly: boolean) => void;
  toggleStore: (storeId: string) => void;
  setStores: (storeIds: string[]) => void;
  clearStores: () => void;
  setPriceRange: (range: { min: number; max: number } | undefined) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Create Filter context
 */
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

/**
 * Filter context provider component
 */
export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, loadFilterState());

  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    saveFilterState(state);
  }, [state]);

  const setInStockOnly = useCallback((inStockOnly: boolean) => {
    dispatch({ type: 'SET_IN_STOCK_ONLY', payload: inStockOnly });
  }, []);

  const toggleStore = useCallback((storeId: string) => {
    dispatch({ type: 'TOGGLE_STORE', payload: storeId });
  }, []);

  const setStores = useCallback((storeIds: string[]) => {
    dispatch({ type: 'SET_STORES', payload: storeIds });
  }, []);

  const clearStores = useCallback(() => {
    dispatch({ type: 'CLEAR_STORES' });
  }, []);

  const setPriceRange = useCallback((range: { min: number; max: number } | undefined) => {
    dispatch({ type: 'SET_PRICE_RANGE', payload: range });
  }, []);

  const clearAllFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_FILTERS' });
  }, []);

  // Compute if any filters are active
  const hasActiveFilters = useMemo(() => {
    return state.inStockOnly || state.selectedStores.length > 0 || state.priceRange !== undefined;
  }, [state]);

  // Memoize the context value to prevent unnecessary re-renders
  const value: FilterContextType = useMemo(() => ({
    state,
    setInStockOnly,
    toggleStore,
    setStores,
    clearStores,
    setPriceRange,
    clearAllFilters,
    hasActiveFilters,
  }), [state, setInStockOnly, toggleStore, setStores, clearStores, setPriceRange, clearAllFilters, hasActiveFilters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
