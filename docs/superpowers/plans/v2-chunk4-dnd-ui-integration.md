# Chunk 4: DnD UI Components + Integration

> **Spec:** `docs/superpowers/specs/2026-03-28-s2-linktree-v2-design.md` — Section 4 (DnD System), Section 5 (CSS)
> **Depends on:** Chunk 1 (CSS layers), Chunk 3 (store actions, drag presets, DragHandle)

## Task 17: Create SortableLinkItem wrapper

**Files:**
- Create: `src/features/card-ordering/SortableLinkItem.tsx`

- [ ] **Step 1: Create SortableLinkItem**

Create `src/features/card-ordering/SortableLinkItem.tsx`:

```typescript
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Link } from '@/types';

interface SortableLinkItemProps {
  link: Link;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  }) => React.ReactNode;
}

export function SortableLinkItem({ link, children }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return <>{children({ setNodeRef, style, isDragging, listeners, attributes })}</>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/SortableLinkItem.tsx
git commit -m "feat: add SortableLinkItem wrapper for link drag-and-drop

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 18: Create SortableLinkList component

**Files:**
- Create: `src/features/card-ordering/SortableLinkList.tsx`

- [ ] **Step 1: Create SortableLinkList**

Create `src/features/card-ordering/SortableLinkList.tsx`:

```typescript
'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableLinkItem } from './SortableLinkItem';
import { LinkItem } from '@/features/link-directory/LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Link } from '@/types';

interface SortableLinkListProps {
  links: Link[];
  categoryId: string;
  accentColor: string;
  isDragging: boolean;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
}

export function SortableLinkList({
  links,
  categoryId,
  accentColor,
  isDragging,
  onEditLink,
  onDeleteLink,
}: SortableLinkListProps) {
  const { setNodeRef } = useDroppable({ id: `droppable-${categoryId}` });

  return (
    <SortableContext
      items={links.map((l) => l.id)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="flex flex-col gap-2">
        {links.map((link) => (
          <SortableLinkItem key={link.id} link={link}>
            {({ setNodeRef: itemRef, style, isDragging: isItemDragging, listeners, attributes }) => (
              <div ref={itemRef} style={style} className="flex items-center gap-1">
                <DragHandle listeners={listeners} attributes={attributes} />
                <div className="flex-1">
                  <LinkItem
                    link={link}
                    accentColor={accentColor}
                    onEdit={() => onEditLink(link)}
                    onDelete={() => onDeleteLink(link)}
                    isDragging={isDragging || isItemDragging}
                  />
                </div>
              </div>
            )}
          </SortableLinkItem>
        ))}
      </div>
    </SortableContext>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Likely fails — `LinkItem` doesn't accept `isDragging` yet. That's expected and will be fixed in Task 23.

Note: This is fine for now. We'll fix the type error when we modify `LinkItem` in Task 23. Just verify the file was created correctly.

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/SortableLinkList.tsx
git commit -m "feat: add SortableLinkList with droppable zone and link sortable context

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 19: Create SortableCategoryCard wrapper

**Files:**
- Create: `src/features/card-ordering/SortableCategoryCard.tsx`

- [ ] **Step 1: Create SortableCategoryCard**

Create `src/features/card-ordering/SortableCategoryCard.tsx`:

```typescript
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '@/types';

interface SortableCategoryCardProps {
  category: Category;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  }) => React.ReactNode;
}

export function SortableCategoryCard({ category, children }: SortableCategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return <>{children({ setNodeRef, style, isDragging, listeners, attributes })}</>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/SortableCategoryCard.tsx
git commit -m "feat: add SortableCategoryCard wrapper for category drag-and-drop

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 20: Create DragOverlayContent component

**Files:**
- Create: `src/features/card-ordering/DragOverlayContent.tsx`

- [ ] **Step 1: Create DragOverlayContent**

Create `src/features/card-ordering/DragOverlayContent.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { DRAG_CARD_LIFT, DRAG_LINK_LIFT, DRAG_TRANSITION } from '@/animations/drag-presets';
import type { Category, Link } from '@/types';

interface DragOverlayContentProps {
  type: 'category' | 'link';
  category?: Category;
  link?: Link;
}

export function DragOverlayContent({ type, category, link }: DragOverlayContentProps) {
  if (type === 'category' && category) {
    return (
      <motion.div
        initial={false}
        animate={DRAG_CARD_LIFT}
        transition={DRAG_TRANSITION}
        className="bg-[var(--bg-card)] border-2 rounded-xl px-4 py-3 w-64"
        style={{
          borderColor: category.color,
          boxShadow: `6px 6px 0px ${category.color}`,
        }}
      >
        <span className="font-extrabold text-[var(--text-primary)] text-sm">
          {category.emoji} {category.name}
        </span>
      </motion.div>
    );
  }

  if (type === 'link' && link) {
    return (
      <motion.div
        initial={false}
        animate={DRAG_LINK_LIFT}
        transition={DRAG_TRANSITION}
        className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-lg px-3 py-2 w-56"
        style={{
          boxShadow: '3px 3px 0px var(--border-color)',
        }}
      >
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">
          {link.title}
        </span>
      </motion.div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/DragOverlayContent.tsx
git commit -m "feat: add DragOverlayContent for category and link drag previews

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 21: Create useCategoryDnd hook

**Files:**
- Create: `src/features/card-ordering/useCategoryDnd.ts`

- [ ] **Step 1: Create useCategoryDnd hook**

Create `src/features/card-ordering/useCategoryDnd.ts`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLinkStore } from '@/store/useLinkStore';
import type { Category, Link } from '@/types';

type DragType = 'category' | 'link' | null;

interface DndState {
  activeType: DragType;
  activeCategory: Category | null;
  activeLink: Link | null;
  overCategoryId: string | null;
}

export function useCategoryDnd(categories: Category[], links: Link[]) {
  const reorderCategories = useLinkStore((s) => s.reorderCategories);
  const reorderLinks = useLinkStore((s) => s.reorderLinks);
  const moveLinkToCategory = useLinkStore((s) => s.moveLinkToCategory);

  const [dndState, setDndState] = useState<DndState>({
    activeType: null,
    activeCategory: null,
    activeLink: null,
    overCategoryId: null,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeId = active.id as string;

      // Check if it's a category
      const cat = categories.find((c) => c.id === activeId);
      if (cat) {
        setDndState({ activeType: 'category', activeCategory: cat, activeLink: null, overCategoryId: null });
        return;
      }

      // Check if it's a link
      const link = links.find((l) => l.id === activeId);
      if (link) {
        setDndState({ activeType: 'link', activeCategory: null, activeLink: link, overCategoryId: null });
        return;
      }
    },
    [categories, links]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over || dndState.activeType !== 'link') {
        setDndState((prev) => ({ ...prev, overCategoryId: null }));
        return;
      }

      const overId = over.id as string;

      // Check if hovering over a link — resolve its category
      const overLink = links.find((l) => l.id === overId);
      if (overLink) {
        setDndState((prev) => ({ ...prev, overCategoryId: overLink.categoryId }));
        return;
      }

      // Check if hovering over a droppable category zone
      const droppableMatch = overId.match(/^droppable-(.+)$/);
      if (droppableMatch) {
        setDndState((prev) => ({ ...prev, overCategoryId: droppableMatch[1] }));
        return;
      }

      setDndState((prev) => ({ ...prev, overCategoryId: null }));
    },
    [dndState.activeType, links]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        setDndState({ activeType: null, activeCategory: null, activeLink: null, overCategoryId: null });
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      if (dndState.activeType === 'category') {
        if (activeId !== overId) {
          reorderCategories(activeId, overId);
        }
      } else if (dndState.activeType === 'link') {
        const activeLink = links.find((l) => l.id === activeId);
        if (!activeLink) return;

        // Check if dropping on a link in the same category
        const overLink = links.find((l) => l.id === overId);
        if (overLink && overLink.categoryId === activeLink.categoryId) {
          reorderLinks(activeLink.categoryId, activeId, overId);
        } else if (overLink && overLink.categoryId !== activeLink.categoryId) {
          // Cross-category: drop on a link in another category
          const targetLinks = links
            .filter((l) => l.categoryId === overLink.categoryId)
            .sort((a, b) => a.order - b.order);
          const insertIndex = targetLinks.findIndex((l) => l.id === overId);
          moveLinkToCategory(activeId, overLink.categoryId, insertIndex >= 0 ? insertIndex : 0);
        } else {
          // Dropping on a droppable zone (category container)
          const droppableMatch = overId.match(/^droppable-(.+)$/);
          if (droppableMatch) {
            const targetCategoryId = droppableMatch[1];
            if (targetCategoryId !== activeLink.categoryId) {
              const targetLinks = links.filter(
                (l) => l.categoryId === targetCategoryId
              );
              moveLinkToCategory(activeId, targetCategoryId, targetLinks.length);
            }
          }
        }
      }

      setDndState({ activeType: null, activeCategory: null, activeLink: null, overCategoryId: null });
    },
    [dndState.activeType, links, reorderCategories, reorderLinks, moveLinkToCategory]
  );

  const isDragging = dndState.activeType !== null;

  return {
    sensors,
    dndState,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/useCategoryDnd.ts
git commit -m "feat: add useCategoryDnd hook with sensors and drag handlers

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 22: Create SortableCategoryGrid component

**Files:**
- Create: `src/features/card-ordering/SortableCategoryGrid.tsx`

- [ ] **Step 1: Create SortableCategoryGrid**

Create `src/features/card-ordering/SortableCategoryGrid.tsx`:

```typescript
'use client';

import {
  DndContext,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '@/animations/variants';
import { SortableCategoryCard } from './SortableCategoryCard';
import { SortableLinkList } from './SortableLinkList';
import { DragOverlayContent } from './DragOverlayContent';
import { CategoryCard } from '@/features/link-directory/CategoryCard';
import { useCategoryDnd } from './useCategoryDnd';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface SortableCategoryGridProps {
  results: FilteredResult[];
  allLinks: Link[];
  allCategories: Category[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLinkToCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  searchQuery: string;
}

export function SortableCategoryGrid({
  results,
  allLinks,
  allCategories,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onAddCategory,
  searchQuery,
}: SortableCategoryGridProps) {
  const {
    sensors,
    dndState,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useCategoryDnd(allCategories, allLinks);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={results.map((r) => r.category.id)}
        strategy={rectSortingStrategy}
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {results.map((result) => (
              <SortableCategoryCard key={result.category.id} category={result.category}>
                {({ setNodeRef, style, isDragging: isCatDragging, listeners, attributes }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={
                      dndState.activeType === 'link' && dndState.overCategoryId === result.category.id
                        ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 rounded-xl transition-shadow'
                        : 'transition-shadow'
                    }
                  >
                    <CategoryCard
                      category={result.category}
                      links={result.links}
                      onEditLink={onEditLink}
                      onDeleteLink={onDeleteLink}
                      onEditCategory={onEditCategory}
                      onDeleteCategory={onDeleteCategory}
                      onAddLink={onAddLinkToCategory}
                      isDragging={isDragging || isCatDragging}
                      dragHandleProps={{ listeners, attributes }}
                      renderLinks={(links, accentColor) => (
                        <SortableLinkList
                          links={links}
                          categoryId={result.category.id}
                          accentColor={accentColor}
                          isDragging={isDragging}
                          onEditLink={onEditLink}
                          onDeleteLink={onDeleteLink}
                        />
                      )}
                    />
                  </div>
                )}
              </SortableCategoryCard>
            ))}
          </AnimatePresence>

          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onAddCategory}
              className="min-h-[140px] border-2 border-dashed border-[var(--text-secondary)] rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)] transition-colors cursor-pointer"
            >
              <span className="text-2xl">+</span>
              <span className="text-sm font-bold">New Category</span>
            </motion.button>
          )}
        </motion.div>
      </SortableContext>

      <DragOverlay>
        {dndState.activeType === 'category' && dndState.activeCategory && (
          <DragOverlayContent type="category" category={dndState.activeCategory} />
        )}
        {dndState.activeType === 'link' && dndState.activeLink && (
          <DragOverlayContent type="link" link={dndState.activeLink} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Will fail until CategoryCard is updated (Task 23). Verify the file was created correctly.

- [ ] **Step 3: Commit**

```bash
git add src/features/card-ordering/SortableCategoryGrid.tsx
git commit -m "feat: add SortableCategoryGrid with DnD context and drag overlay

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 23: Modify CategoryCard and LinkItem for drag support

**Files:**
- Modify: `src/features/link-directory/CategoryCard.tsx`
- Modify: `src/features/link-directory/LinkItem.tsx`

### CategoryCard Changes

- [ ] **Step 1: Update CategoryCard interface and implementation**

Modify `src/features/link-directory/CategoryCard.tsx` to the following complete replacement:

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { staggerItem, cardHover } from '@/animations/variants';
import { LinkItem } from './LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Category, Link } from '@/types';

interface CategoryCardProps {
  category: Category;
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLink: (categoryId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: {
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  };
  renderLinks?: (links: Link[], accentColor: string) => React.ReactNode;
}

export function CategoryCard({
  category,
  links,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLink,
  isDragging = false,
  dragHandleProps,
  renderLinks,
}: CategoryCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={isDragging ? undefined : cardHover}
      className="bg-[var(--bg-card)] border-2 rounded-xl overflow-hidden"
      style={{
        borderColor: category.color,
        boxShadow: `4px 4px 0px ${category.color}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: category.color,
          borderBottom: '2px solid var(--border-color)',
        }}
      >
        <div className="flex items-center gap-1">
          {dragHandleProps && (
            <DragHandle
              listeners={dragHandleProps.listeners}
              attributes={dragHandleProps.attributes}
            />
          )}
          <span className="font-extrabold text-[#222] text-sm">
            {category.emoji} {category.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#222] opacity-60">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
          <button
            onClick={() => onEditCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Edit category"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="p-3">
        {links.length === 0 ? (
          <motion.p
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-sm text-[var(--text-secondary)] py-4"
          >
            No links yet — click + to add
          </motion.p>
        ) : renderLinks ? (
          renderLinks(links, category.color)
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  accentColor={category.color}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link)}
                  isDragging={isDragging}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={() => onAddLink(category.id)}
          className="w-full mt-2 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--text-secondary)] hover:border-[var(--border-color)] rounded-lg transition-colors cursor-pointer"
        >
          + Add link
        </button>
      </div>
    </motion.div>
  );
}
```

### LinkItem Changes

- [ ] **Step 2: Update LinkItem to accept isDragging and remove layout prop**

Modify `src/features/link-directory/LinkItem.tsx` to the following complete replacement:

```typescript
'use client';

import { motion } from 'framer-motion';
import type { Link } from '@/types';

interface LinkItemProps {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function LinkItem({ link, accentColor, onEdit, onDelete, isDragging = false }: LinkItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={isDragging ? undefined : { scale: 1.02 }}
      className="group relative flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-colors"
      style={{
        borderColor: `${accentColor}40`,
        backgroundColor: `${accentColor}10`,
      }}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">
          {link.title}
        </span>
        {link.description && (
          <span className="text-xs text-[var(--text-secondary)] truncate block">
            {link.description}
          </span>
        )}
      </a>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Delete"
        >
          🗑️
        </button>
      </div>
      <span className="text-[var(--text-secondary)] text-sm ml-1">→</span>
    </motion.div>
  );
}
```

Key changes:
- **Removed** `layout` prop (conflicted with @dnd-kit transforms — spec Problem 1)
- **Added** `isDragging` prop (defaults to false)
- **Modified** `whileHover` to return `undefined` when `isDragging` (spec Problem 2)

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (or minor issues from unused new files — all resolved when fully integrated)

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 39 passed (39)` — no regressions from prop additions (all new props are optional)

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/CategoryCard.tsx src/features/link-directory/LinkItem.tsx
git commit -m "feat: update CategoryCard and LinkItem for drag-and-drop support

- Add isDragging prop to disable whileHover during drag
- Add dragHandleProps and renderLinks to CategoryCard
- Remove layout prop from LinkItem (conflicts with @dnd-kit)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 24: Modify CategoryGrid to delegate to SortableCategoryGrid

**Files:**
- Modify: `src/features/link-directory/CategoryGrid.tsx`

- [ ] **Step 1: Update CategoryGrid**

Replace the entire `src/features/link-directory/CategoryGrid.tsx` with:

```typescript
'use client';

import { SortableCategoryGrid } from '@/features/card-ordering/SortableCategoryGrid';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface CategoryGridProps {
  results: FilteredResult[];
  allLinks: Link[];
  allCategories: Category[];
  searchQuery: string;
  onClearSearch: () => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLinkToCategory: (categoryId: string) => void;
  onAddCategory: () => void;
}

export function CategoryGrid({
  results,
  allLinks,
  allCategories,
  searchQuery,
  onClearSearch,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onAddCategory,
}: CategoryGridProps) {
  if (results.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-bold text-[var(--text-secondary)]">
          No links match &ldquo;{searchQuery}&rdquo;
        </p>
        <button
          onClick={onClearSearch}
          className="mt-4 text-sm font-bold text-[#78d6ff] hover:underline cursor-pointer"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-bold text-[var(--text-secondary)]">No categories yet</p>
        <button
          onClick={onAddCategory}
          className="mt-4 text-sm font-bold text-[#a8ff78] hover:underline cursor-pointer"
        >
          Create your first category
        </button>
      </div>
    );
  }

  return (
    <SortableCategoryGrid
      results={results}
      allLinks={allLinks}
      allCategories={allCategories}
      onEditLink={onEditLink}
      onDeleteLink={onDeleteLink}
      onEditCategory={onEditCategory}
      onDeleteCategory={onDeleteCategory}
      onAddLinkToCategory={onAddLinkToCategory}
      onAddCategory={onAddCategory}
      searchQuery={searchQuery}
    />
  );
}
```

Key changes:
- **Removed** `staggerContainer` import (now in SortableCategoryGrid)
- **Removed** `AnimatePresence mode="popLayout"` (spec Problem 3)
- **Removed** direct CategoryCard rendering (delegated to SortableCategoryGrid)
- **Added** `allLinks` and `allCategories` props (needed for DnD context)
- **Kept** empty-state rendering (no DnD needed for empty states)

- [ ] **Step 2: Update HomePage to pass new props to CategoryGrid**

In `src/features/home/HomePage.tsx`:

First, add a `categories` selector. Find:
```typescript
const links = useLinkStore((s) => s.links);
```
Add below it:
```typescript
const categories = useLinkStore((s) => s.categories);
```

Then update the CategoryGrid usage. Find the existing `<CategoryGrid` block and replace with:

```tsx
<CategoryGrid
  results={filteredResults}
  allLinks={links}
  allCategories={categories}
  searchQuery={searchQuery}
  onClearSearch={() => setSearchQuery('')}
  onEditLink={setEditingLink}
  onDeleteLink={(link) =>
    setDeletingItem({ type: 'link', id: link.id, name: link.title })
  }
  onEditCategory={setEditingCategory}
  onDeleteCategory={(cat) =>
    setDeletingItem({ type: 'category', id: cat.id, name: cat.name })
  }
  onAddLinkToCategory={handleAddLinkToCategory}
  onAddCategory={() => setIsAddCategoryOpen(true)}
/>
```

Note: `filteredResults` (not `results`), `setEditingLink` (not `handleEditLink`), etc. — these are the actual variable names in HomePage.

- [ ] **Step 3: Verify build succeeds**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 39 passed (39)`

- [ ] **Step 5: Commit**

```bash
git add src/features/link-directory/CategoryGrid.tsx src/features/home/HomePage.tsx
git commit -m "feat: integrate SortableCategoryGrid into CategoryGrid

- CategoryGrid delegates to SortableCategoryGrid for DnD
- AnimatePresence mode=popLayout replaced with @dnd-kit sorting
- Empty-state rendering preserved

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 25: Full build + test verification

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 39 passed (39)`

Breakdown:
- utils.test.ts: 8 tests
- useToastStore.test.ts: 3 tests
- useLinkStore.test.ts: 17 tests (7 original + 3 reorderCats + 3 reorderLinks + 4 moveLinkToCat)
- useFilteredLinks.test.ts: 6 tests
- useMouseParallax.test.ts: 5 tests

- [ ] **Step 2: Run production build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 5: Start dev server and manual verify**

Run: `npm run dev`
Open: `http://localhost:3000`

Verify all features:
- [ ] 3D animated background visible in dark and light themes
- [ ] Mouse parallax on background
- [ ] Category cards have drag handles in header
- [ ] Categories can be reordered by dragging
- [ ] Links have drag handles
- [ ] Links can be reordered within a category
- [ ] Links can be dragged between categories
- [ ] Drag overlay follows cursor
- [ ] Order persists after page refresh
- [ ] No console errors
- [ ] Import/export/settings completely gone

- [ ] **Step 6: Final commit (if any fixes needed)**

If no fixes needed, skip. Otherwise commit fixes individually.
