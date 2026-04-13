'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode, type CSSProperties } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
}

const getVariants = (direction: string, delay: number): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
});

export default function AnimatedSection({
  children,
  delay = 0,
  direction = 'up',
  className,
  style,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={getVariants(direction, delay)}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
