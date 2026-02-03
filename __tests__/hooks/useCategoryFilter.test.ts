import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { SearchProvider } from '../../src/context/SearchContext';
import { useCategoryFilter } from '../../src/hooks/useCategoryFilter';

/**
 * Test helper component to provide context
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(SearchProvider, null, children);
}

/**
 * Tests for useCategoryFilter hook
 */
describe('useCategoryFilter', () => {
  it('should provide category filter context', () => {
    const { result } = renderHook(() => useCategoryFilter(), {
      wrapper: Wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.selectedCategory).toBeNull();
    expect(typeof result.current.setCategory).toBe('function');
    expect(typeof result.current.clearCategory).toBe('function');
  });

  it('should have null as initial selectedCategory', () => {
    const { result } = renderHook(() => useCategoryFilter(), {
      wrapper: Wrapper,
    });

    expect(result.current.selectedCategory).toBeNull();
  });

  it('should update selectedCategory when setCategory is called', async () => {
    const { result } = renderHook(() => useCategoryFilter(), {
      wrapper: Wrapper,
    });

    expect(result.current.selectedCategory).toBeNull();

    await act(async () => {
      await result.current.setCategory('cooking-oil');
    });

    expect(result.current.selectedCategory).toBe('cooking-oil');
  });

  it('should clear selectedCategory when clearCategory is called', async () => {
    const { result } = renderHook(() => useCategoryFilter(), {
      wrapper: Wrapper,
    });

    // First set a category
    await act(async () => {
      await result.current.setCategory('spices');
    });

    expect(result.current.selectedCategory).toBe('spices');

    // Then clear it
    act(() => {
      result.current.clearCategory();
    });

    expect(result.current.selectedCategory).toBeNull();
  });
});
