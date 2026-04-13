import { describe, it, expect } from 'vitest';

describe('lucide-react dependency', () => {
  it('can import Lucide icons', async () => {
    const { Pencil, Trash2, Search, X, Plus, ArrowRight, Globe, Link, AlertCircle, Monitor } = await import('lucide-react');
    expect(Pencil).toBeDefined();
    expect(Trash2).toBeDefined();
    expect(Search).toBeDefined();
    expect(X).toBeDefined();
    expect(Plus).toBeDefined();
    expect(ArrowRight).toBeDefined();
    expect(Globe).toBeDefined();
    expect(Link).toBeDefined();
    expect(AlertCircle).toBeDefined();
    expect(Monitor).toBeDefined();
  });
});
