import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('lucide-react dependency', () => {
  it('can import Lucide icons', async () => {
    const { Pencil, Trash2, Search, X, Plus, ArrowRight, Globe, Link, AlertCircle, Monitor } = await import('lucide-react');
    expect(Pencil).toBeDefined();
    expect(Trash2).toBeDefined();
    expect(Search).toBeDefined();
    expect(X).toBeDefined();
    expect(Plus).toBeDefined();
    expect(ArrowRight).toBeDefined();
    expect(Globe).toBeDefined();
    expect(Link).toBeDefined();
    expect(AlertCircle).toBeDefined();
    expect(Monitor).toBeDefined();
  });
});

describe('Button semantic tokens', () => {
  it('primary variant uses --color-success token not hardcoded hex', () => {
    render(<Button variant="primary">Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('var(--color-success)');
    expect(btn.className).not.toContain('#a8ff78');
  });

  it('danger variant uses --color-danger token not hardcoded hex', () => {
    render(<Button variant="danger">Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('var(--color-danger)');
    expect(btn.className).not.toContain('#ff6b6b');
  });
});
