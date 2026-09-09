import {Check, Clock3, CreditCard, Receipt, ShieldCheck} from 'lucide-react';
import Image from 'next/image';

import {Reveal} from './Reveal';
import servicesImage from '@/images/card-services.webp';
import worldImage from '@/images/card-world.webp';
import {AUDIENCES, BENEFITS} from '@/content/site';

const ICONS = [CreditCard, Clock3, Receipt, ShieldCheck];

export function Benefits() {
  return (
    <section id="benefits" className="container-x scroll-mt-24 py-24 md:py-32">
      <Reveal>
        <p className="eyebrow mb-4">Почему это работает</p>
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Подписка оплачена, <span className="font-serif font-normal italic text-foreground/80">а не «попробуйте другую карту».</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {BENEFITS.map((b, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={b.title} delay={i * 0.08}>
              <article className="glass group relative h-full rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9">
                <span className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold md:text-2xl">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{b.text}</p>
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 font-mono text-xs text-foreground/25 transition-colors group-hover:text-accent"
                >
                  0{i + 1}
                </span>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div id="audience" className="mt-24 scroll-mt-24">
        <Reveal>
          <p className="eyebrow mb-4">Кому подходит</p>
          <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Себе <span className="font-serif font-normal italic text-foreground/80">или</span> компании.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.1}>
              <div className="grid gap-6">
                <Image
                  src={i === 0 ? servicesImage : worldImage}
                  alt={
                    i === 0
                      ? 'Зарубежная карта и чек с оплаченными подписками: Google, AWS, Figma, Notion, OpenAI'
                      : 'Зарубежная карта и карта мира с валютами: платежи в евро, юанях, лирах, дирхамах и долларах'
                  }
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="illustration"
                />
                <div className="corner relative border border-foreground/10 bg-background p-7 md:p-9">
                  <h3 className="text-2xl font-semibold md:text-3xl">{a.title}</h3>
                  <p className="mt-2 text-muted">{a.lead}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {a.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <p className="max-w-2xl text-muted">
            Нет в списке? Напишите название сервиса: если он принимает карты, оплатим. Чаще всего похожее мы уже оплачивали.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
