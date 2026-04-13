import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('layout.tsx structure', () => {
  const source = readFileSync(resolve(__dirname, 'layout.tsx'), 'utf-8');

  it('does not hardcode data-theme="dark" on html', () => {
    expect(source).not.toMatch(/data-theme="dark"/);
  });

  it('includes a skip-to-content link', () => {
    expect(source).toContain('skip-to-content');
    expect(source).toContain('#main-content');
  });

  it('includes a persistent aria-live region', () => {
    expect(source).toContain('aria-live');
    expect(source).toContain('polite');
  });

  it('inline script handles system theme preference', () => {
    expect(source).toContain('prefers-color-scheme');
    expect(source).toContain('system');
  });
});
