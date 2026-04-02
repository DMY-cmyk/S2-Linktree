'use client';

import {
  DndContext,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '@/animations/variants';
import { SortableCategoryCard } from './SortableCategoryCard';
import { SortableLinkList } from './SortableLinkList';
import { DragOverlayContent } from './DragOverlayContent';
import { CategoryCard } from '@/features/link-directory/CategoryCard';
import { useCategoryDnd } from './useCategoryDnd';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface SortableCategoryGridProps {
  results: FilteredResult[];
  allLinks: Link[];
  allCategories: Category[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLinkToCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  searchQuery: string;
}

export function SortableCategoryGrid({
  results,
  allLinks,
  allCategories,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLinkToCategory,
  onAddCategory,
  searchQuery,
}: SortableCategoryGridProps) {
  const {
    sensors,
    dndState,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useCategoryDnd(allCategories, allLinks);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={results.map((r) => r.category.id)}
        strategy={rectSortingStrategy}
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {results.map((result) => (
              <SortableCategoryCard key={result.category.id} category={result.category}>
                {({ setNodeRef, style, isDragging: isCatDragging, listeners, attributes }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={
                      dndState.activeType === 'link' && dndState.overCategoryId === result.category.id
                        ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 rounded-xl transition-shadow'
                        : 'transition-shadow'
                    }
                  >
                    <CategoryCard
                      category={result.category}
                      links={result.links}
                      searchQuery={searchQuery}
                      onEditLink={onEditLink}
                      onDeleteLink={onDeleteLink}
                      onEditCategory={onEditCategory}
                      onDeleteCategory={onDeleteCategory}
                      onAddLink={onAddLinkToCategory}
                      isDragging={isDragging || isCatDragging}
                      dragHandleProps={{ listeners, attributes }}
                      renderLinks={(links, accentColor) => (
                        <SortableLinkList
                          links={links}
                          categoryId={result.category.id}
                          accentColor={accentColor}
                          isDragging={isDragging}
                          onEditLink={onEditLink}
                          onDeleteLink={onDeleteLink}
                          searchQuery={searchQuery}
                        />
                      )}
                    />
                  </div>
                )}
              </SortableCategoryCard>
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
      </SortableContext>

      <DragOverlay>
        {dndState.activeType === 'category' && dndState.activeCategory && (
          <DragOverlayContent type="category" category={dndState.activeCategory} />
        )}
        {dndState.activeType === 'link' && dndState.activeLink && (
          <DragOverlayContent type="link" link={dndState.activeLink} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
