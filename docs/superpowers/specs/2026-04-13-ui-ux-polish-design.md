# S2-Linktree UI/UX Polish — Design Specification

**Date:** 2026-04-13
**Scope:** Accessibility, design tokens, icon system, mobile UX, keyboard shortcuts, performance
**Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Lucide Icons (new), @dnd-kit

---

## 1. Icon System — Lucide Icons

**Decision:** Replace all functional emoji icons with Lucide React SVG icons. Keep decorative category emoji (user-chosen per category) and empty-state decorative emoji.

### Icons to Replace

| Current Emoji | Lucide Icon | Used In |
|---------------|-------------|---------|
| ✏️ | `Pencil` | LinkItem, CategoryCard edit button |
| 🗑️ | `Trash2` | LinkItem, CategoryCard delete button |
| 🔍 | `Search` | SearchBar prefix icon |
| ✕ | `X` | Modal close button, SearchBar clear |
| → | `ArrowRight` | LinkItem external link indicator |
| 🌐 | `Globe` | LinkFavicon fallback |
| 🔗 | `Link` | CategoryCard empty state |
| ➕/+ | `Plus` | Add Link button, Add Category button |

### Implementation

- Install `lucide-react` package
- Import individual icons (tree-shakeable): `import { Pencil, Trash2 } from 'lucide-react'`
- Standard size: 16px for inline, 20px for standalone buttons
- Stroke width: 2.5px (matches Neo-Brutalism bold aesthetic)
- Color: `currentColor` for automatic theme inheritance

### What Stays as Emoji

- Category emoji (📚, 🚀, etc.) — user-chosen decorative content, not UI controls
- EmojiPicker grid options — these ARE the content being selected
- HeroSection decorative emoji — purely decorative

---

## 2. Focus States — Accent Outline

**Decision:** 3px solid accent-colored outline with 3px offset on all interactive elements, using `:focus-visible` (not `:focus`) to avoid showing on mouse clicks.

### Global Focus Style

```css
/* In globals.css */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}
```

### Component-Specific Adjustments

- **Buttons:** On `:focus-visible`, border-color and box-shadow also shift to `var(--accent)` for cohesion
- **Inputs:** Focus already shifts shadow from 2px to 3px — add the outline on top
- **Modal close button:** Accent outline on the square close button
- **Cards (CategoryCard):** Outline wraps the entire card boundary
- **DragHandle:** Visible focus ring when tabbed to

### Skip-to-Content Link

- Visually hidden by default (positioned off-screen)
- On `:focus`, slides into view at top of page
- Styled as a Neo-Brutalist pill: accent background, bold text, hard shadow
- Target: `#main-content` id on the CategoryGrid container

### Modal Focus Trap

- On modal open: focus moves to first focusable element inside
- Tab cycles through modal elements only (close → inputs → submit → close)
- On modal close: focus returns to the element that triggered the modal
- Implementation: manual trap using `keydown` listener on Tab, tracking first/last focusable elements (no external library needed — keep bundle small)

---

## 3. Semantic Color Tokens

**Decision:** Define semantic CSS custom properties with auto-contrast `--color-on-*` text pairs. Remove all hardcoded hex values from components.

### Token Definitions in globals.css

**Light theme (`[data-theme="light"]`):**

| Token | Value | On-Token | On-Value | Usage |
|-------|-------|----------|----------|-------|
| `--color-success` | `#a8ff78` | `--color-on-success` | `#222222` | Primary button, success toast |
| `--color-danger` | `#ff6b6b` | `--color-on-danger` | `#ffffff` | Delete button, error toast, error text |
| `--color-warning` | `#ffd078` | `--color-on-warning` | `#222222` | Warning toast, theme toggle |
| `--color-accent` | `#7c3aed` (exists) | `--color-on-accent` | `#ffffff` | Focus rings, undo button, highlights |

**Dark theme (`[data-theme="dark"]`):**

| Token | Value | On-Token | On-Value |
|-------|-------|----------|----------|
| `--color-success` | `#86efac` | `--color-on-success` | `#222222` |
| `--color-danger` | `#fca5a5` | `--color-on-danger` | `#222222` |
| `--color-warning` | `#fde68a` | `--color-on-warning` | `#222222` |
| `--color-accent` | `#a855f7` (exists) | `--color-on-accent` | `#ffffff` |

### Components to Update

| Component | Current Hardcoded | Replace With |
|-----------|-------------------|--------------|
| `Button.tsx` (primary) | `#a8ff78` bg, `#222` text | `var(--color-success)`, `var(--color-on-success)` |
| `Button.tsx` (danger) | `#ff6b6b` bg | `var(--color-danger)`, `var(--color-on-danger)` |
| `Toast.tsx` (success) | `#a8ff78` | `var(--color-success)` |
| `Toast.tsx` (warning) | `#ffd078` | `var(--color-warning)` |
| `Toast.tsx` (error) | `#ff6b6b` | `var(--color-danger)` |
| `UndoToast.tsx` | `#a8ff78`, `#ff6b6b` | Semantic tokens |
| `ThemeToggle.tsx` | `#ffd078` | `var(--color-warning)` |
| `Input.tsx` (error) | `#ff6b6b` | `var(--color-danger)` |
| `DeleteConfirm.tsx` | `#ff6b6b` | `var(--color-danger)` |
| `HomePage.tsx` (S2 badge) | `#a8ff78` | `var(--color-success)` |

---

## 4. Mobile UX — Always Visible Actions

**Decision:** Edit/delete action icons always visible at 60% opacity. Full opacity on hover/focus. Applies to both LinkItem and CategoryCard.

### LinkItem Changes

- Remove the `opacity-0 group-hover:opacity-100` pattern
- Replace with `opacity-60 hover:opacity-100 focus-within:opacity-100`
- Increase icon touch target to 32x32px minimum (pad with transparent hit area)
- Icons use Lucide `Pencil` and `Trash2` (from Part 1)

### CategoryCard Header Changes

- Replace emoji buttons (✏️ 🗑️) with Lucide `Pencil` and `Trash2` icons
- Always visible at 60% opacity on the category header bar
- Touch target: 32x32px minimum
- On hover/focus: full opacity

---

## 5. ARIA, Toast Accessibility & Form Errors

### ARIA Label Additions

| Component | Fix |
|-----------|-----|
| `SearchBar.tsx` | Add `aria-label="Search resources"` to input |
| `EmojiPicker.tsx` | Add `aria-label` to each emoji button (e.g., `aria-label="Rocket emoji"`) |
| `RichEmptyState.tsx` | Add `aria-label` to emoji span that already has `role="img"` |
| `CategoryCard.tsx` | Add `aria-label` to link count (e.g., `aria-label="5 links"`) |
| `LinkFavicon.tsx` | Add `alt="Favicon for {domain}"` to img element |
| `Input.tsx` | Add `aria-invalid="true"` when error, `aria-describedby` linking to error message element |

### Toast Accessibility

- Wrap the toast container (`Toast.tsx`) with `aria-live="polite"` and `aria-atomic="true"`
- Screen readers will announce toast content when it appears
- No focus steal — toasts remain non-interactive for keyboard flow

### Enhanced Form Errors

- **Border change:** Input border and shadow shift to `var(--color-danger)` when error is present
- **Error icon:** Lucide `AlertCircle` icon inside the input (right side, absolutely positioned)
- **aria-invalid:** `aria-invalid="true"` attribute on the input element
- **aria-describedby:** Error message gets a unique id, input references it via `aria-describedby`
- **Clearer messages:** Error messages include recovery hint (e.g., "Please enter a valid URL (e.g. https://example.com)")

---

## 6. Search Bar & Keyboard Shortcuts

### Search Clear Button

- When search input has text, show an X button (Lucide `X` icon) on the right side
- Click clears the input and triggers the debounced search reset
- Escape key: clears input text and unfocuses the search bar
- X button is 20x20px with dark background, white icon (matches Neo-Brutalism)

### Keyboard Shortcut Update

| Old | New | Action |
|-----|-----|--------|
| `/` | `Ctrl+K` / `Cmd+K` | Focus search bar |
| `n` | `n` (unchanged) | Open Add Link modal |
| `c` | `c` (unchanged) | Open Add Category modal |
| `Escape` | `Escape` (unchanged) | Close modal / blur search |

### Search Placeholder Hint

- Placeholder text: `"Search resources... (Ctrl+K)"` on Windows/Linux
- Placeholder text: `"Search resources... (⌘K)"` on macOS
- Detect platform via `navigator.platform` or `navigator.userAgentData`

---

## 7. Performance & Polish

### 7a. Mouse Parallax Throttle

- Add 50ms throttle to `useMouseParallax.ts` mousemove handler
- Use a simple timestamp check (no lodash dependency)
- Result: ~20 updates/second instead of ~60+, imperceptible visual difference

### 7b. Toast Stack Limit

- Cap visible toasts at 3 in `useToastStore.ts`
- When a 4th toast is added, auto-dismiss the oldest
- Implementation: check array length in `addToast`, splice oldest if >= 3

### 7c. Reduced Motion — Framer Motion

- Add a `useReducedMotion()` hook (Framer Motion provides `useReducedMotion`)
- Create a motion config provider or utility that disables/reduces animations when `prefers-reduced-motion: reduce` is active
- Affected animations: `popIn`, `staggerContainer`, `staggerItem`, `cardHover`, `modalOverlay`, `modalContent`, drag animations
- When reduced motion: skip spring animations, use instant opacity transitions only

### 7d. DragOverlay Responsive Sizing

- Change `DragOverlayContent.tsx` category preview from `w-64` to `max-w-[16rem] w-[80vw]`
- Change link preview from `w-56` to `max-w-[14rem] w-[75vw]`
- Prevents overflow on screens narrower than 375px

### 7e. prefers-color-scheme Detection

- In `layout.tsx` inline script (where theme is read from localStorage):
  - If no localStorage preference exists, check `window.matchMedia('(prefers-color-scheme: dark)')`
  - If OS prefers dark, set `data-theme="dark"` and save to localStorage
  - If OS prefers light or no preference, default to light (current behavior)
- Only runs on first visit — subsequent visits use localStorage

### 7f. Category Header Text Contrast

- Add a utility function `getContrastText(hexColor: string): '#222222' | '#ffffff'`
- Calculate relative luminance of the background color
- Return `#222222` for light backgrounds, `#ffffff` for dark backgrounds
- Use in `CategoryCard.tsx` header bar where text is currently always `#222`

---

## Files Modified

| File | Changes |
|------|---------|
| `package.json` | Add `lucide-react` dependency |
| `globals.css` | Add semantic color tokens, focus-visible styles, skip-link styles |
| `layout.tsx` | Add skip-to-content link, prefers-color-scheme detection |
| `Button.tsx` | Replace hardcoded colors with tokens, add focus-visible |
| `Input.tsx` | Error state styling, aria-invalid, aria-describedby, AlertCircle icon |
| `Modal.tsx` | Focus trap, Lucide X close icon, return focus on close |
| `ThemeToggle.tsx` | Replace hardcoded color with token |
| `Toast.tsx` | aria-live region, token colors, Lucide icons for variants |
| `UndoToast.tsx` | Token colors |
| `EmojiPicker.tsx` | aria-labels on emoji buttons |
| `DragHandle.tsx` | Focus-visible styling |
| `HighlightText.tsx` | No change needed |
| `LinkFavicon.tsx` | alt text on img |
| `RichEmptyState.tsx` | aria-label on emoji span |
| `SkeletonCard.tsx` | No change needed |
| `HomePage.tsx` | Ctrl+K shortcut, token for S2 badge color |
| `HeroSection.tsx` | No change needed |
| `CategoryCard.tsx` | Lucide icons, always-visible actions, contrast text utility, aria-label on count |
| `LinkItem.tsx` | Lucide icons, always-visible actions, focus-visible |
| `CategoryGrid.tsx` | `id="main-content"` for skip link target |
| `SortableCategoryGrid.tsx` | No change needed |
| `DragOverlayContent.tsx` | Responsive max-width sizing |
| `AddLinkModal.tsx` | Enhanced error states |
| `EditLinkModal.tsx` | Enhanced error states |
| `AddCategoryModal.tsx` | No change needed |
| `EditCategoryModal.tsx` | No change needed |
| `DeleteConfirm.tsx` | Token colors, Lucide icon |
| `SearchBar.tsx` | Clear button, aria-label, Ctrl+K placeholder hint, Lucide Search icon |
| `useMouseParallax.ts` | 50ms throttle |
| `useKeyboardShortcuts.ts` | Replace "/" with Ctrl+K/Cmd+K |
| `useToastStore.ts` | Max 3 toast cap |
| `variants.ts` | Reduced motion variants |
| `drag-presets.ts` | No change needed |
| `lib/utils.ts` | Add `getContrastText()` utility |

## New Files

| File | Purpose |
|------|---------|
| (none) | All changes are modifications to existing files |

## Testing

- Verify all Lucide icons render correctly in light and dark mode
- Tab through entire page — every interactive element must show accent outline
- Test modal focus trap: Tab must not escape modal
- Test skip-to-content: Tab on page load → link appears → Enter → focus jumps to grid
- Verify color tokens in both themes — no hardcoded hex remaining
- Test on mobile viewport (375px): edit/delete visible, DragOverlay fits
- Enable `prefers-reduced-motion` in OS settings: animations should be instant/reduced
- First visit with dark OS theme → should auto-detect dark mode
- Test search: Ctrl+K focuses, Escape clears + unfocuses, X button clears
- Screen reader test: toasts announced, form errors linked, emoji buttons labeled
