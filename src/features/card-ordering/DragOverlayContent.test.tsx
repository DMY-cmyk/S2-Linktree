import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('DragOverlayContent responsive sizing', () => {
  const source = readFileSync(resolve(__dirname, 'DragOverlayContent.tsx'), 'utf-8');

  it('category preview uses responsive max-width not fixed w-64', () => {
    expect(source).not.toMatch(/\bw-64\b/);
    expect(source).toContain('max-w-[16rem]');
    expect(source).toContain('w-[80vw]');
  });

  it('link preview uses responsive max-width not fixed w-56', () => {
    expect(source).not.toMatch(/\bw-56\b/);
    expect(source).toContain('max-w-[14rem]');
    expect(source).toContain('w-[75vw]');
  });
});
