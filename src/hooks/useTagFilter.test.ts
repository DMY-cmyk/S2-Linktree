import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const replaceMock = vi.fn();
const searchParamsRef: { current: URLSearchParams } = { current: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsRef.current,
  usePathname: () => '/',
}));

import { useTagFilter } from './useTagFilter';

beforeEach(() => {
  replaceMock.mockReset();
  searchParamsRef.current = new URLSearchParams();
});

describe('useTagFilter', () => {
  it('parses ?tag=coursework,language into a Set', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework,language');
    const { result } = renderHook(() => useTagFilter());
    expect(result.current.activeTags.has('Coursework')).toBe(true);
    expect(result.current.activeTags.has('Language')).toBe(true);
  });

  it('toggleTag adds and removes from URL', () => {
    const { result } = renderHook(() => useTagFilter());
    act(() => result.current.toggleTag('Coursework'));
    expect(replaceMock).toHaveBeenCalledWith('/?tag=coursework', { scroll: false });
  });

  it('clear() removes the param', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework');
    const { result } = renderHook(() => useTagFilter());
    act(() => result.current.clear());
    expect(replaceMock).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('ignores unknown tag tokens', () => {
    searchParamsRef.current = new URLSearchParams('tag=coursework,bogus');
    const { result } = renderHook(() => useTagFilter());
    expect(Array.from(result.current.activeTags)).toEqual(['Coursework']);
  });
});
