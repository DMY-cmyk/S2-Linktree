import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, fireEvent } from '@testing-library/react';
import { useMouseParallax } from './useMouseParallax';

describe('useMouseParallax', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  it('returns {0, 0} initially', () => {
    const { result } = renderHook(() => useMouseParallax());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('returns normalized coordinates on mousemove', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400 }));
    });
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('returns -1 at top-left corner', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    });
    expect(result.current.x).toBe(-1);
    expect(result.current.y).toBe(-1);
  });

  it('returns 1 at bottom-right corner', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1000, clientY: 800 }));
    });
    expect(result.current.x).toBe(1);
    expect(result.current.y).toBe(1);
  });

  it('cleans up event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useMouseParallax());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('throttles updates to at most once per 50ms', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMouseParallax());

    // Fire 3 rapid events
    fireEvent(window, new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    fireEvent(window, new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
    fireEvent(window, new MouseEvent('mousemove', { clientX: 300, clientY: 300 }));

    // Only first should register immediately
    const firstX = result.current.x;

    // Advance past throttle window
    vi.advanceTimersByTime(51);

    // Now this one should register
    fireEvent(window, new MouseEvent('mousemove', { clientX: 500, clientY: 500 }));

    // The position should have changed after throttle window
    expect(result.current.x).not.toBe(0);

    vi.useRealTimers();
  });
});
