'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { modalContent, reducedModalContent } from '@/animations/variants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    triggerRef.current?.focus();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [handleClose]);

  const contentVariants = shouldReduceMotion ? reducedModalContent : modalContent;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto max-w-md w-full outline-none"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...contentVariants}
            className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-xl shadow-[6px_6px_0px_var(--border-color)] p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="modal-title" className="text-lg font-extrabold text-[var(--text-primary)]">{title}</h2>
              <button
                onClick={handleClose}
                aria-label="Close dialog"
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer rounded-lg"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
