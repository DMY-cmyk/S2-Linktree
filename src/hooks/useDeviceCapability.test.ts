import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeviceCapability } from './useDeviceCapability';

describe('useDeviceCapability', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 1.5, writable: true, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, writable: true, configurable: true });
  });

  it('returns mid quality by default (moderate device)', () => {
    const { result } = renderHook(() => useDeviceCapability());
    expect(result.current).toBe('mid');
  });

  it('returns high for high DPR and many cores', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    const { result } = renderHook(() => useDeviceCapability());
    expect(result.current).toBe('high');
  });

  it('returns low for low DPR', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true });
    const { result } = renderHook(() => useDeviceCapability());
    expect(result.current).toBe('low');
  });

  it('returns low for few cores', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true });
    const { result } = renderHook(() => useDeviceCapability());
    expect(result.current).toBe('low');
  });
});
