export const DRAG_CARD_LIFT = {
  scale: 1.05,
  rotate: 2,
  boxShadow: '6px 6px 0px var(--border-color)',
};

export const DRAG_CARD_SETTLE = {
  scale: 1,
  rotate: 0,
  boxShadow: '4px 4px 0px var(--border-color)',
};

export const DRAG_LINK_LIFT = {
  scale: 1.03,
  boxShadow: '3px 3px 0px var(--border-color)',
};

export const DRAG_LINK_SETTLE = {
  scale: 1,
  boxShadow: 'none',
};

export const DRAG_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export const DRAG_SETTLE_TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

export const SORTABLE_TRANSITION = {
  duration: 200,
  easing: 'ease',
};
