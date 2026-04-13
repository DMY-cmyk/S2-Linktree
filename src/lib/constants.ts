import type { Category, Link } from '@/types';

export const CATEGORY_COLORS = [
  { hex: '#a8ff78', textColor: '#222222' },  // Lime
  { hex: '#78d6ff', textColor: '#222222' },  // Cyan
  { hex: '#ffb3f0', textColor: '#222222' },  // Pink
  { hex: '#ffd078', textColor: '#222222' },  // Orange
  { hex: '#c4b5fd', textColor: '#222222' },  // Lavender
  { hex: '#fca5a5', textColor: '#222222' },  // Coral
  { hex: '#86efac', textColor: '#222222' },  // Mint
  { hex: '#fde68a', textColor: '#222222' },  // Yellow
] as const;

export const EMOJI_OPTIONS = [
  '📝', '🌐', '📖', '📘', '📗', '📙', '📕', '📅',
  '📚', '🎓', '💻', '📊', '🔬', '📐', '✏️', '🗂️',
  '📌', '🔗', '📎', '🏫', '🧪', '📈', '🗓️', '💡',
  '🎯', '📋', '🔍', '⭐', '🏆', '📁',
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-tpa', name: 'TPA', emoji: '📝', color: '#a8ff78', order: 0, createdAt: 1 },
  { id: 'cat-toefl', name: 'TOEFL', emoji: '🌐', color: '#78d6ff', order: 1, createdAt: 1 },
  { id: 'cat-prev-years', name: 'Study Resources (Previous Years)', emoji: '📖', color: '#ffb3f0', order: 2, createdAt: 1 },
  { id: 'cat-sem-1', name: 'Study Resources (Sem. 1)', emoji: '📘', color: '#ffd078', order: 3, createdAt: 1 },
  { id: 'cat-sem-2', name: 'Study Resources (Sem. 2)', emoji: '📗', color: '#c4b5fd', order: 4, createdAt: 1 },
  { id: 'cat-sem-3', name: 'Study Resources (Sem. 3)', emoji: '📙', color: '#fca5a5', order: 5, createdAt: 1 },
  { id: 'cat-sem-4', name: 'Study Resources (Sem. 4)', emoji: '📕', color: '#86efac', order: 6, createdAt: 1 },
  { id: 'cat-schedules', name: 'Schedules', emoji: '📅', color: '#fde68a', order: 7, createdAt: 1 },
];

export const DEFAULT_LINKS: Link[] = [
  { id: 'link-tpa-1', categoryId: 'cat-tpa', title: 'Portal ETC', url: 'https://portal.etc.web.id/', order: 0, createdAt: 1 },
  { id: 'link-tpa-2', categoryId: 'cat-tpa', title: 'Jadwal TPA', url: 'https://koperasi.bappenas.go.id/jadwal-tpa/', order: 1, createdAt: 1 },
  { id: 'link-toefl-1', categoryId: 'cat-toefl', title: 'ILP Online Schedule', url: 'https://ilpcikini.com/online-schedule', order: 0, createdAt: 1 },
  { id: 'link-toefl-2', categoryId: 'cat-toefl', title: 'PTOEFL', url: 'https://ilpcikini.com/ptoefl.php', order: 1, createdAt: 1 },
];
