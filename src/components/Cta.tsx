'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Send} from 'lucide-react';
import {useEffect, useState} from 'react';

import {MagneticButton} from './MagneticButton';
import {RESPONSE_TIME, TELEGRAM_HREF} from '@/content/site';

const WORDS = ['ChatGPT Plus', 'Netflix', 'Google Ads', 'Figma', 'Spotify', 'AWS'];

export function Cta() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const longest = WORDS.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <section className="relative overflow-hidden border-t border-foreground/10 py-28 md:py-40">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[60vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[160px]"
      />
      <div className="container-x relative text-center">
        <p className="eyebrow mb-6">Готовы?</p>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Оплатим
          <br />
          <span className="inline-grid place-items-center">
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-serif italic">
              {longest}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[index]}
                initial={reduce ? false : {y: 24, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={reduce ? undefined : {y: -24, opacity: 0}}
                transition={{type: 'spring', stiffness: 300, damping: 26}}
                className="col-start-1 row-start-1 font-serif font-normal italic text-accent-hot"
              >
                {WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          прямо сейчас
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
          Напишите, что оплатить и на какой срок. Ответим {RESPONSE_TIME} в рабочее время и назовём сумму в рублях.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton href={TELEGRAM_HREF} external className="px-9 py-5 text-base">
            <Send className="h-5 w-5" aria-hidden="true" />
            Написать в Telegram
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline" className="px-9 py-5 text-base">
            Оставить заявку на сайте
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
