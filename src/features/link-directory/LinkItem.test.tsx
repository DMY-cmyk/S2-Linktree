import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkItem } from './LinkItem';

const mockLink = { id: 'l1', categoryId: 'c1', title: 'My Link', url: 'https://example.com', order: 0, createdAt: 1 };

describe('LinkItem', () => {
  it('renders Lucide icons for edit and delete (SVGs)', () => {
    render(<LinkItem link={mockLink} accentColor="#a8ff78" onEdit={vi.fn()} onDelete={vi.fn()} />);
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it('edit button has aria-label with link title', () => {
    render(<LinkItem link={mockLink} accentColor="#a8ff78" onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByLabelText('Edit My Link')).toBeTruthy();
  });

  it('delete button has aria-label with link title', () => {
    render(<LinkItem link={mockLink} accentColor="#a8ff78" onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByLabelText('Delete My Link')).toBeTruthy();
  });

  it('action buttons are always visible at 60% opacity', () => {
    render(<LinkItem link={mockLink} accentColor="#a8ff78" onEdit={vi.fn()} onDelete={vi.fn()} />);
    const editBtn = screen.getByLabelText('Edit My Link');
    const container = editBtn.parentElement!;
    expect(container.className).toContain('opacity-60');
    expect(container.className).not.toContain('opacity-0');
  });

  it('does not render → text (uses ArrowRight icon instead)', () => {
    const { container } = render(<LinkItem link={mockLink} accentColor="#a8ff78" onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(container.textContent).not.toContain('→');
  });
});
