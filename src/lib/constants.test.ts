import { describe, it, expect } from 'vitest';
import {
  CATEGORY_COLORS,
  CATEGORY_TAGS,
  CATEGORY_TAG_ORDER,
  DEFAULT_CATEGORY_TAG,
  SEED_LAST_UPDATED,
  DEFAULT_CATEGORIES,
} from './constants';

describe('CATEGORY_COLORS', () => {
  it('each color entry is an object with hex and textColor', () => {
    for (const entry of CATEGORY_COLORS) {
      expect(entry).toHaveProperty('hex');
      expect(entry).toHaveProperty('textColor');
    }
  });

  it('has 9 color entries (polished palette)', () => {
    expect(CATEGORY_COLORS).toHaveLength(9);
  });

  it('all entries use white textColor on vivid backgrounds', () => {
    for (const entry of CATEGORY_COLORS) {
      expect(entry.textColor).toBe('#ffffff');
    }
  });
});

describe('tag constants', () => {
  it('exposes 5 tags in fixed order', () => {
    expect(CATEGORY_TAGS).toEqual([
      'Entry exam', 'Language', 'Coursework', 'Calendar', 'Archive',
    ]);
    expect(CATEGORY_TAG_ORDER).toEqual(CATEGORY_TAGS);
  });

  it('default tag is Coursework', () => {
    expect(DEFAULT_CATEGORY_TAG).toBe('Coursework');
  });

  it('SEED_LAST_UPDATED is a positive number', () => {
    expect(typeof SEED_LAST_UPDATED).toBe('number');
    expect(SEED_LAST_UPDATED).toBeGreaterThan(0);
  });

  it('every default category has a valid tag', () => {
    for (const c of DEFAULT_CATEGORIES) {
      expect(CATEGORY_TAGS).toContain(c.tag);
    }
  });
});
