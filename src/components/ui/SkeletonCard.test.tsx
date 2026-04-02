import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonCard } from './SkeletonCard';

describe('SkeletonCard', () => {
  it('renders skeleton placeholder elements', () => {
    const { container } = render(<SkeletonCard />);
    const shimmers = container.querySelectorAll('.animate-shimmer');
    expect(shimmers.length).toBeGreaterThanOrEqual(3);
  });

  it('has correct data-testid', () => {
    render(<SkeletonCard />);
    expect(screen.getByTestId('skeleton-card')).toBeDefined();
  });
});
