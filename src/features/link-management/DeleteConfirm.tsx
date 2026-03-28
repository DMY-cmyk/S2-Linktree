'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'link' | 'category';
  linkCount?: number;
}

export function DeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  linkCount = 0,
}: DeleteConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}?`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--text-primary)]">
          Are you sure you want to delete <strong>&ldquo;{itemName}&rdquo;</strong>?
        </p>
        {itemType === 'category' && linkCount > 0 && (
          <p className="text-sm font-bold text-red-500">
            ⚠️ This will also delete {linkCount} {linkCount === 1 ? 'link' : 'links'} inside it.
          </p>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="!bg-red-500 !text-white !shadow-[3px_3px_0px_var(--border-color)] hover:!translate-x-[1px] hover:!translate-y-[1px] hover:!shadow-[2px_2px_0px_var(--border-color)]"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
