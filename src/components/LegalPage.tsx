import type {ReactNode} from 'react';

import {Footer} from './Footer';
import {Navbar} from './Navbar';
import {LEGAL} from '@/content/legal';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Каркас юридической страницы: шапка, заголовок, дата редакции, текст документа, подвал. */
export function LegalPage({title, subtitle, children}: Props) {
  return (
    <>
      <Navbar />
      <main id="main" className="container-x max-w-3xl pt-32 pb-24 md:pt-40">
        <p className="eyebrow mb-4">Документы</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-balance">{title}</h1>
        {subtitle ? <p className="mt-4 text-lg text-muted">{subtitle}</p> : null}
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Редакция {LEGAL.version} · действует с {LEGAL.effectiveDate}
        </p>
        <article className="prose-legal mt-12">{children}</article>
        <nav aria-label="Другие документы" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-foreground/10 pt-6 text-sm">
          <a href="/politika/" className="text-muted hover:text-foreground">
            Политика обработки персональных данных
          </a>
          <a href="/soglasie/" className="text-muted hover:text-foreground">
            Согласие на обработку персональных данных
          </a>
          <a href="/oferta/" className="text-muted hover:text-foreground">
            Публичная оферта
          </a>
        </nav>
      </main>
      <Footer />
    </>
  );
}

/** Реквизиты оператора одним блоком, чтобы не расходились между документами. */
export function OperatorDetails() {
  const o = LEGAL.operator;
  return (
    <ul>
      <li>
        {o.status} {o.fullName}
      </li>
      <li>ИНН {o.inn}</li>
      <li>ОГРНИП {o.ogrnip}</li>
      <li>Адрес для корреспонденции: {o.address}</li>
      <li>Электронная почта для обращений: {o.email}</li>
      <li>Мессенджер: {o.telegram}</li>
      <li>Сайт: {LEGAL.siteUrl}</li>
    </ul>
  );
}
