'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { UndoToast } from './UndoToast';

const variantStyles = {
  success: 'bg-[#a8ff78] text-[#222] border-[var(--border-color)]',
  warning: 'bg-[#ffd078] text-[#222] border-[var(--border-color)]',
  error: 'bg-[#ff6b6b] text-white border-[var(--border-color)]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

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
