import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function extractTitleFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    const clean = hostname.replace(/^www\./, '');
    const name = clean.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return '';
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRelative(ms: number, now: number = Date.now()): string {
  const delta = Math.max(0, now - ms);
  const sec = Math.floor(delta / 1_000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minutes ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hours ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} days ago`;
  if (day < 30) return `${Math.floor(day / 7)} weeks ago`;
  return `${Math.floor(day / 30)} months ago`;
}
