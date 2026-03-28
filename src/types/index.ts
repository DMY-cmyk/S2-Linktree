export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  createdAt: number;
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

export type ToastVariant = 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}
