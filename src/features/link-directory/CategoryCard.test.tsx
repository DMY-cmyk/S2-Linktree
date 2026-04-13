import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';

const mockCategory = {
  id: 'cat-1', name: 'Test', emoji: '📚', color: '#a8ff78', order: 0, createdAt: 1,
};

const defaultProps = {
  category: mockCategory,
  links: [],
  onEditLink: vi.fn(),
  onDeleteLink: vi.fn(),
  onEditCategory: vi.fn(),
  onDeleteCategory: vi.fn(),
  onAddLink: vi.fn(),
};

describe('CategoryCard', () => {
  it('renders Lucide Pencil and Trash2 icons (SVGs, not emoji)', () => {
    render(<CategoryCard {...defaultProps} />);
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it('edit button has aria-label with category name', () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByLabelText('Edit Test')).toBeTruthy();
  });

  it('delete button has aria-label with category name', () => {
    render(<CategoryCard {...defaultProps} />);
    expect(screen.getByLabelText('Delete Test')).toBeTruthy();
  });

  it('action buttons are always visible at 60% opacity', () => {
    render(<CategoryCard {...defaultProps} />);
    const editBtn = screen.getByLabelText('Edit Test');
    expect(editBtn.className).toContain('opacity-60');
    expect(editBtn.className).not.toContain('opacity-0');
  });

  it('link count has aria-label', () => {
    const link = { id: 'l1', categoryId: 'cat-1', title: 'A', url: 'https://a.com', order: 0, createdAt: 1 };
    render(<CategoryCard {...defaultProps} links={[link]} />);
    expect(screen.getByLabelText('1 link')).toBeTruthy();
  });
});
