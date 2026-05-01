import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditCategoryModal } from './EditCategoryModal';
import { useLinkStore } from '@/store/useLinkStore';
import type { Category } from '@/types';

const cat: Category = {
  id: 'c1', name: 'A', emoji: '📘', color: '#16a34a',
  order: 0, createdAt: 1, tag: 'Coursework',
};
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
  useLinkStore.setState({ categories: [cat], links: [], lastUpdatedAt: 1 });
});

describe('EditCategoryModal tag picker', () => {
  it('preselects current tag and persists changes', () => {
    render(<EditCategoryModal isOpen onClose={() => {}} category={cat} />);
    const cw = screen.getByRole('radio', { name: 'Coursework', hidden: true });
    expect((cw as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'Calendar', hidden: true }));
    fireEvent.click(screen.getByRole('button', { name: /save/i, hidden: true }));
    expect(useLinkStore.getState().categories[0].tag).toBe('Calendar');
  });
});
