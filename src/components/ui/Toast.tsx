'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

const variantStyles = {
  success: 'bg-[#a8ff78] text-[#222] border-[#222]',
  warning: 'bg-[#ffd078] text-[#222] border-[#222]',
  error: 'bg-[#ff6b6b] text-white border-[#222]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'px-4 py-3 border-2 rounded-lg shadow-[3px_3px_0px_var(--border-color)] font-bold text-sm max-w-sm cursor-pointer',
              variantStyles[toast.variant]
            )}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
