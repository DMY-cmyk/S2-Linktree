'use client';

import { useState, useCallback } from 'react';
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLinkStore } from '@/store/useLinkStore';
import type { Category, Link } from '@/types';

type DragType = 'category' | 'link' | null;

interface DndState {
  activeType: DragType;
  activeCategory: Category | null;
  activeLink: Link | null;
  overCategoryId: string | null;
}

export function useCategoryDnd(categories: Category[], links: Link[]) {
  const reorderCategories = useLinkStore((s) => s.reorderCategories);
  const reorderLinks = useLinkStore((s) => s.reorderLinks);
  const moveLinkToCategory = useLinkStore((s) => s.moveLinkToCategory);

  const [dndState, setDndState] = useState<DndState>({
    activeType: null,
    activeCategory: null,
    activeLink: null,
    overCategoryId: null,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeId = active.id as string;

      const cat = categories.find((c) => c.id === activeId);
      if (cat) {
        setDndState({ activeType: 'category', activeCategory: cat, activeLink: null, overCategoryId: null });
        return;
      }

      const link = links.find((l) => l.id === activeId);
      if (link) {
        setDndState({ activeType: 'link', activeCategory: null, activeLink: link, overCategoryId: null });
        return;
      }
    },
    [categories, links]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over || dndState.activeType !== 'link') {
        setDndState((prev) => ({ ...prev, overCategoryId: null }));
        return;
      }

      const overId = over.id as string;

      const overLink = links.find((l) => l.id === overId);
      if (overLink) {
        setDndState((prev) => ({ ...prev, overCategoryId: overLink.categoryId }));
        return;
      }

      const droppableMatch = overId.match(/^droppable-(.+)$/);
      if (droppableMatch) {
        setDndState((prev) => ({ ...prev, overCategoryId: droppableMatch[1] }));
        return;
      }

      setDndState((prev) => ({ ...prev, overCategoryId: null }));
    },
    [dndState.activeType, links]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        setDndState({ activeType: null, activeCategory: null, activeLink: null, overCategoryId: null });
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      if (dndState.activeType === 'category') {
        if (activeId !== overId) {
          reorderCategories(activeId, overId);
        }
      } else if (dndState.activeType === 'link') {
        const activeLink = links.find((l) => l.id === activeId);
        if (!activeLink) return;

        const overLink = links.find((l) => l.id === overId);
        if (overLink && overLink.categoryId === activeLink.categoryId) {
          reorderLinks(activeLink.categoryId, activeId, overId);
        } else if (overLink && overLink.categoryId !== activeLink.categoryId) {
          const targetLinks = links
            .filter((l) => l.categoryId === overLink.categoryId)
            .sort((a, b) => a.order - b.order);
          const insertIndex = targetLinks.findIndex((l) => l.id === overId);
          moveLinkToCategory(activeId, overLink.categoryId, insertIndex >= 0 ? insertIndex : 0);
        } else {
          const droppableMatch = overId.match(/^droppable-(.+)$/);
          if (droppableMatch) {
            const targetCategoryId = droppableMatch[1];
            if (targetCategoryId !== activeLink.categoryId) {
              const targetLinks = links.filter(
                (l) => l.categoryId === targetCategoryId
              );
              moveLinkToCategory(activeId, targetCategoryId, targetLinks.length);
            }
          }
        }
      }

      setDndState({ activeType: null, activeCategory: null, activeLink: null, overCategoryId: null });
    },
    [dndState.activeType, links, reorderCategories, reorderLinks, moveLinkToCategory]
  );

  const isDragging = dndState.activeType !== null;

  return {
    sensors,
    dndState,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
