import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls handler when matching key is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ t: handler }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('handles modifier keys (Ctrl)', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ 'mod+k': handler }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not fire when typing in an input', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ t: handler }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: 't', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('cleans up listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyboardShortcuts({ t: vi.fn() }));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('prevents default on matched shortcuts', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ 'mod+k': handler }));

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    expect(preventSpy).toHaveBeenCalled();
  });
});
