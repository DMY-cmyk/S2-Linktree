import { describe, it, expect } from 'vitest';
import { generateConstantsSource } from './exportToCode';
import type { Category, Link } from '@/types';

describe('generateConstantsSource', () => {
  it('includes DEFAULT_CATEGORIES and DEFAULT_LINKS exports', () => {
    const output = generateConstantsSource([], []);
    expect(output).toContain('DEFAULT_CATEGORIES');
    expect(output).toContain('DEFAULT_LINKS');
    expect(output).toContain("import type { Category, Link } from '@/types'");
  });

  it('renders empty arrays as []', () => {
    const output = generateConstantsSource([], []);
    expect(output).toContain('DEFAULT_CATEGORIES: Category[] = []');
    expect(output).toContain('DEFAULT_LINKS: Link[] = []');
  });

  it('includes category fields', () => {
    const categories: Category[] = [
      { id: 'cat-1', name: 'Test', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource(categories, []);
    expect(output).toContain('"cat-1"');
    expect(output).toContain('"Test"');
    expect(output).toContain('"📝"');
    expect(output).toContain('"#a8ff78"');
  });

  it('includes link fields', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'Example', url: 'https://example.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).toContain('"link-1"');
    expect(output).toContain('"cat-1"');
    expect(output).toContain('"Example"');
    expect(output).toContain('"https://example.com"');
  });

  it('sorts categories by order ascending', () => {
    const categories: Category[] = [
      { id: 'cat-b', name: 'B', emoji: '📖', color: '#78d6ff', order: 1, createdAt: 1 },
      { id: 'cat-a', name: 'A', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource(categories, []);
    expect(output.indexOf('"cat-a"')).toBeLessThan(output.indexOf('"cat-b"'));
  });

  it('sorts links by order ascending', () => {
    const links: Link[] = [
      { id: 'link-b', categoryId: 'cat-1', title: 'B', url: 'https://b.com', order: 1, createdAt: 1 },
      { id: 'link-a', categoryId: 'cat-1', title: 'A', url: 'https://a.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output.indexOf('"link-a"')).toBeLessThan(output.indexOf('"link-b"'));
  });

  it('includes optional description when present', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'X', url: 'https://x.com', description: 'My desc', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).toContain('"My desc"');
    expect(output).toContain('description:');
  });

  it('omits description field when not present', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'X', url: 'https://x.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).not.toContain('description:');
  });
});
