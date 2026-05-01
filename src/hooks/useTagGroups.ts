import { useMemo } from 'react';
import type { Category, CategoryTag } from '@/types';
import { CATEGORY_TAG_ORDER } from '@/lib/constants';

export interface TagGroup {
  tag: CategoryTag;
  items: Category[];
}

export function groupByTag(categories: Category[]): TagGroup[] {
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const buckets = new Map<CategoryTag, Category[]>();
  for (const c of sorted) {
    if (!buckets.has(c.tag)) buckets.set(c.tag, []);
    buckets.get(c.tag)!.push(c);
  }
  return CATEGORY_TAG_ORDER
    .filter((t) => buckets.has(t))
    .map((tag) => ({ tag, items: buckets.get(tag)! }));
}

export function useTagGroups(categories: Category[]): TagGroup[] {
  return useMemo(() => groupByTag(categories), [categories]);
}
