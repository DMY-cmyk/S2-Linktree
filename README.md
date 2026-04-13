# S2-Linktree

> **Neo-Brutalism Academic Resource Hub** — A Linktree-style app for organizing Master's degree resources by category, featuring a WebGL 3D animated background, animated aurora gradient, and full drag-and-drop reordering.

🔗 **Live Demo:** [s2-linktree.vercel.app](https://s2-linktree.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r183-black?logo=three.js)

---

## ✨ Features

### Core

- **Category Management** — Create, edit, and delete resource categories with custom emojis and colors
- **Link Management** — Add, edit, and delete links within categories with auto-title fetching
- **Search & Filter** — Real-time debounced search across link titles, URLs, and category names with keyboard shortcut (`Ctrl+K` / `Cmd+K`)
- **Dark / Light / System Theme** — Three-state toggle (light, dark, system) with flash-free SSR hydration, `prefers-color-scheme` auto-detection, and localStorage persistence

### V2 — 3D Background & Drag-and-Drop

- **WebGL 3D Animated Background** — Organic, distorted 3D blobs rendered with React Three Fiber and drei's `MeshDistortMaterial` for GPU-accelerated vertex displacement. Features a 3-light rig (ambient + key + rim) and mouse-driven camera parallax. Theme-adaptive lighting (brighter in dark mode, subtler in light). Automatically disabled for users who prefer reduced motion.
- **Drag-and-Drop Reordering** — Powered by @dnd-kit:
  - **Category reorder** — Drag categories by their handle to rearrange the grid
  - **Link reorder** — Drag links within a category to reorder them
  - **Cross-category moves** — Drag a link from one category and drop it into another (target card highlights with a glow ring)
- **Neo-Brutalism Drag Animations** — Lift/settle transitions with scale and shadow effects matching the design system

### V3 — Visual Polish & Performance

- **Performance Optimizations**
  - Adaptive device capability detection with WebGL GPU renderer checks
  - Reduced sphere geometry segments and blob count for faster rendering
  - Removed Bloom post-processing to cut GPU overhead
  - Lower distortion and animation speed on materials
  - CSS fade-in transition (600ms) on canvas mount to eliminate visual pop-in
- **3D Blob Visual Polish**
  - Emissive glow and translucency (opacity 0.7) for lava-lamp aesthetic
  - Depth-spread blob positions (Z: -2 to -9) for parallax depth
  - Dual-sine organic floating motion (primary wave + secondary harmonic)
- **Animated Aurora Gradient Background**
  - 12-second cycling aurora gradient behind the 3D blobs
  - Dark theme: purple → teal → magenta
  - Light theme: peach → mint → lavender
- **Enhanced UX**
  - Undo toast for link/category deletions
  - Keyboard shortcuts (`Ctrl+K` / `Cmd+K` to focus search, `Esc` to close modals)
  - Skeleton loading states with shimmer animation
  - Rich empty states with contextual actions
  - Link favicons via Google Favicon API
  - Highlight matching text in search results

### V4 — UI/UX Polish & Accessibility

- **Lucide SVG Icon System** — Replaced all functional emoji icons (edit, delete, search, close, add) with [Lucide React](https://lucide.dev/) SVG icons at 2.5px stroke width matching the Neo-Brutalist aesthetic
- **Semantic Design Tokens** — CSS custom properties for success/danger/warning/accent colors with auto-contrast `--color-on-*` text pairs across both themes
- **Comprehensive Accessibility**
  - Global `:focus-visible` accent outline on all interactive elements
  - Skip-to-content link for keyboard navigation
  - Native `<dialog>` modal with built-in focus trapping and Escape handling
  - `aria-invalid` + `aria-describedby` on form inputs with error icon
  - `role="radiogroup"` with `aria-checked` on emoji picker
  - Persistent `aria-live` region for screen reader toast announcements
  - Descriptive `aria-label` on all action buttons, favicons, and link counts
- **Mobile UX** — Edit/delete actions always visible at 60% opacity (no hover-only), 32px minimum touch targets
- **Search Enhancements** — Lucide Search/X icons, clear button, two-stage Escape (clear text then blur), platform-aware shortcut hint
- **Performance** — 50ms mouse parallax throttle, max 3 toast stack, responsive drag overlay sizing for narrow viewports
- **Reduced Motion** — Two-tier `prefers-reduced-motion` support: decorative animations disabled, functional animations softened to 150ms opacity fades
- **Category Header Contrast** — Pre-computed text colors per category background for WCAG-compliant readability

### Design & UX

- **Neo-Brutalism Design** — Bold borders, hard shadows, bright accent colors, and playful animations
- **Fully Client-Side** — All data stored in `localStorage` via Zustand — no backend required
- **Accessible** — Native dialog focus trapping, ARIA labels, radiogroup semantics, skip-to-content, screen reader announcements
- **Responsive** — Works on desktop and mobile with touch-friendly drag sensors and always-visible action buttons

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| 3D Graphics | [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Three.js](https://threejs.org/) + [@react-three/drei](https://github.com/pmndrs/drei) |
| Drag & Drop | [@dnd-kit](https://dndkit.com/) (core, sortable, utilities) |
| State | [Zustand 5](https://zustand.docs.pmnd.rs/) with `persist` middleware |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion 12](https://motion.dev/) |
| IDs | [nanoid](https://github.com/ai/nanoid) |
| Testing | [Vitest 4](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Language | TypeScript 5 |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone the repo
git clone https://github.com/DMY-cmyk/S2-Linktree.git
cd S2-Linktree

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test           # Single run (154 tests)
npm run test:watch # Watch mode
```

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router (layout, page, globals.css)
├── animations/                 # Framer Motion + drag animation presets
├── components/ui/              # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ThemeToggle.tsx
│   ├── Toast.tsx
│   ├── UndoToast.tsx              # Undo action toast for deletions
│   ├── EmojiPicker.tsx
│   ├── DragHandle.tsx             # 6-dot grip handle for drag interactions
│   ├── HighlightText.tsx          # Search term highlight in results
│   ├── LinkFavicon.tsx            # Google Favicon API integration
│   ├── RichEmptyState.tsx         # Contextual empty state with actions
│   └── SkeletonCard.tsx           # Shimmer loading placeholder
├── features/
│   ├── home/                   # HomePage orchestrator + HeroSection
│   ├── link-directory/         # CategoryCard, CategoryGrid, LinkItem
│   ├── link-management/        # Add/Edit/Delete modals for links & categories
│   ├── search/                 # SearchBar with debounce
│   ├── background-effects/     # WebGL 3D animated background
│   │   ├── AnimatedBackground.tsx   # Canvas wrapper with Suspense, fade-in, reduced-motion fallback
│   │   ├── BlobScene.tsx            # 4 blobs, camera parallax, theme-adaptive lighting
│   │   ├── FloatingBlob.tsx         # Organic 3D blob with emissive glow, transparency, dual-sine motion
│   │   └── useMouseParallax.ts      # Normalized mouse coordinate hook
│   └── card-ordering/          # Drag-and-drop reordering system
│       ├── SortableCategoryGrid.tsx  # DndContext wrapper + DragOverlay
│       ├── SortableCategoryCard.tsx  # Sortable category wrapper
│       ├── SortableLinkList.tsx      # Droppable link list container
│       ├── SortableLinkItem.tsx      # Sortable link wrapper
│       ├── DragOverlayContent.tsx    # Category/link drag preview
│       └── useCategoryDnd.ts        # Sensors + drag event handlers
├── hooks/                      # Custom hooks
│   ├── useDeviceCapability.ts       # GPU-aware adaptive quality detection
│   ├── useFilteredLinks.ts          # Search + filter logic
│   └── useKeyboardShortcuts.ts      # Global keyboard shortcuts
├── lib/                        # Utils, constants, color palette
├── store/                      # Zustand stores (links + toasts)
└── types/                      # TypeScript type definitions
```

## 🎨 Design System

The app uses a **Neo-Brutalism** aesthetic:

- **Bold 2px borders** with hard box shadows and depth layers
- **Semantic color tokens:** success, danger, warning, accent — each with auto-contrast `on-*` text pairs
- **Three-state theming** (light / dark / system) via CSS custom properties on `[data-theme]`
- **Lucide SVG icons** at 2.5px stroke width for all UI controls
- **Animated aurora gradient** — 12s cycling background (purple/teal/magenta dark, peach/mint/lavender light)
- **Stagger animations** on category cards and links
- **Drag feedback** — Cards lift with scale + shadow on grab, settle smoothly on drop
- **3D background** — Organic emissive blobs with translucency, depth-spread positioning, and dual-sine motion
- **Skeleton loading** — Shimmer animation placeholders during content load

## 📝 License

This project is for academic/personal use.