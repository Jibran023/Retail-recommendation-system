import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { SearchProvider } from '../../src/context/SearchContext';
import { useSearch } from '../../src/hooks/useSearch';

/**
 * Test helper component to provide context
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(SearchProvider, null, children);
}

/**
 * Tests for useSearch hook
 */
describe('useSearch', () => {
  it('should provide search context', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: Wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(typeof result.current.search).toBe('function');
    expect(typeof result.current.clearSearch).toBe('function');
  });

  it('should throw error when used outside SearchProvider', () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useSearch());
    }).toThrow('useSearch must be used within a SearchProvider');

    console.error = consoleError;
  });

  it('should have initial state with empty query', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: Wrapper,
    });

    expect(result.current.state.query).toBe('');
    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.resultsCount).toBe(0);
  });

  it('should clear search results', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.state.query).toBe('');
    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.resultsCount).toBe(0);
  });

  it('should have search function available', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: Wrapper,
    });

    expect(typeof result.current.search).toBe('function');
  });
});
