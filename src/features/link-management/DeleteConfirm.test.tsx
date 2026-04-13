import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('DeleteConfirm tokens', () => {
  const source = readFileSync(resolve(__dirname, 'DeleteConfirm.tsx'), 'utf-8');

  it('uses semantic danger token not hardcoded red', () => {
    expect(source).not.toContain('text-red-500');
    expect(source).toContain('var(--color-danger)');
  });
});
