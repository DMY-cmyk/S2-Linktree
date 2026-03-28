import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useToastStore } from './useToastStore';

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useToastStore', () => {
  it('adds a toast with id, message, and variant', () => {
    useToastStore.getState().addToast('Hello', 'success');
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Hello');
    expect(toasts[0].variant).toBe('success');
    expect(toasts[0].id).toBeTruthy();
  });

  it('auto-removes toast after 4 seconds', () => {
    useToastStore.getState().addToast('Temp', 'warning');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(4000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('manually removes a specific toast', () => {
    useToastStore.getState().addToast('A', 'success');
    useToastStore.getState().addToast('B', 'error');
    const id = useToastStore.getState().toasts[0].id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0].message).toBe('B');
  });
});
