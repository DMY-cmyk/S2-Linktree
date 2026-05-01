import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonogramFavicon } from './MonogramFavicon';

describe('MonogramFavicon', () => {
  it('maps known github.com to "G"', () => {
    render(<MonogramFavicon url="https://github.com/foo" />);
    expect(screen.getByLabelText(/github\.com/i).textContent).toBe('G');
  });
  it('falls back to first letter for unknown domains', () => {
    render(<MonogramFavicon url="https://example.org/bar" />);
    expect(screen.getByLabelText(/example\.org/i).textContent).toBe('E');
  });
  it('renders middle dot for invalid url', () => {
    render(<MonogramFavicon url="not-a-url" />);
    expect(screen.getByText('·')).toBeInTheDocument();
  });
});
