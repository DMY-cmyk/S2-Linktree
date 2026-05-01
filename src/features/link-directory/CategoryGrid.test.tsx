import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryGrid } from './CategoryGrid';

describe('CategoryGrid skeleton grid', () => {
  it('uses polished grid template (auto-fill 320px, gap 16) when loading', () => {
    const { container } = render(
      <CategoryGrid
        results={[]}
        allLinks={[]}
        allCategories={[]}
        searchQuery=""
        onClearSearch={() => {}}
        onEditLink={() => {}}
        onDeleteLink={() => {}}
        onEditCategory={() => {}}
        onDeleteCategory={() => {}}
        onAddLinkToCategory={() => {}}
        onAddCategory={() => {}}
        loading
      />
    );
    const skeleton = container.querySelector('[data-testid="skeleton-card"]');
    expect(skeleton).toBeInTheDocument();
    const wrapper = skeleton!.parentElement as HTMLElement;
    expect(wrapper.style.display).toBe('grid');
    expect(wrapper.style.gridTemplateColumns).toBe(
      'repeat(auto-fill, minmax(320px, 1fr))'
    );
    // gap may serialize as '16px'
    expect(wrapper.style.gap).toMatch(/^16px$/);
  });
});
