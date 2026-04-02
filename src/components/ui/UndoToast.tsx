'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface UndoToastProps {
  message: string;
  duration: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, duration, onUndo, onDismiss }: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          if (!dismissedRef.current) {
            dismissedRef.current = true;
            setTimeout(() => onDismiss(), 0);
          }
          return 0;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-[3px_3px_0px_var(--border-color)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--text-primary)]">{message}</span>
        <button
          onClick={() => {
            if (!dismissedRef.current) {
              dismissedRef.current = true;
              onUndo();
              onDismiss();
            }
          }}
          className="shrink-0 rounded-lg border-2 border-[var(--border-color)] bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 active:scale-95"
        >
          Undo
        </button>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--border-color)]/30">
        <div
          data-testid="undo-progress"
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
