import { describe, it, expect, beforeEach } from 'vitest';
import { useLinkStore } from './useLinkStore';

beforeEach(() => {
  useLinkStore.setState({ categories: [], links: [] });
});

describe('useLinkStore', () => {
  describe('addCategory', () => {
    it('adds a category with generated id and timestamp', () => {
      useLinkStore.getState().addCategory({ name: 'Test', emoji: '📝', color: '#a8ff78', order: 0 });
      const cats = useLinkStore.getState().categories;
      expect(cats).toHaveLength(1);
      expect(cats[0].name).toBe('Test');
      expect(cats[0].id).toBeTruthy();
      expect(cats[0].createdAt).toBeGreaterThan(0);
    });
  });

  describe('updateCategory', () => {
    it('updates specified fields only', () => {
      useLinkStore.getState().addCategory({ name: 'Old', emoji: '📝', color: '#a8ff78', order: 0 });
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
      useLinkStore.getState().addCategory({ name: 'Cat', emoji: '📝', color: '#a8ff78', order: 0 });
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
          { id: 'c1', name: 'A', emoji: 'a', color: '#fff', order: 0, createdAt: 1 },
          { id: 'c2', name: 'B', emoji: 'b', color: '#000', order: 1, createdAt: 1 },
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

  describe('exportData', () => {
    it('returns categories and links', () => {
      useLinkStore.getState().addCategory({ name: 'C', emoji: 'e', color: '#fff', order: 0 });
      useLinkStore.getState().addLink({ title: 'L', url: 'https://l.com', categoryId: 'x', order: 0 });
      const data = useLinkStore.getState().exportData();
      expect(data.categories).toHaveLength(1);
      expect(data.links).toHaveLength(1);
    });
  });

  describe('importData', () => {
    it('replaces all data in replace mode', () => {
      useLinkStore.getState().addCategory({ name: 'Old', emoji: 'o', color: '#000', order: 0 });
      const result = useLinkStore.getState().importData({
        categories: [{ id: 'n1', name: 'New', emoji: 'n', color: '#fff', order: 0, createdAt: 1 }],
        links: [{ id: 'nl1', categoryId: 'n1', title: 'NL', url: 'https://n.com', order: 0, createdAt: 1 }],
      }, 'replace');
      expect(useLinkStore.getState().categories[0].name).toBe('New');
      expect(result.addedCategories).toBe(1);
      expect(result.addedLinks).toBe(1);
    });

    it('merges new items and skips duplicates by id', () => {
      useLinkStore.setState({
        categories: [{ id: 'ex', name: 'Existing', emoji: 'e', color: '#000', order: 0, createdAt: 1 }],
        links: [{ id: 'el1', categoryId: 'ex', title: 'EL', url: 'https://e.com', order: 0, createdAt: 1 }],
      });
      const result = useLinkStore.getState().importData({
        categories: [
          { id: 'ex', name: 'Dup', emoji: 'e', color: '#000', order: 0, createdAt: 1 },
          { id: 'new1', name: 'New', emoji: 'n', color: '#fff', order: 1, createdAt: 1 },
        ],
        links: [
          { id: 'el1', categoryId: 'ex', title: 'DupL', url: 'https://d.com', order: 0, createdAt: 1 },
          { id: 'nl1', categoryId: 'new1', title: 'NewL', url: 'https://n.com', order: 0, createdAt: 1 },
        ],
      }, 'merge');
      expect(useLinkStore.getState().categories).toHaveLength(2);
      expect(useLinkStore.getState().links).toHaveLength(2);
      expect(result.addedCategories).toBe(1);
      expect(result.addedLinks).toBe(1);
      expect(result.skipped).toBe(2);
      expect(useLinkStore.getState().categories[0].name).toBe('Existing');
    });
  });
});
