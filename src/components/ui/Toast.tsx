'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { UndoToast } from './UndoToast';

const variantStyles = {
  success: 'bg-[var(--success)] text-white border-[var(--border)]',
  warning: 'bg-[color-mix(in_srgb,var(--accent)_20%,var(--surface))] text-[var(--text)] border-[var(--border)]',
  error: 'bg-[var(--danger)] text-white border-[var(--border)]',
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
          <div
            key={toast.id}
            className={cn(
              'fade-up px-4 py-3 border-[1.5px] rounded-[10px] shadow-[3px_3px_0_var(--shadow-color)] font-medium text-sm max-w-sm cursor-pointer',
              variantStyles[toast.variant as keyof typeof variantStyles] || variantStyles.success
            )}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        )
      )}
    </div>
  );
}
