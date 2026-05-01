import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

const matchMediaSpy = vi.fn().mockReturnValue({ matches: false });

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  matchMediaSpy.mockReset().mockReturnValue({ matches: false });
  window.matchMedia = matchMediaSpy as unknown as typeof window.matchMedia;
});

describe('ThemeToggle (binary + legacy migration)', () => {
  it('default is light when nothing stored', () => {
    render(<ThemeToggle />);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles light -> dark', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('s2-linktree-theme')).toBe('dark');
  });

  it('legacy "system" re-derives via matchMedia and persists', () => {
    localStorage.setItem('s2-linktree-theme', 'system');
    matchMediaSpy.mockReturnValue({ matches: true });
    render(<ThemeToggle />);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
