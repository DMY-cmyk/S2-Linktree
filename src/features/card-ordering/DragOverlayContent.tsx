'use client';

import { motion } from 'framer-motion';
import { DRAG_CARD_LIFT, DRAG_LINK_LIFT, DRAG_TRANSITION } from '@/animations/drag-presets';
import type { Category, Link } from '@/types';

interface DragOverlayContentProps {
  type: 'category' | 'link';
  category?: Category;
  link?: Link;
}

export function DragOverlayContent({ type, category, link }: DragOverlayContentProps) {
  if (type === 'category' && category) {
    return (
      <motion.div
        initial={false}
        animate={DRAG_CARD_LIFT}
        transition={DRAG_TRANSITION}
        className="bg-[var(--bg-card)] border-2 rounded-xl px-4 py-3 w-64"
        style={{
          borderColor: category.color,
          boxShadow: `6px 6px 0px ${category.color}`,
        }}
      >
        <span className="font-extrabold text-[var(--text-primary)] text-sm">
          {category.emoji} {category.name}
        </span>
      </motion.div>
    );
  }

  if (type === 'link' && link) {
    return (
      <motion.div
        initial={false}
        animate={DRAG_LINK_LIFT}
        transition={DRAG_TRANSITION}
        className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-lg px-3 py-2 w-56"
        style={{
          boxShadow: '3px 3px 0px var(--border-color)',
        }}
      >
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">
          {link.title}
        </span>
      </motion.div>
    );
  }

  return null;
}
