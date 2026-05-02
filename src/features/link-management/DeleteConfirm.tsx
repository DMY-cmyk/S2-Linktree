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
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>
          Are you sure you want to delete <strong>&ldquo;{itemName}&rdquo;</strong>?
        </p>
        {itemType === 'category' && linkCount > 0 && (
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>
            ⚠️ This will also delete {linkCount} {linkCount === 1 ? 'link' : 'links'} inside it.
          </p>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
