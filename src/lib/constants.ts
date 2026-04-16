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
  { id: 'cat-prev-years', name: 'Materi Pasca Maksi', emoji: '📖', color: '#ffb3f0', order: 2, createdAt: 1 },
  { id: 'cat-sem-1', name: 'Materi (Sem. 1)', emoji: '📘', color: '#ffd078', order: 3, createdAt: 1 },
  { id: 'cat-sem-2', name: 'Materi (Sem. 2)', emoji: '📗', color: '#c4b5fd', order: 4, createdAt: 1 },
  { id: 'cat-sem-3', name: 'Materi (Sem. 3)', emoji: '📙', color: '#fca5a5', order: 5, createdAt: 1 },
  { id: 'cat-sem-4', name: 'Materi (Sem. 4)', emoji: '📕', color: '#86efac', order: 6, createdAt: 1 },
  { id: 'cat-schedules', name: 'Jadwal Kuliah S2', emoji: '📅', color: '#fde68a', order: 7, createdAt: 1 },
  { id: '_jztODWj4j17xbBkYO3aS', name: 'Jadwal Ujian S2', emoji: '📅', color: '#86efac', order: 8, createdAt: 1 },
];

export const DEFAULT_LINKS: Link[] = [
  { id: 'link-tpa-1', categoryId: 'cat-tpa', title: 'Portal ETC', url: 'https://portal.etc.web.id/', description: 'Toefl & TPA dari berbagai tempat', order: 0, createdAt: 1 },
  { id: 'link-tpa-2', categoryId: 'cat-tpa', title: 'Jadwal TPA', url: 'https://koperasi.bappenas.go.id/jadwal-tpa/', description: 'Jadwal TPA resmi dari UUO PT Bapennas', order: 1, createdAt: 1 },
  { id: 'link-toefl-1', categoryId: 'cat-toefl', title: 'ILP Cikini Online Schedule', url: 'https://ilpcikini.com/online-schedule', description: 'Paling disarankan untuk TOEFL Online', order: 0, createdAt: 1 },
  { id: 'x-z4Stn7ZHfpMxkEBxpR_', categoryId: 'cat-toefl', title: 'Speaking Partner (Toefl Prediction)', url: 'https://speakingpartner.id/test-toefl-online-kampung-inggris', description: 'Buat Persiapan Toefl sebelum aslinya', order: 1, createdAt: 1 },
  { id: 'pmX1Us1g9JhI99fVrq9RS', categoryId: 'cat-prev-years', title: 'Akt. 24 - Seadanya', url: 'https://drive.google.com/drive/folders/10nM5usogoVpkhZWa8o851P9PBtUJSFj1?usp=sharing', description: 'Materi + Soal Taun Lalu Akt. 24', order: 0, createdAt: 1 },
  { id: 'f4S4cWYu_4vSGuojDevIG', categoryId: 'cat-sem-1', title: 'Pelaporan Keuangan Korporat', url: 'https://classroom.google.com/c/ODQ4NTk2NDkxNTQw', description: 'Google Classroom', order: 0, createdAt: 1 },
];
