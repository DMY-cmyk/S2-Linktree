'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { CATEGORY_COLORS, CATEGORY_TAGS } from '@/lib/constants';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import type { Category, CategoryTag } from '@/types';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const updateCategory = useLinkStore((s) => s.updateCategory);
  const { addToast } = useToastStore();

  // Lazy-init from prop. Parent (HomePage) renders with key={category.id}
  // so this component remounts (fresh state) when editing a different category.
  const [name, setName] = useState(category.name);
  const [emoji, setEmoji] = useState(category.emoji);
  const [color, setColor] = useState<string>(category.color);
  const [tag, setTag] = useState<CategoryTag>(category.tag);
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
    updateCategory(category.id, {
      name: name.trim(),
      emoji,
      color,
      tag,
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
          <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 500, marginBottom: 6, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Emoji</label>
          <EmojiPicker selected={emoji} onSelect={setEmoji} />
        </div>
        <div>
          <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 500, marginBottom: 6, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Color</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className="w-8 h-8 rounded-lg border-2 transition-transform cursor-pointer"
                style={{
                  backgroundColor: c.hex,
                  borderColor: color === c.hex ? 'var(--border)' : 'transparent',
                  transform: color === c.hex ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 500, marginBottom: 6, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tag</label>
          <div role="radiogroup" className="flex flex-wrap gap-2">
            {CATEGORY_TAGS.map((t) => (
              <label key={t} className="inline-flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" name="edit-category-tag" value={t} checked={tag === t}
                  onChange={() => setTag(t)} aria-label={t} />
                {t}
              </label>
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
