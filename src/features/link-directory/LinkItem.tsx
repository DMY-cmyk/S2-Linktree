'use client';

import { motion } from 'framer-motion';
import type { Link } from '@/types';

interface LinkItemProps {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function LinkItem({ link, accentColor, onEdit, onDelete, isDragging = false }: LinkItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
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
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">
          {link.title}
        </span>
        {link.description && (
          <span className="text-xs text-[var(--text-secondary)] truncate block">
            {link.description}
          </span>
        )}
      </a>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <button
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          className="text-xs p-1 hover:bg-[var(--bg-primary)] rounded cursor-pointer"
          title="Delete"
        >
          🗑️
        </button>
      </div>
      <span className="text-[var(--text-secondary)] text-sm ml-1">→</span>
    </motion.div>
  );
}
