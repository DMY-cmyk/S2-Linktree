import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RichEmptyState } from './RichEmptyState';

describe('RichEmptyState', () => {
  it('renders emoji, title, and description', () => {
    render(
      <RichEmptyState
        emoji="📭"
        title="No links yet"
        description="Add your first link to get started"
      />
    );
    expect(screen.getByText('📭')).toBeDefined();
    expect(screen.getByText('No links yet')).toBeDefined();
    expect(screen.getByText('Add your first link to get started')).toBeDefined();
  });

  it('renders action button when provided', () => {
    const onAction = vi.fn();
    render(
      <RichEmptyState
        emoji="📭"
        title="No links"
        description="Add a link"
        actionLabel="Add Link"
        onAction={onAction}
      />
    );
    const button = screen.getByRole('button', { name: 'Add Link' });
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('does not render button when no action provided', () => {
    render(
      <RichEmptyState
        emoji="📭"
        title="No links"
        description="Nothing here"
      />
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('emoji span has aria-label', () => {
    render(<RichEmptyState emoji="📚" title="T" description="D" />);
    const emojiEl = screen.getByRole('img');
    expect(emojiEl.getAttribute('aria-label')).toBe('📚');
  });
});
