import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CssOrbs } from './CssOrbs';

describe('CssOrbs', () => {
  it('renders 4 orbs + 1 conic accent in light mode', () => {
    const { container } = render(<CssOrbs theme="light" />);
    const wrap = container.querySelector('.animated-bg')!;
    expect(wrap).toBeInTheDocument();
    expect(wrap.children.length).toBe(5);
  });
  it('uses dark palette when theme="dark"', () => {
    const { container } = render(<CssOrbs theme="dark" />);
    const orbs = Array.from(container.querySelectorAll('.animated-bg > div'));
    const bg = (orbs[0] as HTMLElement).style.background;
    expect(bg).toContain('#7c3aed');
  });
});
