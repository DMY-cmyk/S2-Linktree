import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupHeader } from './GroupHeader';

describe('GroupHeader', () => {
  it('renders uppercase tag and zero-padded count', () => {
    render(<GroupHeader title="Coursework" count={4} />);
    expect(screen.getByText('Coursework')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });
  it('renders count >= 10 without padding', () => {
    render(<GroupHeader title="Calendar" count={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
