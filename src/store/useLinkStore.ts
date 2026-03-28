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
  reorderCategories: (activeId: string, overId: string) => void;
}

export const useLinkStore = create<LinkStore>()(
  persist(
    (set) => ({
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

      reorderCategories: (activeId, overId) => {
        if (activeId === overId) return;
        set((state) => {
          const sorted = [...state.categories].sort((a, b) => a.order - b.order);
          const oldIndex = sorted.findIndex((c) => c.id === activeId);
          const newIndex = sorted.findIndex((c) => c.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;
          const reordered = [...sorted];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          return {
            categories: reordered.map((c, i) => ({ ...c, order: i })),
          };
        });
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
