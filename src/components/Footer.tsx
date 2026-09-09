import {Send} from 'lucide-react';

import {CONTACT_EMAIL, OWNER, SITE_NAME, TELEGRAM_HREF} from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-surface">
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <a href="#top" className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-mono text-sm text-white">₽</span>
            {SITE_NAME}
          </a>
          <p className="mt-6 text-sm text-muted">
            {OWNER.status} {OWNER.name}, ИНН {OWNER.inn}
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted hover:text-foreground">
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav aria-label="Документы" className="flex flex-col gap-3 text-sm">
          <a href="/politika/" className="text-muted hover:text-foreground">
            Политика обработки персональных данных
          </a>
          <a href="#faq" className="text-muted hover:text-foreground">
            Условия и вопросы
          </a>
        </nav>

        <a
          href={TELEGRAM_HREF}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-hot"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Написать в Telegram
        </a>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-foreground/10 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40 md:flex-row md:justify-between">
        <span>Для физлиц и компаний</span>
        <span>Оплата зарубежными картами</span>
      </div>
    </footer>
  );
}
