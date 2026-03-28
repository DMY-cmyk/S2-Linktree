'use client';

import { motion } from 'framer-motion';
import { springBouncy } from '@/animations/variants';

export function HeroSection() {
  return (
    <div className="text-center py-8 px-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={springBouncy}
        className="text-4xl mb-3"
      >
        📚
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ...springBouncy }}
        className="text-2xl md:text-3xl font-black text-[var(--text-primary)]"
      >
        S2 Resource Hub
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-[var(--text-secondary)] mt-2"
      >
        All your Master&apos;s degree resources in one place
      </motion.p>
    </div>
  );
}
