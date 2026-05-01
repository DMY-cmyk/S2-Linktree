import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkItem } from './LinkItem';

const link = {
  id: 'l1', categoryId: 'c1',
  title: 'Portal ETC', url: 'https://github.com/foo',
  description: 'desc', order: 0, createdAt: 1,
};

describe('LinkItem polished', () => {
  it('renders monogram for github.com (G)', () => {
    render(<LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByLabelText(/github\.com/i).textContent).toBe('G');
  });
  it('exposes data-link-id for shortcut focus', () => {
    const { container } = render(
      <LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />
    );
    expect(container.querySelector('[data-link-id="l1"]')).toBeInTheDocument();
  });
  it('shows external arrow icon', () => {
    const { container } = render(
      <LinkItem link={link} accentColor="#16a34a" onEdit={() => {}} onDelete={() => {}} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
