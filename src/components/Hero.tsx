'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {ArrowDown, Send, ShieldCheck} from 'lucide-react';
import Image from 'next/image';

import {MagneticButton} from './MagneticButton';
import heroImage from '@/images/card-stack.webp';
import {PAYMENT_TIME, TAGLINE, TG_TEXT, tgLink} from '@/content/site';

const TRUST = ['Наши зарубежные карты', 'Сумма известна до перевода', 'Чек после оплаты', 'Возврат, если платёж не прошёл'];

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : {opacity: 0, y: 28},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay},
  });

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[-30%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="container-x relative">
        <div className="corner relative border border-foreground/10 bg-background/70 px-6 py-12 sm:px-10 md:px-16 md:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <motion.p {...fade(0)} className="eyebrow mb-8">
                {TAGLINE}
              </motion.p>

              <motion.h1
                {...fade(0.1)}
                className="text-[clamp(2.5rem,6vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.03em] text-balance"
              >
                Оплатим любую зарубежную подписку.{' '}
                <span className="font-serif font-normal italic text-foreground/80">Нашей картой, сегодня.</span>
              </motion.h1>

              <motion.p {...fade(0.2)} className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                ChatGPT, Netflix, Spotify, Apple, Google Ads, Figma, AWS и всё, что не берёт российскую карту. Для себя и
                для компании. Вы переводите рубли по СБП, мы платим картой {PAYMENT_TIME} и присылаем чек.
              </motion.p>

              <motion.div {...fade(0.3)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <MagneticButton href={tgLink(TG_TEXT.general)} external>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Написать в Telegram
                </MagneticButton>
                <MagneticButton href="#prices" variant="outline">
                  Посмотреть цены
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </MagneticButton>
              </motion.div>
            </div>

            <motion.div {...fade(0.25)}>
              <Image
                src={heroImage}
                alt="Стопка зарубежных платёжных карт и плитки сервисов вокруг: Google, AWS, Figma, Notion, OpenAI, JetBrains"
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="illustration"
              />
            </motion.div>
          </div>

          <motion.ul {...fade(0.45)} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-foreground/10 pt-6">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground/70">
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
