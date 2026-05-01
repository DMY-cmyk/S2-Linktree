import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UndoToast } from './UndoToast';

describe('UndoToast', () => {
  const defaultProps = {
    message: 'Category deleted',
    duration: 5000,
    onUndo: vi.fn(),
    onDismiss: vi.fn(),
  };

  it('renders the message', () => {
    render(<UndoToast {...defaultProps} />);
    expect(screen.getByText('Category deleted')).toBeDefined();
  });

  it('renders the Undo button', () => {
    render(<UndoToast {...defaultProps} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeDefined();
  });

  it('calls onUndo and onDismiss when Undo is clicked', () => {
    const onUndo = vi.fn();
    const onDismiss = vi.fn();
    render(<UndoToast {...defaultProps} onUndo={onUndo} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders a progress bar', () => {
    const { container } = render(<UndoToast {...defaultProps} />);
    const progressBar = container.querySelector('[data-testid="undo-progress"]');
    expect(progressBar).toBeDefined();
  });
});
