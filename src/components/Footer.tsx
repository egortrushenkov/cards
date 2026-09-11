import {Send} from 'lucide-react';

import {Logo} from './Logo';
import {OWNER, TELEGRAM_HREF} from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-surface">
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-6 text-sm text-muted">
            {OWNER.status} {OWNER.name}, ИНН {OWNER.inn}
          </p>
        </div>

        <nav aria-label="Документы" className="flex flex-col gap-3 text-sm">
          <a href="/oferta/" className="text-muted hover:text-foreground">
            Публичная оферта
          </a>
          <a href="/politika/" className="text-muted hover:text-foreground">
            Политика обработки персональных данных
          </a>
          <a href="/soglasie/" className="text-muted hover:text-foreground">
            Согласие на обработку персональных данных
          </a>
          <a href="/#faq" className="text-muted hover:text-foreground">
            Вопросы и ответы
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
