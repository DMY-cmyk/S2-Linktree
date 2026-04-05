'use client';

import { useState, useRef, useCallback } from 'react';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from '@/features/link-directory/CategoryGrid';
import { SearchBar } from '@/features/search/SearchBar';
import type { SearchBarRef } from '@/features/search/SearchBar';
import { AddLinkModal } from '@/features/link-management/AddLinkModal';
import { EditLinkModal } from '@/features/link-management/EditLinkModal';
import { AddCategoryModal } from '@/features/link-management/AddCategoryModal';
import { EditCategoryModal } from '@/features/link-management/EditCategoryModal';
import { ToastContainer } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useFilteredLinks } from '@/hooks/useFilteredLinks';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { generateConstantsSource } from '@/lib/exportToCode';
import type { Link, Category } from '@/types';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(
  () => import('@/features/background-effects/AnimatedBackground').then((mod) => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>();
  const searchBarRef = useRef<SearchBarRef>(null);

  const filteredResults = useFilteredLinks(searchQuery);
  const deleteLink = useLinkStore((s) => s.deleteLink);
  const deleteCategory = useLinkStore((s) => s.deleteCategory);
  const getSnapshot = useLinkStore((s) => s.getSnapshot);
  const restoreSnapshot = useLinkStore((s) => s.restoreSnapshot);
  const { addToast } = useToastStore();
  const links = useLinkStore((s) => s.links);
  const categories = useLinkStore((s) => s.categories);

  const handleDeleteLink = useCallback((link: Link) => {
    const snapshot = getSnapshot();
    deleteLink(link.id);
    addToast(`"${link.title}" deleted`, 'undo', {
      undoAction: () => restoreSnapshot(snapshot),
      duration: 5000,
    });
  }, [getSnapshot, deleteLink, addToast, restoreSnapshot]);

  const handleDeleteCategory = useCallback((cat: Category) => {
    const catLinks = links.filter((l) => l.categoryId === cat.id);
    const snapshot = getSnapshot();
    deleteCategory(cat.id);
    addToast(
      `"${cat.name}" and ${catLinks.length} link${catLinks.length !== 1 ? 's' : ''} deleted`,
      'undo',
      { undoAction: () => restoreSnapshot(snapshot), duration: 5000 },
    );
  }, [links, getSnapshot, deleteCategory, addToast, restoreSnapshot]);

  const handleAddLinkToCategory = (categoryId: string) => {
    setPreselectedCategoryId(categoryId);
    setIsAddLinkOpen(true);
  };

  const handleExportToCode = useCallback(async () => {
    try {
      const source = generateConstantsSource(categories, links);
      await navigator.clipboard.writeText(source);
      addToast('Copied to clipboard — paste into src/lib/constants.ts', 'success');
    } catch {
      addToast('Failed to copy — check browser clipboard permissions', 'error');
    }
  }, [categories, links, addToast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'n': () => setIsAddLinkOpen(true),
    'c': () => setIsAddCategoryOpen(true),
    '/': () => searchBarRef.current?.focus(),
  });

  return (
    <>
      <AnimatedBackground />
      <div className="content-layer min-h-screen">
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
            <SearchBar ref={searchBarRef} value={searchQuery} onChange={setSearchQuery} />
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={handleExportToCode}>
              Export to Code
            </Button>
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
          allLinks={links}
          allCategories={categories}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onEditLink={setEditingLink}
          onDeleteLink={handleDeleteLink}
          onEditCategory={setEditingCategory}
          onDeleteCategory={handleDeleteCategory}
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

      <ToastContainer />
    </div>
    </>
  );
}
