'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { CATEGORY_COLORS } from '@/lib/constants';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import type { Category } from '@/types';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const updateCategory = useLinkStore((s) => s.updateCategory);
  const { addToast } = useToastStore();

  const [name, setName] = useState(category.name);
  const [emoji, setEmoji] = useState(category.emoji);
  const [color, setColor] = useState<string>(category.color);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(category.name);
    setEmoji(category.emoji);
    setColor(category.color);
    setErrors({});
  }, [category]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    updateCategory(category.id, {
      name: name.trim(),
      emoji,
      color,
    });
    addToast('Category updated', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          error={errors.name}
          autoFocus
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
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className="w-8 h-8 rounded-lg border-2 transition-transform cursor-pointer"
                style={{
                  backgroundColor: c.hex,
                  borderColor: color === c.hex ? 'var(--border-color)' : 'transparent',
                  transform: color === c.hex ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
