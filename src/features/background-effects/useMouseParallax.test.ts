import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
});
