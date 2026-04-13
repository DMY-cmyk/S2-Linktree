import { describe, it, expect } from 'vitest';
import {
  reducedPopIn,
  reducedStaggerItem,
  reducedModalContent,
  reducedCardHover,
  reducedStaggerItemCapped,
} from './variants';

describe('reduced motion variants', () => {
  it('reducedPopIn has no scale or rotate transforms', () => {
    expect(reducedPopIn.initial).toEqual({ opacity: 0 });
    expect(reducedPopIn.animate).toEqual({ opacity: 1 });
    expect(reducedPopIn.transition.duration).toBeLessThanOrEqual(0.15);
  });

  it('reducedStaggerItem has instant opacity only', () => {
    expect(reducedStaggerItem.initial).toEqual({ opacity: 0 });
    expect(reducedStaggerItem.animate.opacity).toBe(1);
    expect(reducedStaggerItem.animate.scale).toBeUndefined();
    expect(reducedStaggerItem.animate.y).toBeUndefined();
  });

  it('reducedModalContent uses 150ms linear fade (functional)', () => {
    expect(reducedModalContent.animate.opacity).toBe(1);
    expect(reducedModalContent.transition.duration).toBe(0.15);
    expect(reducedModalContent.transition.ease).toBe('linear');
  });

  it('reducedCardHover has no movement', () => {
    expect(reducedCardHover).toEqual({});
  });

  it('reducedStaggerItemCapped returns instant opacity', () => {
    const variant = reducedStaggerItemCapped(5);
    expect(variant.initial).toEqual({ opacity: 0 });
    expect(variant.animate.opacity).toBe(1);
    expect(variant.animate.scale).toBeUndefined();
  });
});
