import { describe, it, expect } from 'vitest';
import { isValidUrl, extractTitleFromUrl, cn, generateId, formatRelative } from './utils';

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('returns unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('isValidUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://portal.etc.web.id/')).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('just words')).toBe(false);
  });
});

describe('extractTitleFromUrl', () => {
  it('extracts and capitalizes domain name', () => {
    expect(extractTitleFromUrl('https://portal.etc.web.id/')).toBe('Portal');
    expect(extractTitleFromUrl('https://www.google.com')).toBe('Google');
  });

  it('returns empty string for invalid URLs', () => {
    expect(extractTitleFromUrl('not-a-url')).toBe('');
  });
});

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
  });
});

describe('formatRelative', () => {
  const now = 1_750_000_000_000;
  it('returns "just now" for under 60 seconds', () => {
    expect(formatRelative(now - 30_000, now)).toBe('just now');
  });
  it('returns "N minutes ago" under an hour', () => {
    expect(formatRelative(now - 5 * 60_000, now)).toBe('5 minutes ago');
  });
  it('returns "N hours ago" under a day', () => {
    expect(formatRelative(now - 3 * 3_600_000, now)).toBe('3 hours ago');
  });
  it('returns "N days ago" under a week', () => {
    expect(formatRelative(now - 2 * 86_400_000, now)).toBe('2 days ago');
  });
  it('returns "N weeks ago" under 30 days', () => {
    expect(formatRelative(now - 14 * 86_400_000, now)).toBe('2 weeks ago');
  });
  it('returns "N months ago" beyond 30 days', () => {
    expect(formatRelative(now - 90 * 86_400_000, now)).toBe('3 months ago');
  });
});
