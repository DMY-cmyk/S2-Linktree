# Chunk 4: Management Modals & Final Integration

### Task 25: Create AddLinkModal

**Files:** Create `src/features/link-management/AddLinkModal.tsx`

- [ ] **Step 1:** Create `src/features/link-management/AddLinkModal.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
import { extractTitleFromUrl } from '@/lib/utils';

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

  // Auto-suggest title from URL when title hasn't been manually edited
  useEffect(() => {
    if (!titleTouched && url.trim()) {
      const suggested = extractTitleFromUrl(url.trim());
      if (suggested) setTitle(suggested);
    }
  }, [url, titleTouched]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!url.trim()) errs.url = 'URL is required';
    else {
      try {
        new URL(url);
      } catch {
        errs.url = 'Must be a valid URL (include https://)';
      }
    }
    if (!categoryId) errs.categoryId = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        />
        <Input
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          error={errors.url}
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
            className="w-full px-3 py-2 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] focus:outline-none focus:shadow-[3px_3px_0px_var(--border-color)]"
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add AddLinkModal with validation"
```

---

### Task 26: Create EditLinkModal

**Files:** Create `src/features/link-management/EditLinkModal.tsx`

- [ ] **Step 1:** Create `src/features/link-management/EditLinkModal.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLinkStore } from '@/store/useLinkStore';
import { useToastStore } from '@/store/useToastStore';
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

  useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description ?? '');
    setCategoryId(link.categoryId);
    setErrors({});
  }, [link]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!url.trim()) errs.url = 'URL is required';
    else {
      try {
        new URL(url);
      } catch {
        errs.url = 'Must be a valid URL (include https://)';
      }
    }
    if (!categoryId) errs.categoryId = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        />
        <Input
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          error={errors.url}
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
            className="w-full px-3 py-2 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] focus:outline-none focus:shadow-[3px_3px_0px_var(--border-color)]"
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add EditLinkModal with pre-populated fields"
```

---

### Task 27: Create AddCategoryModal

**Files:** Create `src/features/link-management/AddCategoryModal.tsx`

- [ ] **Step 1:** Create `src/features/link-management/AddCategoryModal.tsx`

```tsx
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
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add AddCategoryModal with emoji and color picker"
```

---

### Task 28: Create EditCategoryModal

**Files:** Create `src/features/link-management/EditCategoryModal.tsx`

- [ ] **Step 1:** Create `src/features/link-management/EditCategoryModal.tsx`

```tsx
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
  const [color, setColor] = useState(category.color);
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
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add EditCategoryModal with pre-populated fields"
```

---

### Task 29: Create DeleteConfirm dialog

**Files:** Create `src/features/link-management/DeleteConfirm.tsx`

- [ ] **Step 1:** Create `src/features/link-management/DeleteConfirm.tsx`

```tsx
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add DeleteConfirm dialog with cascade warning"
```

---

### Task 30: Build verification & visual QA

- [ ] **Step 1:** Run the test suite

Run: `npx vitest run`
Expected: All tests pass (utils, useLinkStore, useToastStore, useFilteredLinks)

- [ ] **Step 2:** Run the Next.js production build

Run: `npx next build`
Expected: Build completes successfully with no errors

- [ ] **Step 3:** Fix any build or type errors that appear

If TypeScript errors exist, fix them one at a time and re-run build.

- [ ] **Step 4:** Run dev server and visually check

Run: `npx next dev`

Manual checks:
1. Page loads without errors in console
2. Default 8 categories appear in a grid
3. Dark/light theme toggle works
4. Add a link → appears in the correct category
5. Edit a link → changes saved
6. Delete a link → disappears
7. Add a category → new card appears
8. Edit a category → changes reflected
9. Delete a category → card and all links removed, cascade warning shown
10. Search → filters across all categories
11. Export → downloads JSON file
12. Import → data appears correctly

- [ ] **Step 5:** Commit all remaining fixes

```bash
git add -A && git commit -m "fix: resolve build and type issues"
```

---

### Task 31: Final integration commit

- [ ] **Step 1:** Verify clean working tree

Run: `git status`
Expected: Clean — nothing to commit

- [ ] **Step 2:** Verify all tests pass one final time

Run: `npx vitest run && npx next build`
Expected: All pass, build succeeds

- [ ] **Step 3:** Tag milestone (optional)

```bash
git tag v1.0.0-rc1
```
