import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddCategoryModal } from './AddCategoryModal';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
  useLinkStore.setState({ categories: [], links: [], lastUpdatedAt: 1 });
});

describe('AddCategoryModal tag picker', () => {
  it('shows 5 tag radios and submits with selected tag', () => {
    render(<AddCategoryModal isOpen onClose={() => {}} />);
    const tagRadios = document.querySelectorAll('input[type="radio"][name="category-tag"]');
    expect(tagRadios).toHaveLength(5);
    fireEvent.change(screen.getByLabelText(/category name/i), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Calendar', hidden: true }));
    fireEvent.click(screen.getByRole('button', { name: /create/i, hidden: true }));
    expect(useLinkStore.getState().categories[0].tag).toBe('Calendar');
  });
});
