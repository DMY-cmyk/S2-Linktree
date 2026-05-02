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

describe('EditLinkModal tokens', () => {
  const source = readFileSync(resolve(__dirname, 'EditLinkModal.tsx'), 'utf-8');

  it('uses --text-2 not legacy --text-primary in category label', () => {
    expect(source).not.toContain('--text-primary');
    expect(source).toContain('var(--text-2)');
  });

  it('uses --surface not legacy --bg-card in category select', () => {
    expect(source).not.toContain('--bg-card');
    expect(source).toContain('var(--surface)');
  });

  it('uses --border-soft not legacy --border-color in category select', () => {
    expect(source).not.toContain('--border-color');
    expect(source).toContain('var(--border-soft)');
  });

  it('uses --danger not hardcoded text-red-500 for error text', () => {
    expect(source).not.toContain('text-red-500');
    expect(source).toContain('var(--danger)');
  });
});
