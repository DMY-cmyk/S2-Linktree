# S2 Resource Hub — "Polished" Redesign

**Status:** Approved (brainstorming complete) — ready for implementation plan
**Date:** 2026-05-01
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
- `src/hooks/useKeyboardShortcuts.ts` — add `E` (edit focused card/link) and `D` (delete focused card/link).
- `src/animations/drag-presets.ts`, `variants.ts` — re-tune to lighter shadow-lift hover; drop framer-motion if no longer needed.
- `package.json` — remove `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `@types/three`. Drop `framer-motion` only if no usages remain after refactor.

### Files added

- `src/features/background-effects/CssOrbs.tsx` — 4 floating orbs + 1 conic accent. Theme-aware colors. Honors `prefers-reduced-motion`.
- `src/features/link-directory/GroupHeader.tsx` — mono uppercase tag header + thin rule + zero-padded count.
- `src/components/ui/MonogramFavicon.tsx` — domain → letter mapping; replaces `LinkFavicon.tsx`.
- `src/components/ui/Footer.tsx` — mono keyboard hints.
- `src/hooks/useTagGroups.ts` — pure function returning `[{ tag, items }]` in `CATEGORY_TAG_ORDER`, omitting empty tags.

### Files deleted

- `src/features/background-effects/AnimatedBackground.tsx`
- `src/features/background-effects/BlobScene.tsx`
- `src/features/background-effects/FloatingBlob.tsx`
- `src/features/background-effects/useMouseParallax.ts` + `.test.ts`
- `src/hooks/useDeviceCapability.ts`
- `src/components/ui/LinkFavicon.tsx` + `.test.tsx`
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

// Hardcode at implementation time to a recent epoch ms so the hero shows
// a meaningful "X days ago" on first load. Bumped on every store mutation
// (in-memory only — resets to this value on page reload).
export const SEED_LAST_UPDATED: number = /* e.g. */ 1746057600000;
```

### No persist migration

The store has no `persist` middleware — data is in-memory, seeded from `DEFAULT_CATEGORIES` / `DEFAULT_LINKS`. Adding `tag` is purely a type + seed update; no migration code is needed. Existing behavior (mutations live for the session, reset on reload) is preserved.

The current `ThemeToggle` reads/writes `localStorage["theme"]` directly (separate from the store). Migration for that is a one-liner on read: stored value `"system"` → treat as `"light"`. Stored `"light"` / `"dark"` are kept as-is.

### `lastUpdatedAt`

- Held in `useLinkStore` state. **Not persisted** (in-memory only, like the rest of the store).
- Initial value: `SEED_LAST_UPDATED` constant in `constants.ts`. Seed with the latest commit's epoch ms (hardcode at implementation time so the hero shows a meaningful "X days ago" on first load).
- Set to `Date.now()` on: add category, edit category, delete category, add link, edit link, delete link, reorder categories, reorder links, cross-category move.
- Hero displays `formatRelative(lastUpdatedAt)` ("just now", "5 minutes ago", "2 days ago"). Use a small inline relative-time helper in `src/lib/utils.ts` (no new dep).

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
- Left: 32×32 `S2` monogram (bg `--text`, text `--bg`, weight 800) + title block ("Resource Hub" 14/700, "v4.1 · neo-brut" 10 mono `--text-3`).
- Right cluster: `<SearchBar />` (320 wide), theme toggle (icon button 34×34), Filter button (ghost), Add link button (primary).

### SearchBar

- 320×34 input with search icon left, ⌘K mono kbd badge right.
- Keep current debounce + `Cmd/Ctrl+K` focus + Esc-to-clear.
- Mobile: shrinks responsively but stays in header.

### ThemeToggle

- Binary light↔dark; sun shown when dark, moon when light.
- localStorage migration: stored `"system"` → read as `"light"`.

### Hero

- Tag chip (pill, mono 11 uppercase 0.12em, 6px accent dot, "Master's degree · academic year 2025/26").
- H1 two-line: "Resource hub" / "for the long haul." (second line `--text-3`).
- Subtitle 17 `--text-2`, max-width 560: "Every classroom, schedule, and study folder you need across four semesters — organized once, searchable forever."
- Stats row: Categories / Links / Last updated (relative time from `lastUpdatedAt`).

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
- Left: `S2-LINKTREE · POLISHED · v4.1`.
- Right: `↑ ↓ ← → navigate` · `⌘K search` · `E edit · D delete`.

### Keyboard shortcuts

- Existing: `Cmd/Ctrl+K` (focus search), `Esc` (close modal / clear search).
- New: `E` (when a card or link is focused, open edit modal), `D` (when a card or link is focused, open delete confirm).
- Implementation: `useKeyboardShortcuts` reads `document.activeElement` to determine focused card/link.

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

`Button.test.tsx`, `Input.test.tsx`, `Modal.test.tsx`, `EmojiPicker.test.tsx`, `Toast.test.tsx`, `UndoToast.test.tsx`, `SkeletonCard.test.tsx`, `RichEmptyState.test.tsx`, `HighlightText.test.tsx`, `CategoryCard.test.tsx`, `LinkItem.test.tsx`, `DragOverlayContent.test.tsx`, `AddLinkModal.test.tsx`, `EditLinkModal.test.tsx`, `DeleteConfirm.test.tsx`, `globals.test.ts`, `layout.test.tsx`.

`ThemeToggle.test.tsx` — **rewrite** for binary state + system→light migration.

### Deleted tests

`LinkFavicon.test.tsx`, `useMouseParallax.test.ts`. `variants.test.ts` only if framer-motion removed.

### New tests

- `CssOrbs.test.tsx` — 4 orbs + 1 conic; reduced-motion disables animation; theme palette swap.
- `useTagGroups.test.ts` — order, empty-tag omission, intra-group order preservation.
- `MonogramFavicon.test.tsx` — known + unknown domain mapping; aria-label.
- `GroupHeader.test.tsx` — uppercase title + zero-padded count.
- `Footer.test.tsx` — three keyboard hint groups.
- `useLinkStore.test.ts` — assert `lastUpdatedAt` initializes from `SEED_LAST_UPDATED`; bumps on add/edit/delete/reorder/cross-category-move (each as its own assertion, using a fake clock or monotonic check). Assert `addCategory` / `updateCategory` accept and round-trip the `tag` field.
- `useKeyboardShortcuts` — `E` and `D` open the right modal for focused card/link.

### Manual verification

- `npm run dev` → light theme: warm-paper bg, dotted grid, hero, sticky header, 4 orbs, tag groups in order (Entry exam → Language → Coursework → Calendar → Archive), tinted card headers, monogram tiles, accent-tinted hover, external-arrow translate.
- Toggle theme → dark palette + orb palette swap; backdrop-blur visible on header.
- Search "TPA" → highlights, non-matching cards/groups hide; `Cmd/Ctrl+K` refocuses.
- Drag a card → lift + shadow grow; drop preserves tag.
- Drag a link cross-category → lands in target card; target card highlights.
- Add/Edit category → tag radio present; saving relocates the card to the matching group.
- Delete a link → undo toast; click undo restores; `lastUpdatedAt` updates.
- Focus a card → press `E` opens edit modal; press `D` opens delete confirm. Same for links.
- `prefers-reduced-motion`: orbs static, hovers softened.
- Mobile width: header sticky, search shrinks, cards stack 1-col, action buttons remain visible.
- `npm run build` succeeds; bundle size drops sharply (R3F + drei + three removed).
- `npm test` green. `npm run lint` clean.

## Open follow-ups (not in this spec)

- Tag-based filter UI in header Filter button — currently restyled placeholder; deeper filter UX is its own design.
- Real favicon fallback (Google API) as an opt-in setting — deferred.
