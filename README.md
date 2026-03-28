# S2-Linktree

> **Neo-Brutalism Academic Resource Hub** — A Linktree-style app for organizing Master's degree resources by category.

🔗 **Live Demo:** [s2-linktree.vercel.app](https://s2-linktree.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

- **Category Management** — Create, edit, and delete resource categories with custom emojis and colors
- **Link Management** — Add, edit, and delete links within categories with auto-title fetching
- **Search & Filter** — Real-time debounced search across link titles, URLs, and category names
- **Dark / Light Theme** — Toggle with flash-free SSR hydration and localStorage persistence
- **Import / Export** — Back up and restore your entire link collection as JSON
- **Neo-Brutalism Design** — Bold borders, hard shadows, bright accent colors, and playful animations
- **Fully Client-Side** — All data stored in `localStorage` via Zustand — no backend required
- **Accessible** — ARIA-compliant modals with focus management and keyboard navigation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
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
npm test           # Single run
npm run test:watch # Watch mode
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (layout, page, globals.css)
├── animations/             # Framer Motion animation presets
├── components/ui/          # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ThemeToggle.tsx
│   ├── Toast.tsx
│   └── EmojiPicker.tsx
├── features/
│   ├── home/               # HomePage orchestrator + HeroSection
│   ├── link-directory/     # CategoryCard, CategoryGrid, LinkItem
│   ├── link-management/    # Add/Edit/Delete modals for links & categories
│   └── search/             # SearchBar with debounce
├── hooks/                  # useFilteredLinks (search + filter logic)
├── lib/                    # Utils, constants, color palette
├── store/                  # Zustand stores (links + toasts)
└── types/                  # TypeScript type definitions
```

## 🎨 Design System

The app uses a **Neo-Brutalism** aesthetic:

- **Bold 3px borders** with hard box shadows
- **Bright accent palette:** `#a8ff78` · `#78d6ff` · `#ff78a8` · `#ffd078` · `#d078ff` · `#78ffd0` · `#ff6b6b` · `#78a8ff`
- **Dark & light themes** via CSS custom properties on `[data-theme]`
- **Stagger animations** on category cards and links

## 📝 License

This project is for academic/personal use.