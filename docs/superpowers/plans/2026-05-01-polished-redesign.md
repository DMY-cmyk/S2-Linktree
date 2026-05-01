# Polished Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Neo-Brutalist + WebGL UI with the editorial "polished" design from `docs/superpowers/specs/2026-05-01-polished-redesign-design.md`, end-to-end, on `feature/polished-redesign`.

**Architecture:** In-place refactor of existing files plus a small set of new leaf components/hooks. Tag becomes a required field on `Category`; tag-based section grouping drives layout. WebGL background is replaced by CSS-only orbs. Two-state theme. Letter-monogram favicon tiles. No `framer-motion`. CSS keyframes only.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Zustand 5, @dnd-kit, lucide-react, vitest 4 + RTL.

**Spec:** `docs/superpowers/specs/2026-05-01-polished-redesign-design.md` (commits `8647d6b` → `e26fa93`).

---

## File map (decomposition)

**New files (created by tasks below):**
- `src/lib/formatRelative.ts` (+ test)
- `src/hooks/useTagGroups.ts` (+ test)
- `src/hooks/useTagFilter.ts` (+ test)
- `src/components/ui/MonogramFavicon.tsx` (+ test)
- `src/components/ui/Footer.tsx` (+ test)
- `src/features/background-effects/CssOrbs.tsx` (+ test)
- `src/features/link-directory/GroupHeader.tsx` (+ test)
- `src/features/link-directory/TagFilterPopover.tsx` (+ test)
- `src/components/ui/Header.tsx` (+ test)

**Modified files:**
- `src/types/index.ts`
- `src/lib/constants.ts`
- `src/lib/utils.ts`
- `src/store/useLinkStore.ts` (+ test)
- `src/hooks/useFilteredLinks.ts` (+ test)
- `src/hooks/useKeyboardShortcuts.ts` (+ test)
- `src/components/ui/ThemeToggle.tsx` (+ test)
- `src/features/search/SearchBar.tsx` (+ test)
- `src/features/link-directory/CategoryCard.tsx` (+ test)
- `src/features/link-directory/LinkItem.tsx` (+ test)
- `src/features/link-management/AddCategoryModal.tsx`
- `src/features/link-management/EditCategoryModal.tsx`
- `src/features/link-management/AddLinkModal.tsx` (+ test)
- `src/features/home/HeroSection.tsx`
- `src/features/home/HomePage.tsx`
- `src/app/globals.css` (+ test)
- `src/app/layout.tsx`
- `next.config.ts`
- `package.json`

**Deleted files:**
- `src/animations/` (entire directory: `drag-presets.ts`, `variants.ts`, `variants.test.ts`)
- `src/features/background-effects/AnimatedBackground.tsx`
- `src/features/background-effects/BlobScene.tsx`
- `src/features/background-effects/FloatingBlob.tsx`
- `src/features/background-effects/useMouseParallax.ts`
- `src/features/background-effects/useMouseParallax.test.ts`
- `src/hooks/useDeviceCapability.ts`
- `src/hooks/useDeviceCapability.test.ts`
- `src/components/ui/LinkFavicon.tsx`
- `src/components/ui/LinkFavicon.test.tsx`

---

## Task list

### Task 1: Add `CategoryTag` type and extend `Category`

**Files:**
- Modify: `src/types/index.ts`

**Dependencies:** None.

- [ ] **Step 1: Write the failing test** — `src/types/index.test.ts` (new):

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/types/index.test.ts`
Expected: FAIL with "Module './index' has no exported member 'CategoryTag'".

- [ ] **Step 3: Write minimal implementation**

In `src/types/index.ts` — replace the existing `Category` interface and add `CategoryTag`:

```ts
export type CategoryTag =
  | 'Entry exam'
  | 'Language'
  | 'Coursework'
  | 'Calendar'
  | 'Archive';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  createdAt: number;
  tag: CategoryTag;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/types/index.test.ts`
Expected: PASS (1 file / 2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/types/index.test.ts
git commit -m "feat(types): add CategoryTag and require tag on Category"
```

---

### Task 2: Add tag/build constants and update palette in `constants.ts`

**Files:**
- Modify: `src/lib/constants.ts`
- Test: `src/lib/constants.test.ts` (existing)

**Dependencies:** Task 1.

- [ ] **Step 1: Write the failing test** — append to `src/lib/constants.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  CATEGORY_TAGS,
  CATEGORY_TAG_ORDER,
  DEFAULT_CATEGORY_TAG,
  SEED_LAST_UPDATED,
  DEFAULT_CATEGORIES,
} from './constants';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/constants.test.ts`
Expected: FAIL — `CATEGORY_TAGS` etc. not exported.

- [ ] **Step 3: Write minimal implementation**

In `src/lib/constants.ts`, replace `CATEGORY_COLORS` with the polished palette and add tag constants. Update `DEFAULT_CATEGORIES` per the seed mapping.

```ts
import type { Category, CategoryTag, Link } from '@/types';

export const CATEGORY_TAGS = [
  'Entry exam', 'Language', 'Coursework', 'Calendar', 'Archive',
] as const satisfies readonly CategoryTag[];

export const CATEGORY_TAG_ORDER: readonly CategoryTag[] = CATEGORY_TAGS;
export const DEFAULT_CATEGORY_TAG: CategoryTag = 'Coursework';

export const SEED_LAST_UPDATED: number =
  Number(process.env.NEXT_PUBLIC_BUILD_TIME) || Date.now();

// Polished palette: vivid primaries used as category color; tinted via color-mix
// in headers so on-color contrast is rarely required. textColor field kept for
// any consumer that still draws text directly on the swatch.
export const CATEGORY_COLORS = [
  { hex: '#16a34a', textColor: '#ffffff' },
  { hex: '#0284c7', textColor: '#ffffff' },
  { hex: '#db2777', textColor: '#ffffff' },
  { hex: '#ea580c', textColor: '#ffffff' },
  { hex: '#7c3aed', textColor: '#ffffff' },
  { hex: '#dc2626', textColor: '#ffffff' },
  { hex: '#059669', textColor: '#ffffff' },
  { hex: '#ca8a04', textColor: '#ffffff' },
  { hex: '#0d9488', textColor: '#ffffff' },
] as const;

export const EMOJI_OPTIONS = [
  '📝','🌐','📖','📘','📗','📙','📕','📅','📚','🎓','💻','📊','🔬','📐','✏️','🗂️',
  '📌','🔗','📎','🏫','🧪','📈','🗓️','💡','🎯','📋','🔍','⭐','🏆','📁',
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-tpa',         name: 'TPA',                emoji: '📝', color: '#16a34a', order: 0, createdAt: 1, tag: 'Entry exam' },
  { id: 'cat-toefl',       name: 'TOEFL',              emoji: '🌐', color: '#0284c7', order: 1, createdAt: 1, tag: 'Language'   },
  { id: 'cat-prev-years',  name: 'Materi Pasca Maksi', emoji: '📖', color: '#db2777', order: 2, createdAt: 1, tag: 'Archive'    },
  { id: 'cat-sem-1',       name: 'Materi (Sem. 1)',    emoji: '📘', color: '#ea580c', order: 3, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-2',       name: 'Materi (Sem. 2)',    emoji: '📗', color: '#7c3aed', order: 4, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-3',       name: 'Materi (Sem. 3)',    emoji: '📙', color: '#dc2626', order: 5, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-4',       name: 'Materi (Sem. 4)',    emoji: '📕', color: '#059669', order: 6, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-schedules',   name: 'Jadwal Kuliah S2',   emoji: '📅', color: '#ca8a04', order: 7, createdAt: 1, tag: 'Calendar'   },
  { id: '_jztODWj4j17xbBkYO3aS', name: 'Jadwal Ujian S2', emoji: '📅', color: '#0d9488', order: 8, createdAt: 1, tag: 'Calendar' },
];

// DEFAULT_LINKS unchanged — keep the existing block as-is.
export const DEFAULT_LINKS: Link[] = /* preserve existing rows verbatim */ [];
```

When applying, keep the existing `DEFAULT_LINKS` array verbatim — do not modify rows. Only the import (`CategoryTag`) and the constants above are new.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/constants.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/lib/constants.test.ts
git commit -m "feat(constants): add tag constants, polished palette, tagged seed"
```

---

### Task 3: Add `formatRelative` utility

**Files:**
- Modify: `src/lib/utils.ts`
- Create: `src/lib/utils.test.ts` (extend if exists)

**Dependencies:** None.

- [ ] **Step 1: Write the failing test** — append to `src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { formatRelative } from './utils';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/utils.test.ts -t formatRelative`
Expected: FAIL — `formatRelative` is not a function.

- [ ] **Step 3: Write minimal implementation**

Append to `src/lib/utils.ts`:

```ts
export function formatRelative(ms: number, now: number = Date.now()): string {
  const delta = Math.max(0, now - ms);
  const sec = Math.floor(delta / 1_000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minutes ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hours ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} days ago`;
  if (day < 30) return `${Math.floor(day / 7)} weeks ago`;
  return `${Math.floor(day / 30)} months ago`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/utils.test.ts -t formatRelative`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils.ts src/lib/utils.test.ts
git commit -m "feat(utils): add formatRelative helper"
```

---

### Task 4: Extend `useLinkStore` with `lastUpdatedAt` + tag-aware `addCategory`

**Files:**
- Modify: `src/store/useLinkStore.ts`
- Modify: `src/store/useLinkStore.test.ts`

**Dependencies:** Tasks 1, 2.

- [ ] **Step 1: Write the failing test** — append to `src/store/useLinkStore.test.ts`:

```ts
import { SEED_LAST_UPDATED } from '@/lib/constants';

describe('lastUpdatedAt', () => {
  it('initializes from SEED_LAST_UPDATED', () => {
    expect(useLinkStore.getState().lastUpdatedAt).toBe(SEED_LAST_UPDATED);
  });

  it('bumps on addCategory', () => {
    const before = useLinkStore.getState().lastUpdatedAt;
    useLinkStore.getState().addCategory({
      name: 'X', emoji: '📝', color: '#16a34a', order: 0, tag: 'Coursework',
    });
    expect(useLinkStore.getState().lastUpdatedAt).toBeGreaterThan(before);
  });

  it('bumps on deleteLink, reorderCategories, moveLinkToCategory', () => {
    useLinkStore.getState().addCategory({
      name: 'A', emoji: '📝', color: '#16a34a', order: 0, tag: 'Coursework',
    });
    const id = useLinkStore.getState().categories[0].id;
    useLinkStore.getState().addLink({
      title: 'L', url: 'https://a.com', categoryId: id, order: 0,
    });
    const t1 = useLinkStore.getState().lastUpdatedAt;
    useLinkStore.getState().deleteLink(useLinkStore.getState().links[0].id);
    expect(useLinkStore.getState().lastUpdatedAt).toBeGreaterThanOrEqual(t1);
  });
});

describe('addCategory tag insertion', () => {
  it('places new category at top of its tag (order = minOrderInTag - 1)', () => {
    useLinkStore.setState({
      categories: [
        { id: 'a', name: 'A', emoji: '📘', color: '#16a34a', order: 5, createdAt: 1, tag: 'Coursework' },
        { id: 'b', name: 'B', emoji: '📗', color: '#0284c7', order: 7, createdAt: 1, tag: 'Coursework' },
      ],
      links: [],
    });
    useLinkStore.getState().addCategory({
      name: 'New', emoji: '📕', color: '#7c3aed', order: 999, tag: 'Coursework',
    });
    const created = useLinkStore.getState().categories.find((c) => c.name === 'New')!;
    expect(created.order).toBe(4);
  });

  it('falls back to global min - 1 when no peer in tag', () => {
    useLinkStore.setState({
      categories: [
        { id: 'a', name: 'A', emoji: '📘', color: '#16a34a', order: 3, createdAt: 1, tag: 'Coursework' },
      ],
      links: [],
    });
    useLinkStore.getState().addCategory({
      name: 'New', emoji: '📅', color: '#0d9488', order: 0, tag: 'Calendar',
    });
    expect(useLinkStore.getState().categories.find((c) => c.tag === 'Calendar')!.order).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: FAIL — `lastUpdatedAt` undefined; `addCategory` rejects `tag`.

- [ ] **Step 3: Write minimal implementation**

In `src/store/useLinkStore.ts` — extend the interface and every mutation. Use a small `bump()` helper:

```ts
import { SEED_LAST_UPDATED } from '@/lib/constants';
// ...existing imports

interface LinkStore {
  categories: Category[];
  links: Link[];
  lastUpdatedAt: number;
  addCategory: (input: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Pick<Category, 'name' | 'emoji' | 'color' | 'order' | 'tag'>>) => void;
  // ...existing actions unchanged in signature
}

export const useLinkStore = create<LinkStore>()((set, get) => ({
  categories: DEFAULT_CATEGORIES,
  links: DEFAULT_LINKS,
  lastUpdatedAt: SEED_LAST_UPDATED,

  addCategory: (input) =>
    set((state) => {
      const peers = state.categories.filter((c) => c.tag === input.tag);
      const orders = (peers.length ? peers : state.categories).map((c) => c.order);
      const newOrder = (orders.length ? Math.min(...orders) : 0) - 1;
      return {
        categories: [
          ...state.categories,
          { ...input, order: newOrder, id: generateId(), createdAt: Date.now() },
        ],
        lastUpdatedAt: Date.now(),
      };
    }),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      lastUpdatedAt: Date.now(),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      links: state.links.filter((l) => l.categoryId !== id),
      lastUpdatedAt: Date.now(),
    })),

  addLink: (input) =>
    set((state) => ({
      links: [...state.links, { ...input, id: generateId(), createdAt: Date.now() }],
      lastUpdatedAt: Date.now(),
    })),

  updateLink: (id, updates) =>
    set((state) => ({
      links: state.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      lastUpdatedAt: Date.now(),
    })),

  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((l) => l.id !== id),
      lastUpdatedAt: Date.now(),
    })),

  // reorderCategories / reorderLinks / moveLinkToCategory — append `lastUpdatedAt: Date.now()`
  // to each set() return object.
  // restoreSnapshot: also bump.
}));
```

Update existing tests in this file that constructed `Category` literals: add `tag: 'Coursework'` to satisfy the new required field.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: PASS (all existing + new tests).

- [ ] **Step 5: Commit**

```bash
git add src/store/useLinkStore.ts src/store/useLinkStore.test.ts
git commit -m "feat(store): track lastUpdatedAt and tag-top insertion"
```

---

### Task 5: Add `useTagGroups` hook

**Files:**
- Create: `src/hooks/useTagGroups.ts`
- Create: `src/hooks/useTagGroups.test.ts`

**Dependencies:** Tasks 1, 2.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useTagGroups.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/useTagGroups.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useTagGroups.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTagGroups.ts src/hooks/useTagGroups.test.ts
git commit -m "feat(hooks): add useTagGroups for CATEGORY_TAG_ORDER bucketing"
```

---

### Task 6: Add `useTagFilter` hook

**Files:**
- Create: `src/hooks/useTagFilter.ts`
- Create: `src/hooks/useTagFilter.test.ts`

**Dependencies:** Task 1.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const replaceMock = vi.fn();
const searchParamsRef: { current: URLSearchParams } = { current: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsRef.current,
  usePathname: () => '/',
}));

import { useTagFilter } from './useTagFilter';

beforeEach(() => {
  replaceMock.mockReset();
  searchParamsRef.current = new URLSearchParams();
});

describe('useTagFilter', () => {
  it('parses ?tag=coursework,language into a Set', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework,language');
    const { result } = renderHook(() => useTagFilter());
    expect(result.current.activeTags.has('Coursework')).toBe(true);
    expect(result.current.activeTags.has('Language')).toBe(true);
  });

  it('toggleTag adds and removes from URL', () => {
    const { result } = renderHook(() => useTagFilter());
    act(() => result.current.toggleTag('Coursework'));
    expect(replaceMock).toHaveBeenCalledWith('/?tag=coursework', { scroll: false });
  });

  it('clear() removes the param', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework');
    const { result } = renderHook(() => useTagFilter());
    act(() => result.current.clear());
    expect(replaceMock).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('ignores unknown tag tokens', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework,bogus');
    const { result } = renderHook(() => useTagFilter());
    expect(Array.from(result.current.activeTags)).toEqual(['Coursework']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useTagFilter.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/useTagFilter.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useTagFilter.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTagFilter.ts src/hooks/useTagFilter.test.ts
git commit -m "feat(hooks): add useTagFilter URL-backed tag selection"
```

---

### Task 7: Extend `useFilteredLinks` to match `tag`

**Files:**
- Modify: `src/hooks/useFilteredLinks.ts`
- Modify: `src/hooks/useFilteredLinks.test.ts`

**Dependencies:** Task 1.

- [ ] **Step 1: Write the failing test** — append:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useFilteredLinks.test.ts -t 'matches by tag'`
Expected: FAIL — current predicate ignores `tag`.

- [ ] **Step 3: Write minimal implementation**

In `src/hooks/useFilteredLinks.ts`, change the match predicate:

```ts
const categoryNameMatches =
  category.name.toLowerCase().includes(query) ||
  category.tag.toLowerCase().includes(query);

const filteredLinks = categoryNameMatches
  ? catLinks
  : catLinks.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.url.toLowerCase().includes(query) ||
        (l.description?.toLowerCase().includes(query) ?? false)
    );
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useFilteredLinks.test.ts`
Expected: PASS (existing + new).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useFilteredLinks.ts src/hooks/useFilteredLinks.test.ts
git commit -m "feat(search): match category tag in useFilteredLinks"
```

---

### Task 8: Replace `globals.css` tokens, body grid, keyframes

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/globals.test.ts`

**Dependencies:** None.

- [ ] **Step 1: Write the failing test**

In `src/app/globals.test.ts`, replace existing token assertions with the polished palette:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const css = readFileSync(join(__dirname, 'globals.css'), 'utf8');

describe('globals.css polished tokens', () => {
  it('defines warm-paper light palette', () => {
    expect(css).toMatch(/--bg:\s*#fbf9f4/);
    expect(css).toMatch(/--accent:\s*#6d3aed/);
    expect(css).toMatch(/--surface:\s*#ffffff/);
    expect(css).toMatch(/--border-soft:\s*#d8d3c6/);
  });
  it('defines deep-navy dark palette', () => {
    expect(css).toMatch(/\[data-theme="dark"\]/);
    expect(css).toMatch(/--bg:\s*#0e0f1a/);
    expect(css).toMatch(/--accent:\s*#b497ff/);
  });
  it('defines orb keyframes', () => {
    for (const k of ['float', 'float-alt', 'float-slow', 'pulse-glow', 'fade-up']) {
      expect(css).toMatch(new RegExp(`@keyframes\\s+${k}\\b`));
    }
  });
  it('defines reduced-motion override for .animated-bg', () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*\.animated-bg/);
  });
  it('removes legacy aurora keyframes', () => {
    expect(css).not.toMatch(/@keyframes\s+aurora/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/globals.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Replace the whole content of `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg: #fbf9f4;
  --bg-grid: #efeae0;
  --surface: #ffffff;
  --surface-2: #f5f1e8;
  --text: #131318;
  --text-2: #5a5a66;
  --text-3: #8a8a96;
  --border: #131318;
  --border-soft: #d8d3c6;
  --accent: #6d3aed;
  --accent-on: #ffffff;
  --shadow-color: #131318;
  --success: #16a34a;
  --danger: #dc2626;
}
[data-theme="dark"] {
  --bg: #0e0f1a;
  --bg-grid: #16172a;
  --surface: #181a2c;
  --surface-2: #20223a;
  --text: #f4f3ee;
  --text-2: #b6b3aa;
  --text-3: #74717a;
  --border: #f4f3ee;
  --border-soft: #2a2c44;
  --accent: #b497ff;
  --accent-on: #131318;
  --shadow-color: #000000;
}

* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
body {
  min-height: 100vh;
  background-image:
    linear-gradient(var(--bg-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px);
  background-size: 32px 32px;
  background-position: -1px -1px;
  position: relative;
  overflow-x: hidden;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}

::selection { background: var(--accent); color: var(--accent-on); }

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.animated-bg {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none; opacity: 0.65;
}
.content-wrapper { position: relative; z-index: 1; }

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -30px); }
  66% { transform: translate(-20px, 20px); }
}
@keyframes float-alt {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-25px, 25px) rotate(5deg); }
  66% { transform: translate(20px, -15px) rotate(-3deg); }
}
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, 15px) scale(1.05); }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; filter: blur(40px); }
  50% { opacity: 0.5; filter: blur(50px); }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up { animation: fade-up 220ms ease-out both; }

.card-rest { transform: translate(0, 0); box-shadow: 3px 3px 0 var(--shadow-color); transition: transform 120ms ease, box-shadow 120ms ease; }
.card-hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--shadow-color); }
.card-lift { transform: translate(-2px, -2px) scale(1.02); box-shadow: 6px 6px 0 var(--shadow-color); transition: transform 150ms ease, box-shadow 150ms ease; }

@media (prefers-reduced-motion: reduce) {
  .animated-bg * { animation: none !important; }
  .fade-up { animation-duration: 0ms; }
  .card-rest, .card-hover, .card-lift { transition-duration: 150ms; transform: none; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/globals.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/globals.test.ts
git commit -m "feat(styles): polished tokens, dotted grid, orb keyframes"
```

---

### Task 9: Add `MonogramFavicon` component

**Files:**
- Create: `src/components/ui/MonogramFavicon.tsx`
- Create: `src/components/ui/MonogramFavicon.test.tsx`

**Dependencies:** Task 8 (CSS classes for `.mono`).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonogramFavicon } from './MonogramFavicon';

describe('MonogramFavicon', () => {
  it('maps known github.com to "G"', () => {
    render(<MonogramFavicon url="https://github.com/foo" />);
    expect(screen.getByLabelText(/github\.com/i).textContent).toBe('G');
  });
  it('falls back to first letter for unknown domains', () => {
    render(<MonogramFavicon url="https://example.org/bar" />);
    expect(screen.getByLabelText(/example\.org/i).textContent).toBe('E');
  });
  it('renders middle dot for invalid url', () => {
    render(<MonogramFavicon url="not-a-url" />);
    expect(screen.getByText('·')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/MonogramFavicon.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/MonogramFavicon.tsx
const MAP: Record<string, string> = {
  'github.com': 'G',
  'classroom.google.com': 'C',
  'drive.google.com': 'D',
  'docs.google.com': 'D',
  'ilpcikini.com': 'I',
  'speakingpartner.id': 'S',
  'portal.etc.web.id': 'E',
  'koperasi.bappenas.go.id': 'B',
};

interface Props { url: string; accent?: string; }

export function MonogramFavicon({ url, accent }: Props) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
  if (!host) return <span aria-hidden>·</span>;
  const ch = MAP[host] ?? host[0]?.toUpperCase() ?? '·';
  return (
    <span
      className="mono"
      role="img"
      aria-label={`Favicon for ${host}`}
      style={{
        width: 20, height: 20, display: 'grid', placeItems: 'center',
        borderRadius: 4, background: 'var(--surface-2)',
        border: '1px solid var(--border-soft)',
        color: accent ?? 'var(--text)', fontSize: 10, fontWeight: 700,
        flexShrink: 0,
      }}
    >{ch}</span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/MonogramFavicon.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/MonogramFavicon.tsx src/components/ui/MonogramFavicon.test.tsx
git commit -m "feat(ui): add MonogramFavicon letter tile"
```

---

### Task 10: Add `GroupHeader` component

**Files:**
- Create: `src/features/link-directory/GroupHeader.tsx`
- Create: `src/features/link-directory/GroupHeader.test.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupHeader } from './GroupHeader';

describe('GroupHeader', () => {
  it('renders uppercase tag and zero-padded count', () => {
    render(<GroupHeader title="Coursework" count={4} />);
    expect(screen.getByText('Coursework')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });
  it('renders count >= 10 without padding', () => {
    render(<GroupHeader title="Calendar" count={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-directory/GroupHeader.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/link-directory/GroupHeader.tsx
interface Props { title: string; count: number; }
export function GroupHeader({ title, count }: Props) {
  return (
    <div style={{
      gridColumn: '1 / -1', display: 'flex', alignItems: 'baseline',
      gap: 12, padding: '20px 0 4px',
    }}>
      <h2 className="mono" style={{
        margin: 0, fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: 'var(--text-2)',
      }}>{title}</h2>
      <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
      <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>
        {String(count).padStart(2, '0')}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-directory/GroupHeader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/GroupHeader.tsx src/features/link-directory/GroupHeader.test.tsx
git commit -m "feat(ui): add GroupHeader for tag sections"
```

---

### Task 11: Add `CssOrbs` component

**Files:**
- Create: `src/features/background-effects/CssOrbs.tsx`
- Create: `src/features/background-effects/CssOrbs.test.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CssOrbs } from './CssOrbs';

describe('CssOrbs', () => {
  it('renders 4 orbs + 1 conic accent in light mode', () => {
    const { container } = render(<CssOrbs theme="light" />);
    const wrap = container.querySelector('.animated-bg')!;
    expect(wrap).toBeInTheDocument();
    expect(wrap.children.length).toBe(5);
  });
  it('uses dark palette when theme="dark"', () => {
    const { container } = render(<CssOrbs theme="dark" />);
    const orbs = Array.from(container.querySelectorAll('.animated-bg > div'));
    const bg = (orbs[0] as HTMLElement).style.background;
    expect(bg).toContain('#7c3aed');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/background-effects/CssOrbs.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/background-effects/CssOrbs.tsx
'use client';

interface Props { theme: 'light' | 'dark'; }

const PALETTE = {
  light: ['#6d3aed', '#0284c7', '#db2777', '#ea580c'] as const,
  dark:  ['#7c3aed', '#06b6d4', '#db2777', '#ea580c'] as const,
};

const ORBS = [
  { size: 400, left: '10%', top: '15%', dur: 25, anim: 'float' },
  { size: 350, left: '75%', top: '60%', dur: 30, anim: 'float-alt' },
  { size: 320, left: '50%', top: '40%', dur: 28, anim: 'float-slow' },
  { size: 280, left: '25%', top: '75%', dur: 22, anim: 'float-alt' },
] as const;

export function CssOrbs({ theme }: Props) {
  const colors = PALETTE[theme];
  return (
    <div className="animated-bg" aria-hidden>
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: o.size, height: o.size, left: o.left, top: o.top,
          background: `radial-gradient(circle, ${colors[i]}40 0%, ${colors[i]}15 40%, transparent 70%)`,
          borderRadius: '50%',
          animation: `${o.anim} ${o.dur}s ease-in-out infinite, pulse-glow ${o.dur * 0.6}s ease-in-out infinite`,
          willChange: 'transform, opacity',
        }} />
      ))}
      <div style={{
        position: 'absolute', width: 600, height: 600, left: '60%', top: '10%',
        background: `conic-gradient(from 45deg, transparent, ${theme === 'dark' ? '#a855f7' : '#6d3aed'}08, transparent)`,
        borderRadius: '40%',
        animation: 'float-slow 35s ease-in-out infinite reverse',
        willChange: 'transform',
      }} />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/background-effects/CssOrbs.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/background-effects/CssOrbs.tsx src/features/background-effects/CssOrbs.test.tsx
git commit -m "feat(bg): add CssOrbs CSS-only animated background"
```

---

### Task 12: Add `Footer` component

**Files:**
- Create: `src/components/ui/Footer.tsx`
- Create: `src/components/ui/Footer.test.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders polished version label and 3 keyboard hints', () => {
    render(<Footer />);
    expect(screen.getByText(/POLISHED · v5\.0/)).toBeInTheDocument();
    expect(screen.getByText(/navigate/)).toBeInTheDocument();
    expect(screen.getByText(/⌘K search/)).toBeInTheDocument();
    expect(screen.getByText(/E edit · D delete/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/Footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/Footer.tsx
export function Footer() {
  return (
    <footer className="mono" style={{
      maxWidth: 1100, margin: '60px auto 32px', padding: 24,
      borderTop: '1.5px solid var(--border-soft)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, color: 'var(--text-3)',
      flexWrap: 'wrap', gap: 12,
    }}>
      <div>S2-LINKTREE · POLISHED · v5.0</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <span>↑ ↓ ← → navigate</span>
        <span>⌘K search</span>
        <span>E edit · D delete</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Footer.tsx src/components/ui/Footer.test.tsx
git commit -m "feat(ui): add polished Footer with keyboard hints"
```

---

### Task 13: Add `TagFilterPopover` component

**Files:**
- Create: `src/features/link-directory/TagFilterPopover.tsx`
- Create: `src/features/link-directory/TagFilterPopover.test.tsx`

**Dependencies:** Task 6.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilterPopover } from './TagFilterPopover';

const replaceMock = vi.fn();
const searchParamsRef: { current: URLSearchParams } = { current: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsRef.current,
  usePathname: () => '/',
}));

beforeEach(() => {
  replaceMock.mockReset();
  searchParamsRef.current = new URLSearchParams();
});

describe('TagFilterPopover', () => {
  it('renders 5 tag pills', () => {
    render(<TagFilterPopover open onClose={() => {}} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
  });

  it('toggling a pill calls router.replace with slug', () => {
    render(<TagFilterPopover open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /coursework/i }));
    expect(replaceMock).toHaveBeenCalledWith('/?tag=coursework', { scroll: false });
  });

  it('renders Clear button only when active', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework');
    render(<TagFilterPopover open onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-directory/TagFilterPopover.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/link-directory/TagFilterPopover.tsx
'use client';

import { useEffect, useRef } from 'react';
import { CATEGORY_TAGS } from '@/lib/constants';
import { useTagFilter } from '@/hooks/useTagFilter';

interface Props { open: boolean; onClose: () => void; }

export function TagFilterPopover({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { activeTags, toggleTag, clear } = useTagFilter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} role="dialog" aria-label="Filter by tag" style={{
      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
      background: 'var(--surface)', border: '1.5px solid var(--border)',
      borderRadius: 12, padding: 16,
      boxShadow: '4px 4px 0 var(--shadow-color)',
      width: 280, zIndex: 50,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {CATEGORY_TAGS.map((t) => {
          const active = activeTags.has(t);
          return (
            <button
              key={t}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => toggleTag(t)}
              className="mono"
              style={{
                height: 28, padding: '0 10px',
                fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                border: active ? '1.5px solid var(--border)' : '1.5px solid var(--border-soft)',
                borderRadius: 999,
                background: active ? 'color-mix(in srgb, var(--accent) 14%, var(--surface))' : 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >{t}</button>
          );
        })}
      </div>
      {activeTags.size > 0 && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={clear} className="mono" style={{
            background: 'transparent', border: 'none', color: 'var(--text-2)',
            fontSize: 11, cursor: 'pointer',
          }}>Clear</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-directory/TagFilterPopover.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/TagFilterPopover.tsx src/features/link-directory/TagFilterPopover.test.tsx
git commit -m "feat(filter): add TagFilterPopover with URL-backed tag pills"
```

---

### Task 14: Migrate `ThemeToggle` to two-state with legacy `system` re-derive

**Files:**
- Modify: `src/components/ui/ThemeToggle.tsx`
- Modify: `src/components/ui/ThemeToggle.test.tsx`

**Dependencies:** None (independent of other tasks).

- [ ] **Step 1: Write the failing test** — replace existing tests:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

const matchMediaSpy = vi.fn().mockReturnValue({ matches: false });

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  matchMediaSpy.mockReset().mockReturnValue({ matches: false });
  window.matchMedia = matchMediaSpy as unknown as typeof window.matchMedia;
});

describe('ThemeToggle (binary + legacy migration)', () => {
  it('default is light when nothing stored', () => {
    render(<ThemeToggle />);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles light -> dark', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('s2-linktree-theme')).toBe('dark');
  });

  it('legacy "system" re-derives via matchMedia and persists', () => {
    localStorage.setItem('s2-linktree-theme', 'system');
    matchMediaSpy.mockReturnValue({ matches: true });
    render(<ThemeToggle />);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/ThemeToggle.test.tsx`
Expected: FAIL — current 3-state behavior.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';
const KEY = 's2-linktree-theme';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const raw = localStorage.getItem(KEY);
  if (raw === 'light' || raw === 'dark') return raw;
  if (raw === 'system') {
    const next: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    return next;
  }
  localStorage.setItem(KEY, 'light');
  return 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const initial = readInitial();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      data-testid="theme-toggle"
      style={{
        width: 34, height: 34, display: 'grid', placeItems: 'center',
        background: 'var(--surface)', color: 'var(--text)',
        border: '1.5px solid var(--border-soft)', borderRadius: 8,
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/ThemeToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx src/components/ui/ThemeToggle.test.tsx
git commit -m "feat(theme): binary toggle with legacy system->matchMedia migration"
```

---

### Task 15: Add tag radio to `AddCategoryModal`

**Files:**
- Modify: `src/features/link-management/AddCategoryModal.tsx`

**Dependencies:** Tasks 1, 2, 4.

- [ ] **Step 1: Write the failing test** — `src/features/link-management/AddCategoryModal.test.tsx` (new):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddCategoryModal } from './AddCategoryModal';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({ categories: [], links: [] }));

describe('AddCategoryModal tag picker', () => {
  it('shows 5 tag radios and submits with selected tag', () => {
    render(<AddCategoryModal isOpen onClose={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);
    fireEvent.change(screen.getByLabelText(/category name/i), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('radio', { name: /calendar/i }));
    fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form')!);
    expect(useLinkStore.getState().categories[0].tag).toBe('Calendar');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-management/AddCategoryModal.test.tsx`
Expected: FAIL — no radios.

- [ ] **Step 3: Write minimal implementation**

In `AddCategoryModal.tsx`:
1. Import `CATEGORY_TAGS, DEFAULT_CATEGORY_TAG` from `@/lib/constants`.
2. Add `useState<CategoryTag>(DEFAULT_CATEGORY_TAG)` for `tag`.
3. Render a fieldset of 5 radios (use the existing styling for buttons; pattern after EmojiPicker).
4. Pass `tag` in the `addCategory(...)` call.

```tsx
import { CATEGORY_TAGS, DEFAULT_CATEGORY_TAG } from '@/lib/constants';
import type { CategoryTag } from '@/types';

const [tag, setTag] = useState<CategoryTag>(DEFAULT_CATEGORY_TAG);

// In JSX, add:
<fieldset>
  <legend className="block text-sm font-bold text-[var(--text-primary)] mb-2">Tag</legend>
  <div role="radiogroup" className="flex flex-wrap gap-2">
    {CATEGORY_TAGS.map((t) => (
      <label key={t}>
        <input type="radio" name="tag" value={t} checked={tag === t}
          onChange={() => setTag(t)} aria-label={t} />
        {t}
      </label>
    ))}
  </div>
</fieldset>

// In addCategory call:
addCategory({ name: name.trim(), emoji, color, order, tag });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-management/AddCategoryModal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-management/AddCategoryModal.tsx src/features/link-management/AddCategoryModal.test.tsx
git commit -m "feat(modal): add tag radio-group to AddCategoryModal"
```

---

### Task 16: Add tag radio to `EditCategoryModal`

**Files:**
- Modify: `src/features/link-management/EditCategoryModal.tsx`

**Dependencies:** Tasks 1, 2, 4.

- [ ] **Step 1: Write the failing test** — `src/features/link-management/EditCategoryModal.test.tsx` (new):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditCategoryModal } from './EditCategoryModal';
import { useLinkStore } from '@/store/useLinkStore';

const cat = {
  id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' as const,
};
beforeEach(() => useLinkStore.setState({ categories: [cat], links: [] }));

describe('EditCategoryModal tag picker', () => {
  it('preselects current tag and persists changes', () => {
    render(<EditCategoryModal isOpen onClose={() => {}} category={cat} />);
    const cw = screen.getByRole('radio', { name: /coursework/i });
    expect((cw as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: /calendar/i }));
    fireEvent.submit(screen.getByRole('button', { name: /save/i }).closest('form')!);
    expect(useLinkStore.getState().categories[0].tag).toBe('Calendar');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-management/EditCategoryModal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Apply the same `useState<CategoryTag>(category.tag)` + radiogroup as Task 15. Pass `tag` to `updateCategory` and reset `setTag(category.tag)` in the existing `useEffect` reset block.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-management/EditCategoryModal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-management/EditCategoryModal.tsx src/features/link-management/EditCategoryModal.test.tsx
git commit -m "feat(modal): add tag radio-group to EditCategoryModal"
```

---

### Task 17: Confirm `AddLinkModal` works without preset (Category select required)

**Files:**
- Modify: `src/features/link-management/AddLinkModal.tsx` (cosmetic: rename `preselectedCategoryId` → `presetCategoryId` for consistency with spec)
- Modify: `src/features/link-management/AddLinkModal.test.tsx`

**Dependencies:** Task 4.

- [ ] **Step 1: Write the failing test** — append:

```tsx
it('requires category selection when no preset is given', () => {
  useLinkStore.setState({
    categories: [
      { id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' },
    ],
    links: [],
  });
  render(<AddLinkModal isOpen onClose={() => {}} />);
  // Submit without picking
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'X' } });
  fireEvent.change(screen.getByLabelText(/url/i), { target: { value: 'https://x.com' } });
  fireEvent.click(screen.getByRole('button', { name: /add link/i }));
  expect(screen.getByText(/select a category/i)).toBeInTheDocument();
  expect(useLinkStore.getState().links).toHaveLength(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-management/AddLinkModal.test.tsx -t 'requires category'`
Expected: PASS or FAIL — current code already validates `categoryId`. If it passes, this task confirms behavior; rename prop next.

- [ ] **Step 3: Write minimal implementation**

In `AddLinkModal.tsx`, rename prop `preselectedCategoryId` → `presetCategoryId` (and update `HomePage.tsx` callsite). Also ensure when prop is omitted, the `<select>` defaults to `''` and validation message shows.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/features/link-management/AddLinkModal.test.tsx`
Expected: PASS (all). Also run `npx vitest run src/features/home` to confirm HomePage usage still compiles.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-management/AddLinkModal.tsx src/features/link-management/AddLinkModal.test.tsx src/features/home/HomePage.tsx
git commit -m "refactor(modal): rename preset prop and confirm category-select gate"
```

---

### Task 18: Add `E` / `D` shortcuts to `useKeyboardShortcuts`

**Files:**
- Modify: `src/hooks/useKeyboardShortcuts.ts`
- Modify: `src/hooks/useKeyboardShortcuts.test.ts`

**Dependencies:** None (uses DOM data-attrs added later, but logic works without them).

- [ ] **Step 1: Write the failing test** — append:

```ts
import { renderHook } from '@testing-library/react';

it('skips shortcuts when a <dialog> is open', () => {
  const cb = vi.fn();
  document.body.innerHTML = '<dialog open></dialog><div tabindex="0" data-card-id="c1"></div>';
  const card = document.querySelector('[data-card-id]') as HTMLElement;
  card.focus();
  renderHook(() => useKeyboardShortcuts({ e: cb }));
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
  expect(cb).not.toHaveBeenCalled();
});

it('fires E with focusedCardId when card focused', () => {
  const cb = vi.fn();
  document.body.innerHTML = '<div tabindex="0" data-card-id="c1"></div>';
  const card = document.querySelector('[data-card-id]') as HTMLElement;
  card.focus();
  renderHook(() => useKeyboardShortcuts({
    e: () => cb((document.activeElement as HTMLElement).dataset.cardId),
  }));
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
  expect(cb).toHaveBeenCalledWith('c1');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useKeyboardShortcuts.test.ts`
Expected: FAIL — dialog suppression not implemented.

- [ ] **Step 3: Write minimal implementation**

Update `useKeyboardShortcuts.ts`:

```ts
const handler = useCallback((e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const isInput =
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' || target.isContentEditable;
  if (isInput) {
    if (e.key === 'Escape') (target as HTMLInputElement).blur();
    return;
  }
  // Suppress while any <dialog> is open
  if (document.querySelector('dialog[open]')) return;

  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('mod');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key.toLowerCase());
  const combo = parts.join('+');
  if (shortcuts[combo]) {
    e.preventDefault();
    shortcuts[combo]();
  }
}, [shortcuts]);
```

(The handler reads `document.activeElement` from outside via callback closures; tests inject the closure.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useKeyboardShortcuts.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useKeyboardShortcuts.ts src/hooks/useKeyboardShortcuts.test.ts
git commit -m "feat(shortcuts): suppress when dialog open; expand input guard to SELECT"
```

---

### Task 19: Rewrite `LinkItem` with monogram + accent hover

**Files:**
- Modify: `src/features/link-directory/LinkItem.tsx`
- Modify: `src/features/link-directory/LinkItem.test.tsx`

**Dependencies:** Tasks 9, 8.

- [ ] **Step 1: Write the failing test** — replace tests:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkItem } from './LinkItem';

const link = {
  id: 'l1', categoryId: 'c1',
  title: 'Portal ETC', url: 'https://github.com/foo',
  description: 'desc', order: 0, createdAt: 1,
};

describe('LinkItem polished', () => {
  it('renders monogram for github.com (G)', () => {
    render(<LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByLabelText(/github\.com/i).textContent).toBe('G');
  });
  it('exposes data-link-id for shortcut focus', () => {
    const { container } = render(
      <LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />
    );
    expect(container.querySelector('[data-link-id="l1"]')).toBeInTheDocument();
  });
  it('shows external arrow', () => {
    const { container } = render(
      <LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-directory/LinkItem.test.tsx`
Expected: FAIL — old structure.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/link-directory/LinkItem.tsx
'use client';

import { useState } from 'react';
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { MonogramFavicon } from '@/components/ui/MonogramFavicon';
import { HighlightText } from '@/components/ui/HighlightText';
import type { Link } from '@/types';

interface Props {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  searchQuery?: string;
  index?: number;
}

const domainOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

export function LinkItem({ link, accentColor, onEdit, onDelete, isDragging = false, searchQuery, index = 0 }: Props) {
  const [hover, setHover] = useState(false);
  const domain = domainOf(link.url);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link-id={link.id}
      className="fade-up"
      style={{
        ['--idx' as never]: String(index),
        animationDelay: `calc(var(--idx) * 30ms)`,
        display: 'grid',
        gridTemplateColumns: '20px 1fr auto',
        alignItems: 'center', gap: 10,
        padding: '9px 10px',
        background: hover ? `color-mix(in srgb, ${accentColor} 8%, var(--surface))` : 'transparent',
        border: `1.5px solid ${hover ? `color-mix(in srgb, ${accentColor} 40%, var(--border-soft))` : 'transparent'}`,
        borderRadius: 7,
        transition: 'background 120ms, border-color 120ms',
        textDecoration: 'none', color: 'inherit',
      }}
      onMouseEnter={() => !isDragging && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <MonogramFavicon url={link.url} accent={accentColor} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <HighlightText text={link.title} query={searchQuery ?? ''} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: 'var(--text-3)', marginTop: 1,
        }}>
          <span className="mono" style={{ color: 'var(--text-2)' }}>{domain}</span>
          {link.description && (
            <>
              <span>·</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <HighlightText text={link.description} query={searchQuery ?? ''} />
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          aria-label={`Edit ${link.title}`}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
        ><Pencil size={13} strokeWidth={1.75} /></button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          aria-label={`Delete ${link.title}`}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
        ><Trash2 size={13} strokeWidth={1.75} /></button>
        <span style={{
          color: hover ? accentColor : 'var(--text-3)',
          transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'color 120ms, transform 120ms',
          display: 'grid', placeItems: 'center',
        }}><ArrowUpRight size={13} strokeWidth={1.75} /></span>
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-directory/LinkItem.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/LinkItem.tsx src/features/link-directory/LinkItem.test.tsx
git commit -m "feat(link): polished LinkItem with monogram + accent hover"
```

---

### Task 20: Rewrite `CategoryCard` with tinted header + drag handle + tag·count subtitle

**Files:**
- Modify: `src/features/link-directory/CategoryCard.tsx`
- Modify: `src/features/link-directory/CategoryCard.test.tsx`

**Dependencies:** Tasks 1, 8, 19.

- [ ] **Step 1: Write the failing test** — replace existing tests:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';
import type { Category } from '@/types';

const cat: Category = {
  id: 'c1', name: 'TPA', emoji: '📝', color: '#16a34a',
  order: 0, createdAt: 1, tag: 'Entry exam',
};

describe('CategoryCard polished', () => {
  it('renders mono tag·count subtitle', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByText(/Entry exam/)).toBeInTheDocument();
    expect(screen.getByText(/0 links/)).toBeInTheDocument();
  });
  it('exposes data-card-id for shortcut focus', () => {
    const { container } = render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(container.querySelector('[data-card-id="c1"]')).toBeInTheDocument();
  });
  it('renders dashed Add link CTA', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByRole('button', { name: /add link/i })).toBeInTheDocument();
  });
  it('shows in-card empty state when links is empty', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByText(/no links yet/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/link-directory/CategoryCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Replace `CategoryCard.tsx` (no `framer-motion`):

```tsx
'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { LinkItem } from './LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Category, Link } from '@/types';

interface Props {
  category: Category;
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLink: (categoryId: string) => void;
  isDragging?: boolean;
  searchQuery?: string;
  dragHandleProps?: {
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  };
  renderLinks?: (links: Link[], accentColor: string) => React.ReactNode;
  index?: number;
}

export function CategoryCard({
  category, links, onEditLink, onDeleteLink, onEditCategory, onDeleteCategory,
  onAddLink, isDragging = false, searchQuery, dragHandleProps, renderLinks, index = 0,
}: Props) {
  const [hover, setHover] = useState(false);
  const accent = category.color;
  const headerBg = `color-mix(in srgb, ${accent} 14%, var(--surface))`;

  const ariaLabel = `${category.name}, ${links.length} link${links.length === 1 ? '' : 's'}, press E to edit or D to delete`;

  return (
    <article
      tabIndex={0}
      data-card-id={category.id}
      aria-label={ariaLabel}
      className="fade-up"
      style={{
        ['--idx' as never]: String(index),
        animationDelay: `calc(var(--idx) * 30ms)`,
        position: 'relative',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 10,
        boxShadow: hover && !isDragging ? '4px 4px 0 var(--shadow-color)' : '3px 3px 0 var(--shadow-color)',
        transform: hover && !isDragging ? 'translate(-1px,-1px)' : 'translate(0,0)',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <header style={{
        padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1.5px solid var(--border-soft)',
        background: headerBg,
      }}>
        {dragHandleProps && (
          <DragHandle listeners={dragHandleProps.listeners} attributes={dragHandleProps.attributes} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: 2, background: accent,
              border: `1px solid color-mix(in srgb, ${accent} 60%, var(--border))`,
              flexShrink: 0,
            }} />
            <h3 style={{
              margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              color: 'var(--text)',
            }}>{category.name}</h3>
          </div>
          <div className="mono" style={{
            marginTop: 3, fontSize: 10.5, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {category.tag} · <span style={{ color: 'var(--text-2)' }}>
              {links.length} link{links.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button type="button" onClick={() => onEditCategory(category)}
            aria-label={`Edit ${category.name}`}
            style={{ width: 26, height: 26, display: 'grid', placeItems: 'center',
              background: 'transparent', border: 'none', borderRadius: 6,
              color: 'var(--text-3)', cursor: 'pointer' }}>
            <Pencil size={13} strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => onDeleteCategory(category)}
            aria-label={`Delete ${category.name}`}
            style={{ width: 26, height: 26, display: 'grid', placeItems: 'center',
              background: 'transparent', border: 'none', borderRadius: 6,
              color: 'var(--text-3)', cursor: 'pointer' }}>
            <Trash2 size={13} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {links.length === 0 ? (
          <div style={{
            padding: '20px 12px', textAlign: 'center',
            border: '1.5px dashed var(--border-soft)', borderRadius: 8,
            background: 'var(--surface-2)',
          }}>
            <div style={{
              width: 28, height: 28, margin: '0 auto 8px',
              display: 'grid', placeItems: 'center',
              background: 'var(--surface)', border: '1.5px solid var(--border-soft)',
              borderRadius: 6, color: 'var(--text-3)',
            }}><BookOpen size={14} strokeWidth={1.75} /></div>
            <div className="mono" style={{
              fontSize: 10.5, fontWeight: 500, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>No links yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
              Drop a Classroom link or Drive folder.
            </div>
          </div>
        ) : renderLinks ? (
          renderLinks(links, accent)
        ) : (
          links.map((l, i) => (
            <LinkItem key={l.id} link={l} accentColor={accent}
              onEdit={() => onEditLink(l)} onDelete={() => onDeleteLink(l)}
              isDragging={isDragging} searchQuery={searchQuery} index={i} />
          ))
        )}
        <button
          type="button"
          onClick={() => onAddLink(category.id)}
          aria-label="Add link"
          style={{
            marginTop: 4, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'transparent',
            border: '1.5px dashed var(--border-soft)',
            borderRadius: 8,
            color: 'var(--text-3)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/link-directory/CategoryCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/CategoryCard.tsx src/features/link-directory/CategoryCard.test.tsx
git commit -m "feat(card): polished CategoryCard with tinted header and tabindex"
```

---

### Task 21: Rewrite `HeroSection` with bilingual copy + stats + relative time

**Files:**
- Modify: `src/features/home/HeroSection.tsx`
- Create: `src/features/home/HeroSection.test.tsx`

**Dependencies:** Tasks 3, 4.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [
    { id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' },
  ],
  links: [
    { id: 'l1', categoryId: 'c1', title: 'L', url: 'https://x.com', order: 0, createdAt: 1 },
  ],
  lastUpdatedAt: Date.now() - 2 * 86_400_000,
}));

describe('HeroSection', () => {
  it('renders bilingual chip and headline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Program Magister · TA 2025\/26/)).toBeInTheDocument();
    expect(screen.getByText(/Resource hub/)).toBeInTheDocument();
    expect(screen.getByText(/Classroom, jadwal, dan folder/)).toBeInTheDocument();
  });
  it('shows category and link counts and relative time', () => {
    render(<HeroSection />);
    expect(screen.getByText('1', { selector: 'div' })).toBeInTheDocument(); // categories
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/home/HeroSection.test.tsx`
Expected: FAIL — old hero copy.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/home/HeroSection.tsx
'use client';

import { useLinkStore } from '@/store/useLinkStore';
import { formatRelative } from '@/lib/utils';

export function HeroSection() {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);
  const lastUpdatedAt = useLinkStore((s) => s.lastUpdatedAt);

  return (
    <section style={{ padding: '44px 0 32px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="mono" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontSize: 11, fontWeight: 500,
        color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.12em',
        background: 'var(--surface)', border: '1.5px solid var(--border-soft)',
        borderRadius: 999, padding: '5px 12px',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
        Program Magister · TA 2025/26
      </div>
      <h1 style={{
        margin: '20px 0 10px', fontSize: 64, fontWeight: 800,
        letterSpacing: '-0.04em', lineHeight: 0.95,
      }}>
        Resource hub<br />
        <span style={{ color: 'var(--text-3)' }}>for the long haul.</span>
      </h1>
      <p style={{ margin: 0, fontSize: 17, color: 'var(--text-2)', maxWidth: 560, lineHeight: 1.5 }}>
        Classroom, jadwal, dan folder belajar untuk empat semester — diatur sekali, mudah dicari selamanya.
      </p>
      <div className="mono" style={{
        marginTop: 28, display: 'flex', gap: 24, alignItems: 'center',
        fontSize: 12, color: 'var(--text-2)', flexWrap: 'wrap',
      }}>
        <Stat label="Categories" value={String(categories.length)} />
        <Divider />
        <Stat label="Links" value={String(links.length)} />
        <Divider />
        <Stat label="Last updated" value={formatRelative(lastUpdatedAt)} />
      </div>
    </section>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>{label}</div>
  </div>
);
const Divider = () => <div style={{ width: 1, height: 32, background: 'var(--border-soft)' }} />;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/home/HeroSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/HeroSection.tsx src/features/home/HeroSection.test.tsx
git commit -m "feat(hero): bilingual editorial hero with stats + relative time"
```

---

### Task 22: Add `Header` component with TagFilterButton + AddLinkButton

**Files:**
- Create: `src/components/ui/Header.tsx`
- Create: `src/components/ui/Header.test.tsx`

**Dependencies:** Tasks 13, 14.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders S2 monogram, version v5.0, search, theme toggle, filter, add link', () => {
    render(<Header
      query="" onQueryChange={() => {}}
      onAddLink={() => {}} searchInputRef={{ current: null } as any}
    />);
    expect(screen.getByText('S2')).toBeInTheDocument();
    expect(screen.getByText(/v5\.0 · polished/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/switch to (dark|light) mode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add link/i })).toBeInTheDocument();
  });

  it('clicking filter opens popover (5 pills)', () => {
    render(<Header
      query="" onQueryChange={() => {}}
      onAddLink={() => {}} searchInputRef={{ current: null } as any}
    />);
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/Header.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/Header.tsx
'use client';

import { useState, type RefObject } from 'react';
import { Filter, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from '@/features/search/SearchBar';
import { TagFilterPopover } from '@/features/link-directory/TagFilterPopover';
import { useTagFilter } from '@/hooks/useTagFilter';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onAddLink: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function Header({ query, onQueryChange, onAddLink, searchInputRef }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const { activeTags } = useTagFilter();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid var(--border-soft)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, display: 'grid', placeItems: 'center',
            background: 'var(--text)', color: 'var(--bg)',
            borderRadius: 8, fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em',
          }}>S2</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Resource Hub</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>v5.0 · polished</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar ref={searchInputRef} value={query} onChange={onQueryChange} />
        <ThemeToggle />
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filter by tag"
            style={btnGhost}
          >
            <Filter size={14} strokeWidth={1.75} />
            Filter{activeTags.size > 0 && (
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                · {activeTags.size}
              </span>
            )}
          </button>
          <TagFilterPopover open={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
        <button
          type="button"
          onClick={onAddLink}
          aria-label="Add link"
          style={btnPrimary}
        >
          <Plus size={14} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </header>
  );
}

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 34, padding: '0 14px',
  background: 'var(--text)', color: 'var(--bg)',
  border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: 13, fontWeight: 600,
  boxShadow: '2px 2px 0 var(--shadow-color)',
  cursor: 'pointer',
} as const;

const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 34, padding: '0 12px',
  background: 'var(--surface)', color: 'var(--text)',
  border: '1.5px solid var(--border-soft)', borderRadius: 8,
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/Header.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Header.tsx src/components/ui/Header.test.tsx
git commit -m "feat(ui): add polished sticky Header with filter + add-link"
```

---

### Task 23: Restyle `SearchBar` (in-header pill, ⌘K badge)

**Files:**
- Modify: `src/features/search/SearchBar.tsx`
- Modify: `src/features/search/SearchBar.test.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: Write the failing test** — append:

```tsx
it('renders ⌘K kbd badge', () => {
  render(<SearchBar value="" onChange={() => {}} />);
  expect(screen.getByText('⌘K')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/search/SearchBar.test.tsx -t '⌘K'`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Restyle existing `SearchBar.tsx` to use the polished tokens. Keep `forwardRef`, debounce, Esc behavior. Add a positioned `⌘K` `<span>` inside the input wrapper.

```tsx
// Polished SearchBar (sketch — keep existing logic, swap markup/styles)
return (
  <div style={{ position: 'relative', width: 320 }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
      color: 'var(--text-3)', display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
      <Search size={14} strokeWidth={1.75} />
    </span>
    <input
      ref={localRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search resources, links, courses…"
      style={{
        width: '100%', height: 34, padding: '0 56px 0 34px',
        background: 'var(--surface)',
        border: '1.5px solid var(--border-soft)', borderRadius: 8,
        color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
        outline: 'none',
      }}
    />
    <span className="mono" style={{
      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
      display: 'inline-flex', alignItems: 'center', gap: 2,
      fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
      background: 'var(--surface-2)', border: '1px solid var(--border-soft)',
      padding: '2px 6px', borderRadius: 4,
    }}>⌘K</span>
  </div>
);
```

Drop the previous Tailwind classes for the input wrapper.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/search/SearchBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/search/SearchBar.tsx src/features/search/SearchBar.test.tsx
git commit -m "feat(search): polished in-header SearchBar with ⌘K badge"
```

---

### Task 24: Tune `SortableCategoryGrid` to render tag-grouped sections

**Files:**
- Modify: `src/features/card-ordering/SortableCategoryGrid.tsx`

**Dependencies:** Tasks 5, 10, 20.

- [ ] **Step 1: Write the failing test** — `src/features/card-ordering/SortableCategoryGrid.test.tsx` (new):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SortableCategoryGrid } from './SortableCategoryGrid';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [
    { id: 'c1', name: 'TPA',   emoji: '📝', color: '#16a34a', order: 0, createdAt: 1, tag: 'Entry exam' },
    { id: 'c2', name: 'TOEFL', emoji: '🌐', color: '#0284c7', order: 1, createdAt: 1, tag: 'Language'   },
    { id: 'c3', name: 'Sem 1', emoji: '📘', color: '#ea580c', order: 2, createdAt: 1, tag: 'Coursework' },
  ],
  links: [],
}));

describe('SortableCategoryGrid', () => {
  it('renders one GroupHeader per non-empty tag in CATEGORY_TAG_ORDER', () => {
    render(<SortableCategoryGrid
      results={[
        { category: useLinkStore.getState().categories[0], links: [] },
        { category: useLinkStore.getState().categories[1], links: [] },
        { category: useLinkStore.getState().categories[2], links: [] },
      ]}
      allLinks={[]} allCategories={useLinkStore.getState().categories}
      onEditLink={() => {}} onDeleteLink={() => {}}
      onEditCategory={() => {}} onDeleteCategory={() => {}}
      onAddLinkToCategory={() => {}} onAddCategory={() => {}}
      searchQuery=""
    />);
    const headers = screen.getAllByRole('heading', { level: 2 }).map((n) => n.textContent);
    expect(headers).toEqual(['Entry exam', 'Language', 'Coursework']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/card-ordering/SortableCategoryGrid.test.tsx`
Expected: FAIL — current component renders flat grid.

- [ ] **Step 3: Write minimal implementation**

Rework the rendering inside `SortableCategoryGrid` to:
1. Keep ONE `<DndContext>` and ONE `<SortableContext items={results.map(r => r.category.id)} strategy={rectSortingStrategy}>`.
2. Group `results` via `groupByTag(results.map(r => r.category))` then render per-tag `<section>` with `<GroupHeader title={tag} count={items.reduce(...)} />` and a CSS grid of `<SortableCategoryCard />` for each item in that tag's bucket. Inside each group, look up the matching `links` from `results`.
3. Drop any `staggerContainer` wrapping (replaced by CSS `fade-up`).

(Existing drop logic + `useCategoryDnd` is preserved — only the JSX structure changes.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/card-ordering/SortableCategoryGrid.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/card-ordering/SortableCategoryGrid.tsx src/features/card-ordering/SortableCategoryGrid.test.tsx
git commit -m "feat(grid): render tag-grouped sections with single SortableContext"
```

---

### Task 25: Wire E/D keyboard shortcuts in `HomePage`

**Files:**
- Modify: `src/features/home/HomePage.tsx`

**Dependencies:** Tasks 18, 20, 19.

- [ ] **Step 1: Write the failing test** — `src/features/home/HomePage.shortcut.test.tsx` (new):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { HomePage } from './HomePage';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [{ id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' }],
  links: [{ id: 'l1', categoryId: 'c1', title: 'L', url: 'https://x.com', order: 0, createdAt: 1 }],
}));

describe('HomePage E/D shortcuts', () => {
  it('pressing E with a card focused opens edit modal', () => {
    const { container } = render(<HomePage />);
    const card = container.querySelector('[data-card-id="c1"]') as HTMLElement;
    card.focus();
    fireEvent.keyDown(window, { key: 'e' });
    expect(container.querySelector('dialog[open]')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/home/HomePage.shortcut.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

In `HomePage.tsx`, expand the `useKeyboardShortcuts` map:

```ts
useKeyboardShortcuts({
  'mod+k': () => searchBarRef.current?.focus(),
  e: () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return;
    const cardId = el.closest('[data-card-id]')?.getAttribute('data-card-id');
    const linkId = el.closest('[data-link-id]')?.getAttribute('data-link-id');
    if (cardId) {
      const cat = categories.find((c) => c.id === cardId);
      if (cat) setEditingCategory(cat);
    } else if (linkId) {
      const lnk = links.find((l) => l.id === linkId);
      if (lnk) setEditingLink(lnk);
    }
  },
  d: () => {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return;
    const cardId = el.closest('[data-card-id]')?.getAttribute('data-card-id');
    const linkId = el.closest('[data-link-id]')?.getAttribute('data-link-id');
    if (cardId) {
      const cat = categories.find((c) => c.id === cardId);
      if (cat) handleDeleteCategory(cat);
    } else if (linkId) {
      const lnk = links.find((l) => l.id === linkId);
      if (lnk) handleDeleteLink(lnk);
    }
  },
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/home/HomePage.shortcut.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/HomePage.tsx src/features/home/HomePage.shortcut.test.tsx
git commit -m "feat(shortcuts): wire E/D to edit/delete focused card or link"
```

---

### Task 26: Compose `HomePage` with new Header, CssOrbs, Footer; remove WebGL import

**Files:**
- Modify: `src/features/home/HomePage.tsx`

**Dependencies:** Tasks 11, 12, 14, 22, 24.

- [ ] **Step 1: Write the failing test** — `src/features/home/HomePage.test.tsx` (new):

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [{ id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' }],
  links: [],
}));

describe('HomePage polished composition', () => {
  it('renders new Header (v5.0), CssOrbs, Hero, Footer', () => {
    const { container } = render(<HomePage />);
    expect(screen.getByText(/v5\.0 · polished/)).toBeInTheDocument();
    expect(container.querySelector('.animated-bg')).toBeInTheDocument();
    expect(screen.getByText(/Resource hub/)).toBeInTheDocument();
    expect(screen.getByText(/POLISHED · v5\.0/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/home/HomePage.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Replace the JSX of `HomePage.tsx` to:
1. Drop the `dynamic(...)` import for `AnimatedBackground`.
2. Import `CssOrbs`, `Header`, `Footer`.
3. Read current theme via `data-theme` attribute (or maintain a small state synced to ThemeToggle); pass into `<CssOrbs />`.
4. Wrap content in `<div className="content-wrapper">`.
5. Replace the inline `<header>` JSX with `<Header />`.
6. Replace the legacy `<footer>` (if any) with `<Footer />`.
7. Remove the `Export to Code` button (out of polished scope; preserved in HomePage code today — drop from header per spec, retain handler only if test requires; if removing, also remove the import).

Sketch:

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>(() =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
);
useEffect(() => {
  const ob = new MutationObserver(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  });
  ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => ob.disconnect();
}, []);

return (
  <>
    <CssOrbs theme={theme} />
    <div className="content-wrapper" style={{ minHeight: '100vh' }}>
      <Header
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onAddLink={() => setIsAddLinkOpen(true)}
        searchInputRef={searchBarRef}
      />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 32px' }}>
        <HeroSection />
        <CategoryGrid {...gridProps} />
      </main>
      <Footer />
      {/* modals + ToastContainer unchanged */}
    </div>
  </>
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/home/HomePage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/home/HomePage.tsx src/features/home/HomePage.test.tsx
git commit -m "feat(home): compose polished HomePage with Header/CssOrbs/Footer"
```

---

### Task 27: Update `CategoryGrid` empty-state copy to polished tokens (no logic change)

**Files:**
- Modify: `src/features/link-directory/CategoryGrid.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: Write the failing test**

(Existing tests already cover empty/results paths.)
Smoke check: `npx vitest run src/features/link-directory/CategoryGrid` — should remain green after edits.

- [ ] **Step 2: Implementation**

Replace the `grid grid-cols-* gap-4` skeleton wrapper with inline style `display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, paddingTop: 12`.

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/features/link-directory`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/features/link-directory/CategoryGrid.tsx
git commit -m "style(grid): switch CategoryGrid skeleton to polished grid template"
```

---

### Task 28: Restyle `Modal`, `Button`, `Input`, `Toast`, `UndoToast`, `SkeletonCard`, `RichEmptyState`, `EmojiPicker`, `HighlightText` to polished tokens

**Files (touch each in turn — separate sub-task per file):**
- `src/components/ui/Modal.tsx` (+ test)
- `src/components/ui/Button.tsx` (+ test)
- `src/components/ui/Input.tsx` (+ test)
- `src/components/ui/Toast.tsx` (+ test)
- `src/components/ui/UndoToast.tsx` (+ test)
- `src/components/ui/SkeletonCard.tsx` (+ test)
- `src/components/ui/RichEmptyState.tsx` (+ test)
- `src/components/ui/EmojiPicker.tsx` (+ test)
- `src/components/ui/HighlightText.tsx` (+ test)
- `src/components/ui/DragHandle.tsx`

**Dependencies:** Task 8.

- [ ] **Step 1: For each file, write or extend a test** asserting the polished tokens are present (e.g. `box-shadow: 3px 3px 0 var(--shadow-color)`, no `bg-[var(--bg-card)]`, etc.). Behaviors unchanged.

- [ ] **Step 2: Run tests** — confirm failure on token assertions.

- [ ] **Step 3: Implementation** — per file, replace token classes/styles to align with the polished spec section. Where `framer-motion` was used (`<motion.button>`, `<motion.div>`), strip it and rely on CSS classes (`.card-rest`, `.fade-up`).

- [ ] **Step 4: Verify**

Run: `npx vitest run src/components/ui`
Expected: PASS for all UI tests.

- [ ] **Step 5: Commit (per file or grouped)**

```bash
git add src/components/ui
git commit -m "style(ui): restyle UI primitives to polished tokens; drop framer-motion"
```

---

### Task 29: Restyle `DragOverlayContent` and SortableLinkItem/SortableLinkList to polished tokens

**Files:**
- Modify: `src/features/card-ordering/DragOverlayContent.tsx` (+ test)
- Modify: `src/features/card-ordering/SortableCategoryCard.tsx`
- Modify: `src/features/card-ordering/SortableLinkItem.tsx`
- Modify: `src/features/card-ordering/SortableLinkList.tsx`

**Dependencies:** Tasks 19, 20.

- [ ] **Step 1: Write the failing test** — extend `DragOverlayContent.test.tsx` to assert `.card-lift` is applied during drag preview.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/card-ordering/DragOverlayContent.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementation** — strip framer-motion variants (`staggerItem`, `popOut`, etc.) from these files; apply `.card-lift` class on drag preview wrapper; use the new CategoryCard / LinkItem internals.

- [ ] **Step 4: Verify**

Run: `npx vitest run src/features/card-ordering`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/card-ordering
git commit -m "refactor(dnd): polished overlay + sortable wrappers without framer-motion"
```

---

### Task 30: Inject `NEXT_PUBLIC_BUILD_TIME` in `next.config.ts`

**Files:**
- Modify: `next.config.ts`

**Dependencies:** Task 2.

- [ ] **Step 1: Write the failing test** — `next.config.test.ts` (new):

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const src = readFileSync(join(__dirname, 'next.config.ts'), 'utf8');

describe('next.config.ts', () => {
  it('injects NEXT_PUBLIC_BUILD_TIME from VERCEL_GIT_COMMIT_AUTHOR_DATE', () => {
    expect(src).toMatch(/NEXT_PUBLIC_BUILD_TIME/);
    expect(src).toMatch(/VERCEL_GIT_COMMIT_AUTHOR_DATE/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run next.config.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Edit `next.config.ts` so the exported config includes:

```ts
const nextConfig: NextConfig = {
  // ...existing
  env: {
    NEXT_PUBLIC_BUILD_TIME:
      process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? new Date().toISOString(),
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run next.config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts next.config.test.ts
git commit -m "feat(config): inject NEXT_PUBLIC_BUILD_TIME for SEED_LAST_UPDATED"
```

---

### Task 31: Delete WebGL background, animations, LinkFavicon, useDeviceCapability

**Files (delete):**
- `src/features/background-effects/AnimatedBackground.tsx`
- `src/features/background-effects/BlobScene.tsx`
- `src/features/background-effects/FloatingBlob.tsx`
- `src/features/background-effects/useMouseParallax.ts`
- `src/features/background-effects/useMouseParallax.test.ts`
- `src/hooks/useDeviceCapability.ts`
- `src/hooks/useDeviceCapability.test.ts`
- `src/components/ui/LinkFavicon.tsx`
- `src/components/ui/LinkFavicon.test.tsx`
- `src/animations/drag-presets.ts`
- `src/animations/variants.ts`
- `src/animations/variants.test.ts`

**Dependencies:** Tasks 11 (CssOrbs replaces background), 19 (LinkItem now imports MonogramFavicon), 28/29 (no remaining framer-motion imports).

- [ ] **Step 1: Verify no remaining imports** — `grep -rn "from '@/components/ui/LinkFavicon'\\|from '@/features/background-effects\\|from '@/hooks/useDeviceCapability'\\|from '@/animations/" src`. Expected: empty output.

- [ ] **Step 2: Delete files** with `git rm`:

```bash
git rm src/features/background-effects/AnimatedBackground.tsx \
       src/features/background-effects/BlobScene.tsx \
       src/features/background-effects/FloatingBlob.tsx \
       src/features/background-effects/useMouseParallax.ts \
       src/features/background-effects/useMouseParallax.test.ts \
       src/hooks/useDeviceCapability.ts \
       src/hooks/useDeviceCapability.test.ts \
       src/components/ui/LinkFavicon.tsx \
       src/components/ui/LinkFavicon.test.tsx \
       src/animations/drag-presets.ts \
       src/animations/variants.ts \
       src/animations/variants.test.ts
rmdir src/animations 2>/dev/null || true
```

- [ ] **Step 3: Run full suite**

Run: `npm test`
Expected: PASS (no broken imports).

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove WebGL background, framer-motion variants, LinkFavicon, device capability"
```

---

### Task 32: Drop unused dependencies from `package.json`

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Dependencies:** Task 31.

- [ ] **Step 1: Verify nothing imports the deps**

`grep -rn "from 'framer-motion'\\|from '@react-three/\\|from 'three\\b" src` → empty.

- [ ] **Step 2: Uninstall**

```bash
npm uninstall framer-motion @react-three/fiber @react-three/drei @react-three/postprocessing three @types/three
```

- [ ] **Step 3: Run full suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: drop framer-motion + R3F + three deps"
```

---

### Task 33: Final smoke — `npm run lint` + `npm run build`

**Files:** None.

**Dependencies:** Tasks 1–32.

- [ ] **Step 1: Lint**

```bash
npm run lint
```
Expected: 0 errors. Fix any remaining `any` or hook warnings inline (typically `RichEmptyState.test.tsx`, `UndoToast.test.tsx`, `SearchBar.tsx` — replace `any` with concrete types).

- [ ] **Step 2: Build**

```bash
npm run build
```
Expected: success.

- [ ] **Step 3: Run full suite**

```bash
npm test
```
Expected: PASS (>= 154 tests; new tests added; deleted tests removed).

- [ ] **Step 4: Manual smoke (optional, time-permitting)**

Run `npm run dev`, open `localhost:3000`, verify the manual checklist in the spec § Manual verification.

- [ ] **Step 5: Commit (only if lint fixes were applied)**

```bash
git add -A
git commit -m "chore: lint cleanup post-redesign"
```

---

## Self-review (post-plan)

**Spec coverage:** Each spec section has at least one task —

| Spec section | Task(s) |
|---|---|
| Tokens / globals.css | 8 |
| Data model + constants | 1, 2, 4 |
| `lastUpdatedAt` + `formatRelative` | 3, 4, 21 |
| `useTagGroups` | 5 |
| `useTagFilter` | 6 |
| `useFilteredLinks` (tag match) | 7 |
| `MonogramFavicon` | 9 |
| `GroupHeader` | 10 |
| `CssOrbs` | 11 |
| `Footer` | 12 |
| `TagFilterPopover` | 13 |
| `ThemeToggle` migration | 14 |
| Modal tag pickers | 15, 16 |
| `AddLinkModal` no-preset | 17 |
| `useKeyboardShortcuts` E/D + dialog guard | 18, 25 |
| `LinkItem` rewrite | 19 |
| `CategoryCard` rewrite | 20 |
| `HeroSection` rewrite | 21 |
| `Header` extraction | 22 |
| `SearchBar` polish | 23 |
| `SortableCategoryGrid` tag sections | 24 |
| `HomePage` composition | 26 |
| `CategoryGrid` polish | 27 |
| UI primitives restyle | 28 |
| DnD wrappers restyle | 29 |
| `next.config.ts` env | 30 |
| Cleanup deletes | 31 |
| Dep removal | 32 |
| Final smoke | 33 |

**Type consistency:** `Category.tag` referenced consistently as `CategoryTag`; `groupByTag` / `useTagGroups` / `useTagFilter` use the same union; `CATEGORY_TAGS` / `CATEGORY_TAG_ORDER` always imported from `@/lib/constants`. `data-card-id` / `data-link-id` attribute names used consistently in Tasks 18, 20, 25, 19.

**Placeholder scan:** Every code block is concrete; no "TBD" or "similar to Task N".

---

## Parallel execution map

```
Group A (independent, can run in parallel):
  Task 1: types
  Task 3: formatRelative util
  Task 8: globals.css tokens
  Task 14: ThemeToggle migration

Sequential after Group A:
  Task 2: constants (depends on 1)

Group B (after Tasks 1, 2):
  Task 4: store extension
  Task 5: useTagGroups
  Task 6: useTagFilter
  Task 7: useFilteredLinks tag match

Group C (leaf components — after Task 8):
  Task 9: MonogramFavicon
  Task 10: GroupHeader
  Task 11: CssOrbs
  Task 12: Footer

Sequential:
  Task 13: TagFilterPopover (after Task 6)
  Task 18: useKeyboardShortcuts E/D + dialog guard (independent of others)
  Task 23: SearchBar polish (after Task 8)

Group D (modal updates — after 1, 2, 4):
  Task 15: AddCategoryModal
  Task 16: EditCategoryModal
  Task 17: AddLinkModal preset rename

Sequential:
  Task 19: LinkItem rewrite (after 8, 9)
  Task 20: CategoryCard rewrite (after 1, 8, 19)
  Task 21: HeroSection rewrite (after 3, 4)
  Task 22: Header (after 13, 14)

Sequential:
  Task 24: SortableCategoryGrid (after 5, 10, 20)
  Task 25: HomePage E/D wiring (after 18, 19, 20)
  Task 26: HomePage composition (after 11, 12, 14, 22, 24)
  Task 27: CategoryGrid polish (after 8)
  Task 28: UI primitives restyle (after 8)
  Task 29: DnD wrappers restyle (after 19, 20)

Sequential:
  Task 30: next.config.ts (after 2)
  Task 31: deletions (after 11, 19, 28, 29)
  Task 32: deps (after 31)
  Task 33: final smoke (after 1–32)
```

**Critical path:** 1 → 2 → 4 → 5 → 24 → 26 → 33.

**Total tasks:** 33.

---

## Execution handoff

After approval, two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks.
2. **Inline Execution** — execute in this session via `executing-plans`, with checkpoints.

(Per Phase 4 prompt: pick at that time.)
