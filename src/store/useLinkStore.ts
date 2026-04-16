import { create } from 'zustand';
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
  reorderLinks: (categoryId: string, activeId: string, overId: string) => void;
  moveLinkToCategory: (linkId: string, targetCategoryId: string, insertIndex: number) => void;
  getSnapshot: () => { categories: Category[]; links: Link[] };
  restoreSnapshot: (snapshot: { categories: Category[]; links: Link[] }) => void;
}

export const useLinkStore = create<LinkStore>()(
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

    reorderLinks: (categoryId, activeId, overId) => {
      if (activeId === overId) return;
      set((state) => {
        const catLinks = state.links
          .filter((l) => l.categoryId === categoryId)
          .sort((a, b) => a.order - b.order);
        const otherLinks = state.links.filter((l) => l.categoryId !== categoryId);
        const oldIndex = catLinks.findIndex((l) => l.id === activeId);
        const newIndex = catLinks.findIndex((l) => l.id === overId);
        if (oldIndex === -1 || newIndex === -1) return state;
        const reordered = [...catLinks];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        return {
          links: [...otherLinks, ...reordered.map((l, i) => ({ ...l, order: i }))],
        };
      });
    },

    moveLinkToCategory: (linkId, targetCategoryId, insertIndex) => {
      set((state) => {
        const link = state.links.find((l) => l.id === linkId);
        if (!link) return state;
        const sourceCategoryId = link.categoryId;
        if (sourceCategoryId === targetCategoryId) return state;

        const sourceLinks = state.links
          .filter((l) => l.categoryId === sourceCategoryId && l.id !== linkId)
          .sort((a, b) => a.order - b.order)
          .map((l, i) => ({ ...l, order: i }));

        const targetLinks = state.links
          .filter((l) => l.categoryId === targetCategoryId)
          .sort((a, b) => a.order - b.order);
        const clampedIndex = Math.min(insertIndex, targetLinks.length);
        const movedLink = { ...link, categoryId: targetCategoryId };
        targetLinks.splice(clampedIndex, 0, movedLink);
        const reorderedTarget = targetLinks.map((l, i) => ({ ...l, order: i }));

        const otherLinks = state.links.filter(
          (l) => l.categoryId !== sourceCategoryId && l.categoryId !== targetCategoryId
        );
        return { links: [...otherLinks, ...sourceLinks, ...reorderedTarget] };
      });
    },

    getSnapshot: () => ({
      categories: JSON.parse(JSON.stringify(get().categories)),
      links: JSON.parse(JSON.stringify(get().links)),
    }),

    restoreSnapshot: (snapshot) =>
      set({ categories: snapshot.categories, links: snapshot.links }),
  })
);
