'use client';

import { useState, useEffect } from 'react';
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

  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [description, setDescription] = useState(link.description ?? '');
  const [categoryId, setCategoryId] = useState(link.categoryId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description ?? '');
    setCategoryId(link.categoryId);
    setErrors({});
    setUrlError('');
  }, [link]);

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
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] focus:shadow-[3px_3px_0px_var(--border-color)]"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
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
