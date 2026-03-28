'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { staggerItem, cardHover } from '@/animations/variants';
import { LinkItem } from './LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Category, Link } from '@/types';

interface CategoryCardProps {
  category: Category;
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLink: (categoryId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: {
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  };
  renderLinks?: (links: Link[], accentColor: string) => React.ReactNode;
}

export function CategoryCard({
  category,
  links,
  onEditLink,
  onDeleteLink,
  onEditCategory,
  onDeleteCategory,
  onAddLink,
  isDragging = false,
  dragHandleProps,
  renderLinks,
}: CategoryCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={isDragging ? undefined : cardHover}
      className="bg-[var(--bg-card)] border-2 rounded-xl overflow-hidden"
      style={{
        borderColor: category.color,
        boxShadow: `4px 4px 0px ${category.color}`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: category.color,
          borderBottom: '2px solid var(--border-color)',
        }}
      >
        <div className="flex items-center gap-1">
          {dragHandleProps && (
            <DragHandle
              listeners={dragHandleProps.listeners}
              attributes={dragHandleProps.attributes}
            />
          )}
          <span className="font-extrabold text-[#222] text-sm">
            {category.emoji} {category.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#222] opacity-60">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
          <button
            onClick={() => onEditCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Edit category"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteCategory(category)}
            className="text-[#222] opacity-60 hover:opacity-100 text-xs cursor-pointer"
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="p-3">
        {links.length === 0 ? (
          <motion.p
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-sm text-[var(--text-secondary)] py-4"
          >
            No links yet — click + to add
          </motion.p>
        ) : renderLinks ? (
          renderLinks(links, category.color)
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  accentColor={category.color}
                  onEdit={() => onEditLink(link)}
                  onDelete={() => onDeleteLink(link)}
                  isDragging={isDragging}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={() => onAddLink(category.id)}
          className="w-full mt-2 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-2 border-dashed border-[var(--text-secondary)] hover:border-[var(--border-color)] rounded-lg transition-colors cursor-pointer"
        >
          + Add link
        </button>
      </div>
    </motion.div>
  );
}
