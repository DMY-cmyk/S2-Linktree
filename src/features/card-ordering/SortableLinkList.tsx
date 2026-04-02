'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableLinkItem } from './SortableLinkItem';
import { LinkItem } from '@/features/link-directory/LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Link } from '@/types';

interface SortableLinkListProps {
  links: Link[];
  categoryId: string;
  accentColor: string;
  isDragging: boolean;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  searchQuery?: string;
}

export function SortableLinkList({
  links,
  categoryId,
  accentColor,
  isDragging,
  onEditLink,
  onDeleteLink,
  searchQuery,
}: SortableLinkListProps) {
  const { setNodeRef } = useDroppable({ id: `droppable-${categoryId}` });

  return (
    <SortableContext
      items={links.map((l) => l.id)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="flex flex-col gap-2">
        {links.map((link, index) => (
          <SortableLinkItem key={link.id} link={link}>
            {({ setNodeRef: itemRef, style, isDragging: isItemDragging, listeners, attributes }) => (
              <div ref={itemRef} style={style} className="flex items-center gap-1">
                <DragHandle listeners={listeners} attributes={attributes} />
                <div className="flex-1">
                  <LinkItem
                    link={link}
                    accentColor={accentColor}
                    onEdit={() => onEditLink(link)}
                    onDelete={() => onDeleteLink(link)}
                    isDragging={isDragging || isItemDragging}
                    searchQuery={searchQuery}
                    index={index}
                  />
                </div>
              </div>
            )}
          </SortableLinkItem>
        ))}
      </div>
    </SortableContext>
  );
}
