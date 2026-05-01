import { create } from 'zustand';
import type { Category, Link } from '@/types';
import { generateId } from '@/lib/utils';
import { DEFAULT_CATEGORIES, DEFAULT_LINKS, SEED_LAST_UPDATED } from '@/lib/constants';

interface LinkStore {
  categories: Category[];
  links: Link[];
  lastUpdatedAt: number;
  addCategory: (input: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<Pick<Category, 'name' | 'emoji' | 'color' | 'order' | 'tag'>>) => void;
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

export const useLinkStore = create<LinkStore>()((set, get) => ({
  categories: DEFAULT_CATEGORIES,
  links: DEFAULT_LINKS,
  lastUpdatedAt: SEED_LAST_UPDATED,

  addCategory: (input) =>
    set((state) => {
      const peers = state.categories.filter((c) => c.tag === input.tag);
      const orders = (peers.length ? peers : state.categories).map((c) => c.order);
      const newOrder = (orders.length ? Math.min(...orders) : 0) - 1;
      return {
        categories: [
          ...state.categories,
          { ...input, order: newOrder, id: generateId(), createdAt: Date.now() },
        ],
        lastUpdatedAt: Date.now(),
      };
    }),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      lastUpdatedAt: Date.now(),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      links: state.links.filter((l) => l.categoryId !== id),
      lastUpdatedAt: Date.now(),
    })),

  addLink: (input) =>
    set((state) => ({
      links: [...state.links, { ...input, id: generateId(), createdAt: Date.now() }],
      lastUpdatedAt: Date.now(),
    })),

  updateLink: (id, updates) =>
    set((state) => ({
      links: state.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      lastUpdatedAt: Date.now(),
    })),

  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((l) => l.id !== id),
      lastUpdatedAt: Date.now(),
    })),

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
        lastUpdatedAt: Date.now(),
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
        lastUpdatedAt: Date.now(),
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
      return {
        links: [...otherLinks, ...sourceLinks, ...reorderedTarget],
        lastUpdatedAt: Date.now(),
      };
    });
  },

  getSnapshot: () => ({
    categories: JSON.parse(JSON.stringify(get().categories)),
    links: JSON.parse(JSON.stringify(get().links)),
  }),

  restoreSnapshot: (snapshot) =>
    set({ categories: snapshot.categories, links: snapshot.links, lastUpdatedAt: Date.now() }),
}));
