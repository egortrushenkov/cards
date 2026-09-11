'use client';

import {AnimatePresence, motion, useMotionValueEvent, useScroll} from 'framer-motion';
import {Menu, Send, X} from 'lucide-react';
import {useState} from 'react';

import {Logo} from './Logo';
import {cn} from '@/lib/utils';
import {TG_TEXT, tgLink} from '@/content/site';

const LINKS = [
  {href: '/#audience', label: 'Что оплачиваю'},
  {href: '/#how', label: 'Как работает'},
  {href: '/#prices', label: 'Цены'},
  {href: '/#faq', label: 'Вопросы'},
  {href: '/#contact', label: 'Контакты'},
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const {scrollY} = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'container-x flex items-center justify-between py-4 transition-all duration-300',
          scrolled && 'py-3',
        )}
      >
        <Logo />

        <nav aria-label="Разделы" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={tgLink(TG_TEXT.general)}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-white sm:inline-flex"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Связаться
          </a>
          <button
            type="button"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 border-b border-transparent bg-background/70 backdrop-blur-xl transition-opacity duration-300',
          scrolled ? 'opacity-100 border-foreground/10' : 'opacity-0',
        )}
      />

      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Мобильное меню"
            initial={{opacity: 0, y: -8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -8}}
            transition={{duration: 0.2}}
            className="container-x md:hidden"
          >
            <div className="glass mt-2 flex flex-col gap-1 rounded-3xl p-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base text-foreground/90 hover:bg-foreground/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={tgLink(TG_TEXT.general)}
                target="_blank"
                rel="noopener"
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-white"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Связаться в Telegram
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
