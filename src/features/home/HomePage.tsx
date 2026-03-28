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
  const [deletingItem, setDeletingItem] = useState<{
    type: 'link' | 'category';
    id: string;
    name: string;
  } | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>();

  const filteredResults = useFilteredLinks(searchQuery);
  const deleteLink = useLinkStore((s) => s.deleteLink);
  const deleteCategory = useLinkStore((s) => s.deleteCategory);
  const { addToast } = useToastStore();
  const links = useLinkStore((s) => s.links);
  const categories = useLinkStore((s) => s.categories);

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
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <ThemeToggle />
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
    </>
  );
}
