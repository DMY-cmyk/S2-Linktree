'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { CategoryGrid } from '@/features/link-directory/CategoryGrid';
import type { SearchBarRef } from '@/features/search/SearchBar';
import { AddLinkModal } from '@/features/link-management/AddLinkModal';
import { EditLinkModal } from '@/features/link-management/EditLinkModal';
import { AddCategoryModal } from '@/features/link-management/AddCategoryModal';
import { EditCategoryModal } from '@/features/link-management/EditCategoryModal';
import { ToastContainer } from '@/components/ui/Toast';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { CssOrbs } from '@/features/background-effects/CssOrbs';
import { FilterStrip, type SortMode } from '@/features/link-directory/FilterStrip';
import { TweaksEffects } from '@/features/tweaks/TweaksEffects';
import { TweaksPanel } from '@/features/tweaks/TweaksPanel';
import { useFilteredLinks } from '@/hooks/useFilteredLinks';
import { useTagFilter } from '@/hooks/useTagFilter';
import { useHydrated } from '@/hooks/useHydrated';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import { useTweaksStore } from '@/store/useTweaksStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Link, Category } from '@/types';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>();
  const [sort, setSort] = useState<SortMode>('order');
  const searchBarRef = useRef<SearchBarRef>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const hydrated = useHydrated();
  const filterVisible = useTweaksStore((s) => s.filterVisible);
  const { activeTags } = useTagFilter();

  const filteredResults = useFilteredLinks(searchQuery);
  // Tag filtering happens here so the inline FilterStrip actually narrows the
  // grid (search filtering already lives in useFilteredLinks).
  const visibleResults =
    activeTags.size === 0
      ? filteredResults
      : filteredResults.filter((r) => activeTags.has(r.category.tag));
  const deleteLink = useLinkStore((s) => s.deleteLink);
  const deleteCategory = useLinkStore((s) => s.deleteCategory);
  const getSnapshot = useLinkStore((s) => s.getSnapshot);
  const restoreSnapshot = useLinkStore((s) => s.restoreSnapshot);
  const { addToast } = useToastStore();
  const links = useLinkStore((s) => s.links);
  const categories = useLinkStore((s) => s.categories);

  // Sync theme state with data-theme attribute (set by ThemeToggle)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const read = () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    };
    read();
    const ob = new MutationObserver(read);
    ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => ob.disconnect();
  }, []);

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

  useKeyboardShortcuts({
    'mod+k': () => searchBarRef.current?.focus(),
    e: () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return;
      const cardEl = el.closest('[data-card-id]') as HTMLElement | null;
      const linkEl = el.closest('[data-link-id]') as HTMLElement | null;
      if (cardEl?.dataset.cardId) {
        const cat = categories.find((c) => c.id === cardEl.dataset.cardId);
        if (cat) setEditingCategory(cat);
      } else if (linkEl?.dataset.linkId) {
        const lnk = links.find((l) => l.id === linkEl.dataset.linkId);
        if (lnk) setEditingLink(lnk);
      }
    },
    d: () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return;
      const cardEl = el.closest('[data-card-id]') as HTMLElement | null;
      const linkEl = el.closest('[data-link-id]') as HTMLElement | null;
      if (cardEl?.dataset.cardId) {
        const cat = categories.find((c) => c.id === cardEl.dataset.cardId);
        if (cat) handleDeleteCategory(cat);
      } else if (linkEl?.dataset.linkId) {
        const lnk = links.find((l) => l.id === linkEl.dataset.linkId);
        if (lnk) handleDeleteLink(lnk);
      }
    },
  });

  return (
    <>
      <CssOrbs theme={theme} />
      <TweaksEffects />
      <div className="content-wrapper" style={{ minHeight: '100vh' }}>
        <Header
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onAddLink={() => setIsAddLinkOpen(true)}
          searchInputRef={searchBarRef}
        />
        <main style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 36px' }}>
          <HeroSection />
          <FilterStrip visible={!hydrated || filterVisible} sort={sort} onSort={setSort} />
          <CategoryGrid
            results={visibleResults}
            allLinks={links}
            allCategories={categories}
            searchQuery={searchQuery}
            sort={sort}
            onClearSearch={() => setSearchQuery('')}
            onEditLink={setEditingLink}
            onDeleteLink={handleDeleteLink}
            onEditCategory={setEditingCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddLinkToCategory={handleAddLinkToCategory}
            onAddCategory={() => setIsAddCategoryOpen(true)}
          />
        </main>
        <Footer />

        <AddLinkModal
          key={`add-link-${preselectedCategoryId ?? 'none'}`}
          isOpen={isAddLinkOpen}
          onClose={() => {
            setIsAddLinkOpen(false);
            setPreselectedCategoryId(undefined);
          }}
          preselectedCategoryId={preselectedCategoryId}
        />
        {editingLink && (
          <EditLinkModal
            key={editingLink.id}
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
            key={editingCategory.id}
            isOpen={!!editingCategory}
            onClose={() => setEditingCategory(null)}
            category={editingCategory}
          />
        )}

        <ToastContainer />
        <TweaksPanel />
      </div>
    </>
  );
}
