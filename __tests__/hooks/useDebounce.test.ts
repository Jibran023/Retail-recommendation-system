import { renderHook, act, waitFor } from '@testing-library/react';
import useDebounce from '../../src/hooks/useDebounce';

/**
 * Tests for useDebounce hook
 */
describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should update debounced value after delay', async () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial');
  });

  it('should debounce rapid value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Rapidly change values
    rerender({ value: 'change1', delay: 500 });
    rerender({ value: 'change2', delay: 500 });
    rerender({ value: 'change3', delay: 500 });

    // Fast-forward through timers - should only trigger once
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('change3');
    });
  });

  it('should reset timer on value change before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Change value and advance time partially
    rerender({ value: 'change1', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change value again before timer completes
    rerender({ value: 'change2', delay: 500 });

    // Value should not have updated yet
    expect(result.current).toBe('initial');

    // Complete the timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('change2');
  });

  it('should use default delay of 300ms', () => {
    const { result } = renderHook(() => useDebounce('test'));
    expect(result.current).toBe('test');
  });

  it('should handle different data types', () => {
    const { result: numberResult } = renderHook(() => useDebounce(42, 300));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() =>
      useDebounce({ key: 'value' }, 300)
    );
    expect(objectResult.current).toEqual({ key: 'value' });
  });
});
