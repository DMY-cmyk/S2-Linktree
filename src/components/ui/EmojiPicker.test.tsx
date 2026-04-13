import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmojiPicker } from './EmojiPicker';

describe('EmojiPicker accessibility', () => {
  it('has role="radiogroup" on the container', () => {
    render(<EmojiPicker selected="📚" onSelect={() => {}} />);
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('has aria-label on the radiogroup', () => {
    render(<EmojiPicker selected="📚" onSelect={() => {}} />);
    expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe('Choose category emoji');
  });

  it('each emoji button has role="radio"', () => {
    render(<EmojiPicker selected="📚" onSelect={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(30);
  });

  it('selected emoji has aria-checked="true"', () => {
    render(<EmojiPicker selected="📚" onSelect={() => {}} />);
    const selected = screen.getByLabelText(/Books emoji/i);
    expect(selected.getAttribute('aria-checked')).toBe('true');
  });

  it('unselected emoji has aria-checked="false"', () => {
    render(<EmojiPicker selected="📚" onSelect={() => {}} />);
    const unselected = screen.getByLabelText(/Memo emoji/i);
    expect(unselected.getAttribute('aria-checked')).toBe('false');
  });
});
