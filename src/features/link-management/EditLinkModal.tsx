'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import { isValidUrl } from '@/lib/utils';
import type { Link } from '@/types';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: Link;
}

export function EditLinkModal({ isOpen, onClose, link }: EditLinkModalProps) {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);
  const updateLink = useLinkStore((s) => s.updateLink);
  const { addToast } = useToastStore();

  // Lazy-init from prop. Parent (HomePage) renders with key={link.id}
  // so this component remounts (fresh state) when editing a different link.
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [description, setDescription] = useState(link.description ?? '');
  const [categoryId, setCategoryId] = useState(link.categoryId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [urlError, setUrlError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!url.trim()) errs.url = 'URL is required';
    else {
      try {
        new URL(url);
      } catch {
        errs.url = 'Please enter a valid URL (e.g. https://example.com)';
      }
    }
    if (!categoryId) errs.categoryId = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isValidUrl(url)) {
      setUrlError('Please enter a valid URL (e.g. https://example.com)');
      return;
    }
    if (!validate()) return;

    // Check for duplicate URL in same category (skip self)
    const duplicate = links.some(
      (l) => l.id !== link.id && l.categoryId === categoryId && l.url.toLowerCase() === url.trim().toLowerCase()
    );
    if (duplicate) {
      const catName = categories.find((c) => c.id === categoryId)?.name ?? 'this category';
      addToast(`This URL already exists in ${catName}`, 'warning');
      return;
    }

    updateLink(link.id, {
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      categoryId,
    });
    addToast('Link updated', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Link title"
          error={errors.title}
          autoFocus
        />
        <Input
          label="URL"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
          onBlur={() => {
            if (url && !isValidUrl(url)) setUrlError('Please enter a valid URL (e.g. https://example.com)');
          }}
          placeholder="https://example.com"
          error={urlError || errors.url}
        />
        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Quick note"
        />
        <div>
          <label className="mono" style={{ display: 'block', fontSize: 10, fontWeight: 500, marginBottom: 6, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              width: '100%', height: 36, padding: '0 12px',
              background: 'var(--surface)', color: 'var(--text)',
              border: '1.5px solid var(--border-soft)', borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit',
            }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p style={{ fontSize: 12, fontWeight: 500, marginTop: 4, color: 'var(--danger)' }}>{errors.categoryId}</p>
          )}
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
