import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { createRef } from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders S2 monogram, version v5.0, search, theme toggle, filter, add link', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Header
      query="" onQueryChange={() => {}}
      onAddLink={() => {}} searchInputRef={ref as any}
    />);
    expect(screen.getByText('S2')).toBeInTheDocument();
    expect(screen.getByText(/v5\.0 · polished/)).toBeInTheDocument();
    expect(screen.getByLabelText(/switch to (dark|light) mode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add link$/i })).toBeInTheDocument();
  });

  it('clicking filter opens popover (5 pills)', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Header
      query="" onQueryChange={() => {}}
      onAddLink={() => {}} searchInputRef={ref as any}
    />);
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
  });
});
