# Chunk 3: Feature Components — Display & Search

### Task 18: Create LinkItem component

**Files:** Create `src/features/link-directory/LinkItem.tsx`

- [ ] **Step 1:** Create `src/features/link-directory/LinkItem.tsx`

```tsx
'use client';

import { motion } from 'framer-motion';
import type { Link } from '@/types';

interface LinkItemProps {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function LinkItem({ link, accentColor, onEdit, onDelete }: LinkItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-colors"
      style={{
        borderColor: `${accentColor}40`,
        backgroundColor: `${accentColor}10`,
      }}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">
          {link.title}
        </span>
        {link.description && (
          <span className="text-xs text-[var(--text-secondary)] truncate block">
            {link.description}
          </span>
        )}
      </a>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Delete"
        >
          🗑️
        </button>
      </div>
      <span className="text-[var(--text-secondary)] text-sm ml-1">→</span>
    </motion.div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add LinkItem component with hover actions"
```

---

### Task 19: Create CategoryCard component

**Files:** Create `src/features/link-directory/CategoryCard.tsx`

- [ ] **Step 1:** Create `src/features/link-directory/CategoryCard.tsx`

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { staggerItem, cardHover } from '@/animations/variants';
import { LinkItem } from './LinkItem';
import type { Category, Link } from '@/types';

interface CategoryCardProps {
  category: Category;
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLink: (categoryId: string) => void;
}

export function CategoryCard({
  category,
  links,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLink,
}: CategoryCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={cardHover}
      className="bg-[var(--bg-card)] border-2 rounded-xl overflow-hidden"
      style={{
        borderColor: category.color,
        boxShadow: `4px 4px 0px ${category.color}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: category.color,
          borderBottom: '2px solid var(--border-color)',
        }}
      >
        <span className="font-extrabold text-[#222] text-sm">
          {category.emoji} {category.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#222] opacity-60">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
          <button
            onClick={() => onEditCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Edit category"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="p-3">
        {links.length === 0 ? (
          <motion.p
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-sm text-[var(--text-secondary)] py-4"
          >
            No links yet — click + to add
          </motion.p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  accentColor={category.color}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={() => onAddLink(category.id)}
          className="w-full mt-2 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--text-secondary)] hover:border-[var(--border-color)] rounded-lg transition-colors cursor-pointer"
        >
          + Add link
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add CategoryCard with colored header and link list"
```

---

### Task 20: Create CategoryGrid component

**Files:** Create `src/features/link-directory/CategoryGrid.tsx`

- [ ] **Step 1:** Create `src/features/link-directory/CategoryGrid.tsx`

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '@/animations/variants';
import { CategoryCard } from './CategoryCard';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface CategoryGridProps {
  results: FilteredResult[];
  searchQuery: string;
  onClearSearch: () => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLinkToCategory: (categoryId: string) => void;
  onAddCategory: () => void;
}

export function CategoryGrid({
  results,
  searchQuery,
  onClearSearch,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onAddCategory,
}: CategoryGridProps) {
  if (results.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-bold text-[var(--text-secondary)]">
          No links match &ldquo;{searchQuery}&rdquo;
        </p>
        <button
          onClick={onClearSearch}
          className="mt-4 text-sm font-bold text-[#78d6ff] hover:underline cursor-pointer"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-bold text-[var(--text-secondary)]">No categories yet</p>
        <button
          onClick={onAddCategory}
          className="mt-4 text-sm font-bold text-[#a8ff78] hover:underline cursor-pointer"
        >
          Create your first category
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <AnimatePresence mode="popLayout">
        {results.map((result) => (
          <CategoryCard
            key={result.category.id}
            category={result.category}
            links={result.links}
            onEditLink={onEditLink}
            onDeleteLink={onDeleteLink}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddLink={onAddLinkToCategory}
          />
        ))}
      </AnimatePresence>

      {!searchQuery && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onAddCategory}
          className="min-h-[140px] border-2 border-dashed border-[var(--text-secondary)] rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)] transition-colors cursor-pointer"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-bold">New Category</span>
        </motion.button>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add CategoryGrid with stagger animation and empty states"
```

---

### Task 21: Create SearchBar component

**Files:** Create `src/features/search/SearchBar.tsx`

- [ ] **Step 1:** Create `src/features/search/SearchBar.tsx`

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 150);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Search links..."
        className="w-40 md:w-60 pl-8 pr-3 py-1.5 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:shadow-[3px_3px_0px_var(--border-color)]"
      />
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add debounced SearchBar component"
```

---

### Task 22: Create HeroSection component

**Files:** Create `src/features/home/HeroSection.tsx`

- [ ] **Step 1:** Create `src/features/home/HeroSection.tsx`

```tsx
'use client';

import { motion } from 'framer-motion';
import { springBouncy } from '@/animations/variants';

export function HeroSection() {
  return (
    <div className="text-center py-8 px-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={springBouncy}
        className="text-4xl mb-3"
      >
        📚
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springBouncy }}
        className="text-2xl md:text-3xl font-black text-[var(--text-primary)]"
      >
        S2 Resource Hub
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-[var(--text-secondary)] mt-2"
      >
        All your Master&apos;s degree resources in one place
      </motion.p>
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add animated HeroSection"
```

---

### Task 23: Create HomePage orchestrator

**Files:** Create `src/features/home/HomePage.tsx`

- [ ] **Step 1:** Create `src/features/home/HomePage.tsx`

```tsx
'use client';

import { useState } from 'react';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from '@/features/link-directory/CategoryGrid';
import { SearchBar } from '@/features/search/SearchBar';
import { AddLinkModal } from '@/features/link-management/AddLinkModal';
import { EditLinkModal } from '@/features/link-management/EditLinkModal';
import { AddCategoryModal } from '@/features/link-management/AddCategoryModal';
import { EditCategoryModal } from '@/features/link-management/EditCategoryModal';
import { DeleteConfirm } from '@/features/link-management/DeleteConfirm';
import { ToastContainer } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useFilteredLinks } from '@/hooks/useFilteredLinks';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import type { Link, Category } from '@/types';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    type: 'link' | 'category';
    id: string;
    name: string;
  } | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>();

  const filteredResults = useFilteredLinks(searchQuery);
  const { deleteLink, deleteCategory, exportData, importData } = useLinkStore();
  const { addToast } = useToastStore();
  const links = useLinkStore((s) => s.links);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 's2-linktree-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully', 'success');
  };

  const handleImport = (mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      const confirmed = window.confirm('This will replace all current data. Are you sure?');
      if (!confirmed) return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          const result = importData(data, mode);
          addToast(
            mode === 'replace'
              ? `Imported ${result.addedCategories} categories, ${result.addedLinks} links`
              : `Added ${result.addedCategories} categories, ${result.addedLinks} links. Skipped ${result.skipped} duplicates.`,
            'success'
          );
        } catch {
          addToast('Invalid backup file', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'link') {
      deleteLink(deletingItem.id);
      addToast('Link deleted', 'success');
    } else {
      deleteCategory(deletingItem.id);
      addToast('Category and its links deleted', 'success');
    }
    setDeletingItem(null);
  };

  const handleAddLinkToCategory = (categoryId: string) => {
    setPreselectedCategoryId(categoryId);
    setIsAddLinkOpen(true);
  };

  const linkCountForCategory = (categoryId: string) =>
    links.filter((l) => l.categoryId === categoryId).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)] border-b-2 border-[var(--border-color)] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-[#a8ff78] text-[#222] font-black text-lg px-3 py-1 border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)]">
              S2
            </div>
            <span className="font-bold text-[var(--text-primary)] hidden sm:block">
              My Academic Hub
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <ThemeToggle />
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] shadow-[2px_2px_0px_var(--border-color)] cursor-pointer">
                ⚙️
              </button>
              <div className="absolute right-0 top-full mt-2 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-lg shadow-[3px_3px_0px_var(--border-color)] p-2 hidden group-hover:block min-w-[160px] z-50">
                <button
                  onClick={handleExport}
                  className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
                >
                  📤 Export Data
                </button>
                <button
                  onClick={() => handleImport('merge')}
                  className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
                >
                  📥 Import (Merge)
                </button>
                <button
                  onClick={() => handleImport('replace')}
                  className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-primary)]"
                >
                  🔄 Import (Replace)
                </button>
              </div>
            </div>
            <Button onClick={() => setIsAddLinkOpen(true)} size="sm">
              + Add Link
            </Button>
          </div>
        </div>
      </header>

      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <CategoryGrid
          results={filteredResults}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onEditLink={setEditingLink}
          onDeleteLink={(link) =>
            setDeletingItem({ type: 'link', id: link.id, name: link.title })
          }
          onEditCategory={setEditingCategory}
          onDeleteCategory={(cat) =>
            setDeletingItem({ type: 'category', id: cat.id, name: cat.name })
          }
          onAddLinkToCategory={handleAddLinkToCategory}
          onAddCategory={() => setIsAddCategoryOpen(true)}
        />
      </main>

      {/* Modals */}
      <AddLinkModal
        isOpen={isAddLinkOpen}
        onClose={() => {
          setIsAddLinkOpen(false);
          setPreselectedCategoryId(undefined);
        }}
        preselectedCategoryId={preselectedCategoryId}
      />
      {editingLink && (
        <EditLinkModal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          link={editingLink}
        />
      )}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />
      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
        />
      )}
      {deletingItem && (
        <DeleteConfirm
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
          itemName={deletingItem.name}
          itemType={deletingItem.type}
          linkCount={
            deletingItem.type === 'category'
              ? linkCountForCategory(deletingItem.id)
              : 0
          }
        />
      )}

      <ToastContainer />
    </div>
  );
}
```

**Note:** This imports management modals (AddLinkModal, EditLinkModal, etc.) which are built in Chunk 4. This file will have import errors until those are created. That's expected — Chunk 4 must follow immediately.

- [ ] **Step 2:** Commit (with `--no-verify` if linter errors on missing imports)

```bash
git add -A && git commit -m "feat: add HomePage orchestrator with all modal state management"
```

---

### Task 24: Wire page.tsx

**Files:** Replace `src/app/page.tsx`

- [ ] **Step 1:** Replace `src/app/page.tsx` with:

```tsx
import { HomePage } from '@/features/home/HomePage';

export default function Page() {
  return <HomePage />;
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: wire page.tsx to render HomePage"
```
