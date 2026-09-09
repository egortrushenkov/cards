'use client';

import {motion, useMotionValue, useReducedMotion, useSpring} from 'framer-motion';
import {useRef, useState, type MouseEvent, type ReactNode} from 'react';

import {cn} from '@/lib/utils';

interface Props {
  children: ReactNode;
  href: string;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  external?: boolean;
}

/** Кнопка с «магнитным» притяжением к курсору и заливкой при наведении. */
export function MagneticButton({children, href, variant = 'primary', className, external}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {stiffness: 200, damping: 18, mass: 0.2});
  const sy = useSpring(y, {stiffness: 200, damping: 18, mass: 0.2});

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const base =
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[15px] font-semibold transition-colors duration-300';
  const variants = {
    primary: 'bg-accent text-white shadow-glow',
    outline: 'border border-foreground/20 text-foreground',
    ghost: 'text-foreground/80 hover:text-foreground',
  } as const;
  // Цвет заливки, которая поднимается снизу при наведении.
  const fill = {
    primary: 'bg-foreground',
    outline: 'bg-foreground',
    ghost: 'bg-foreground/5',
  } as const;
  const hoverText = {
    primary: 'text-background',
    outline: 'text-background',
    ghost: 'text-foreground',
  } as const;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={reduce ? undefined : {x: sx, y: sy}}
      whileTap={reduce ? undefined : {scale: 0.96}}
      className="inline-block"
    >
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        className={cn(base, variants[variant], className)}
      >
        <motion.span
          aria-hidden="true"
          className={cn('absolute inset-0 z-0 rounded-full', fill[variant])}
          initial={false}
          animate={reduce ? {y: hovered ? '0%' : '100%'} : {y: hovered ? '0%' : '100%', borderRadius: hovered ? '0%' : '50% 50% 0 0'}}
          transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
        />
        <span className={cn('relative z-10 flex items-center gap-3 transition-colors duration-300', hovered && hoverText[variant])}>
          {children}
        </span>
      </a>
    </motion.div>
  );
}
