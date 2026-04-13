'use client';

import { motion } from 'framer-motion';
import { Pencil, Trash2, ArrowRight } from 'lucide-react';
import { staggerItemCapped, popOut } from '@/animations/variants';
import { LinkFavicon } from '@/components/ui/LinkFavicon';
import { HighlightText } from '@/components/ui/HighlightText';
import type { Link } from '@/types';

interface LinkItemProps {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  searchQuery?: string;
  index?: number;
}

export function LinkItem({ link, accentColor, onEdit, onDelete, isDragging = false, searchQuery, index = 0 }: LinkItemProps) {
  const stagger = staggerItemCapped(index);
  return (
    <motion.div
      initial={stagger.initial}
      animate={stagger.animate}
      exit={popOut.exit}
      whileHover={isDragging ? undefined : { scale: 1.02 }}
      className="group relative flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-colors"
      style={{
        borderColor: `${accentColor}40`,
        backgroundColor: `${accentColor}10`,
      }}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <span className="flex items-center gap-2">
          <LinkFavicon url={link.url} />
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            <HighlightText text={link.title} query={searchQuery ?? ''} />
          </span>
        </span>
        {link.description && (
          <span className="text-xs text-[var(--text-secondary)] truncate block">
            <HighlightText text={link.description} query={searchQuery ?? ''} />
          </span>
        )}
      </a>
      <div className="flex items-center gap-1 opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity ml-2">
        <button
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-secondary)]"
          aria-label={`Edit ${link.title}`}
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer text-[var(--text-secondary)]"
          aria-label={`Delete ${link.title}`}
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
      <span className="text-[var(--text-secondary)] ml-1"><ArrowRight size={14} strokeWidth={2.5} /></span>
    </motion.div>
  );
}
