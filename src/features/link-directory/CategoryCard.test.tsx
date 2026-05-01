import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryCard } from './CategoryCard';
import type { Category } from '@/types';

const cat: Category = {
  id: 'c1', name: 'TPA', emoji: '📝', color: '#16a34a',
  order: 0, createdAt: 1, tag: 'Entry exam',
};

describe('CategoryCard polished', () => {
  it('renders mono tag·count subtitle', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByText(/Entry exam/)).toBeInTheDocument();
    expect(screen.getByText(/0 links/)).toBeInTheDocument();
  });
  it('exposes data-card-id and tabindex for shortcut focus', () => {
    const { container } = render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    const article = container.querySelector('[data-card-id="c1"]') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(article.getAttribute('tabindex')).toBe('0');
  });
  it('renders dashed Add link CTA', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByRole('button', { name: /add link/i })).toBeInTheDocument();
  });
  it('shows in-card empty state when links is empty', () => {
    render(
      <CategoryCard category={cat} links={[]} onEditLink={() => {}} onDeleteLink={() => {}}
        onEditCategory={() => {}} onDeleteCategory={() => {}} onAddLink={() => {}} />
    );
    expect(screen.getByText(/no links yet/i)).toBeInTheDocument();
  });
});
