# S2-Linktree Visual Refresh — Implementation Plan

## Problem Statement

S2-Linktree V2 is feature-complete but has room for visual polish, UX refinement, and performance optimization. The goal is to elevate the app from "functional" to "delightful" across three pillars: visual design, performance, and user experience.

## Approach

Incremental, pillar-by-pillar implementation. Each task is self-contained and testable. Dependencies are noted where tasks must be completed in order. All changes preserve the existing neo-brutalism design language.

---

## Tasks

### Phase 1: Foundation (Performance + Infrastructure)

**1. Progressive 3D Enhancement**
- Add CSS animated gradient fallback in `globals.css` (visible immediately, before JS loads)
- Create a `useDeviceCapability` hook that detects GPU tier (high/mid/low) using `navigator.hardwareConcurrency` and `renderer.info`
- Modify `AnimatedBackground.tsx` to lazy-load via `requestIdleCallback` instead of on mount
- Scale 3D quality: high → 6 blobs 64×64 + Bloom; mid → 4 blobs 32×32 no Bloom; low → CSS only
- Add visibility/idle detection: reduce to 15fps after 5s idle, pause when `document.hidden`
- Modify `BlobScene.tsx` to accept `quality` prop and adapt geometry/effects accordingly

**2. Skeleton Loading**
- Create `SkeletonCard` component in `src/components/ui/` with shimmer animation
- Create `SkeletonGrid` that renders 4-6 skeleton cards in the grid layout
- Show skeleton grid during initial hydration (before Zustand store rehydrates from localStorage)
- Smooth crossfade transition from skeleton to real content using Framer Motion `AnimatePresence`

### Phase 2: Core UX Improvements

**3. Undo Toast System**
- Extend `useToastStore` with `undoAction` callback and `countdown` timer fields on Toast type
- Create new `UndoToast` component with progress bar (CSS animation, 5s linear) and UNDO button
- Modify `useLinkStore`: add `_snapshot` field and `restoreSnapshot()` action
- Before any delete, store current `{ categories, links }` snapshot
- On undo click, call `restoreSnapshot()` and dismiss toast
- Remove `DeleteConfirm` modal usage from `HomePage.tsx` — delete triggers undo toast directly
- Keep `DeleteConfirm` component file (don't delete) in case it's needed later

**4. Keyboard Shortcuts**
- Create `useKeyboardShortcuts` hook in `src/hooks/`
- Register global keydown listeners: Ctrl+K (focus search), Ctrl+N (open add link modal), Ctrl+Z (undo last delete), Esc (clear search / close modal), T (toggle theme when no input focused)
- Guard against firing when user is typing in an input/textarea
- Pass necessary callbacks from `HomePage.tsx` (openAddLink, focusSearch, undo, toggleTheme)

### Phase 3: Visual Design

**5. Enhanced Depth Cards**
- Update `CategoryCard.tsx` styles:
  - Background: `linear-gradient(135deg, card-bg 0%, card-bg-darker 100%)`
  - Shadow: `4px 4px 0px {color}, 0 8px 32px rgba(0,0,0,0.3)` (hard + soft)
  - Header zone: gradient accent background with separated padding
  - Link count: badge-style pill with category color tint
- Update both dark and light theme values in `globals.css` (add `--bg-card-secondary` variable)
- Ensure drag overlay in `DragOverlayContent.tsx` matches new card style

**6. Link Favicons**
- Create `Favicon` component in `src/components/ui/` that renders `<img>` from `https://www.google.com/s2/favicons?domain={domain}&sz=32`
- Add error fallback to 🌐 globe emoji on load failure
- Integrate into `LinkItem.tsx` — show favicon before link title
- Also show in `DragOverlayContent.tsx` link preview

**7. Rich Empty States**
- Update empty state in `CategoryCard.tsx`: add emoji icon, descriptive text, inline "+ Add Link" CTA button
- Update "no search results" in `CategoryGrid.tsx`: add 🔍 emoji, helpful message, "Clear search" button
- Update "no categories" in `CategoryGrid.tsx`: add 📂 emoji, welcoming message, "Create your first category" button
- All empty states use Framer Motion fade-in animation

**8. Smoother Card Animations**
- Update `animations/variants.ts`: refine `popIn` with better spring config for card creation
- Add `popOut` exit variant (scale 0.95, opacity 0, y: 10) for card/link deletion
- Wrap category cards and link items in `AnimatePresence` with `mode="popLayout"` for smooth add/remove
- Tune stagger timing: cap at 8 items (avoid long delays for large collections)

### Phase 4: Search & Forms Polish

**9. Search Result Highlighting**
- Create `HighlightText` utility component that wraps matching substrings in `<mark>` with themed styling
- Update `useFilteredLinks` to return the search query alongside results
- Update `LinkItem.tsx` to use `HighlightText` for title, URL, and description when search is active
- Style `<mark>` with category-colored background (low opacity) and bold weight

**10. Improved Modal Forms**
- Add `autoFocus` to first input in `AddLinkModal`, `EditLinkModal`, `AddCategoryModal`, `EditCategoryModal`
- Add inline validation: show error styling on blur (not just on submit), clear error on valid input
- Improve modal spring animation: use `springBouncy` from animation presets instead of default
- Add subtle backdrop blur to modal overlay

### Phase 5: Integration & Testing

**11. Update Existing Tests**
- Update store tests for new snapshot/restore functionality
- Add tests for `useKeyboardShortcuts` hook
- Add tests for `HighlightText` component
- Verify existing 39 tests still pass after all changes

---

## Notes

- All changes are client-side only — no backend changes needed
- The neo-brutalism design language (bold borders, hard shadows, bright accents) must be preserved
- Dark/light theme support must work for all new components
- Reduced motion preference must be respected for all new animations
- Existing drag-and-drop functionality must remain unaffected
- Google Favicon API is free and requires no API key
