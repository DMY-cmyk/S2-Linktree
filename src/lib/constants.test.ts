import { describe, it, expect } from 'vitest';
import { CATEGORY_COLORS } from './constants';

describe('CATEGORY_COLORS', () => {
  it('each color entry is an object with hex and textColor', () => {
    for (const entry of CATEGORY_COLORS) {
      expect(entry).toHaveProperty('hex');
      expect(entry).toHaveProperty('textColor');
      expect(['#222222', '#ffffff']).toContain(entry.textColor);
    }
  });

  it('has 8 color entries', () => {
    expect(CATEGORY_COLORS).toHaveLength(8);
  });

  it('dark backgrounds get white text', () => {
    const lavender = CATEGORY_COLORS.find(c => c.hex === '#c4b5fd');
    expect(lavender?.textColor).toBe('#222222');
  });
});
