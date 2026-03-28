# S2-Linktree V2 Design Specification

**Date:** 2026-03-28
**Status:** Draft
**Scope:** Remove import/export, add 3D animated background, add drag-and-drop card reordering

---

## 1. Overview

Three changes to the deployed S2-Linktree application:

1. **Remove import/export features** — Clean removal of Export Data, Import Data (Merge), Import Data (Replace), and the entire settings menu.
2. **Add 3D animated background** — WebGL floating color blobs using React Three Fiber with mouse parallax, theme-adaptive, performance-safe.
3. **Add drag-and-drop reordering** — Category cards, links within categories, and cross-category link dragging using @dnd-kit.

### Constraints

- Preserve all existing core functionality (CRUD, search, theme toggle, toast notifications)
- Maintain clean component boundaries and feature-based folder structure
- Both dark and light themes must work correctly
- Desktop and mobile must be fully supported
- No unnecessary rewrites — surgical changes to existing files

---

## 2. Feature Removal: Import/Export + Settings Menu

### What Gets Removed

**HomePage.tsx:**
- `handleExport` function
- `handleImport` function
- `isValidImport` validation function
- `settingsOpen` state and `settingsRef` ref
- The `useEffect` for click-outside-close on settings dropdown
- The entire settings `<button>` (⚙️) and its dropdown menu DOM
- Zustand selector references: `exportData`, `importData`

**useLinkStore.ts:**
- `exportData` action (interface + implementation)
- `importData` action (interface + implementation)
- Related type signature in `LinkStore` interface

**useLinkStore.test.ts:**
- All test cases covering `exportData` and `importData`

### What Stays

- ThemeToggle component (already rendered independently in the header)
- All CRUD operations (add/edit/delete categories and links)
- Search functionality
- Toast notifications
- localStorage persistence

---

## 3. 3D Animated Background

### Technology

- **React Three Fiber** (`@react-three/fiber`) — Declarative React wrapper for Three.js
- **Three.js** (`three`) — 3D engine
- **@react-three/drei** — Utility components (camera controls, materials)
- **@react-three/postprocessing** — Bloom effect for dreamy glow

### Architecture

```
features/background-effects/
├── AnimatedBackground.tsx   — Lazy-loaded wrapper: Canvas + Suspense + SSR guard
├── BlobScene.tsx            — Scene composition: blobs + lights + bloom + parallax
├── FloatingBlob.tsx         — Single 3D sphere with autonomous floating motion
└── useMouseParallax.ts      — Hook: tracks mouse position, returns normalized coords
```

**Integration point:** `AnimatedBackground` is rendered in `HomePage.tsx` as a fixed full-screen layer behind all content. `HomePage.tsx` is already a `'use client'` component, making it the correct host for the `next/dynamic` SSR-false import. It must NOT be placed in `layout.tsx` (which is a Server Component).

### 3D Scene Design

**Spheres (5–7 blobs):**
- Radius range: 0.8 – 2.5 units
- Material: `MeshStandardMaterial` with:
  - `transparent: true`
  - `roughness: 0.9` (matte, not glossy)
  - `opacity`: 0.25 (dark theme), 0.15 (light theme)
- Colors from Neo-Brutalism palette:
  - `#a8ff78` (green), `#78d6ff` (blue), `#ff78a8` (pink)
  - `#ffd078` (orange), `#d078ff` (purple), `#78ffd0` (teal)
- Each sphere has a unique floating path:
  - Position: `x = baseX + sin(time * speedX + phaseX) * amplitudeX`
  - Same pattern for Y and Z axes
  - Speed range: 0.1 – 0.4 (slow, dreamy)
  - Amplitude range: 0.5 – 2.0 units

**Lighting:**
- Ambient light: intensity 0.4 (provides base illumination)
- Point light: positioned above-center, intensity 1.0

**Post-processing:**
- Bloom effect via `@react-three/postprocessing`
  - `luminanceThreshold: 0.2` (catches the colored spheres)
  - `luminanceSmoothing: 0.9` (soft falloff)
  - `intensity`: 1.5 (dark theme), 0.8 (light theme)
  - Creates the dreamy lava-lamp glow effect

**Camera:**
- Orthographic or perspective with `fov: 50`, positioned at `z = 10`
- No orbit controls — camera is fixed, only parallax shifts it

### Theme Adaptation

The scene reads the current theme from the `data-theme` attribute on `<html>`:

| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| Canvas background | `transparent` (shows CSS `--bg-primary`) | `transparent` |
| Sphere opacity | 0.25 | 0.15 |
| Bloom intensity | 1.5 | 0.8 |
| Ambient light | 0.4 | 0.6 |

A `MutationObserver` on `document.documentElement` watches for `data-theme` changes and triggers re-render with updated values.

### Mouse Parallax

**`useMouseParallax` hook:**
- Listens to `mousemove` on `window`
- Returns `{ x, y }` normalized to `[-1, 1]`
- Applied as camera offset: `camera.position.x = baseX + mouse.x * 0.3`
- Smoothed with linear interpolation (`lerp`) in `useFrame` for fluid motion
- **Mobile fallback:** No tilt-based parallax on mobile (DeviceOrientationEvent requires explicit permission on iOS 13+ and is unreliable). Mobile uses autonomous float only — no parallax.

### Performance Safeguards

- **Lazy loading:** `next/dynamic(() => import('./AnimatedBackground'), { ssr: false })` — zero impact on initial bundle and SSR
- **Pixel ratio cap:** `dpr={[1, 1.5]}` prevents high-DPI devices from rendering at native resolution
- **Reduced motion:** Respects `prefers-reduced-motion: reduce` — renders static blurred circles via CSS fallback instead of WebGL canvas
- **Suspense fallback:** Gradient placeholder matching theme while Three.js loads
- **Will-change optimization:** Canvas container has `will-change: transform` for compositor layer promotion

---

## 4. Drag-and-Drop Reordering

### Technology

- **@dnd-kit/core** — Core drag-and-drop primitives
- **@dnd-kit/sortable** — Sortable list/grid presets
- **@dnd-kit/utilities** — CSS utility transforms

### Architecture

```
features/card-ordering/
├── SortableCategoryGrid.tsx — DndContext + SortableContext wrapping the category grid
├── SortableCategoryCard.tsx — useSortable wrapper around CategoryCard
├── SortableLinkList.tsx     — Nested SortableContext for links within a card
├── SortableLinkItem.tsx     — useSortable wrapper around LinkItem
├── DragOverlayContent.tsx   — Visual clone shown while dragging (follows cursor)
└── useCategoryDnd.ts        — Hook: sensor config, drag start/over/end handlers

components/ui/
└── DragHandle.tsx           — Reusable grip icon (⠿) with grab cursor
```

### Interaction Model

#### Level 1: Category Grid Reorder

- **Trigger:** Click/press-hold the drag handle (`⠿`) in the category card header
- **Visual:** Card lifts (scale 1.05, deeper shadow `6px 6px 0px`, ±2° rotation), other cards shift smoothly to fill gaps
- **Drop:** Card settles into new position with spring animation
- **Persistence:** `reorderCategories(activeId, overId)` updates `order` fields in store → auto-persisted to localStorage

#### Level 2: Link Reorder Within Category

- **Trigger:** Click/press-hold the drag handle on a link row
- **Visual:** Link row lifts with scale 1.03, slight shadow
- **Drop:** Reorders within the same category
- **Persistence:** `reorderLinks(categoryId, activeId, overId)` updates link `order` fields

#### Level 3: Drag Links Between Categories

- **Trigger:** Same as Level 2 — dragging a link out of its card boundary
- **Detection:** `onDragOver` checks if the link is hovering over a different category container
- **Visual feedback:** Target category card shows a glowing border highlight (using its accent color) when a link is dragged over it
- **Drop:** `moveLinkToCategory(linkId, targetCategoryId, insertIndex)` moves the link, recalculates order in both source and target categories
- **Overlay:** `DragOverlay` renders a ghost of the link item following the cursor, ensuring smooth visual during cross-container moves

### Sensors

```typescript
const sensors = useSensors(
  useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
  useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);
```

- **Mouse:** 8px movement threshold to distinguish click from drag
- **Touch:** 250ms press-hold delay to avoid conflicting with scroll
- **Keyboard:** Arrow keys for accessible reordering

### Framer Motion + @dnd-kit Reconciliation

The existing codebase uses Framer Motion features that will conflict with @dnd-kit's transform-based positioning. These must be explicitly handled:

**Problem 1: `layout` prop on `LinkItem`**
- Framer Motion's `layout` animates position changes with its own transform, conflicting with @dnd-kit's `transform: translate3d(...)`.
- **Fix:** Remove the `layout` prop from `LinkItem`. @dnd-kit's `SortableContext` with `transition` config handles smooth reorder animations natively.

**Problem 2: `whileHover` on `CategoryCard` and `LinkItem`**
- During drag, hovering over items triggers hover animations, causing visual jitter.
- **Fix:** Pass an `isDragging` boolean (from `useCategoryDnd` hook via context or props) to `CategoryCard` and `LinkItem`. When `isDragging` is true, disable `whileHover` by setting it to `undefined`.

**Problem 3: `AnimatePresence mode="popLayout"` in `CategoryGrid`**
- Zustand state changes from reordering trigger AnimatePresence to interpret items as exiting/entering, causing stagger animations on every drop.
- **Fix:** Replace `AnimatePresence mode="popLayout"` with a simpler render approach. Use `layoutId` on sortable items for smooth transitions, and rely on @dnd-kit's built-in `transition` for reorder animations. AnimatePresence stays only for actual add/remove operations (not reorder).

**Implementation pattern:**
```typescript
// In SortableCategoryCard / SortableLinkItem wrapper:
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
const style = { transform: CSS.Transform.toString(transform), transition };

// Pass isDragging to inner component to disable conflicting Framer Motion props
<CategoryCard {...props} isDragging={isDragging} dragHandleProps={{ ...attributes, ...listeners }} ref={setNodeRef} style={style} />
```

### Store Additions

```typescript
// New actions added to useLinkStore
reorderCategories: (activeId: string, overId: string) => void;
reorderLinks: (categoryId: string, activeId: string, overId: string) => void;
moveLinkToCategory: (linkId: string, targetCategoryId: string, insertIndex: number) => void;
```

**`reorderCategories` logic:**
1. Get sorted categories array
2. Find indices of `activeId` and `overId`
3. Apply `arrayMove` to swap positions
4. Reassign sequential `order` values (0, 1, 2, ...) to the reordered array

**`reorderLinks` logic:**
1. Filter links by `categoryId`, sorted by `order`
2. Apply `arrayMove` on the filtered set
3. Reassign sequential `order` values to the reordered links

**`moveLinkToCategory` logic:**
1. Update the moved link's `categoryId` to `targetCategoryId`
2. Remove the link from the source category's ordered list and reassign sequential `order` values to close the gap
3. Insert the link at `insertIndex` in the target category's ordered list and reassign sequential `order` values to make room

### Drag Animations

Added to `src/animations/variants.ts` and/or `src/animations/drag-presets.ts`:

```typescript
export const dragLift = {
  scale: 1.05,
  rotate: 2,
  boxShadow: '6px 6px 0px var(--border-color)',
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

export const dragSettle = {
  scale: 1,
  rotate: 0,
  boxShadow: '4px 4px 0px var(--border-color)',
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};

export const linkDragLift = {
  scale: 1.03,
  boxShadow: '3px 3px 0px var(--border-color)',
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};
```

---

## 5. CSS & Layout Changes

### globals.css Additions

```css
/* Z-index layering for background */
.bg-canvas-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.content-layer {
  position: relative;
  z-index: 1;
}
```

### Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .bg-canvas-layer canvas {
    display: none;
  }
  .bg-canvas-layer .reduced-motion-fallback {
    display: block;
  }
}
```

---

## 6. New Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `three` | 3D rendering engine | ~150KB gzipped |
| `@react-three/fiber` | React renderer for Three.js | ~35KB gzipped |
| `@react-three/drei` | R3F utility components | Tree-shakeable, ~10KB used |
| `@react-three/postprocessing` | Bloom post-processing | ~15KB gzipped |
| `@dnd-kit/core` | Core DnD primitives | ~15KB gzipped |
| `@dnd-kit/sortable` | Sortable presets | ~5KB gzipped |
| `@dnd-kit/utilities` | CSS transform utilities | ~2KB gzipped |

All lazy-loaded where applicable to minimize initial bundle impact.

---

## 7. File Change Summary

### New Files
| File | Purpose |
|------|---------|
| `src/features/background-effects/AnimatedBackground.tsx` | Lazy-loaded R3F Canvas wrapper |
| `src/features/background-effects/BlobScene.tsx` | 3D scene with blobs, lights, bloom |
| `src/features/background-effects/FloatingBlob.tsx` | Single floating sphere component |
| `src/features/background-effects/useMouseParallax.ts` | Mouse position tracking hook |
| `src/features/card-ordering/SortableCategoryGrid.tsx` | DnD context for category grid |
| `src/features/card-ordering/SortableCategoryCard.tsx` | Sortable category card wrapper |
| `src/features/card-ordering/SortableLinkList.tsx` | DnD context for links in a card |
| `src/features/card-ordering/SortableLinkItem.tsx` | Sortable link item wrapper |
| `src/features/card-ordering/DragOverlayContent.tsx` | Drag overlay visual |
| `src/features/card-ordering/useCategoryDnd.ts` | DnD sensor + handler hook |
| `src/components/ui/DragHandle.tsx` | Reusable drag handle grip icon |
| `src/animations/drag-presets.ts` | Drag-specific animation configs |

### Modified Files
| File | Changes |
|------|---------|
| `src/features/home/HomePage.tsx` | Remove import/export/settings, integrate background + DnD |
| `src/store/useLinkStore.ts` | Remove export/import, add reorderCategories + reorderLinks + moveLinkToCategory |
| `src/store/useLinkStore.test.ts` | Remove export/import tests, add reorder + move tests |
| `src/features/link-directory/CategoryCard.tsx` | Add drag handle, accept sortable props |
| `src/features/link-directory/CategoryGrid.tsx` | Delegate rendering to SortableCategoryGrid |
| `src/features/link-directory/LinkItem.tsx` | Add drag handle, accept sortable props |
| `src/animations/variants.ts` | Add drag animation presets |
| `src/app/globals.css` | Add z-index layers, reduced-motion fallback |
| `package.json` | Add new dependencies |

### Deleted Code (No File Deletions)
All removals are within existing files — no entire files are deleted.

---

## 8. Testing Strategy

### Unit Tests (Vitest)
- **Reorder store actions:** Test `reorderCategories` and `reorderLinks` with various orderings
- **useMouseParallax hook:** Test normalized coordinate calculation
- **Existing tests:** Verify no regressions after import/export removal

### Manual Testing Checklist
- [ ] Import/export buttons gone, no console errors
- [ ] 3D background renders in dark theme
- [ ] 3D background renders in light theme
- [ ] Background adapts on theme toggle
- [ ] Mouse parallax shifts camera subtly
- [ ] Category cards can be reordered via drag
- [ ] Links can be reordered within a category
- [ ] Links can be dragged between categories
- [ ] Reorder persists after page refresh
- [ ] Touch drag works on mobile viewport
- [ ] `prefers-reduced-motion` shows CSS fallback
- [ ] Production build succeeds
- [ ] No TypeScript errors

---

## 9. Non-Goals (Out of Scope)

- Undo/redo for drag operations
- Animation toggle in settings
- Category folding/collapsing
- Link favicons
- Keyboard shortcuts for reordering beyond @dnd-kit's built-in support
