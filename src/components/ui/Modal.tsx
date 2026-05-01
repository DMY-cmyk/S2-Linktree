'use client';

import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

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

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto max-w-md w-full outline-none"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      {isOpen && (
        <div
          className="fade-up"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 14,
            boxShadow: '6px 6px 0 var(--shadow-color)',
            padding: 24,
            maxHeight: '85vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
              }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              style={{
                width: 28,
                height: 28,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--text-3)',
                cursor: 'pointer',
              }}
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
