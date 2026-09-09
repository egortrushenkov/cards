import {Check, Send} from 'lucide-react';

import {Reveal} from './Reveal';
import {PLANS, TELEGRAM_HREF} from '@/content/site';
import {cn} from '@/lib/utils';

export function Pricing() {
  return (
    <section id="prices" className="container-x scroll-mt-24 py-24 md:py-32">
      <Reveal className="text-center">
        <p className="eyebrow mb-4">Цены</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Курс дня плюс комиссия. <span className="font-serif font-normal italic text-foreground/80">Итог знаете до перевода.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted">
          Сумма подписки переводится в рубли по курсу на день оплаты, сверху комиссия по тарифу. Никаких доплат за
          конвертацию и «сервисных сборов» после.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1} className="h-full">
            <article
              className={cn(
                'relative flex h-full flex-col rounded-3xl border p-8 md:p-9',
                plan.highlight ? 'border-accent bg-accent-soft shadow-glow' : 'glass border-foreground/10',
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                  Чаще всего
                </span>
              ) : null}
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{plan.name}</p>
              <p className="mt-2 text-lg font-medium">{plan.audience}</p>
              <p className="text-sm text-muted">{plan.range}</p>
              <p className="mt-6 flex items-end gap-2">
                <span className="text-6xl font-bold tracking-tight">{plan.fee}</span>
                <span className="pb-2 text-muted">комиссия</span>
              </p>
              <p className="mt-1 text-sm text-muted">{plan.feeNote}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={TELEGRAM_HREF}
                target="_blank"
                rel="noopener"
                className={cn(
                  'mt-9 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-colors',
                  plan.highlight ? 'bg-accent text-white hover:bg-foreground hover:text-background' : 'bg-foreground text-background hover:bg-accent hover:text-white',
                )}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Оплатить подписку
              </a>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center text-sm text-muted">
        Пример: ChatGPT Plus за 20 $ при курсе 90 ₽ — это 1 800 ₽ плюс 300 ₽ комиссии, итого 2 100 ₽.
      </Reveal>
    </section>
  );
}
