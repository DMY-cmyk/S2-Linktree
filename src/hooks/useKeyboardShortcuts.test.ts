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

  it('does not fire for bare single-letter keys when no handler registered', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ 'mod+k': handler }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('skips shortcuts when a <dialog> is open', () => {
    const cb = vi.fn();
    document.body.innerHTML = '<dialog open></dialog><div tabindex="0" data-card-id="c1"></div>';
    const card = document.querySelector('[data-card-id]') as HTMLElement;
    card.focus();
    renderHook(() => useKeyboardShortcuts({ e: cb }));
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
    expect(cb).not.toHaveBeenCalled();
  });

  it('skips when active element is SELECT', () => {
    const cb = vi.fn();
    document.body.innerHTML = '<select><option>a</option></select>';
    const sel = document.querySelector('select') as HTMLSelectElement;
    sel.focus();
    renderHook(() => useKeyboardShortcuts({ e: cb }));
    sel.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
    expect(cb).not.toHaveBeenCalled();
  });
});
