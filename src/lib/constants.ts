import type { Category, CategoryTag, Link } from '@/types';

export const CATEGORY_TAGS = [
  'Entry exam', 'Language', 'Coursework', 'Calendar', 'Archive',
] as const satisfies readonly CategoryTag[];

export const CATEGORY_TAG_ORDER: readonly CategoryTag[] = CATEGORY_TAGS;
export const DEFAULT_CATEGORY_TAG: CategoryTag = 'Coursework';

export const SEED_LAST_UPDATED: number =
  Number(process.env.NEXT_PUBLIC_BUILD_TIME) || Date.now();

export const CATEGORY_COLORS = [
  { hex: '#16a34a', textColor: '#ffffff' },
  { hex: '#0284c7', textColor: '#ffffff' },
  { hex: '#db2777', textColor: '#ffffff' },
  { hex: '#ea580c', textColor: '#ffffff' },
  { hex: '#7c3aed', textColor: '#ffffff' },
  { hex: '#dc2626', textColor: '#ffffff' },
  { hex: '#059669', textColor: '#ffffff' },
  { hex: '#ca8a04', textColor: '#ffffff' },
  { hex: '#0d9488', textColor: '#ffffff' },
] as const;

export const EMOJI_OPTIONS = [
  '📝','🌐','📖','📘','📗','📙','📕','📅','📚','🎓','💻','📊','🔬','📐','✏️','🗂️',
  '📌','🔗','📎','🏫','🧪','📈','🗓️','💡','🎯','📋','🔍','⭐','🏆','📁',
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-tpa',         name: 'TPA',                emoji: '📝', color: '#16a34a', order: 0, createdAt: 1, tag: 'Entry exam' },
  { id: 'cat-toefl',       name: 'TOEFL',              emoji: '🌐', color: '#0284c7', order: 1, createdAt: 1, tag: 'Language'   },
  { id: 'cat-prev-years',  name: 'Materi Pasca Maksi', emoji: '📖', color: '#db2777', order: 2, createdAt: 1, tag: 'Archive'    },
  { id: 'cat-sem-1',       name: 'Materi (Sem. 1)',    emoji: '📘', color: '#ea580c', order: 3, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-2',       name: 'Materi (Sem. 2)',    emoji: '📗', color: '#7c3aed', order: 4, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-3',       name: 'Materi (Sem. 3)',    emoji: '📙', color: '#dc2626', order: 5, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-sem-4',       name: 'Materi (Sem. 4)',    emoji: '📕', color: '#059669', order: 6, createdAt: 1, tag: 'Coursework' },
  { id: 'cat-schedules',   name: 'Jadwal Kuliah S2',   emoji: '📅', color: '#ca8a04', order: 7, createdAt: 1, tag: 'Calendar'   },
  { id: '_jztODWj4j17xbBkYO3aS', name: 'Jadwal Ujian S2', emoji: '📅', color: '#0d9488', order: 8, createdAt: 1, tag: 'Calendar' },
];

export const DEFAULT_LINKS: Link[] = [
  { id: 'link-tpa-1', categoryId: 'cat-tpa', title: 'Portal ETC', url: 'https://portal.etc.web.id/', description: 'Toefl & TPA dari berbagai tempat', order: 0, createdAt: 1 },
  { id: 'link-tpa-2', categoryId: 'cat-tpa', title: 'Jadwal TPA', url: 'https://koperasi.bappenas.go.id/jadwal-tpa/', description: 'Jadwal TPA resmi dari UUO PT Bapennas', order: 1, createdAt: 1 },
  { id: 'link-toefl-1', categoryId: 'cat-toefl', title: 'ILP Cikini Online Schedule', url: 'https://ilpcikini.com/online-schedule', description: 'Paling disarankan untuk TOEFL Online', order: 0, createdAt: 1 },
  { id: 'x-z4Stn7ZHfpMxkEBxpR_', categoryId: 'cat-toefl', title: 'Speaking Partner (Toefl Prediction)', url: 'https://speakingpartner.id/test-toefl-online-kampung-inggris', description: 'Buat Persiapan Toefl sebelum aslinya', order: 1, createdAt: 1 },
  { id: 'pmX1Us1g9JhI99fVrq9RS', categoryId: 'cat-prev-years', title: 'Akt. 24 - Seadanya', url: 'https://drive.google.com/drive/folders/10nM5usogoVpkhZWa8o851P9PBtUJSFj1?usp=sharing', description: 'Materi + Soal Taun Lalu Akt. 24', order: 0, createdAt: 1 },
  { id: 'f4S4cWYu_4vSGuojDevIG', categoryId: 'cat-sem-1', title: 'Pelaporan Keuangan Korporat', url: 'https://classroom.google.com/c/ODQ4NTk2NDkxNTQw', description: 'Google Classroom', order: 0, createdAt: 1 },
  { id: 'ZfDpFVdtO2W9TChRM6yni', categoryId: 'cat-sem-1', title: 'PKK - Ringkasan dsb', url: 'https://github.com/DMY-cmyk/pkk-course-materials', description: 'Ringkasan, Study Guide, Exercise, Review Sheet', order: 1, createdAt: 1 },
  { id: '3wKnrjshuKLGPWO5tiuTA', categoryId: 'cat-sem-1', title: 'Managemen Stratejik - Ringkasan dsb', url: 'https://github.com/DMY-cmyk/msk304-course-materials', description: 'Ringkasan, Study Guide, Exercise, Review Sheet', order: 2, createdAt: 1 },
  { id: 'kEzCYtAZqP2xs3kWEpOBh', categoryId: 'cat-sem-1', title: 'ALK - Ringkasan dsb', url: 'https://github.com/DMY-cmyk/FSA-ALK301', description: 'Ringkasan, Study Guide, Exercise, Review Sheet', order: 3, createdAt: 1 },
];
