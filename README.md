# S2-Linktree

> **Neo-Brutalism Academic Resource Hub** — A Linktree-style app for organizing Master's degree resources by category, featuring a WebGL 3D animated background and full drag-and-drop reordering.

🔗 **Live Demo:** [s2-linktree.vercel.app](https://s2-linktree.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r176-black?logo=three.js)

---

## ✨ Features

### Core

- **Category Management** — Create, edit, and delete resource categories with custom emojis and colors
- **Link Management** — Add, edit, and delete links within categories with auto-title fetching
- **Search & Filter** — Real-time debounced search across link titles, URLs, and category names
- **Dark / Light Theme** — Toggle with flash-free SSR hydration and localStorage persistence

### V2 — 3D Background & Drag-and-Drop

- **WebGL 3D Animated Background** — Six floating color blobs rendered with React Three Fiber, Bloom post-processing, and mouse-driven camera parallax. Theme-adaptive (brighter in dark mode, subtler in light). Automatically disabled for users who prefer reduced motion.
- **Drag-and-Drop Reordering** — Powered by @dnd-kit:
  - **Category reorder** — Drag categories by their handle to rearrange the grid
  - **Link reorder** — Drag links within a category to reorder them
  - **Cross-category moves** — Drag a link from one category and drop it into another (target card highlights with a glow ring)
- **Neo-Brutalism Drag Animations** — Lift/settle transitions with scale and shadow effects matching the design system

### Design & UX

- **Neo-Brutalism Design** — Bold borders, hard shadows, bright accent colors, and playful animations
- **Fully Client-Side** — All data stored in `localStorage` via Zustand — no backend required
- **Accessible** — ARIA-compliant modals with focus management and keyboard navigation
- **Responsive** — Works on desktop and mobile with touch-friendly drag sensors

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| 3D Graphics | [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Three.js](https://threejs.org/) + [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) |
| Drag & Drop | [@dnd-kit](https://dndkit.com/) (core, sortable, utilities) |
| State | [Zustand 5](https://zustand.docs.pmnd.rs/) with `persist` middleware |
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
npm test           # Single run (39 tests)
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
│   ├── EmojiPicker.tsx
│   └── DragHandle.tsx          # 6-dot grip handle for drag interactions
├── features/
│   ├── home/                   # HomePage orchestrator + HeroSection
│   ├── link-directory/         # CategoryCard, CategoryGrid, LinkItem
│   ├── link-management/        # Add/Edit/Delete modals for links & categories
│   ├── search/                 # SearchBar with debounce
│   ├── background-effects/     # WebGL 3D animated background
│   │   ├── AnimatedBackground.tsx   # Canvas wrapper with Suspense + reduced-motion fallback
│   │   ├── BlobScene.tsx            # 6 blobs, Bloom, camera parallax, theme detection
│   │   ├── FloatingBlob.tsx         # Animated sphere with sine-based floating motion
│   │   └── useMouseParallax.ts      # Normalized mouse coordinate hook
│   └── card-ordering/          # Drag-and-drop reordering system
│       ├── SortableCategoryGrid.tsx  # DndContext wrapper + DragOverlay
│       ├── SortableCategoryCard.tsx  # Sortable category wrapper
│       ├── SortableLinkList.tsx      # Droppable link list container
│       ├── SortableLinkItem.tsx      # Sortable link wrapper
│       ├── DragOverlayContent.tsx    # Category/link drag preview
│       └── useCategoryDnd.ts        # Sensors + drag event handlers
├── hooks/                      # useFilteredLinks (search + filter logic)
├── lib/                        # Utils, constants, color palette
├── store/                      # Zustand stores (links + toasts)
└── types/                      # TypeScript type definitions
```

## 🎨 Design System

The app uses a **Neo-Brutalism** aesthetic:

- **Bold 3px borders** with hard box shadows
- **Bright accent palette:** `#a8ff78` · `#78d6ff` · `#ff78a8` · `#ffd078` · `#d078ff` · `#78ffd0` · `#ff6b6b` · `#78a8ff`
- **Dark & light themes** via CSS custom properties on `[data-theme]`
- **Stagger animations** on category cards and links
- **Drag feedback** — Cards lift with scale + shadow on grab, settle smoothly on drop
- **3D background** — Floating color blobs with Bloom glow, adapting to current theme

## 📝 License

This project is for academic/personal use.