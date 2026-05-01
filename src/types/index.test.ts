import { describe, it, expectTypeOf } from 'vitest';
import type { Category, CategoryTag } from './index';

describe('Category type', () => {
  it('CategoryTag accepts the 5 design values', () => {
    expectTypeOf<CategoryTag>().toEqualTypeOf<
      'Entry exam' | 'Language' | 'Coursework' | 'Calendar' | 'Archive'
    >();
  });

  it('Category requires tag', () => {
    const c: Category = {
      id: 'x', name: 'n', emoji: '📝', color: '#000',
      order: 0, createdAt: 1, tag: 'Coursework',
    };
    expectTypeOf(c.tag).toEqualTypeOf<CategoryTag>();
  });
});
