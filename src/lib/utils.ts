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
