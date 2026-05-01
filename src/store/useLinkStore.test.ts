import { describe, it, expect, beforeEach } from 'vitest';
import { useLinkStore } from './useLinkStore';
import { SEED_LAST_UPDATED } from '@/lib/constants';

beforeEach(() => {
  useLinkStore.setState({ categories: [], links: [] });
});

describe('useLinkStore', () => {
  describe('addCategory', () => {
    it('adds a category with generated id and timestamp', () => {
      useLinkStore.getState().addCategory({ name: 'Test', emoji: '📝', color: '#a8ff78', order: 0, tag: 'Coursework' });
      const cats = useLinkStore.getState().categories;
      expect(cats).toHaveLength(1);
      expect(cats[0].name).toBe('Test');
      expect(cats[0].id).toBeTruthy();
      expect(cats[0].createdAt).toBeGreaterThan(0);
    });
  });

  describe('updateCategory', () => {
    it('updates specified fields only', () => {
      useLinkStore.getState().addCategory({ name: 'Old', emoji: '📝', color: '#a8ff78', order: 0, tag: 'Coursework' });
      const id = useLinkStore.getState().categories[0].id;
      useLinkStore.getState().updateCategory(id, { name: 'New', color: '#78d6ff' });
      const cat = useLinkStore.getState().categories[0];
      expect(cat.name).toBe('New');
      expect(cat.color).toBe('#78d6ff');
      expect(cat.emoji).toBe('📝');
    });
  });

  describe('deleteCategory', () => {
    it('removes category and cascades to delete its links', () => {
      useLinkStore.getState().addCategory({ name: 'Cat', emoji: '📝', color: '#a8ff78', order: 0, tag: 'Coursework' });
      const catId = useLinkStore.getState().categories[0].id;
      useLinkStore.getState().addLink({ title: 'L1', url: 'https://a.com', categoryId: catId, order: 0 });
      useLinkStore.getState().addLink({ title: 'L2', url: 'https://b.com', categoryId: catId, order: 1 });
      useLinkStore.getState().deleteCategory(catId);
      expect(useLinkStore.getState().categories).toHaveLength(0);
      expect(useLinkStore.getState().links).toHaveLength(0);
    });

    it('does not delete links from other categories', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
          { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1, tag: 'Coursework' },
        ],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c2', title: 'L2', url: 'https://2.com', order: 0, createdAt: 1 },
        ],
      });
      useLinkStore.getState().deleteCategory('c1');
      expect(useLinkStore.getState().links).toHaveLength(1);
      expect(useLinkStore.getState().links[0].categoryId).toBe('c2');
    });
  });

  describe('addLink', () => {
    it('adds a link with generated id', () => {
      useLinkStore.getState().addLink({ title: 'Test', url: 'https://test.com', categoryId: 'c1', order: 0 });
      expect(useLinkStore.getState().links).toHaveLength(1);
      expect(useLinkStore.getState().links[0].title).toBe('Test');
    });
  });

  describe('updateLink', () => {
    it('updates specified fields', () => {
      useLinkStore.getState().addLink({ title: 'Old', url: 'https://old.com', categoryId: 'c1', order: 0 });
      const id = useLinkStore.getState().links[0].id;
      useLinkStore.getState().updateLink(id, { title: 'New', url: 'https://new.com' });
      expect(useLinkStore.getState().links[0].title).toBe('New');
      expect(useLinkStore.getState().links[0].categoryId).toBe('c1');
    });
  });

  describe('deleteLink', () => {
    it('removes only the specified link', () => {
      useLinkStore.getState().addLink({ title: 'A', url: 'https://a.com', categoryId: 'c1', order: 0 });
      useLinkStore.getState().addLink({ title: 'B', url: 'https://b.com', categoryId: 'c1', order: 1 });
      useLinkStore.getState().deleteLink(useLinkStore.getState().links[0].id);
      expect(useLinkStore.getState().links).toHaveLength(1);
      expect(useLinkStore.getState().links[0].title).toBe('B');
    });
  });

  describe('reorderCategories', () => {
    it('swaps two categories and reassigns sequential order values', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
          { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1, tag: 'Coursework' },
          { id: 'c3', name: 'C', emoji: 'c', color: '#aaa', order: 2, createdAt: 1, tag: 'Coursework' },
        ],
        links: [],
      });
      useLinkStore.getState().reorderCategories('c1', 'c3');
      const cats = useLinkStore.getState().categories;
      const sorted = [...cats].sort((a, b) => a.order - b.order);
      expect(sorted.map((c) => c.id)).toEqual(['c2', 'c3', 'c1']);
      expect(sorted[0].order).toBe(0);
      expect(sorted[1].order).toBe(1);
      expect(sorted[2].order).toBe(2);
    });

    it('handles moving a category backward', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
          { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1, tag: 'Coursework' },
          { id: 'c3', name: 'C', emoji: 'c', color: '#aaa', order: 2, createdAt: 1, tag: 'Coursework' },
        ],
        links: [],
      });
      useLinkStore.getState().reorderCategories('c3', 'c1');
      const cats = useLinkStore.getState().categories;
      const sorted = [...cats].sort((a, b) => a.order - b.order);
      expect(sorted.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
      expect(sorted[0].order).toBe(0);
      expect(sorted[1].order).toBe(1);
      expect(sorted[2].order).toBe(2);
    });

    it('does nothing when activeId equals overId', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
        ],
        links: [],
      });
      useLinkStore.getState().reorderCategories('c1', 'c1');
      expect(useLinkStore.getState().categories[0].order).toBe(0);
    });
  });

  describe('reorderLinks', () => {
    it('reorders links within a category', () => {
      useLinkStore.setState({
        categories: [{ id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' }],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
          { id: 'l3', categoryId: 'c1', title: 'L3', url: 'https://3.com', order: 2, createdAt: 1 },
        ],
      });
      useLinkStore.getState().reorderLinks('c1', 'l1', 'l3');
      const links = useLinkStore.getState().links
        .filter((l) => l.categoryId === 'c1')
        .sort((a, b) => a.order - b.order);
      expect(links.map((l) => l.id)).toEqual(['l2', 'l3', 'l1']);
      expect(links[0].order).toBe(0);
      expect(links[1].order).toBe(1);
      expect(links[2].order).toBe(2);
    });

    it('does not affect links in other categories', () => {
      useLinkStore.setState({
        categories: [],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
          { id: 'l3', categoryId: 'c2', title: 'L3', url: 'https://3.com', order: 0, createdAt: 1 },
        ],
      });
      useLinkStore.getState().reorderLinks('c1', 'l1', 'l2');
      const c2Links = useLinkStore.getState().links.filter((l) => l.categoryId === 'c2');
      expect(c2Links[0].order).toBe(0);
    });

    it('does nothing when activeId equals overId', () => {
      useLinkStore.setState({
        categories: [],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
        ],
      });
      useLinkStore.getState().reorderLinks('c1', 'l1', 'l1');
      expect(useLinkStore.getState().links[0].order).toBe(0);
    });
  });

  describe('moveLinkToCategory', () => {
    it('moves a link to a different category at specified index', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
          { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1, tag: 'Coursework' },
        ],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
          { id: 'l3', categoryId: 'c2', title: 'L3', url: 'https://3.com', order: 0, createdAt: 1 },
        ],
      });
      useLinkStore.getState().moveLinkToCategory('l1', 'c2', 0);
      const c1Links = useLinkStore.getState().links
        .filter((l) => l.categoryId === 'c1')
        .sort((a, b) => a.order - b.order);
      const c2Links = useLinkStore.getState().links
        .filter((l) => l.categoryId === 'c2')
        .sort((a, b) => a.order - b.order);
      expect(c1Links.map((l) => l.id)).toEqual(['l2']);
      expect(c1Links[0].order).toBe(0);
      expect(c2Links.map((l) => l.id)).toEqual(['l1', 'l3']);
      expect(c2Links[0].order).toBe(0);
      expect(c2Links[1].order).toBe(1);
    });

    it('reassigns order values in source category after removal', () => {
      useLinkStore.setState({
        categories: [],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
          { id: 'l3', categoryId: 'c1', title: 'L3', url: 'https://3.com', order: 2, createdAt: 1 },
        ],
      });
      useLinkStore.getState().moveLinkToCategory('l2', 'c2', 0);
      const c1Links = useLinkStore.getState().links
        .filter((l) => l.categoryId === 'c1')
        .sort((a, b) => a.order - b.order);
      expect(c1Links.map((l) => l.id)).toEqual(['l1', 'l3']);
      expect(c1Links[0].order).toBe(0);
      expect(c1Links[1].order).toBe(1);
    });

    it('appends to end of target category when insertIndex exceeds length', () => {
      useLinkStore.setState({
        categories: [],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c2', title: 'L2', url: 'https://2.com', order: 0, createdAt: 1 },
        ],
      });
      useLinkStore.getState().moveLinkToCategory('l1', 'c2', 99);
      const c2Links = useLinkStore.getState().links
        .filter((l) => l.categoryId === 'c2')
        .sort((a, b) => a.order - b.order);
      expect(c2Links.map((l) => l.id)).toEqual(['l2', 'l1']);
      expect(c2Links[0].order).toBe(0);
      expect(c2Links[1].order).toBe(1);
    });

    it('does nothing when moving to the same category', () => {
      useLinkStore.setState({
        categories: [],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'L1', url: 'https://1.com', order: 0, createdAt: 1 },
          { id: 'l2', categoryId: 'c1', title: 'L2', url: 'https://2.com', order: 1, createdAt: 1 },
        ],
      });
      useLinkStore.getState().moveLinkToCategory('l1', 'c1', 1);
      const links = useLinkStore.getState().links;
      expect(links).toHaveLength(2);
      expect(links[0].order).toBe(0);
      expect(links[1].order).toBe(1);
    });
  });

  describe('snapshot and restore', () => {
    it('getSnapshot returns a deep copy of current state', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'Test', emoji: '📝', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
        ],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'Link', url: 'https://example.com', order: 0, createdAt: 1 },
        ],
      });

      const snapshot = useLinkStore.getState().getSnapshot();
      expect(snapshot.categories).toHaveLength(1);
      expect(snapshot.links).toHaveLength(1);
      expect(snapshot.categories).not.toBe(useLinkStore.getState().categories);
      expect(snapshot.links).not.toBe(useLinkStore.getState().links);
    });

    it('restoreSnapshot overwrites current state', () => {
      useLinkStore.setState({
        categories: [],
        links: [],
      });

      const snapshot = {
        categories: [
          { id: 'c1', name: 'Restored', emoji: '🔄', color: '#000', order: 0, createdAt: 1, tag: 'Coursework' as const },
        ],
        links: [
          { id: 'l1', categoryId: 'c1', title: 'Restored Link', url: 'https://restored.com', order: 0, createdAt: 1 },
        ],
      };

      useLinkStore.getState().restoreSnapshot(snapshot);
      expect(useLinkStore.getState().categories).toHaveLength(1);
      expect(useLinkStore.getState().categories[0].name).toBe('Restored');
      expect(useLinkStore.getState().links).toHaveLength(1);
      expect(useLinkStore.getState().links[0].title).toBe('Restored Link');
    });

    it('snapshot is independent of store mutations', () => {
      useLinkStore.setState({
        categories: [
          { id: 'c1', name: 'Before', emoji: '📝', color: '#fff', order: 0, createdAt: 1, tag: 'Coursework' },
        ],
        links: [],
      });

      const snapshot = useLinkStore.getState().getSnapshot();
      useLinkStore.getState().deleteCategory('c1');

      expect(useLinkStore.getState().categories).toHaveLength(0);
      expect(snapshot.categories).toHaveLength(1);
      expect(snapshot.categories[0].name).toBe('Before');
    });
  });
});

describe('lastUpdatedAt', () => {
  it('initializes from SEED_LAST_UPDATED', () => {
    // reset to fresh state (clears beforeEach override)
    useLinkStore.setState({ categories: [], links: [], lastUpdatedAt: SEED_LAST_UPDATED });
    expect(useLinkStore.getState().lastUpdatedAt).toBe(SEED_LAST_UPDATED);
  });

  it('bumps on addCategory', () => {
    useLinkStore.setState({ categories: [], links: [], lastUpdatedAt: 1 });
    useLinkStore.getState().addCategory({
      name: 'X', emoji: '📝', color: '#16a34a', order: 0, tag: 'Coursework',
    });
    expect(useLinkStore.getState().lastUpdatedAt).toBeGreaterThan(1);
  });

  it('bumps on deleteLink', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' },
      ],
      links: [
        { id: 'l1', categoryId: 'c1', title: 'L', url: 'https://a.com', order: 0, createdAt: 1 },
      ],
      lastUpdatedAt: 1,
    });
    useLinkStore.getState().deleteLink('l1');
    expect(useLinkStore.getState().lastUpdatedAt).toBeGreaterThan(1);
  });
});

describe('addCategory tag insertion', () => {
  it('places new category at top of its tag (order = minOrderInTag - 1)', () => {
    useLinkStore.setState({
      categories: [
        { id: 'a', name: 'A', emoji: '📘', color: '#16a34a', order: 5, createdAt: 1, tag: 'Coursework' },
        { id: 'b', name: 'B', emoji: '📗', color: '#0284c7', order: 7, createdAt: 1, tag: 'Coursework' },
      ],
      links: [],
      lastUpdatedAt: 0,
    });
    useLinkStore.getState().addCategory({
      name: 'New', emoji: '📕', color: '#7c3aed', order: 999, tag: 'Coursework',
    });
    const created = useLinkStore.getState().categories.find((c) => c.name === 'New')!;
    expect(created.order).toBe(4);
  });

  it('falls back to global min - 1 when no peer in tag', () => {
    useLinkStore.setState({
      categories: [
        { id: 'a', name: 'A', emoji: '📘', color: '#16a34a', order: 3, createdAt: 1, tag: 'Coursework' },
      ],
      links: [],
      lastUpdatedAt: 0,
    });
    useLinkStore.getState().addCategory({
      name: 'New', emoji: '📅', color: '#0d9488', order: 0, tag: 'Calendar',
    });
    expect(useLinkStore.getState().categories.find((c) => c.tag === 'Calendar')!.order).toBe(2);
  });
});
