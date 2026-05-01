import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredLinks } from './useFilteredLinks';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => {
  useLinkStore.setState({
    categories: [
      { id: 'c1', name: 'TPA', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1, tag: 'Coursework' },
      { id: 'c2', name: 'TOEFL', emoji: '🌐', color: '#78d6ff', order: 1, createdAt: 1, tag: 'Coursework' },
      { id: 'c3', name: 'Empty', emoji: '📁', color: '#ffd078', order: 2, createdAt: 1, tag: 'Coursework' },
    ],
    links: [
      { id: 'l1', categoryId: 'c1', title: 'Portal ETC', url: 'https://portal.etc.web.id/', order: 0, createdAt: 1 },
      { id: 'l2', categoryId: 'c1', title: 'Jadwal TPA', url: 'https://koperasi.bappenas.go.id/', order: 1, createdAt: 1 },
      { id: 'l3', categoryId: 'c2', title: 'ILP Schedule', url: 'https://ilpcikini.com/', order: 0, createdAt: 1 },
    ],
  });
});

describe('useFilteredLinks', () => {
  it('returns all categories with their links when no query', () => {
    const { result } = renderHook(() => useFilteredLinks(''));
    expect(result.current).toHaveLength(3);
    expect(result.current[0].links).toHaveLength(2);
    expect(result.current[2].links).toHaveLength(0);
  });

  it('filters by link title', () => {
    const { result } = renderHook(() => useFilteredLinks('Portal'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].links[0].title).toBe('Portal ETC');
  });

  it('shows all links when category name matches', () => {
    const { result } = renderHook(() => useFilteredLinks('TPA'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].links).toHaveLength(2);
  });

  it('filters by URL content', () => {
    const { result } = renderHook(() => useFilteredLinks('ilpcikini'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].category.name).toBe('TOEFL');
  });

  it('returns empty when nothing matches', () => {
    const { result } = renderHook(() => useFilteredLinks('nonexistent'));
    expect(result.current).toHaveLength(0);
  });

  it('is case insensitive', () => {
    const { result } = renderHook(() => useFilteredLinks('portal'));
    expect(result.current).toHaveLength(1);
  });

  it('matches by tag name', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: '📘', color: '#000', order: 0, createdAt: 1, tag: 'Coursework' },
        { id: 'c2', name: 'B', emoji: '📅', color: '#fff', order: 1, createdAt: 1, tag: 'Calendar' },
      ],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'X', url: 'https://x', order: 0, createdAt: 1 },
      ],
      lastUpdatedAt: 1,
    });
    const { result } = renderHook(() => useFilteredLinks('coursework'));
    expect(result.current.map((r) => r.category.id)).toEqual(['c1']);
  });
});
