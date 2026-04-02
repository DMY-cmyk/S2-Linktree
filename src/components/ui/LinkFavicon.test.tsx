import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkFavicon } from './LinkFavicon';

describe('LinkFavicon', () => {
  it('renders img with Google Favicon API URL', () => {
    render(<LinkFavicon url="https://example.com" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toContain('google.com/s2/favicons');
    expect(img.getAttribute('src')).toContain('domain=example.com');
  });

  it('shows fallback emoji on image error', () => {
    render(<LinkFavicon url="https://example.com" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('🌐')).toBeDefined();
  });

  it('shows fallback for invalid URL', () => {
    render(<LinkFavicon url="not-a-url" />);
    expect(screen.getByText('🌐')).toBeDefined();
  });
});
