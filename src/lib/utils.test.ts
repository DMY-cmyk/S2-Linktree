import { describe, it, expect } from 'vitest';
import { isValidUrl, extractTitleFromUrl, cn, generateId } from './utils';

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
