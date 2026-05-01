import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders polished version label and 3 keyboard hints', () => {
    render(<Footer />);
    expect(screen.getByText(/POLISHED · v5\.0/)).toBeInTheDocument();
    expect(screen.getByText(/navigate/)).toBeInTheDocument();
    expect(screen.getByText(/⌘K search/)).toBeInTheDocument();
    expect(screen.getByText(/E edit · D delete/)).toBeInTheDocument();
  });
});
