import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input accessibility', () => {
  it('sets aria-invalid when error is present', () => {
    render(<Input error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('links error message via aria-describedby', () => {
    render(<Input error="Required" />);
    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = document.getElementById(describedBy!);
    expect(errorEl?.textContent).toContain('Required');
  });

  it('renders AlertCircle icon when error is present', () => {
    render(<Input error="Bad" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('does not have outline-none class', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).not.toContain('outline-none');
  });

  it('uses --danger token for error border', () => {
    render(<Input error="Bad" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('var(--danger)');
    expect(input.className).not.toContain('#ff6b6b');
  });
});
