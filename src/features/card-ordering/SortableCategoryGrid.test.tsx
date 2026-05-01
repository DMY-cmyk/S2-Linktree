import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SortableCategoryGrid } from './SortableCategoryGrid';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [
    { id: 'c1', name: 'TPA',   emoji: '📝', color: '#16a34a', order: 0, createdAt: 1, tag: 'Entry exam' },
    { id: 'c2', name: 'TOEFL', emoji: '🌐', color: '#0284c7', order: 1, createdAt: 1, tag: 'Language'   },
    { id: 'c3', name: 'Sem 1', emoji: '📘', color: '#ea580c', order: 2, createdAt: 1, tag: 'Coursework' },
  ],
  links: [],
  lastUpdatedAt: 1,
}));

describe('SortableCategoryGrid tag sections', () => {
  it('renders one GroupHeader per non-empty tag in CATEGORY_TAG_ORDER', () => {
    const cats = useLinkStore.getState().categories;
    render(<SortableCategoryGrid
      results={[
        { category: cats[0], links: [] },
        { category: cats[1], links: [] },
        { category: cats[2], links: [] },
      ]}
      allLinks={[]} allCategories={cats}
      onEditLink={() => {}} onDeleteLink={() => {}}
      onEditCategory={() => {}} onDeleteCategory={() => {}}
      onAddLinkToCategory={() => {}} onAddCategory={() => {}}
      searchQuery=""
    />);
    const headers = screen.getAllByRole('heading', { level: 2 }).map((n) => n.textContent);
    expect(headers).toEqual(['Entry exam', 'Language', 'Coursework']);
  });
});
