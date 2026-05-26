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
import { SortableCategoryCard } from './SortableCategoryCard';
import { SortableLinkList } from './SortableLinkList';
import { DragOverlayContent } from './DragOverlayContent';
import { CategoryCard } from '@/features/link-directory/CategoryCard';
import { GroupHeader } from '@/features/link-directory/GroupHeader';
import { useCategoryDnd } from './useCategoryDnd';
import { groupByTag } from '@/hooks/useTagGroups';
import type { SortMode } from '@/features/link-directory/FilterStrip';
import type { Category, Link } from '@/types';
import type { FilteredResult } from '@/hooks/useFilteredLinks';

interface Props {
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
  sort?: SortMode;
}

export function SortableCategoryGrid({
  results, allLinks, allCategories,
  onEditLink, onDeleteLink, onEditCategory, onDeleteCategory,
  onAddLinkToCategory, onAddCategory, searchQuery, sort = 'order',
}: Props) {
  const { sensors, dndState, isDragging, handleDragStart, handleDragOver, handleDragEnd } =
    useCategoryDnd(allCategories, allLinks);

  // Build tag groups from the visible (filtered) results, then apply the chosen
  // sort within each group. 'order'/'recent' keep the custom (drag) order;
  // 'alpha' sorts by name.
  const groups = groupByTag(results.map((r) => r.category)).map((g) =>
    sort === 'alpha'
      ? { ...g, items: [...g.items].sort((a, b) => a.name.localeCompare(b.name)) }
      : g,
  );
  const linksByCat = new Map(results.map((r) => [r.category.id, r.links] as const));
  const sortableIds = groups.flatMap((g) => g.items.map((c) => c.id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        {groups.map((g, gi) => (
          <section key={g.tag} style={{ marginBottom: 8 }}>
            <GroupHeader title={g.tag} count={g.items.length} index={gi + 1} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 18, paddingTop: 12,
            }}>
              {g.items.map((cat, idx) => (
                <SortableCategoryCard key={cat.id} category={cat}>
                  {({ setNodeRef, style, isDragging: isCatDragging, listeners, attributes }) => (
                    <div
                      ref={setNodeRef}
                      style={style}
                      className={
                        dndState.activeType === 'link' && dndState.overCategoryId === cat.id
                          ? 'ring-2 ring-[var(--accent)] ring-offset-2 rounded-xl transition-shadow'
                          : 'transition-shadow'
                      }
                    >
                      <CategoryCard
                        category={cat}
                        links={linksByCat.get(cat.id) ?? []}
                        searchQuery={searchQuery}
                        index={idx}
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
                            categoryId={cat.id}
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
            </div>
          </section>
        ))}

        {!searchQuery && (
          <button
            type="button"
            onClick={onAddCategory}
            style={{
              marginTop: 24,
              minHeight: 80,
              width: '100%',
              border: '1.5px dashed var(--border-soft)',
              borderRadius: 10,
              background: 'transparent',
              color: 'var(--text-3)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <span>+</span>
            <span>New category</span>
          </button>
        )}
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
