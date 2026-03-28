# S2-Linktree: Academic Resource Hub — Design Specification

## Problem Statement

A Master's degree student needs a central, stylish hub to organize academic links — test portals (TPA, TOEFL), study resources by semester, schedules, and more. Existing Linktree clones are generic and lack the structure needed for academic categorization.

## Proposed Solution

A personal, single-page academic resource hub built with Next.js. It uses a Neo-Brutalism visual style with playful bouncy animations, organizes links in a responsive category card grid, and stores everything in browser localStorage via Zustand. Supports dark/light theme toggle, real-time search/filter, and full CRUD for links and categories.

## Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14+ (App Router) | Full-featured React framework, Vercel-native |
| State | Zustand + localStorage persist middleware | Minimal boilerplate, ~1KB, built-in persistence |
| Styling | Tailwind CSS | Utility-first, excellent for Neo-Brutalism patterns |
| Animations | Framer Motion | Spring physics, layout animations, AnimatePresence |
| IDs | nanoid | Tiny, URL-safe unique IDs |
| Deployment | Vercel | Free tier, built for Next.js |

## Data Model

```typescript
interface Category {
  id: string;          // nanoid
  name: string;        // e.g. "TPA", "Study Resources (Sem. 1)"
  emoji: string;       // category icon, e.g. "📝"
  color: string;       // accent color for Neo-Brutalism card border/header
  order: number;       // display order in grid
  createdAt: number;   // unix timestamp
}

interface Link {
  id: string;          // nanoid
  categoryId: string;  // references Category.id
  title: string;       // display name
  url: string;         // the actual URL
  description?: string; // optional note/description
  order: number;       // display order within category
  createdAt: number;   // unix timestamp
}
```

**Storage:** Single Zustand store with `categories: Category[]` and `links: Link[]` arrays, persisted via `zustand/middleware/persist` to `localStorage` under key `s2-linktree-store`.

## Initial Categories

| Order | Name | Emoji | Color |
|-------|------|-------|-------|
| 0 | TPA | 📝 | `#a8ff78` (lime) |
| 1 | TOEFL | 🌐 | `#78d6ff` (cyan) |
| 2 | Study Resources (Previous Years) | 📖 | `#ffb3f0` (pink) |
| 3 | Study Resources (Sem. 1) | 📘 | `#ffd078` (orange) |
| 4 | Study Resources (Sem. 2) | 📗 | `#c4b5fd` (lavender) |
| 5 | Study Resources (Sem. 3) | 📙 | `#fca5a5` (coral) |
| 6 | Study Resources (Sem. 4) | 📕 | `#86efac` (mint) |
| 7 | Schedules | 📅 | `#fde68a` (yellow) |

### Initial Links (pre-populated)

**TPA:**
- Portal ETC → https://portal.etc.web.id/
- Jadwal TPA → https://koperasi.bappenas.go.id/jadwal-tpa/

**TOEFL:**
- ILP Online Schedule → https://ilpcikini.com/online-schedule
- PTOEFL → https://ilpcikini.com/ptoefl.php

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider, fonts
│   ├── page.tsx                # Thin — renders <HomePage />
│   └── globals.css             # Tailwind directives + Neo-Brutalism base styles
├── features/
│   ├── home/
│   │   ├── HomePage.tsx        # Main layout: header + hero + search + grid
│   │   └── HeroSection.tsx     # Title, subtitle, animated emoji
│   ├── link-directory/
│   │   ├── CategoryGrid.tsx    # Responsive grid container with stagger animation
│   │   ├── CategoryCard.tsx    # Single category card with colored header + links
│   │   └── LinkItem.tsx        # Individual link row with hover actions
│   ├── link-management/
│   │   ├── AddLinkModal.tsx    # Modal: URL, title, description, category select
│   │   ├── EditLinkModal.tsx   # Modal: edit existing link fields
│   │   ├── AddCategoryModal.tsx # Modal: name, emoji picker, color picker
│   │   └── DeleteConfirm.tsx   # Confirmation dialog for destructive actions
│   └── search/
│       └── SearchBar.tsx       # Global search input with real-time filtering
├── components/
│   └── ui/
│       ├── Modal.tsx           # Reusable animated modal wrapper
│       ├── Button.tsx          # Neo-Brutalism button (bold border, shadow)
│       ├── Input.tsx           # Styled input with thick borders
│       ├── ThemeToggle.tsx     # Dark/light mode switch
│       └── EmojiPicker.tsx     # Grid-based emoji selector
├── store/
│   └── useLinkStore.ts        # Zustand store: categories[], links[], CRUD actions
├── hooks/
│   └── useFilteredLinks.ts    # Search/filter logic hook
├── lib/
│   ├── constants.ts           # Default categories, color palette, seed links
│   └── utils.ts               # URL validation, ID generation helpers
├── animations/
│   └── variants.ts            # Framer Motion spring presets, stagger configs
└── types/
    └── index.ts               # Category, Link type definitions
```

## Visual Design: Neo-Brutalism

### Core Visual Properties
- **Borders:** 2-3px solid borders in dark color (`#222` light / `#fff` dark)
- **Shadows:** Hard offset shadows (3-4px), no blur, using accent color or border color
- **Colors:** Bright, saturated accent palette — lime, cyan, pink, orange, lavender, coral, mint, yellow
- **Typography:** Bold/extra-bold weights (700-900), system-ui font stack
- **Border radius:** 8-12px — rounded but not pill-shaped
- **Backgrounds:** Light mode: warm cream `#fffbe6`, Dark mode: deep blue-grey `#1a1a2e`

### Theme System
CSS custom properties toggled via a `data-theme` attribute on `<html>`:

```
--bg-primary: light #fffbe6 / dark #1a1a2e
--bg-card: light #ffffff / dark #2a2a4a
--text-primary: light #222222 / dark #ffffff
--text-secondary: light #666666 / dark rgba(255,255,255,0.6)
--border-color: light #222222 / dark #ffffff
--shadow-color: light #222222 / dark (accent color per card)
```

### Light Mode Readability
All text in light mode uses solid dark colors (`#222` or `#333`) — no transparent text. Link items use dark borders + dark text on `#f0f0f0` backgrounds. Search placeholder text is `#999` minimum. Buttons and badges always have `#222` text.

## Layout: Category Card Grid

- **Desktop:** 3-column responsive grid (`grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`)
- **Tablet:** 2 columns
- **Mobile:** 1 column, full-width cards
- **Gap:** 16px between cards

### Category Card Anatomy
1. **Header bar:** Colored background (category accent color), emoji + name, link count badge
2. **Body:** List of link items, each as a rounded row with hover effects
3. **Empty state:** Centered "No links yet" message with subtle pulse animation
4. **Footer area:** Inline "+ Add link to this category" subtle button

### Special Cards
- **"+ New Category"** dashed-border card at end of grid — opens AddCategoryModal on click

## Component Behavior

### Header
- **Logo:** "S2" badge in Neo-Brutalism style (green bg, thick border)
- **Title:** "My Academic Hub"
- **Search bar:** Right-aligned, filters in real-time across all categories
- **Theme toggle:** Moon/sun emoji button
- **"+ Add Link" button:** Opens AddLinkModal with category dropdown

### Search/Filter
- Searches across link titles, URLs, descriptions, and category names
- As user types, non-matching categories fade out (AnimatePresence)
- Matching links are highlighted within their category cards
- "No results" empty state with "Clear search" button
- Debounced at 150ms for performance

### Add Link Modal
Fields: URL (required), Title (required, auto-populated from URL if possible), Description (optional), Category (required dropdown). Validation: valid URL format, non-empty title.

### Edit Link Modal
Same fields as Add, pre-populated. Shows in which category the link currently lives. Allows moving to different category.

### Add Category Modal
Fields: Name (required), Emoji (picker grid), Color (preset palette selector). Validates: non-empty name.

### Delete Confirmation
Animated modal: "Are you sure you want to delete [name]?" with Cancel and Delete buttons. Delete button uses red accent.

## Animations (Framer Motion)

### Presets
```typescript
// Spring physics for bouncy Neo-Brutalism feel
const springBouncy = { type: "spring", stiffness: 300, damping: 20 };
const springGentle = { type: "spring", stiffness: 200, damping: 25 };

// Entrance variants
const popIn = {
  initial: { scale: 0.8, opacity: 0, rotate: -2 },
  animate: { scale: 1, opacity: 1, rotate: 0, transition: springBouncy },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
};

// Stagger children
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } }
};
```

### Interaction Map
| Trigger | Animation |
|---------|-----------|
| Page load | Cards stagger in with popIn (0.06s delay between) |
| Card hover | translateY(-4px), shadow grows, subtle 1° wobble |
| Link hover | Background brightens, scale 1.02x |
| Modal open | Spring scale 0.9→1 + backdrop fade in |
| Link added | New item slides in from left with spring |
| Link deleted | Shrink to 0 + fade out |
| Theme toggle | CSS transition crossfade (0.3s on custom properties) |
| Search filter | Layout animation via AnimatePresence |
| Empty state | Gentle opacity pulse on placeholder text |

## Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| Invalid URL | Inline form error: "Please enter a valid URL" |
| Duplicate URL in same category | Warning toast: "This URL already exists in [category]" |
| Empty required field | Inline error under field, submit button disabled |
| localStorage quota exceeded | Toast: "Storage full — try deleting unused links" |
| No categories exist | Full-page empty state: "Create your first category" with CTA |
| Search returns nothing | "No links match your search" + clear button |
| External links | All open in new tab with `rel="noopener noreferrer"` |

## Data Export/Import

A settings gear icon in the header expands to show:
- **Export:** Downloads all data as a JSON file (`s2-linktree-backup.json`)
- **Import:** File upload that merges or replaces data, with confirmation

This provides a safety net for localStorage-based storage.

## V1 Scope

### Included
- Category CRUD (create, edit, delete with confirmation)
- Link CRUD (add, edit, delete with confirmation)
- Category card grid layout (responsive)
- Real-time search/filter across all links
- Dark/light theme toggle with persistence
- Neo-Brutalism visual style with playful bouncy animations
- 8 pre-populated categories with seed links for TPA and TOEFL
- Data export/import as JSON
- Mobile responsive design

### Excluded from V1 (future considerations)
- Authentication/multi-user
- Drag-and-drop reordering
- Pinning favorite links
- Rich link previews (favicon, og:image)
- Cloud sync
- Notes/annotations on links
- Tags (cross-category labeling)

## Deployment

- **Platform:** Vercel (free tier)
- **Build:** `next build` produces static/SSG output (no server-side data fetching needed)
- **Config:** No environment variables required for v1

## Future Extensibility

The architecture supports future additions without restructuring:
- **Search → advanced filtering:** The `useFilteredLinks` hook can be extended with tag/date filters
- **Drag-and-drop:** Add `@dnd-kit/core` and update `order` fields in store
- **Authentication:** Add Next.js middleware + auth provider, migrate localStorage to a database
- **Cloud sync:** Replace Zustand localStorage middleware with a remote sync adapter
- **Notes:** Add `notes?: string` field to Link type
