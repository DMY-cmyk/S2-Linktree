'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import { extractTitleFromUrl, isValidUrl } from '@/lib/utils';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategoryId?: string;
}

export function AddLinkModal({ isOpen, onClose, preselectedCategoryId }: AddLinkModalProps) {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);
  const addLink = useLinkStore((s) => s.addLink);
  const { addToast } = useToastStore();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(preselectedCategoryId ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [titleTouched, setTitleTouched] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Title is auto-suggested inline from URL onChange when not manually edited.
  // Preselected category is initialized once via useState; parent uses
  // key={preselectedCategoryId} to remount when preselected changes.

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required (e.g. TOEFL Practice Test #3)';
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

    // Check for duplicate URL in same category
    const duplicate = links.some(
      (l) => l.categoryId === categoryId && l.url.toLowerCase() === url.trim().toLowerCase()
    );
    if (duplicate) {
      const catName = categories.find((c) => c.id === categoryId)?.name ?? 'this category';
      addToast(`This URL already exists in ${catName}`, 'warning');
      return;
    }

    const order = links.filter((l) => l.categoryId === categoryId).length;
    addLink({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      categoryId,
      order,
    });
    addToast('Link added!', 'success');
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setCategoryId(preselectedCategoryId ?? '');
    setErrors({});
    setTitleTouched(false);
    setUrlError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Link">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => { setTitleTouched(true); setTitle(e.target.value); }}
          placeholder="e.g. TOEFL Practice Test #3"
          error={errors.title}
          autoFocus
        />
        <Input
          label="URL"
          value={url}
          onChange={(e) => {
            const next = e.target.value;
            setUrl(next);
            setUrlError('');
            if (!titleTouched && next.trim()) {
              const suggested = extractTitleFromUrl(next.trim());
              if (suggested) setTitle(suggested);
            }
          }}
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
          placeholder="Quick note about this link"
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
            <option value="">Select a category...</option>
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
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Link</Button>
        </div>
      </form>
    </Modal>
  );
}
