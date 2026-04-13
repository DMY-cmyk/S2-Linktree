import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('globals.css semantic tokens', () => {
  const css = readFileSync(resolve(__dirname, 'globals.css'), 'utf-8');

  it('defines --color-success in light theme', () => {
    expect(css).toContain('--color-success');
  });

  it('defines --color-danger in light theme', () => {
    expect(css).toContain('--color-danger');
  });

  it('defines --color-warning in light theme', () => {
    expect(css).toContain('--color-warning');
  });

  it('defines --color-on-success for text contrast', () => {
    expect(css).toContain('--color-on-success');
  });

  it('defines --color-on-danger for text contrast', () => {
    expect(css).toContain('--color-on-danger');
  });

  it('defines --color-on-warning for text contrast', () => {
    expect(css).toContain('--color-on-warning');
  });

  it('defines --color-on-accent for text contrast', () => {
    expect(css).toContain('--color-on-accent');
  });
});

describe('globals.css focus and skip-link styles', () => {
  const css = readFileSync(resolve(__dirname, 'globals.css'), 'utf-8');

  it('defines :focus-visible outline style', () => {
    expect(css).toContain(':focus-visible');
    expect(css).toContain('outline');
    expect(css).toContain('var(--accent)');
  });

  it('defines skip-to-content link styles', () => {
    expect(css).toContain('.skip-to-content');
  });
});
