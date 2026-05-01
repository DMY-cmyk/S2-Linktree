import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => useLinkStore.setState({
  categories: [
    { id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' },
  ],
  links: [
    { id: 'l1', categoryId: 'c1', title: 'L', url: 'https://x.com', order: 0, createdAt: 1 },
  ],
  lastUpdatedAt: Date.now() - 2 * 86_400_000,
}));

describe('HeroSection', () => {
  it('renders bilingual chip and headline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Program Magister · TA 2025\/26/)).toBeInTheDocument();
    expect(screen.getByText(/Resource hub/)).toBeInTheDocument();
    expect(screen.getByText(/Classroom, jadwal, dan folder/)).toBeInTheDocument();
  });
  it('shows relative time', () => {
    render(<HeroSection />);
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
  });
});
