import { create } from 'zustand';
import type { Toast } from '@/types';
import { generateId } from '@/lib/utils';

interface AddToastOptions {
  undoAction?: () => void;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, variant: Toast['variant'], options?: AddToastOptions) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, variant, options) => {
    const id = generateId();
    const duration = options?.duration ?? 4000;
    const toast: Toast = {
      id,
      message,
      variant,
      undoAction: options?.undoAction,
      duration,
    };
    set((state) => {
      const updated = [...state.toasts, toast];
      if (updated.length > 3) {
        return { toasts: updated.slice(updated.length - 3) };
      }
      return { toasts: updated };
    });
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
