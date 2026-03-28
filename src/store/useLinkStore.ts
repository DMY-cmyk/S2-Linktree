import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Category, Link } from '@/types';
import { generateId } from '@/lib/utils';
import { DEFAULT_CATEGORIES, DEFAULT_LINKS } from '@/lib/constants';

interface LinkStore {
  categories: Category[];
  links: Link[];
  addCategory: (input: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Pick<Category, 'name' | 'emoji' | 'color' | 'order'>>) => void;
  deleteCategory: (id: string) => void;
  addLink: (input: Omit<Link, 'id' | 'createdAt'>) => void;
  updateLink: (id: string, updates: Partial<Pick<Link, 'title' | 'url' | 'description' | 'categoryId' | 'order'>>) => void;
  deleteLink: (id: string) => void;
  exportData: () => { categories: Category[]; links: Link[] };
  importData: (
    data: { categories: Category[]; links: Link[] },
    mode: 'replace' | 'merge'
  ) => { addedCategories: number; addedLinks: number; skipped: number };
}

export const useLinkStore = create<LinkStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      links: DEFAULT_LINKS,

      addCategory: (input) =>
        set((state) => ({
          categories: [...state.categories, { ...input, id: generateId(), createdAt: Date.now() }],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          links: state.links.filter((l) => l.categoryId !== id),
        })),

      addLink: (input) =>
        set((state) => ({
          links: [...state.links, { ...input, id: generateId(), createdAt: Date.now() }],
        })),

      updateLink: (id, updates) =>
        set((state) => ({
          links: state.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),

      deleteLink: (id) =>
        set((state) => ({ links: state.links.filter((l) => l.id !== id) })),

      exportData: () => {
        const { categories, links } = get();
        return { categories, links };
      },

      importData: (data, mode) => {
        if (mode === 'replace') {
          set({ categories: data.categories, links: data.links });
          return { addedCategories: data.categories.length, addedLinks: data.links.length, skipped: 0 };
        }
        const state = get();
        const existingCatIds = new Set(state.categories.map((c) => c.id));
        const existingLinkIds = new Set(state.links.map((l) => l.id));
        const newCats = data.categories.filter((c) => !existingCatIds.has(c.id));
        const newLinks = data.links.filter((l) => !existingLinkIds.has(l.id));
        const skipped = data.categories.length - newCats.length + data.links.length - newLinks.length;
        set({ categories: [...state.categories, ...newCats], links: [...state.links, ...newLinks] });
        return { addedCategories: newCats.length, addedLinks: newLinks.length, skipped };
      },
    }),
    {
      name: 's2-linktree-store',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => localStorage.getItem(name),
        setItem: (name: string, value: string) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            // Lazy-import toast store to avoid circular dependency
            import('@/store/useToastStore').then(({ useToastStore }) => {
              useToastStore.getState().addToast('Storage full — try deleting unused links', 'error');
            });
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      })),
    }
  )
);
