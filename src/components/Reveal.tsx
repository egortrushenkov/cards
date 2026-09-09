'use client';

import {motion, useReducedMotion} from 'framer-motion';
import type {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Мягкое появление блока при прокрутке. При prefers-reduced-motion — без движения. */
export function Reveal({children, className, delay = 0, y = 24}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : {opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1], delay}}
    >
      {children}
    </motion.div>
  );
}
