import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';
import { useLinkStore } from '@/store/useLinkStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

beforeEach(() => useLinkStore.setState({
  categories: [{ id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' }],
  links: [],
  lastUpdatedAt: 1,
}));

describe('HomePage polished composition', () => {
  it('renders new Header (v5.0), CssOrbs, Hero, Footer', () => {
    const { container } = render(<HomePage />);
    expect(screen.getByText(/v5\.0 · polished/)).toBeInTheDocument();
    expect(container.querySelector('.animated-bg')).toBeInTheDocument();
    expect(screen.getByText(/Resource hub/)).toBeInTheDocument();
    expect(screen.getByText(/POLISHED · v5\.0/)).toBeInTheDocument();
  });

  it('does not render Export to Code button', () => {
    render(<HomePage />);
    expect(screen.queryByText(/Export to Code/i)).not.toBeInTheDocument();
  });
});
