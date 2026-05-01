import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders Lucide Search icon (SVG, not emoji)', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('has aria-label on the input', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-label')).toBe('Search resources');
  });

  it('shows clear button when input has text', () => {
    render(<SearchBar value="react" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeTruthy();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear search')).toBeNull();
  });

  it('has id="main-content" on wrapper for skip link target', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(document.getElementById('main-content')).toBeTruthy();
  });

  it('keyboard shortcut hint is visible (badge or placeholder)', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    const placeholder = input.getAttribute('placeholder') ?? '';
    const badgeText = screen.queryByText(/Ctrl\+K|⌘K/)?.textContent ?? '';
    expect(`${placeholder} ${badgeText}`).toMatch(/Ctrl\+K|⌘K/);
  });

  it('first Escape clears text when input has value', () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    input.focus();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('second Escape blurs when input is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    input.focus();
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(document.activeElement).not.toBe(input);
  });

  it('renders ⌘K kbd badge in polished mode', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});
