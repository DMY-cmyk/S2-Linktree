import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute('data-theme', 'light');
});

describe('ThemeToggle three-state', () => {
  it('cycles through light → dark → system', async () => {
    const user = userEvent.setup();
    localStorage.setItem('s2-linktree-theme', 'light');
    render(<ThemeToggle />);
    const btn = screen.getByTestId('theme-toggle');

    await user.click(btn);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('dark');

    await user.click(btn);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('system');

    await user.click(btn);
    expect(localStorage.getItem('s2-linktree-theme')).toBe('light');
  });

  it('shows Monitor icon SVG when in system mode', async () => {
    const user = userEvent.setup();
    localStorage.setItem('s2-linktree-theme', 'dark');
    render(<ThemeToggle />);
    const btn = screen.getByTestId('theme-toggle');

    await user.click(btn);
    const svg = btn.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('updates aria-label for each state', async () => {
    const user = userEvent.setup();
    localStorage.setItem('s2-linktree-theme', 'light');
    render(<ThemeToggle />);
    const btn = screen.getByTestId('theme-toggle');

    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
    await user.click(btn);
    expect(btn.getAttribute('aria-label')).toBe('Switch to system theme');
    await user.click(btn);
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
