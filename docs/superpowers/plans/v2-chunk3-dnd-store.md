# Chunk 3: DnD Store + Animations

> **Spec:** `docs/superpowers/specs/2026-03-28-s2-linktree-v2-design.md` — Section 4 (Store Additions, Drag Animations)
> **Depends on:** Chunk 1 (export/import removed from store)

## Task 12: Add reorderCategories store action with tests

**Files:**
- Modify: `src/store/useLinkStore.test.ts`
- Modify: `src/store/useLinkStore.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/store/useLinkStore.test.ts` (inside the outer `describe('useLinkStore', ...)`):

```typescript
describe('reorderCategories', () => {
  it('swaps two categories and reassigns sequential order values', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 },
        { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1 },
        { id: 'c3', name: 'C', emoji: 'c', color: '#aaa', order: 2, createdAt: 1 },
      ],
      links: [],
    });
    useLinkStore.getState().reorderCategories('c1', 'c3');
    const cats = useLinkStore.getState().categories;
    const sorted = [...cats].sort((a, b) => a.order - b.order);
    expect(sorted.map((c) => c.id)).toEqual(['c2', 'c3', 'c1']);
    expect(sorted[0].order).toBe(0);
    expect(sorted[1].order).toBe(1);
    expect(sorted[2].order).toBe(2);
  });

  it('handles moving a category backward', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 },
        { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1 },
        { id: 'c3', name: 'C', emoji: 'c', color: '#aaa', order: 2, createdAt: 1 },
      ],
      links: [],
    });
    useLinkStore.getState().reorderCategories('c3', 'c1');
    const cats = useLinkStore.getState().categories;
    const sorted = [...cats].sort((a, b) => a.order - b.order);
    expect(sorted.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
    expect(sorted[0].order).toBe(0);
    expect(sorted[1].order).toBe(1);
    expect(sorted[2].order).toBe(2);
  });

  it('does nothing when activeId equals overId', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 },
      ],
      links: [],
    });
    useLinkStore.getState().reorderCategories('c1', 'c1');
    expect(useLinkStore.getState().categories[0].order).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: FAIL — `reorderCategories is not a function`

- [ ] **Step 3: Add reorderCategories to the store interface**

In `src/store/useLinkStore.ts`, add to the `LinkStore` interface (after `deleteLink`):

```typescript
reorderCategories: (activeId: string, overId: string) => void;
```

- [ ] **Step 4: Implement reorderCategories**

In `src/store/useLinkStore.ts`, add the implementation inside the persist callback (after `deleteLink`):

```typescript
reorderCategories: (activeId, overId) => {
  if (activeId === overId) return;
  set((state) => {
    const sorted = [...state.categories].sort((a, b) => a.order - b.order);
    const oldIndex = sorted.findIndex((c) => c.id === activeId);
    const newIndex = sorted.findIndex((c) => c.id === overId);
    if (oldIndex === -1 || newIndex === -1) return state;
    const reordered = [...sorted];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    return {
      categories: reordered.map((c, i) => ({ ...c, order: i })),
    };
  });
},
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: `Tests 10 passed (10)` (7 existing + 3 new)

- [ ] **Step 6: Commit**

```bash
git add src/store/useLinkStore.ts src/store/useLinkStore.test.ts
git commit -m "feat: add reorderCategories store action with arrayMove logic

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 13: Add reorderLinks store action with tests

**Files:**
- Modify: `src/store/useLinkStore.test.ts`
- Modify: `src/store/useLinkStore.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/store/useLinkStore.test.ts`:

```typescript
describe('reorderLinks', () => {
  it('reorders links within a category', () => {
    useLinkStore.setState({
      categories: [{ id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 }],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
        { id: 'l3', categoryId: 'c1', title: 'L3', url: 'https://3.com', order: 2, createdAt: 1 },
      ],
    });
    useLinkStore.getState().reorderLinks('c1', 'l1', 'l3');
    const links = useLinkStore.getState().links
      .filter((l) => l.categoryId === 'c1')
      .sort((a, b) => a.order - b.order);
    expect(links.map((l) => l.id)).toEqual(['l2', 'l3', 'l1']);
    expect(links[0].order).toBe(0);
    expect(links[1].order).toBe(1);
    expect(links[2].order).toBe(2);
  });

  it('does not affect links in other categories', () => {
    useLinkStore.setState({
      categories: [],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
        { id: 'l3', categoryId: 'c2', title: 'L3', url: 'https://3.com', order: 0, createdAt: 1 },
      ],
    });
    useLinkStore.getState().reorderLinks('c1', 'l1', 'l2');
    const c2Links = useLinkStore.getState().links.filter((l) => l.categoryId === 'c2');
    expect(c2Links[0].order).toBe(0);
  });

  it('does nothing when activeId equals overId', () => {
    useLinkStore.setState({
      categories: [],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
      ],
    });
    useLinkStore.getState().reorderLinks('c1', 'l1', 'l1');
    expect(useLinkStore.getState().links[0].order).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: FAIL — `reorderLinks is not a function`

- [ ] **Step 3: Add reorderLinks to the store interface**

Add to the `LinkStore` interface:

```typescript
reorderLinks: (categoryId: string, activeId: string, overId: string) => void;
```

- [ ] **Step 4: Implement reorderLinks**

Add after `reorderCategories`:

```typescript
reorderLinks: (categoryId, activeId, overId) => {
  if (activeId === overId) return;
  set((state) => {
    const catLinks = state.links
      .filter((l) => l.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
    const otherLinks = state.links.filter((l) => l.categoryId !== categoryId);
    const oldIndex = catLinks.findIndex((l) => l.id === activeId);
    const newIndex = catLinks.findIndex((l) => l.id === overId);
    if (oldIndex === -1 || newIndex === -1) return state;
    const reordered = [...catLinks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    return {
      links: [...otherLinks, ...reordered.map((l, i) => ({ ...l, order: i }))],
    };
  });
},
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: `Tests 13 passed (13)` (10 + 3 new)

- [ ] **Step 6: Commit**

```bash
git add src/store/useLinkStore.ts src/store/useLinkStore.test.ts
git commit -m "feat: add reorderLinks store action for within-category reordering

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 14: Add moveLinkToCategory store action with tests

**Files:**
- Modify: `src/store/useLinkStore.test.ts`
- Modify: `src/store/useLinkStore.ts`

- [ ] **Step 1: Write the failing tests**

Append to `src/store/useLinkStore.test.ts`:

```typescript
describe('moveLinkToCategory', () => {
  it('moves a link to a different category at specified index', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 },
        { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1 },
      ],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
        { id: 'l3', categoryId: 'c2', title: 'L3', url: 'https://3.com', order: 0, createdAt: 1 },
      ],
    });
    useLinkStore.getState().moveLinkToCategory('l1', 'c2', 0);
    const c1Links = useLinkStore.getState().links
      .filter((l) => l.categoryId === 'c1')
      .sort((a, b) => a.order - b.order);
    const c2Links = useLinkStore.getState().links
      .filter((l) => l.categoryId === 'c2')
      .sort((a, b) => a.order - b.order);
    expect(c1Links.map((l) => l.id)).toEqual(['l2']);
    expect(c1Links[0].order).toBe(0);
    expect(c2Links.map((l) => l.id)).toEqual(['l1', 'l3']);
    expect(c2Links[0].order).toBe(0);
    expect(c2Links[1].order).toBe(1);
  });

  it('reassigns order values in source category after removal', () => {
    useLinkStore.setState({
      categories: [],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
        { id: 'l3', categoryId: 'c1', title: 'L3', url: 'https://3.com', order: 2, createdAt: 1 },
      ],
    });
    useLinkStore.getState().moveLinkToCategory('l2', 'c2', 0);
    const c1Links = useLinkStore.getState().links
      .filter((l) => l.categoryId === 'c1')
      .sort((a, b) => a.order - b.order);
    expect(c1Links.map((l) => l.id)).toEqual(['l1', 'l3']);
    expect(c1Links[0].order).toBe(0);
    expect(c1Links[1].order).toBe(1);
  });

  it('appends to end of target category when insertIndex exceeds length', () => {
    useLinkStore.setState({
      categories: [],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c2', title: 'L2', url: 'https://2.com', order: 0, createdAt: 1 },
      ],
    });
    useLinkStore.getState().moveLinkToCategory('l1', 'c2', 99);
    const c2Links = useLinkStore.getState().links
      .filter((l) => l.categoryId === 'c2')
      .sort((a, b) => a.order - b.order);
    expect(c2Links.map((l) => l.id)).toEqual(['l2', 'l1']);
    expect(c2Links[0].order).toBe(0);
    expect(c2Links[1].order).toBe(1);
  });

  it('does nothing when moving to the same category', () => {
    useLinkStore.setState({
      categories: [],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
      ],
    });
    useLinkStore.getState().moveLinkToCategory('l1', 'c1', 1);
    const links = useLinkStore.getState().links;
    expect(links).toHaveLength(2);
    expect(links[0].order).toBe(0);
    expect(links[1].order).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: FAIL — `moveLinkToCategory is not a function`

- [ ] **Step 3: Add moveLinkToCategory to the store interface**

Add to the `LinkStore` interface:

```typescript
moveLinkToCategory: (linkId: string, targetCategoryId: string, insertIndex: number) => void;
```

- [ ] **Step 4: Implement moveLinkToCategory**

Add after `reorderLinks`:

```typescript
moveLinkToCategory: (linkId, targetCategoryId, insertIndex) => {
  set((state) => {
    const link = state.links.find((l) => l.id === linkId);
    if (!link) return state;
    const sourceCategoryId = link.categoryId;
    if (sourceCategoryId === targetCategoryId) return state;

    // Remove from source, reassign order
    const sourceLinks = state.links
      .filter((l) => l.categoryId === sourceCategoryId && l.id !== linkId)
      .sort((a, b) => a.order - b.order)
      .map((l, i) => ({ ...l, order: i }));

    // Insert into target at position
    const targetLinks = state.links
      .filter((l) => l.categoryId === targetCategoryId)
      .sort((a, b) => a.order - b.order);
    const clampedIndex = Math.min(insertIndex, targetLinks.length);
    const movedLink = { ...link, categoryId: targetCategoryId };
    targetLinks.splice(clampedIndex, 0, movedLink);
    const reorderedTarget = targetLinks.map((l, i) => ({ ...l, order: i }));

    // Combine: other links + source + target
    const otherLinks = state.links.filter(
      (l) => l.categoryId !== sourceCategoryId && l.categoryId !== targetCategoryId
    );
    return { links: [...otherLinks, ...sourceLinks, ...reorderedTarget] };
  });
},
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: `Tests 17 passed (17)` (13 + 4 new)

- [ ] **Step 6: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 39 passed (39)`

Test count: 24 (chunk 1) + 5 (chunk 2) + 10 (chunk 3: 3+3+4) = 39

- [ ] **Step 7: Commit**

```bash
git add src/store/useLinkStore.ts src/store/useLinkStore.test.ts
git commit -m "feat: add moveLinkToCategory store action for cross-category drag

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 15: Create drag animation presets

**Files:**
- Create: `src/animations/drag-presets.ts`

- [ ] **Step 1: Create drag-presets.ts**

Create `src/animations/drag-presets.ts`:

```typescript
export const DRAG_CARD_LIFT = {
  scale: 1.05,
  rotate: 2,
  boxShadow: '6px 6px 0px var(--border-color)',
};

export const DRAG_CARD_SETTLE = {
  scale: 1,
  rotate: 0,
  boxShadow: '4px 4px 0px var(--border-color)',
};

export const DRAG_LINK_LIFT = {
  scale: 1.03,
  boxShadow: '3px 3px 0px var(--border-color)',
};

export const DRAG_LINK_SETTLE = {
  scale: 1,
  boxShadow: 'none',
};

export const DRAG_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export const DRAG_SETTLE_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

export const SORTABLE_TRANSITION = {
  duration: 200,
  easing: 'ease',
};
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/animations/drag-presets.ts
git commit -m "feat: add drag animation presets for Neo-Brutalism lift/settle effects

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 16: Create DragHandle UI component

**Files:**
- Create: `src/components/ui/DragHandle.tsx`

- [ ] **Step 1: Create DragHandle component**

Create `src/components/ui/DragHandle.tsx`:

```typescript
interface DragHandleProps {
  ref?: React.Ref<HTMLButtonElement>;
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export function DragHandle({ ref, listeners, attributes }: DragHandleProps) {
  return (
    <button
      ref={ref}
      className="cursor-grab active:cursor-grabbing touch-none p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/DragHandle.tsx
git commit -m "feat: add DragHandle grip icon component for drag-and-drop

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
