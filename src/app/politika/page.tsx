import type {Metadata} from 'next';

import {Footer} from '@/components/Footer';
import {Navbar} from '@/components/Navbar';
import {OWNER} from '@/content/site';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  robots: {index: false, follow: true},
};

export default function PolitikaPage() {
  return (
    <>
      <Navbar />
      <main className="container-x max-w-3xl pt-36 pb-24">
        <h1 className="text-4xl font-bold tracking-tight">Политика обработки персональных данных</h1>
        <p className="mt-6 text-muted">Оператор: {OWNER.status} {OWNER.name}, ИНН {OWNER.inn}.</p>
        <p className="mt-4 leading-relaxed text-foreground/85">
          Через форму на сайте мы получаем имя, контакт, название сервиса и сумму. Данные нужны только для ответа и оплаты и
          приходят менеджеру в Telegram. Доступы к аккаунтам не сохраняются: после оплаты вы меняете пароль.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          {'{Текст политики: цели и основания обработки, сроки хранения, порядок отзыва согласия, контакты оператора.}'}
        </p>
      </main>
      <Footer />
    </>
  );
}
