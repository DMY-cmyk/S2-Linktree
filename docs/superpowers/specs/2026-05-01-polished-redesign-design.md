# S2 Resource Hub — "Polished" Redesign

**Status:** Phase 1 complete (design approved chunk-by-chunk) — ready for Phase 2 (worktree + writing-plans)
**Date:** 2026-05-01 (revised same day after Phase 1 critical audit)
**Source:** `S2 Resource Hub - Standalone.html` (extracted to `design-extracted/` and `design-template.html`)

## Goal

Replace the current Neo-Brutalist + WebGL aesthetic with a refined editorial style that matches the reference standalone HTML. Preserve all existing functional behavior (drag-and-drop, modals, search, undo, persistence). Drop WebGL/Three.js entirely in favor of CSS-only animated background.

## Non-goals

- Re-introducing localStorage persistence. The store is intentionally in-memory only (seeded from `DEFAULT_CATEGORIES` / `DEFAULT_LINKS` per commit `df9641b`); this redesign keeps that model. User mutations live for the session and reset on reload.
- Runtime tweak panel — all preferences (density, header style, favicons toggle, grid toggle, animated-orbs toggle) are baked at sensible defaults; no in-app settings UI.
- Geist / Geist Mono fonts — keep current system font stack. The polished mock used Geist; we deliberately do not adopt it.
- Three-state theme — drop "system"; ship light/dark only.

## Approved decisions (from brainstorming)

| Topic | Decision |
|-------|----------|
| Scope | Full redesign (replace Neo-Brutalism + WebGL end-to-end) |
| Fonts | Keep current system font stack |
| Background | CSS-only orbs; remove R3F / drei / three / postprocessing / @types/three from `package.json` |
| Category tags | Required field on `Category`; seed assigns explicit tag per category (no migration — store is in-memory); tag drives section grouping |
| Tweak panel | Skip; bake defaults |
| Theme | Two-state (light / dark) |
| Favicons | Letter-monogram tiles (not real Google favicons) |
| Empty categories | Show with in-card empty state |
| Drag and tags | Drag never changes a category's tag (tag changed only via Edit modal) |
| Hero "Last updated" | Track `lastUpdatedAt` on store; render relative time |
| `E` / `D` shortcuts | Implement (E = edit focused card/link, D = delete focused card/link) |
| Approach | A — in-place refactor of existing files |

## Phase 1 audit refinements (2026-05-01)

| # | Topic | Resolution |
|---|------|----|
| 1 | DnD strategy under tag groups | Flat `SortableContext` over global `order`; sectioned visual rendering; `rectSortingStrategy` |
| 2 | Header `Filter` button | Tag-pill filter popover with `?tag=…` URL query persistence (single source of truth) |
| 3 | Header `Add link` (no preset) | `AddLinkModal` grows a Category `<select>` when launched without a preset |
| 4 | `E` / `D` shortcut focus model | Tab-focusable cards/links (`tabindex="0"`); suppressed in input/textarea/select/contenteditable; suppressed when any `<dialog>` is open |
| 5 | Search match `tag` | Yes — `useFilteredLinks` adds `tag` to predicate (`title \| url \| desc \| categoryName \| tag`) |
| 6 | Header version label | `"v5.0 · polished"`; footer becomes `"S2-LINKTREE · POLISHED · v5.0"` |
| 7 | Legacy `theme="system"` | One-shot re-derive via `matchMedia('(prefers-color-scheme: dark)')`; result written back to localStorage |
| 8 | framer-motion | Drop entirely; replace `drag-presets` + `variants` with CSS keyframes / transitions |
| 9 | `SEED_LAST_UPDATED` | `Number(process.env.NEXT_PUBLIC_BUILD_TIME) \|\| Date.now()`; `next.config.ts` injects `NEXT_PUBLIC_BUILD_TIME` from `process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE` |
| 10 | Hero copy | English headline + Indonesian chip + Indonesian subtitle |
| 11 | `order` rule | Display = global `order` filtered per tag; new categories inserted at the **top** of their tag's section (`order = minOrderInTag - 1`) |

## Architecture

### Files modified (in place)

- `src/app/globals.css` — replace tokens with polished palette; drop aurora keyframes; add `float / float-alt / float-slow / pulse-glow` keyframes; drop `[data-theme="system"]` paths; add dotted-grid body background.
- `src/app/layout.tsx` — keep system font stack; ensure `data-theme` defaults to `"light"`.
- `src/features/home/HomePage.tsx` — sticky header + hero + tag-grouped sections + footer.
- `src/features/home/HeroSection.tsx` — editorial hero (tag chip + 64px headline + subtitle + stats row).
- `src/features/link-directory/CategoryCard.tsx` — tinted-header chrome, color dot, mono tag·count line, in-card empty state, dashed "Add link" CTA.
- `src/features/link-directory/LinkItem.tsx` — monogram tile + title + mono domain·desc + animated external arrow; accent-tinted hover.
- `src/features/search/SearchBar.tsx` — in-header pill with ⌘K mono badge.
- `src/components/ui/ThemeToggle.tsx` — two-state sun/moon binary toggle.
- `src/components/ui/Modal.tsx`, `EmojiPicker.tsx`, `Button.tsx`, `Input.tsx`, `UndoToast.tsx`, `Toast.tsx`, `SkeletonCard.tsx`, `RichEmptyState.tsx`, `HighlightText.tsx` — restyled to polished tokens.
- `src/features/link-management/AddCategoryModal.tsx`, `EditCategoryModal.tsx` — add tag radio-group (5 options, required, default `"Coursework"` for new).
- `src/store/useLinkStore.ts` — extend `LinkStore` state with `lastUpdatedAt: number`; update on add/edit/delete/reorder; expose action signature changes for `addCategory` / `updateCategory` to include `tag`. No persist middleware change (none exists).
- `src/lib/constants.ts` — add `CATEGORY_TAGS`, `CATEGORY_TAG_ORDER`, `DEFAULT_CATEGORY_TAG`, `SEED_LAST_UPDATED`. Update `DEFAULT_CATEGORIES` to include `tag` per-category. Update `CATEGORY_COLORS` palette to match the polished mock's tones (`#16a34a`, `#0284c7`, `#db2777`, `#ea580c`, `#7c3aed`, `#dc2626`, `#059669`, `#ca8a04`, `#0d9488`); preserve `textColor` mapping per swatch (recompute for WCAG-AA contrast on the new hexes).
- `src/types/index.ts` — add `CategoryTag` union and `tag` field on `Category`.
- `src/hooks/useKeyboardShortcuts.ts` — add `E` (edit focused card/link) and `D` (delete focused card/link). Suppress in editable controls; suppress while any `<dialog>` is open. Resolve focused element via `[data-card-id]` / `[data-link-id]` on `document.activeElement`.
- `src/features/search/SearchBar.tsx` — in-header pill (already listed); also: add `tag` to `useFilteredLinks` predicate.
- `src/features/link-management/AddLinkModal.tsx` — accept optional `presetCategoryId?: string`. When omitted, render a required `<select>` "Category" at the top, populated from `useLinkStore.categories` sorted by `name`; submit blocked until set.
- `next.config.ts` — add `env: { NEXT_PUBLIC_BUILD_TIME: process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? new Date().toISOString() }`.
- `package.json` — remove `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `@types/three`, **`framer-motion`** (committed removal — drag/stagger animations move to CSS keyframes).

### Files added

- `src/features/background-effects/CssOrbs.tsx` — 4 floating orbs + 1 conic accent. Theme-aware colors. Honors `prefers-reduced-motion`.
- `src/features/link-directory/GroupHeader.tsx` — mono uppercase tag header + thin rule + zero-padded count.
- `src/features/link-directory/TagFilterPopover.tsx` — 5 toggleable tag pills, anchored under header Filter button; `role="dialog"` / pills `role="checkbox"`. URL-syncs `?tag=` via `router.replace`.
- `src/components/ui/Header.tsx` — sticky shell extracted from current inline header (logo, version, search slot, theme toggle, filter button, add-link button).
- `src/components/ui/MonogramFavicon.tsx` — domain → letter mapping; replaces `LinkFavicon.tsx`.
- `src/hooks/useTagFilter.ts` — `{ activeTags: Set<CategoryTag>, toggleTag(tag), clear() }` backed by `useSearchParams` / `router`.
- `src/components/ui/Footer.tsx` — mono keyboard hints.
- `src/hooks/useTagGroups.ts` — pure function returning `[{ tag, items }]` in `CATEGORY_TAG_ORDER`, omitting empty tags.

### Files deleted

- `src/features/background-effects/AnimatedBackground.tsx`
- `src/features/background-effects/BlobScene.tsx`
- `src/features/background-effects/FloatingBlob.tsx`
- `src/features/background-effects/useMouseParallax.ts` + `.test.ts`
- `src/hooks/useDeviceCapability.ts`
- `src/components/ui/LinkFavicon.tsx` + `.test.tsx`
- `src/animations/drag-presets.ts`
- `src/animations/variants.ts` + `variants.test.ts`
- (Whole `src/animations/` directory once empty.)
- Aurora / blob CSS in `globals.css`.

## Data model

```ts
// src/types/index.ts
export type CategoryTag =
  | "Entry exam"
  | "Language"
  | "Coursework"
  | "Calendar"
  | "Archive";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  createdAt: number;
  tag: CategoryTag; // NEW (required)
}
```

```ts
// src/lib/constants.ts
export const CATEGORY_TAGS = [
  "Entry exam",
  "Language",
  "Coursework",
  "Calendar",
  "Archive",
] as const satisfies readonly CategoryTag[];

export const CATEGORY_TAG_ORDER: readonly CategoryTag[] = CATEGORY_TAGS;
export const DEFAULT_CATEGORY_TAG: CategoryTag = "Coursework";

// Build-time injection from Vercel deploy metadata (next.config.ts).
// Falls back to Date.now() in local dev / non-Vercel builds.
export const SEED_LAST_UPDATED: number =
  Number(process.env.NEXT_PUBLIC_BUILD_TIME) || Date.now();
```

```ts
// next.config.ts (env block)
env: {
  NEXT_PUBLIC_BUILD_TIME:
    process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? new Date().toISOString(),
},
```

### No persist migration

The store has no `persist` middleware — data is in-memory, seeded from `DEFAULT_CATEGORIES` / `DEFAULT_LINKS`. Adding `tag` is purely a type + seed update; no migration code is needed. Existing behavior (mutations live for the session, reset on reload) is preserved.

The current `ThemeToggle` reads/writes `localStorage["theme"]` directly (separate from the store). Legacy migration for `"system"`:

```ts
// On first read of localStorage["theme"]:
//   "system" → next = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//              localStorage.setItem("theme", next); return next;
//   "light" | "dark" → return as-is.
//   absent → default "light"; persist.
```

This runs once on first read; existing dark-OS users on legacy `"system"` keep their dark preference instead of silently flipping to light.

### `lastUpdatedAt`

- Held in `useLinkStore` state. **Not persisted** (in-memory only, like the rest of the store).
- Initial value: `SEED_LAST_UPDATED` (resolved from `NEXT_PUBLIC_BUILD_TIME` env var, fallback `Date.now()`).
- Set to `Date.now()` on: add category, edit category, delete category, add link, edit link, delete link, reorder categories, reorder links, cross-category move.
- Hero displays `formatRelative(lastUpdatedAt)`:
  - <60 s → `"just now"`
  - <60 min → `"N minutes ago"`
  - <24 h → `"N hours ago"`
  - <7 d → `"N days ago"`
  - <30 d → `"N weeks ago"`
  - else → `"N months ago"`
- Helper `formatRelative(ms: number, now = Date.now()): string` lives in `src/lib/utils.ts`. No new dep.

### `order` rule under tag grouping (formal)

- `Category.order` remains a single global integer; sortable identity stays the global array.
- Display: `useTagGroups(categories)` sorts by `order`, partitions into 5 buckets keyed on `tag` in `CATEGORY_TAG_ORDER`. Tags with zero categories are omitted.
- New-category insertion (`addCategory({ tag, ... })`):
  1. `peers = categories.filter(c => c.tag === input.tag)`.
  2. If `peers.length > 0`: `newOrder = Math.min(...peers.map(p => p.order)) - 1`.
  3. Else: `newOrder = Math.min(...categories.map(c => c.order)) - 1` (or `0` if empty).
  4. The new category appears at the **top** of its tag's section without renumbering siblings.
- DnD `arrayMove` on the global array is unchanged. Cross-tag drags fire normally; the dragged card's tag is unchanged, so the next render places it back inside its own tag's section, near its new global `order` neighbors. The 120ms transition softens the visual snap.

## Visual system

### Tokens (drop-in `globals.css`)

```css
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
```

### Body

- `min-height: 100vh; overflow-x: hidden; position: relative;`
- Dotted grid via two `linear-gradient` overlays at `32px 32px`, color `var(--bg-grid)`.

### Typography

- Font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- Mono utility (`.mono`): `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`.
- Hero h1 = 64 / 800 / -0.04em / 0.95 line-height.
- Group label = 11 mono uppercase / 0.14em tracking.
- Card title = 15 / 700 / -0.015em.
- Link title = 13 / 600.
- Mono labels = 10–11 / 500–600 / 0.08–0.12em tracking.

### Borders / radii / shadows

- 1.5px borders (`--border` for cards, `--border-soft` for subordinate).
- Radii: 8 (buttons/inputs/icon-tiles), 7 (link-row hover), 10 (cards), 12 (modals), 999 (chips).
- Card shadow: `3px 3px 0 var(--shadow-color)` rest → `4px 4px 0` on hover with `translate(-1px, -1px)`, 120ms transition.

### CSS orbs

- Wrapper `.animated-bg`: `position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.65;`
- 4 orbs (280–400px), each `radial-gradient(circle, ${color}40 0%, ${color}15 40%, transparent 70%)`, animated with combined `float|float-alt|float-slow` + `pulse-glow`.
- 1 conic-gradient accent (600×600, `border-radius: 40%`, very low opacity, slow reverse rotation).
- Light theme palette: `#6d3aed, #0284c7, #db2777, #ea580c`.
- Dark theme palette: `#7c3aed, #06b6d4, #db2777, #ea580c`.
- `prefers-reduced-motion: reduce` → `.animated-bg * { animation: none !important; }` (orbs stay visible, static).

### Focus & selection

- Global `:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }`.
- `::selection { background: var(--accent); color: var(--accent-on); }`.

### Baked defaults

- Density = `"comfortable"`; padY 14, padX 16, link row py 9.
- Header style = `"fill"` (tinted via `color-mix(in srgb, ${color} 14%, var(--surface))`).
- Show favicons = `true`. Show grid = `true`. Animated orbs = `true`.

## Component specs

### Header (sticky)

- `position: sticky; top: 0; z-index: 40;`
- Bg: `color-mix(in srgb, var(--bg) 88%, transparent)` + `backdrop-filter: blur(12px)`.
- Bottom border: `1.5px solid var(--border-soft)`.
- Inner row: `max-width: 1100; padding: 14px 24px; gap: 16; display: flex; align-items: center;`.
- Left: 32×32 `S2` monogram (bg `--text`, text `--bg`, weight 800) + title block ("Resource Hub" 14/700, **`"v5.0 · polished"`** 10 mono `--text-3`).
- Right cluster: `<SearchBar />` (320 wide), theme toggle (icon button 34×34), `<TagFilterButton />` (ghost; renders accent dot + count when `activeTags.size > 0`), `<AddLinkButton />` (primary; opens `AddLinkModal` with no preset).

### SearchBar

- 320×34 input with search icon left, ⌘K mono kbd badge right.
- Keep current debounce + `Cmd/Ctrl+K` focus + Esc-to-clear.
- Mobile: shrinks responsively but stays in header.

### ThemeToggle

- Binary light↔dark; sun shown when dark, moon when light.
- Legacy `"system"` migration: one-shot `matchMedia('(prefers-color-scheme: dark)')` re-derive on first read; result persisted back to `localStorage["theme"]`.

### TagFilterButton + TagFilterPopover

- Button: `btnGhost` style with `IconFilter`. When `activeTags.size > 0`, renders an accent dot + count: e.g. `Filter · 2`.
- Popover: absolutely positioned 12px below the button, `--surface` bg, `1.5px --border` + `4px 4px 0 --shadow-color` shadow, radius 12, padding 16. Width auto, max-width 320.
- 5 toggleable pills laid out 3+2: each 28px tall, mono 11/600 uppercase 0.08em tracking, `1.5px --border-soft` resting → `1.5px --border` + `color-mix(--accent 14%, --surface)` bg when active. `role="checkbox"` with `aria-checked`. Pill order = `CATEGORY_TAG_ORDER`.
- "Clear" link bottom-right (visible only when `activeTags.size > 0`); calls `useTagFilter.clear()`.
- URL is the single source of truth: pills toggle calls `router.replace` with updated `?tag=` (comma-separated, lowercase + hyphenated: `entry-exam,language,coursework,calendar,archive`). Reading: `useTagFilter` parses `?tag=` and exposes `Set<CategoryTag>`.
- Closes on outside-click and Esc; toggles do **not** close (multi-select feel).
- `role="dialog"` `aria-label="Filter by tag"`; focus moves into the popover on open and returns to the button on close.

### Hero

- Tag chip (pill, mono 11 uppercase 0.12em, 6px accent dot): **`"Program Magister · TA 2025/26"`**.
- H1 two-line: **`"Resource hub"`** / **`"for the long haul."`** (second line `--text-3`).
- Subtitle 17 `--text-2`, max-width 560: **`"Classroom, jadwal, dan folder belajar untuk empat semester — diatur sekali, mudah dicari selamanya."`**
- Stats row: Categories / Links / Last updated (relative time from `lastUpdatedAt` via `formatRelative`).

### GroupHeader

- `gridColumn: 1 / -1; display: flex; align-items: baseline; gap: 12; padding: 20px 0 4px;`
- Left: mono 11 / 600 / uppercase / 0.14em / `--text-2` tag name.
- Middle: 1px `--border-soft` rule, flex-1.
- Right: mono 11 `--text-3` zero-padded count (`"04"`).

### CategoryCard

- Article: `--surface` bg, `1.5px --border`, radius 10, shadow `3px 3px 0`. Hover `(-1px,-1px)` + `4px 4px 0`. 120ms transition.
- Header: tinted bg `color-mix(in srgb, ${accent} 14%, var(--surface))`, padding 14×16, bottom `1.5px --border-soft`.
- Drag handle (grip 14, `--text-3`, cursor grab) wired to existing `useSortable` listeners.
- 8×8 color dot (radius 2) + title 15/700 ellipsis.
- Mono subtitle: `${tag} · {n} link{s}`.
- Edit / Delete icon buttons (26×26, transparent → `--surface-2` on hover).
- Body padding 8, gap 4.
- Empty state inside card (dashed `--border-soft`, `--surface-2` bg, book icon, mono "No links yet", "Drop a Classroom link or Drive folder.").
- Below rows: dashed `1.5px --border-soft` "Add link" CTA full-width 36px.

### LinkItem

- Grid `20px 1fr auto`, gap 10, padding `9px 10px`.
- Monogram tile (20×20, radius 4, `--surface-2` bg, `1px --border-soft`, accent letter, mono 10/700).
- Title 13/600 ellipsis with HighlightText.
- Mono domain `--text-2` · description `--text-3` ellipsis with HighlightText.
- External-arrow right; on hover translates `(2px, -2px)` and turns `accent`.
- Hover: row bg `color-mix(${accent}, 8%)`, border `color-mix(${accent}, 40%, --border-soft)`.

### MonogramFavicon

- Known domains → letters: `github.com`→G, `classroom.google.com`→C, `drive.google.com`/`docs.google.com`→D, `ilpcikini.com`→I, `speakingpartner.id`→S, `portal.etc.web.id`→E, `koperasi.bappenas.go.id`→B.
- Fallback: first char of hostname uppercased; final fallback `·`.
- `aria-label` includes the domain.

### Modals

- `<dialog>` chrome restyled: `--surface` bg, `1.5px --border` + `4px 4px 0 --shadow-color`, radius 12, padding 24, max-width 480.
- Inputs: 36 tall, `1.5px --border-soft`, radius 8.
- Add/Edit Category: emoji picker preserved; **add tag radio-group** (5 segmented buttons, required).
- DeleteConfirm: copy + behavior preserved; restyled buttons.

### UndoToast / Toast / SkeletonCard / RichEmptyState

- New tokens. Toast bg `--surface`, `1.5px --border`, `3px 3px 0` shadow.
- Skeleton uses `--surface-2`.
- RichEmptyState: mono uppercase eyebrow + body + primary CTA.

### Footer

- `max-width: 1100; margin: 60px auto 32px; padding: 24; border-top: 1.5px --border-soft;`
- Flex space-between; mono 11 `--text-3`.
- Left: **`S2-LINKTREE · POLISHED · v5.0`**.
- Right: `↑ ↓ ← → navigate` · `⌘K search` · `E edit · D delete`.

### Keyboard shortcuts (final)

- Existing: `Cmd/Ctrl+K` (focus search), `Esc` (close modal / clear search).
- New: `E` (open edit modal for focused card/link), `D` (open delete confirm for focused card/link).
- Suppression rules:
  - Skip if `document.activeElement` is inside `input | textarea | select | [contenteditable=""] | [contenteditable="true"]`.
  - Skip while any `<dialog>` is open.
- Focus resolution:
  - `<article>` (CategoryCard) gets `tabindex="0"`, `data-card-id={category.id}`, and `aria-label={`${name}, ${count} links, press E to edit or D to delete`}`.
  - `<a>` (LinkItem) is already focusable; add `data-link-id={link.id}`.
  - Handler reads `data-card-id` / `data-link-id` from `document.activeElement` (or its closest ancestor) to resolve the target.
  - If neither attribute is present on the focus chain → no-op.
- Existing global `:focus-visible` accent ring already provides the visual cue.

### Search (`useFilteredLinks`)

- A category passes if `categoryName | tag` matches the trimmed lowercase query.
- A link passes if `title | url | description | parentCategoryName | parentTag` matches.
- Empty query returns all data.
- Filter ↔ Search interaction: tag filter applies *before* search (search operates on the already-filtered visible data set).

### Animations (CSS-only, no framer-motion)

- Card hover lift: 120ms transition on `transform` + `box-shadow`. Rest = `translate(0,0) / 3px 3px 0`. Hover = `translate(-1px,-1px) / 4px 4px 0`.
- Drag overlay: `.card-lift` class flips shadow to `6px 6px 0` and applies `scale(1.02)` over 150ms; release returns to rest.
- List entrance stagger: single CSS keyframe `fade-up` (8px translateY + opacity 0→1, 220ms ease-out), applied via `animation-delay: calc(var(--idx) * 30ms)` on each rendered card/link with `--idx` set inline.
- `prefers-reduced-motion: reduce`: decorative animations off; functional ones soften to 150ms opacity fades.

## Tag → category mapping (seed data)

| Category | Tag |
|----------|-----|
| TPA | Entry exam |
| TOEFL | Language |
| Materi Pasca Maksi | Archive |
| Sem 1–4 | Coursework |
| Jadwal Kuliah | Calendar |
| Jadwal Ujian | Calendar |

## Reduced motion

- Orbs: animation disabled, orbs static (still visible).
- Hover lifts: replaced with opacity-only feedback.
- Drag animations: stay at 150ms (existing two-tier rule preserved).

## Test plan

### Updated existing tests

`Button.test.tsx`, `Input.test.tsx`, `Modal.test.tsx`, `EmojiPicker.test.tsx`, `Toast.test.tsx`, `UndoToast.test.tsx`, `SkeletonCard.test.tsx`, `RichEmptyState.test.tsx`, `HighlightText.test.tsx`, `CategoryCard.test.tsx`, `LinkItem.test.tsx`, `DragOverlayContent.test.tsx`, `EditLinkModal.test.tsx`, `DeleteConfirm.test.tsx`, `globals.test.ts`, `layout.test.tsx`.

- `ThemeToggle.test.tsx` — **rewrite** for binary state + legacy `"system"` re-derive via mocked `matchMedia` (writing back to localStorage).
- `AddLinkModal.test.tsx` — extend: when `presetCategoryId` is omitted, the Category `<select>` is required; submit blocked until a category is chosen.
- `useFilteredLinks.test.ts` — add tag-match cases (typing a tag name returns all categories sharing it).

### Deleted tests

- `LinkFavicon.test.tsx`
- `useMouseParallax.test.ts`
- `variants.test.ts` (framer-motion removed)

### New tests

- `CssOrbs.test.tsx` — 4 orbs + 1 conic; reduced-motion disables animation; theme palette swap.
- `useTagGroups.test.ts` — `CATEGORY_TAG_ORDER`, empty-tag omission, intra-group order preservation, **new-category insertion at top of tag** (`order = minOrderInTag - 1`).
- `MonogramFavicon.test.tsx` — known + unknown domain mapping; aria-label includes domain.
- `GroupHeader.test.tsx` — uppercase title + zero-padded count (`"04"`, `"12"`).
- `Header.test.tsx` — renders logo, version (`"v5.0 · polished"`), search, theme toggle, filter button, add-link button.
- `TagFilterPopover.test.tsx` — pills toggle, URL syncs via mocked `router.replace`, multi-select works, Esc closes, outside-click closes, "Clear" action resets.
- `useTagFilter.test.ts` — read/write of `?tag=` query, multi-tag serialization, clear, malformed values ignored.
- `Footer.test.tsx` — three keyboard hint groups; left footer renders `"v5.0"`.
- `useLinkStore.test.ts` — `lastUpdatedAt` initializes from `SEED_LAST_UPDATED`; bumps on each mutation (add/edit/delete/reorder/cross-category-move). `addCategory` / `updateCategory` accept and round-trip the `tag` field. `addCategory` insertion places the new category at the top of its tag's section (`order = minOrderInTag - 1`).
- `useKeyboardShortcuts.test.ts` — `E` and `D` resolve via `data-card-id` / `data-link-id` on `activeElement`; suppressed in input/textarea/select/contenteditable; suppressed while a `<dialog>` is open.
- `formatRelative.test.ts` — boundary tests (just now, minutes/hours/days/weeks/months ago).

### Manual verification

- `npm run dev` → light theme: warm-paper bg, dotted grid, hero, sticky header, 4 orbs, tag groups in order (Entry exam → Language → Coursework → Calendar → Archive), tinted card headers, monogram tiles, accent-tinted hover, external-arrow translate.
- Toggle theme → dark palette + orb palette swap; backdrop-blur visible on header.
- Search `"TPA"` → highlights; matches by title/url/desc/category-name/tag; `Cmd/Ctrl+K` refocuses.
- Search `"coursework"` → all Coursework categories surface (tag match).
- Filter button → popover with 5 tag pills; toggling updates URL `?tag=…`; deep-link with `?tag=coursework` reproduces filtered state.
- Drag a card within a tag → lift + shadow grow; drops at new global order; renders in correct slot.
- Drag a card across tag-section visually → tag is unchanged; card returns to its own tag's section at the new global `order` neighborhood.
- Drag a link cross-category → lands in target card; target card highlights.
- Add link via header CTA → modal shows required Category `<select>`; submit blocked until set.
- Add category → tag radio present; saving inserts at the **top** of the chosen tag's section.
- Delete a link → undo toast; click undo restores; `lastUpdatedAt` updates and hero recomputes relative time.
- Focus a card via Tab → press `E` opens edit modal; press `D` opens delete confirm. Same for links.
- Type `e` while focus is in search input → no shortcut fires (input guard).
- Type `e` while a modal is open → no shortcut fires (dialog guard).
- Legacy localStorage `theme="system"` on a dark-OS machine → on first load, theme is dark and localStorage now stores `"dark"`.
- `prefers-reduced-motion`: orbs static, hovers softened.
- Mobile width: header sticky, search shrinks, cards stack 1-col, action buttons remain visible.
- `npm run build` succeeds; bundle size drops sharply (R3F + drei + three + framer-motion removed).
- `npm test` green. `npm run lint` clean.

## Open follow-ups (not in this spec)

- Real favicon fallback (Google API) as an opt-in setting — deferred.
- Per-tag drag reordering UX (cross-tag drag currently snaps back) — revisit if the snap-back motion proves confusing in dogfooding.
