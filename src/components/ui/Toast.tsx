'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { UndoToast } from './UndoToast';

const variantStyles = {
  success: 'bg-[var(--color-success)] text-[var(--color-on-success)] border-[var(--border-color)]',
  warning: 'bg-[var(--color-warning)] text-[var(--color-on-warning)] border-[var(--border-color)]',
  error: 'bg-[var(--color-danger)] text-[var(--color-on-danger)] border-[var(--border-color)]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const liveRegion = document.getElementById('toast-live-region');
    if (liveRegion && toasts.length > 0) {
      liveRegion.textContent = toasts[toasts.length - 1].message;
    } else if (liveRegion) {
      liveRegion.textContent = '';
    }
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) =>
          toast.variant === 'undo' && toast.undoAction ? (
            <UndoToast
              key={toast.id}
              message={toast.message}
              duration={toast.duration ?? 5000}
              onUndo={toast.undoAction}
              onDismiss={() => removeToast(toast.id)}
            />
          ) : (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'px-4 py-3 border-2 rounded-lg shadow-[3px_3px_0px_var(--border-color)] font-bold text-sm max-w-sm cursor-pointer',
                variantStyles[toast.variant as keyof typeof variantStyles] || variantStyles.success
              )}
              onClick={() => removeToast(toast.id)}
            >
              {toast.message}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
