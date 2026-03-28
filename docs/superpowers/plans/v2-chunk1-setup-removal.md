# Chunk 1: Setup + Feature Removal

> **Spec:** `docs/superpowers/specs/2026-03-28-s2-linktree-v2-design.md` — Section 2

## Task 1: Create feature branch and install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/s2-linktree-v2
```

- [ ] **Step 2: Install 3D background dependencies**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
```

- [ ] **Step 3: Install DnD dependencies**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 4: Install Three.js type definitions**

```bash
npm install -D @types/three
```

- [ ] **Step 5: Verify baseline tests still pass**

Run: `npx vitest run`
Expected: `Tests 27 passed (27)`

- [ ] **Step 6: Verify build succeeds**

Run: `npx next build`
Expected: `✓ Compiled successfully`, exit code 0

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install R3F, @dnd-kit, and Three.js dependencies

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Remove export/import from store — tests first

**Files:**
- Modify: `src/store/useLinkStore.test.ts`
- Modify: `src/store/useLinkStore.ts`

- [ ] **Step 1: Remove export/import test cases**

In `src/store/useLinkStore.test.ts`, delete the entire `describe('exportData', ...)` block and the entire `describe('importData', ...)` block. These are the last two describe blocks in the file.

The file should end after the `describe('deleteLink', ...)` block's closing `});`.

After removal, the test file should have these describe blocks only:
- `addCategory`
- `updateCategory`
- `deleteCategory`
- `addLink`
- `updateLink`
- `deleteLink`

- [ ] **Step 2: Run tests to verify the remaining tests still pass**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: `Tests 7 passed (7)` (was 10, removed 3 export/import tests)

- [ ] **Step 3: Remove exportData and importData from store interface**

In `src/store/useLinkStore.ts`, remove these lines from the `LinkStore` interface:

```typescript
// DELETE these lines:
exportData: () => { categories: Category[]; links: Link[] };
importData: (
  data: { categories: Category[]; links: Link[] },
  mode: 'replace' | 'merge'
) => { addedCategories: number; addedLinks: number; skipped: number };
```

- [ ] **Step 4: Remove exportData and importData implementations from store**

In `src/store/useLinkStore.ts`, remove these implementation blocks from the `persist` callback:

```typescript
// DELETE the exportData implementation:
exportData: () => {
  const { categories, links } = get();
  return { categories, links };
},

// DELETE the importData implementation:
importData: (data, mode) => {
  if (mode === 'replace') {
    set({ categories: data.categories, links: data.links });
    return { addedCategories: data.categories.length, addedLinks: data.links.length, skipped: 0 };
  }
  const state = get();
  const existingCatIds = new Set(state.categories.map((c) => c.id));
  const existingLinkIds = new Set(state.links.map((l) => l.id));
  const newCats = data.categories.filter((c) => !existingCatIds.has(c.id));
  const newLinks = data.links.filter((l) => !existingLinkIds.has(l.id));
  const skipped = data.categories.length - newCats.length + data.links.length - newLinks.length;
  set({ categories: [...state.categories, ...newCats], links: [...state.links, ...newLinks] });
  return { addedCategories: newCats.length, addedLinks: newLinks.length, skipped };
},
```

- [ ] **Step 5: Run tests to verify store still works**

Run: `npx vitest run src/store/useLinkStore.test.ts`
Expected: `Tests 7 passed (7)`

- [ ] **Step 6: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 24 passed (24)` (27 minus 3 removed)

- [ ] **Step 7: Commit**

```bash
git add src/store/useLinkStore.ts src/store/useLinkStore.test.ts
git commit -m "refactor: remove exportData and importData from link store

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Remove settings menu and import/export UI from HomePage

**Files:**
- Modify: `src/features/home/HomePage.tsx`

- [ ] **Step 1: Remove import of Category and Link types used only for isValidImport**

The `Category` and `Link` types are also used for modal state, so the import stays. No change needed for the type import.

- [ ] **Step 2: Remove the `isValidImport` function**

Delete the entire function at the top of `HomePage.tsx` (before the `HomePage` component):

```typescript
// DELETE this entire function:
function isValidImport(data: unknown): data is { categories: Category[]; links: Link[] } {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.categories) || !Array.isArray(d.links)) return false;
  return d.categories.every((c: unknown) => c && typeof c === 'object' && 'id' in c && 'name' in c)
      && d.links.every((l: unknown) => l && typeof l === 'object' && 'id' in l && 'url' in l && 'categoryId' in l);
}
```

- [ ] **Step 3: Remove settings-related state and ref**

Inside the `HomePage` component, delete:

```typescript
// DELETE these lines:
const [settingsOpen, setSettingsOpen] = useState(false);
const settingsRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 4: Remove the click-outside useEffect for settings menu**

Delete:

```typescript
// DELETE this entire useEffect:
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
      setSettingsOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

- [ ] **Step 5: Remove Zustand selector references for exportData and importData**

Delete:

```typescript
// DELETE these lines:
const exportData = useLinkStore((s) => s.exportData);
const importData = useLinkStore((s) => s.importData);
```

- [ ] **Step 6: Remove handleExport and handleImport functions**

Delete:

```typescript
// DELETE the entire handleExport function
const handleExport = () => { ... };

// DELETE the entire handleImport function
const handleImport = (mode: 'replace' | 'merge') => { ... };
```

- [ ] **Step 7: Remove the settings menu UI from the header JSX**

In the header's flex container (after `<ThemeToggle />`), delete the entire settings `<div>` wrapper including the gear button and dropdown:

```tsx
{/* DELETE this entire block: */}
<div className="relative" ref={settingsRef}>
  <button
    onClick={() => setSettingsOpen(!settingsOpen)}
    className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[2px_2px_0px_var(--border-color)] cursor-pointer"
  >
    ⚙️
  </button>
  {settingsOpen && (
    <div className="absolute right-0 top-full mt-2 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-lg shadow-[3px_3px_0px_var(--border-color)] p-2 min-w-[160px] z-50">
    <button
      onClick={() => { handleExport(); setSettingsOpen(false); }}
      className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
    >
      📤 Export Data
    </button>
    <button
      onClick={() => { handleImport('merge'); setSettingsOpen(false); }}
      className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
    >
      📥 Import (Merge)
    </button>
    <button
      onClick={() => { handleImport('replace'); setSettingsOpen(false); }}
      className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
    >
      🔄 Import (Replace)
    </button>
  </div>
  )}
</div>
```

- [ ] **Step 8: Clean up unused imports**

After removing the above code, check which imports are no longer needed:

- `useRef` — check if still used elsewhere (it's not after removing `settingsRef`). Remove from the import.
- `useEffect` — check if still used elsewhere (the `preselectedCategoryId` sync effect in AddLinkModal is in a different file, so check only HomePage). After removing the click-outside effect, no `useEffect` remains in HomePage. Remove from the import.

Update the import line:

```typescript
// BEFORE:
import { useState, useRef, useEffect } from 'react';
// AFTER:
import { useState } from 'react';
```

- [ ] **Step 9: Verify TypeScript compiles**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 10: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 24 passed (24)`

- [ ] **Step 11: Commit**

```bash
git add src/features/home/HomePage.tsx
git commit -m "refactor: remove settings menu, export/import UI from HomePage

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Add CSS layer classes for background

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add background and content layer classes**

Append to the end of `src/app/globals.css`:

```css
/* Z-index layering for 3D background */
.bg-canvas-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  will-change: transform;
}

.content-layer {
  position: relative;
  z-index: 1;
}

/* Reduced motion: hide WebGL, show CSS fallback */
@media (prefers-reduced-motion: reduce) {
  .bg-canvas-layer canvas {
    display: none;
  }
  .bg-canvas-layer .reduced-motion-fallback {
    display: block;
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add CSS layer classes for 3D background and content z-index

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: Wrap HomePage content in content-layer

**Files:**
- Modify: `src/features/home/HomePage.tsx`

- [ ] **Step 1: Add `content-layer` class to the outermost div**

In `HomePage.tsx`, change the root div:

```tsx
// BEFORE:
<div className="min-h-screen bg-[var(--bg-primary)]">

// AFTER:
<div className="content-layer min-h-screen bg-[var(--bg-primary)]">
```

This ensures all content sits above the future background canvas (z-index: 1).

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Verify tests**

Run: `npx vitest run`
Expected: `Tests 24 passed (24)`

- [ ] **Step 4: Commit**

```bash
git add src/features/home/HomePage.tsx
git commit -m "feat: wrap HomePage in content-layer for background z-index

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
