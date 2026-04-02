import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HighlightText } from './HighlightText';

describe('HighlightText', () => {
  it('returns plain text when query is empty', () => {
    const { container } = render(<HighlightText text="Hello World" query="" />);
    expect(container.textContent).toBe('Hello World');
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });

  it('wraps matching text in mark elements', () => {
    const { container } = render(<HighlightText text="Hello World" query="World" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe('World');
  });

  it('is case insensitive', () => {
    const { container } = render(<HighlightText text="Hello World" query="hello" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe('Hello');
  });

  it('highlights multiple occurrences', () => {
    const { container } = render(<HighlightText text="foo bar foo" query="foo" />);
    expect(container.querySelectorAll('mark')).toHaveLength(2);
  });

  it('handles special regex characters in query', () => {
    const { container } = render(<HighlightText text="price is $10.00" query="$10.00" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].textContent).toBe('$10.00');
  });

  it('returns plain text when no match found', () => {
    const { container } = render(<HighlightText text="Hello World" query="xyz" />);
    expect(container.textContent).toBe('Hello World');
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });
});
