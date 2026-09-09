'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Plus} from 'lucide-react';
import {useState} from 'react';

import {Reveal} from './Reveal';
import {FAQ} from '@/content/site';
import {cn} from '@/lib/utils';

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-24 border-y border-foreground/10 bg-surface py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="eyebrow mb-4">Вопросы</p>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Спрашивают <span className="font-serif font-normal italic text-foreground/80">перед первым платежом.</span>
          </h2>
        </Reveal>

        <Reveal>
          <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              return (
                <li key={item.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium transition-colors hover:text-foreground md:text-xl"
                  >
                    {item.q}
                    <Plus
                      className={cn('h-5 w-5 shrink-0 text-accent transition-transform duration-300', isOpen && 'rotate-45')}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={reduce ? false : {height: 0, opacity: 0}}
                        animate={{height: 'auto', opacity: 1}}
                        exit={reduce ? undefined : {height: 0, opacity: 0}}
                        transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 leading-relaxed text-muted">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
