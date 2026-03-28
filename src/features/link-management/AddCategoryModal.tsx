'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { CATEGORY_COLORS } from '@/lib/constants';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const categories = useLinkStore((s) => s.categories);
  const addCategory = useLinkStore((s) => s.addCategory);
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📁');
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addCategory({
      name: name.trim(),
      emoji,
      color,
      order: categories.length,
    });
    addToast('Category created!', 'success');
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setEmoji('📁');
    setColor(CATEGORY_COLORS[0]);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Research Papers"
          error={errors.name}
        />
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">Emoji</label>
          <EmojiPicker selected={emoji} onSelect={setEmoji} />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-lg border-2 transition-transform cursor-pointer"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? 'var(--border-color)' : 'transparent',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
}
