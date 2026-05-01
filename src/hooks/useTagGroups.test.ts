import { describe, it, expect } from 'vitest';
import { groupByTag } from './useTagGroups';
import type { Category } from '@/types';

const cat = (id: string, order: number, tag: Category['tag']): Category => ({
  id, name: id, emoji: '📝', color: '#000', order, createdAt: 1, tag,
});

describe('groupByTag', () => {
  it('returns groups in CATEGORY_TAG_ORDER, omitting empty tags', () => {
    const groups = groupByTag([
      cat('a', 1, 'Coursework'),
      cat('b', 2, 'Entry exam'),
      cat('c', 3, 'Coursework'),
    ]);
    expect(groups.map((g) => g.tag)).toEqual(['Entry exam', 'Coursework']);
    expect(groups[1].items.map((c) => c.id)).toEqual(['a', 'c']);
  });

  it('preserves intra-group order from global order asc', () => {
    const groups = groupByTag([
      cat('z', 9, 'Coursework'),
      cat('y', 1, 'Coursework'),
      cat('x', 5, 'Coursework'),
    ]);
    expect(groups[0].items.map((c) => c.id)).toEqual(['y', 'x', 'z']);
  });
});
