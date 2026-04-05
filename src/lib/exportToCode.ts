import type { Category, Link } from '@/types';

function formatCategory(cat: Category): string {
  return `  { id: ${JSON.stringify(cat.id)}, name: ${JSON.stringify(cat.name)}, emoji: ${JSON.stringify(cat.emoji)}, color: ${JSON.stringify(cat.color)}, order: ${cat.order}, createdAt: 1 }`;
}

function formatLink(link: Link): string {
  const descPart = link.description != null
    ? `, description: ${JSON.stringify(link.description)}`
    : '';
  return `  { id: ${JSON.stringify(link.id)}, categoryId: ${JSON.stringify(link.categoryId)}, title: ${JSON.stringify(link.title)}, url: ${JSON.stringify(link.url)}${descPart}, order: ${link.order}, createdAt: 1 }`;
}

export function generateConstantsSource(categories: Category[], links: Link[]): string {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  const catsBlock = sortedCategories.length > 0
    ? `[\n${sortedCategories.map(formatCategory).join(',\n')},\n]`
    : '[]';

  const linksBlock = sortedLinks.length > 0
    ? `[\n${sortedLinks.map(formatLink).join(',\n')},\n]`
    : '[]';

  return [
    '// Paste this into src/lib/constants.ts — replace DEFAULT_CATEGORIES and DEFAULT_LINKS',
    '',
    `export const DEFAULT_CATEGORIES: Category[] = ${catsBlock};`,
    '',
    `export const DEFAULT_LINKS: Link[] = ${linksBlock};`,
  ].join('\n');
}
