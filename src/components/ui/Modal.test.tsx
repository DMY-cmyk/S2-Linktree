import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('Modal with native dialog', () => {
  it('renders a dialog element', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test">Content</Modal>);
    expect(document.querySelector('dialog')).toBeTruthy();
  });

  it('calls showModal when isOpen becomes true', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test">Content</Modal>);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('displays the title', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="My Title">Content</Modal>);
    expect(screen.getByText('My Title')).toBeTruthy();
  });

  it('renders Lucide X icon for close button', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test">Content</Modal>);
    const closeBtn = screen.getByLabelText('Close dialog');
    const svg = closeBtn.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>);
    await user.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalled();
  });
});
