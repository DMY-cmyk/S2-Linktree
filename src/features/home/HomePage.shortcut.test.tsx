import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { HomePage } from './HomePage';
import { useLinkStore } from '@/store/useLinkStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('@/features/background-effects/AnimatedBackground', () => ({
  AnimatedBackground: () => null,
}));

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
  useLinkStore.setState({
    categories: [{ id: 'c1', name: 'A', emoji: '📘', color: '#16a34a', order: 0, createdAt: 1, tag: 'Coursework' }],
    links: [{ id: 'l1', categoryId: 'c1', title: 'L', url: 'https://x.com', order: 0, createdAt: 1 }],
    lastUpdatedAt: 1,
  });
});

describe('HomePage E/D shortcuts', () => {
  it('pressing E with a card focused opens edit modal (a <dialog>)', () => {
    const { container } = render(<HomePage />);
    const card = container.querySelector('[data-card-id="c1"]') as HTMLElement;
    expect(card).toBeInTheDocument();
    card.focus();
    act(() => {
      fireEvent.keyDown(window, { key: 'e' });
    });
    expect(container.querySelector('dialog[open]')).toBeInTheDocument();
  });
});
