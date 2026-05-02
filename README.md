# S2-Linktree

> **Polished editorial resource hub** for organizing Master's degree resources by tag and category — with a CSS-only animated background, in-memory drag-and-drop reordering, URL-backed tag filtering, and full keyboard control.

🔗 **Live Demo:** [s2-linktree.vercel.app](https://s2-linktree.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

### Editorial design
- **Polished palette & typography** — warm-paper light theme, deep-navy dark theme, mono uppercase labels, refined geometry (1.5px borders, 8–14px radii)
- **CSS-only animated orbs** — four floating gradient orbs + conic accent on a dotted-grid background, all driven by CSS keyframes (no WebGL, no framer-motion)
- **Bilingual hero** — English headline (“Resource hub for the long haul.”) + Indonesian subtitle, with live stats and a relative “last updated” timestamp
- **Letter-monogram favicons** — domain-aware single-letter tiles (G for github, C for classroom, D for drive, …) instead of remote favicon fetches
- **Binary theme** — light / dark only, with first-paint hydration and migration from any legacy `'system'` value via `matchMedia`

### Organization
- **Required category tags** — every category belongs to one of `Entry exam`, `Language`, `Coursework`, `Calendar`, `Archive`. Cards are grouped under uppercase section headers with a horizontal rule and zero-padded count
- **URL-backed tag filter** — the filter popover writes selected tags to the URL query string, so a filtered view is shareable and survives reload
- **Search** — debounced search across link titles, URLs, descriptions, category names, and category tags

### Interaction
- **Drag-and-drop** — categories reorder within the grid; links reorder within a category and can be moved between categories. Powered by `@dnd-kit`
- **Keyboard shortcuts**
  - `Cmd/Ctrl + K` focus search
  - `E` edit the focused card or link
  - `D` delete the focused card or link
  - `Esc` clear search / close modals
- **In-memory state** — categories and links live in a Zustand store with no `persist` middleware; data resets on reload (intentional for the academic-snapshot use case)
- **`lastUpdatedAt` tracking** — every mutation bumps an in-memory timestamp; on first load it’s seeded from `NEXT_PUBLIC_BUILD_TIME`, which `next.config.ts` injects from Vercel’s `VERCEL_GIT_COMMIT_AUTHOR_DATE` at build time

### Accessibility & polish
- Native `<dialog>` modals with focus trapping and Escape handling
- `:focus-visible` accent outline on every interactive element, skip-to-content link
- `aria-checked` on emoji picker, `role="checkbox"` on tag pills, descriptive `aria-label`s throughout
- Full `prefers-reduced-motion` support (orb animations and stagger fades are disabled)
- 32px+ touch targets, always-visible action buttons on mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Drag & Drop | [@dnd-kit](https://dndkit.com/) (core, sortable, utilities) |
| State | [Zustand 5](https://zustand.docs.pmnd.rs/) (in-memory, no persist) |
| Icons | [Lucide React](https://lucide.dev/) at 1.75 stroke width |
| IDs | [nanoid](https://github.com/ai/nanoid) |
| Testing | [Vitest 4](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Language | TypeScript 5 |

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **npm** ≥ 10

### Install & Run

```bash
git clone https://github.com/DMY-cmyk/S2-Linktree.git
cd S2-Linktree
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test           # Single run (170 tests across 41 files)
npm run test:watch
```

## 📁 Project Structure

```
src/
├── app/                       # Next.js App Router (layout, page, globals.css)
├── components/ui/             # Reusable primitives
│   ├── Button.tsx · Input.tsx · Modal.tsx · Toast.tsx · UndoToast.tsx
│   ├── EmojiPicker.tsx · HighlightText.tsx · MonogramFavicon.tsx
│   ├── RichEmptyState.tsx · SkeletonCard.tsx
│   ├── Header.tsx · Footer.tsx · ThemeToggle.tsx · DragHandle.tsx
├── features/
│   ├── home/                  # HomePage orchestrator + bilingual HeroSection
│   ├── link-directory/        # CategoryCard, CategoryGrid, LinkItem,
│   │                          # GroupHeader, TagFilterPopover
│   ├── link-management/       # Add/Edit/Delete modals (with tag radio)
│   ├── search/                # SearchBar with debounce + ⌘K badge
│   ├── background-effects/    # CssOrbs (CSS-only animated background)
│   └── card-ordering/         # @dnd-kit wrappers + DragOverlay
├── hooks/                     # useFilteredLinks, useTagGroups, useTagFilter,
│                              # useKeyboardShortcuts, useCategoryDnd
├── lib/                       # constants (palette, tags, SEED_LAST_UPDATED), utils
├── store/                     # useLinkStore (in-memory, lastUpdatedAt tracking)
└── types/                     # CategoryTag union + Category/Link types
```

## 🎨 Design System

- **Tokens** — `--surface`, `--surface-2`, `--text` / `--text-2` / `--text-3`, `--border`, `--border-soft`, `--accent`, `--accent-soft`, `--accent-on`, `--success`, `--danger`, `--shadow-color` on `[data-theme="light"|"dark"]`
- **Geometry** — 1.5px borders, 8px (input/button) → 14px (modal/card) radii, 3px hard-shadow on accent buttons with hover lift
- **Typography** — sans body + mono uppercase meta (`letterSpacing: 0.06em`) for tags, counts, and shortcut hints
- **Color mixing** — accent-tinted hover states via `color-mix(in srgb, var(--accent) 14%, var(--surface))`
- **Stagger** — `.fade-up` utility with `--idx` CSS variable + `animationDelay: calc(var(--idx) * 30ms)`

## 🚢 Deployment

Deployed on Vercel with zero configuration. `next.config.ts` injects `NEXT_PUBLIC_BUILD_TIME` from `VERCEL_GIT_COMMIT_AUTHOR_DATE` so the seeded `lastUpdatedAt` on first load reflects the actual deploy commit timestamp.

## 📝 License

This project is for academic/personal use.
