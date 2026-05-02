import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('DeleteConfirm tokens', () => {
  const source = readFileSync(resolve(__dirname, 'DeleteConfirm.tsx'), 'utf-8');

  it('uses polished --danger token, not legacy --color-danger', () => {
    expect(source).not.toContain('--color-danger');
    expect(source).not.toContain('text-red-500');
    expect(source).toContain('var(--danger)');
  });

  it('uses Button variant="danger" instead of className override', () => {
    expect(source).toContain('variant="danger"');
    expect(source).not.toContain('!bg-[');
  });
});
