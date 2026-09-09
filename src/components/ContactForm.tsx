'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {CheckCircle2, Send} from 'lucide-react';
import {useState, type FormEvent} from 'react';

import {Reveal} from './Reveal';
import {CONTACT_EMAIL, RESPONSE_TIME, TELEGRAM_HREF} from '@/content/site';
import {cn} from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent';

const inputClass =
  'w-full rounded-2xl border border-foreground/12 bg-background px-4 py-3.5 text-base text-foreground placeholder:text-foreground/35 transition-colors focus:border-accent focus:outline-none';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    if (!data.name?.trim()) return setError('Как к вам обращаться?');
    if (!data.contact?.trim()) return setError('Оставьте Telegram, телефон или почту, чтобы мы могли ответить.');
    if (!data.service?.trim()) return setError('Напишите, какую подписку или сервис оплатить.');
    setError(null);
    setStatus('sending');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as {ok?: boolean; error?: string} | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Не удалось отправить. Попробуйте ещё раз или напишите в Telegram.');
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Нет связи с сервером. Напишите нам в Telegram.');
      setStatus('idle');
    }
  }

  return (
    <section id="contact" className="container-x scroll-mt-24 py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="eyebrow mb-4">Контакты</p>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Напишите, <span className="font-serif font-normal italic text-foreground/80">как удобно.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Быстрее всего в Telegram: напишите, что оплатить, и мы ответим {RESPONSE_TIME} в рабочее время. Форма
            справа попадает туда же.
          </p>
          <ul className="mt-10 space-y-4 text-lg">
            <li>
              <a href={TELEGRAM_HREF} target="_blank" rel="noopener" className="inline-flex items-center gap-3 hover:text-accent-hot">
                <Send className="h-5 w-5 text-accent" aria-hidden="true" />
                Написать в Telegram
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent-hot">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {status === 'sent' ? (
            <motion.div
              initial={reduce ? false : {opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              role="status"
              className="glass flex h-full flex-col items-start justify-center gap-4 rounded-3xl p-8 md:p-10"
            >
              <CheckCircle2 className="h-10 w-10 text-accent" aria-hidden="true" />
              <h3 className="text-2xl font-semibold">Заявка отправлена</h3>
              <p className="text-muted">Ответим {RESPONSE_TIME} в рабочее время. Если срочно, напишите напрямую.</p>
              <a
                href={TELEGRAM_HREF}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Написать в Telegram
              </a>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="glass rounded-3xl p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Ваше имя</span>
                  <input name="name" className={inputClass} placeholder="Анна" autoComplete="name" required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Компания, если платите для бизнеса</span>
                  <input name="company" className={inputClass} placeholder="Необязательно" autoComplete="organization" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm text-muted">Telegram, телефон или почта</span>
                  <input name="contact" className={inputClass} placeholder="@username" required />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm text-muted">Что оплатить и на какой срок</span>
                  <input name="service" className={inputClass} placeholder="Например, ChatGPT Plus на месяц или Google Ads на 500 $" required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Сумма</span>
                  <input name="amount" className={inputClass} placeholder="1500" inputMode="decimal" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Валюта</span>
                  <select name="currency" className={cn(inputClass, 'appearance-none')} defaultValue="USD">
                    {['USD', 'EUR', 'CNY', 'AED', 'TRY', 'GBP', 'Другая'].map((c) => (
                      <option key={c} value={c === 'Другая' ? 'OTHER' : c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm text-muted">Комментарий</span>
                  <textarea name="comment" rows={3} className={inputClass} placeholder="Срочность, ссылка на страницу оплаты, вопросы" />
                </label>
              </div>

              {error ? (
                <p role="alert" className="mt-4 rounded-2xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-white transition-colors hover:bg-foreground hover:text-background disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
                </button>
                <p className="text-xs leading-relaxed text-muted">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="/politika/" className="underline hover:text-foreground">
                    политикой обработки данных
                  </a>
                  .
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
