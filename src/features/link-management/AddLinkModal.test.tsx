import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddLinkModal } from './AddLinkModal';
import { useLinkStore } from '@/store/useLinkStore';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('AddLinkModal accessibility', () => {
  const source = readFileSync(resolve(__dirname, 'AddLinkModal.tsx'), 'utf-8');

  it('select element does not have outline-none', () => {
    expect(source).not.toContain('focus:outline-none');
  });

  it('uses clearer error messages with recovery hints', () => {
    expect(source).toContain('e.g.');
  });

  it('requires category selection when no preset is given', () => {
    useLinkStore.setState({
      categories: [
        { id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' },
      ],
      links: [],
      lastUpdatedAt: 1,
    });
    render(<AddLinkModal isOpen onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText(/title/i, { selector: 'input' }), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText(/^url/i, { selector: 'input' }), { target: { value: 'https://x.com' } });
    // Submit without picking a category
    fireEvent.click(screen.getByRole('button', { name: /add link/i, hidden: true }));
    expect(useLinkStore.getState().links).toHaveLength(0);
    expect(screen.getByText('Select a category')).toBeInTheDocument();
  });
});

describe('AddLinkModal tokens', () => {
  const source = readFileSync(resolve(__dirname, 'AddLinkModal.tsx'), 'utf-8');

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
