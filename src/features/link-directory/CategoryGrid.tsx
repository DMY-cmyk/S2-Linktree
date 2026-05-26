'use client';

import { SortableCategoryGrid } from '@/features/card-ordering/SortableCategoryGrid';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { RichEmptyState } from '@/components/ui/RichEmptyState';
import type { SortMode } from '@/features/link-directory/FilterStrip';
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
  loading?: boolean;
  sort?: SortMode;
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
  loading,
  sort,
}: CategoryGridProps) {
  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && searchQuery) {
    return (
      <RichEmptyState
        emoji="🔍"
        title="No results found"
        description={`No links or categories match "${searchQuery}"`}
        actionLabel="Clear search"
        onAction={onClearSearch}
      />
    );
  }

  if (results.length === 0) {
    return (
      <RichEmptyState
        emoji="📚"
        title="No categories yet"
        description="Create your first category to start organizing your links"
        actionLabel="Create Category"
        onAction={onAddCategory}
      />
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
      sort={sort}
    />
  );
}
