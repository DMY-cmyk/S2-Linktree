import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilterPopover } from './TagFilterPopover';

const replaceMock = vi.fn();
const searchParamsRef: { current: URLSearchParams } = { current: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsRef.current,
  usePathname: () => '/',
}));

beforeEach(() => {
  replaceMock.mockReset();
  searchParamsRef.current = new URLSearchParams();
});

describe('TagFilterPopover', () => {
  it('renders 5 tag pills', () => {
    render(<TagFilterPopover open onClose={() => {}} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
  });

  it('toggling a pill calls router.replace with slug', () => {
    render(<TagFilterPopover open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /coursework/i }));
    expect(replaceMock).toHaveBeenCalledWith('/?tag=coursework', { scroll: false });
  });

  it('renders Clear button only when active', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework');
    render(<TagFilterPopover open onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
});
