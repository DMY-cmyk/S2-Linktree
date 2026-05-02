import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('DragHandle tokens', () => {
  const source = readFileSync(resolve(__dirname, 'DragHandle.tsx'), 'utf-8');

  it('uses --text-3 instead of legacy --text-secondary', () => {
    expect(source).not.toContain('--text-secondary');
    expect(source).toContain('var(--text-3)');
  });

  it('uses --text instead of legacy --text-primary', () => {
    expect(source).not.toContain('--text-primary');
    expect(source).toContain('var(--text)');
  });
});
