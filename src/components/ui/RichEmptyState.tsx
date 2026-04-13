import { motion } from 'framer-motion';

interface RichEmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function RichEmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: RichEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <span className="text-5xl mb-3" role="img" aria-label={emoji}>{emoji}</span>
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-xs">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg border-2 border-[var(--border-color)] bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
