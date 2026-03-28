'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Link } from '@/types';

interface SortableLinkItemProps {
  link: Link;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    isDragging: boolean;
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  }) => React.ReactNode;
}

export function SortableLinkItem({ link, children }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return <>{children({ setNodeRef, style, isDragging, listeners, attributes })}</>;
}
