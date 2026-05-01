export type CategoryTag =
  | 'Entry exam'
  | 'Language'
  | 'Coursework'
  | 'Calendar'
  | 'Archive';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  createdAt: number;
  tag: CategoryTag;
}

export interface Link {
  id: string;
  categoryId: string;
  title: string;
  url: string;
  description?: string;
  order: number;
  createdAt: number;
}

export type ToastVariant = 'success' | 'warning' | 'error' | 'undo';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  undoAction?: () => void;
  duration?: number;
}
