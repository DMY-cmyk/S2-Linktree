import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('EditLinkModal accessibility', () => {
  const source = readFileSync(resolve(__dirname, 'EditLinkModal.tsx'), 'utf-8');

  it('select element does not have outline-none', () => {
    expect(source).not.toContain('focus:outline-none');
  });

  it('uses clearer error messages with recovery hints', () => {
    expect(source).toContain('e.g.');
  });
});
