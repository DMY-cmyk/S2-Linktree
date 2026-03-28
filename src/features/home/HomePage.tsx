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
