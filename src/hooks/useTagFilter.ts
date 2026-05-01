'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CategoryTag } from '@/types';
import { CATEGORY_TAGS } from '@/lib/constants';

const slug = (t: CategoryTag) => t.toLowerCase().replace(/\s+/g, '-');
const fromSlug = (s: string): CategoryTag | null =>
  CATEGORY_TAGS.find((t) => slug(t) === s) ?? null;

export interface UseTagFilter {
  activeTags: Set<CategoryTag>;
  toggleTag: (tag: CategoryTag) => void;
  clear: () => void;
}

export function useTagFilter(): UseTagFilter {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const activeTags = useMemo(() => {
    const raw = params?.get('tag') ?? '';
    const set = new Set<CategoryTag>();
    for (const part of raw.split(',').filter(Boolean)) {
      const t = fromSlug(part);
      if (t) set.add(t);
    }
    return set;
  }, [params]);

  const writeBack = useCallback((next: Set<CategoryTag>) => {
    const sp = new URLSearchParams(params?.toString() ?? '');
    if (next.size === 0) sp.delete('tag');
    else sp.set('tag', Array.from(next).map(slug).join(','));
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const toggleTag = useCallback((tag: CategoryTag) => {
    const next = new Set(activeTags);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    writeBack(next);
  }, [activeTags, writeBack]);

  const clear = useCallback(() => writeBack(new Set()), [writeBack]);

  return { activeTags, toggleTag, clear };
}
