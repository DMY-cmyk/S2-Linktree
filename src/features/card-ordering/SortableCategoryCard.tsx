'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '@/types';

interface SortableCategoryCardProps {
  category: Category;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  }) => React.ReactNode;
}

export function SortableCategoryCard({ category, children }: SortableCategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return <>{children({ setNodeRef, style, isDragging, listeners, attributes })}</>;
}
