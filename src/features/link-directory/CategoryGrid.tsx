'use client';

import { SortableCategoryGrid } from '@/features/card-ordering/SortableCategoryGrid';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface CategoryGridProps {
  results: FilteredResult[];
  allLinks: Link[];
  allCategories: Category[];
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
  allLinks,
  allCategories,
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
    <SortableCategoryGrid
      results={results}
      allLinks={allLinks}
      allCategories={allCategories}
      onEditLink={onEditLink}
      onDeleteLink={onDeleteLink}
      onEditCategory={onEditCategory}
      onDeleteCategory={onDeleteCategory}
      onAddLinkToCategory={onAddLinkToCategory}
      onAddCategory={onAddCategory}
      searchQuery={searchQuery}
    />
  );
}
