# Cross-Device Sync & Cache Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two issues that prevent changes from appearing on other devices: (A) add an "Export to Code" button that copies current store data as `constants.ts` TypeScript, and (B) add `Cache-Control: no-cache` headers to `next.config.ts` so browsers always fetch fresh HTML after a Vercel deploy.

**Architecture:** Fix A is a pure utility function (`generateConstantsSource`) that serialises Zustand store state into TypeScript source, wired to a button in the header that copies to the clipboard and shows a toast. Fix B is a single `headers()` function in `next.config.ts` returning no-cache rules for all HTML routes.

**Tech Stack:** Next.js 16, Zustand, TypeScript, Vitest, Framer Motion

**Worktree:** `.worktrees/cross-device-sync-cache-fix`
**Branch:** `cross-device-sync-cache-fix`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/lib/exportToCode.ts` | Pure function: Category[] + Link[] → TypeScript string |
| Create | `src/lib/exportToCode.test.ts` | Unit tests for generateConstantsSource |
| Modify | `src/features/home/HomePage.tsx` | Add Export button + clipboard handler |
| Modify | `next.config.ts` | Add headers() with Cache-Control rules |

---

## Task 1: Cache-Control headers in `next.config.ts` (Fix B)

**Files:**
- Modify: `next.config.ts`

> No unit test possible for a config file. Verification is via `npm run build` (no TypeScript errors).

- [ ] **Step 1: Replace `next.config.ts` with the headers() implementation**

Open `next.config.ts` (currently has empty config object) and replace its entire content with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // All HTML routes — never cache, always fetch fresh from Vercel
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // Static SVG assets — short cache is fine
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        // Favicon — short cache is fine
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify build compiles without errors**

Run from the worktree root:
```bash
npm run build 2>&1
```

Expected: build succeeds, no TypeScript errors. Output ends with something like:
```
✓ Compiled successfully
Route (app)  ...
```

If build fails due to TypeScript errors in `next.config.ts`, check that the `NextConfig` type accepts `headers`. It does in Next.js 16.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add Cache-Control no-cache headers for all HTML routes"
```

---

## Task 2: `generateConstantsSource` utility with tests (Fix A, part 1)

**Files:**
- Create: `src/lib/exportToCode.ts`
- Create: `src/lib/exportToCode.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `src/lib/exportToCode.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { generateConstantsSource } from './exportToCode';
import type { Category, Link } from '@/types';

describe('generateConstantsSource', () => {
  it('includes DEFAULT_CATEGORIES and DEFAULT_LINKS exports', () => {
    const output = generateConstantsSource([], []);
    expect(output).toContain('DEFAULT_CATEGORIES');
    expect(output).toContain('DEFAULT_LINKS');
  });

  it('renders empty arrays as []', () => {
    const output = generateConstantsSource([], []);
    expect(output).toContain('DEFAULT_CATEGORIES: Category[] = []');
    expect(output).toContain('DEFAULT_LINKS: Link[] = []');
  });

  it('includes category fields', () => {
    const categories: Category[] = [
      { id: 'cat-1', name: 'Test', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource(categories, []);
    expect(output).toContain('"cat-1"');
    expect(output).toContain('"Test"');
    expect(output).toContain('"📝"');
    expect(output).toContain('"#a8ff78"');
  });

  it('includes link fields', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'Example', url: 'https://example.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).toContain('"link-1"');
    expect(output).toContain('"cat-1"');
    expect(output).toContain('"Example"');
    expect(output).toContain('"https://example.com"');
  });

  it('sorts categories by order ascending', () => {
    const categories: Category[] = [
      { id: 'cat-b', name: 'B', emoji: '📖', color: '#78d6ff', order: 1, createdAt: 1 },
      { id: 'cat-a', name: 'A', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource(categories, []);
    expect(output.indexOf('"cat-a"')).toBeLessThan(output.indexOf('"cat-b"'));
  });

  it('sorts links by order ascending', () => {
    const links: Link[] = [
      { id: 'link-b', categoryId: 'cat-1', title: 'B', url: 'https://b.com', order: 1, createdAt: 1 },
      { id: 'link-a', categoryId: 'cat-1', title: 'A', url: 'https://a.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output.indexOf('"link-a"')).toBeLessThan(output.indexOf('"link-b"'));
  });

  it('includes optional description when present', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'X', url: 'https://x.com', description: 'My desc', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).toContain('"My desc"');
    expect(output).toContain('description:');
  });

  it('omits description field when not present', () => {
    const links: Link[] = [
      { id: 'link-1', categoryId: 'cat-1', title: 'X', url: 'https://x.com', order: 0, createdAt: 1 },
    ];
    const output = generateConstantsSource([], links);
    expect(output).not.toContain('description:');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail (file doesn't exist yet)**

```bash
npx vitest run src/lib/exportToCode.test.ts 2>&1
```

Expected: FAIL — `Cannot find module './exportToCode'`

- [ ] **Step 3: Create the implementation**

Create `src/lib/exportToCode.ts`:

```typescript
import type { Category, Link } from '@/types';

function formatCategory(cat: Category): string {
  return `  { id: ${JSON.stringify(cat.id)}, name: ${JSON.stringify(cat.name)}, emoji: ${JSON.stringify(cat.emoji)}, color: ${JSON.stringify(cat.color)}, order: ${cat.order}, createdAt: 1 }`;
}

function formatLink(link: Link): string {
  const descPart = link.description != null
    ? `, description: ${JSON.stringify(link.description)}`
    : '';
  return `  { id: ${JSON.stringify(link.id)}, categoryId: ${JSON.stringify(link.categoryId)}, title: ${JSON.stringify(link.title)}, url: ${JSON.stringify(link.url)}${descPart}, order: ${link.order}, createdAt: 1 }`;
}

export function generateConstantsSource(categories: Category[], links: Link[]): string {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  const catsBlock = sortedCategories.length > 0
    ? `[\n${sortedCategories.map(formatCategory).join(',\n')},\n]`
    : '[]';

  const linksBlock = sortedLinks.length > 0
    ? `[\n${sortedLinks.map(formatLink).join(',\n')},\n]`
    : '[]';

  return [
    '// Paste this into src/lib/constants.ts — replace DEFAULT_CATEGORIES and DEFAULT_LINKS',
    '',
    `export const DEFAULT_CATEGORIES: Category[] = ${catsBlock};`,
    '',
    `export const DEFAULT_LINKS: Link[] = ${linksBlock};`,
  ].join('\n');
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/lib/exportToCode.test.ts 2>&1
```

Expected: All 8 tests PASS, 0 failures.

- [ ] **Step 5: Run full test suite to confirm no regressions**

```bash
npm test 2>&1
```

Expected: All 79 tests pass (71 existing + 8 new).

- [ ] **Step 6: Commit**

```bash
git add src/lib/exportToCode.ts src/lib/exportToCode.test.ts
git commit -m "feat: add generateConstantsSource utility for Export to Code"
```

---

## Task 3: Export button in `HomePage.tsx` (Fix A, part 2)

**Files:**
- Modify: `src/features/home/HomePage.tsx`

> The button lives in the header `<div className="flex items-center gap-3 flex-wrap">` alongside `<ThemeToggle />` and `+ Add Link`. It calls `generateConstantsSource`, writes to clipboard, then fires a toast.

- [ ] **Step 1: Add the export handler and button to `HomePage.tsx`**

In `src/features/home/HomePage.tsx`, make the following changes:

1. Add the import at the top (alongside existing imports):

```typescript
import { generateConstantsSource } from '@/lib/exportToCode';
```

2. Add the handler inside the `HomePage` function body, after the existing `handleAddLinkToCategory` handler:

```typescript
  const handleExportToCode = useCallback(async () => {
    const source = generateConstantsSource(categories, links);
    await navigator.clipboard.writeText(source);
    addToast('Copied to clipboard — paste into src/lib/constants.ts', 'success');
  }, [categories, links, addToast]);
```

3. Add the button in the header `<div className="flex items-center gap-3 flex-wrap">`, between `<ThemeToggle />` and the `+ Add Link` button:

```tsx
            <Button variant="secondary" size="sm" onClick={handleExportToCode}>
              Export to Code
            </Button>
```

The full updated header section (lines 92–98 of the original) should look like:

```tsx
          <div className="flex items-center gap-3 flex-wrap">
            <SearchBar ref={searchBarRef} value={searchQuery} onChange={setSearchQuery} />
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={handleExportToCode}>
              Export to Code
            </Button>
            <Button onClick={() => setIsAddLinkOpen(true)} size="sm">
              + Add Link
            </Button>
          </div>
```

- [ ] **Step 2: Run full test suite to confirm no regressions**

```bash
npm test 2>&1
```

Expected: All 79 tests still pass (no component tests for HomePage exist — clipboard is browser-only and not tested in jsdom).

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No errors output (exit code 0).

- [ ] **Step 4: Commit**

```bash
git add src/features/home/HomePage.tsx
git commit -m "feat: add Export to Code button in header to sync localStorage data"
```

---

## Task 4: Final verification

- [ ] **Step 1: Run full test suite one last time**

```bash
npm test 2>&1
```

Expected: All 79 tests pass.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output (no errors).

- [ ] **Step 3: Run build**

```bash
npm run build 2>&1
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Confirm all commits are present**

```bash
git log --oneline -5 2>&1
```

Expected output (newest first):
```
<hash> feat: add Export to Code button in header to sync localStorage data
<hash> feat: add generateConstantsSource utility for Export to Code
<hash> feat: add Cache-Control no-cache headers for all HTML routes
<hash> docs: add cross-device sync and cache fix design spec
```
