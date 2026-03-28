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
