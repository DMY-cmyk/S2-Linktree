import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Toast variant styles', () => {
  const source = readFileSync(resolve(__dirname, 'Toast.tsx'), 'utf-8');

  it('uses semantic tokens not hardcoded hex', () => {
    expect(source).not.toContain("'#a8ff78'");
    expect(source).not.toContain("'#ffd078'");
    expect(source).not.toContain("'#ff6b6b'");
    expect(source).toContain('var(--color-success)');
    expect(source).toContain('var(--color-warning)');
    expect(source).toContain('var(--color-danger)');
  });

  it('includes aria-live wiring to toast-live-region', () => {
    expect(source).toContain('toast-live-region');
  });
});
