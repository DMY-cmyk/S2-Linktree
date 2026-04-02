export const springBouncy = { type: 'spring' as const, stiffness: 300, damping: 20 };
export const springGentle = { type: 'spring' as const, stiffness: 200, damping: 25 };

export const popIn = {
  initial: { scale: 0.8, opacity: 0, rotate: -2 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.8, opacity: 0 },
  transition: springBouncy,
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem = {
  initial: { scale: 0.8, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0, transition: springBouncy },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

export const slideInLeft = {
  initial: { x: -30, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: springGentle },
  exit: { x: -30, opacity: 0, transition: { duration: 0.2 } },
};

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: springBouncy },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};

export const cardHover = {
  y: -4,
  rotate: 0.5,
  transition: springGentle,
};

export const popOut = {
  initial: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

export const springSmooth = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};
