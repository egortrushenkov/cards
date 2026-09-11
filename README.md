# Оплата подписок — продающий лендинг

Одностраничный сайт компании, которая своими зарубежными картами оплачивает подписки и сервисы физлицам и другим компаниям: тёмный редакционный стиль
(по мотивам шаблона Arfazrll Portfolio с 21st.dev), цены, кнопка «Связаться» в Telegram и форма
заявки, которая тоже уходит в Telegram.

- Фронтенд: Next.js 16 (App Router, статический экспорт), Tailwind CSS 3.4, framer-motion, lucide-react.
- Бэкенд: `server.js` на встроенном `http` Node 20+: отдаёт `out/`, принимает `POST /api/lead`, шлёт в Telegram.

## Запуск

```bash
npm install
cp .env.example .env     # TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, MANAGER_USERNAME
npm run build            # статика в out/
npm start                # node server.js → http://localhost:3000
```

`npm run dev` поднимает dev-сервер Next (форма в dev-режиме шлёт на `/api/lead` того же порта, поэтому для
проверки отправки нужен `npm start`).

## Что поменять перед публикацией

Всё в одном файле `src/content/site.ts`:

- **Цены** (`PLANS`): три тарифа с процентом комиссии и минимумом. Цифры сейчас — рабочая заготовка, поставьте свои.
- Скорость ответа и оплаты (`RESPONSE_TIME`, `PAYMENT_TIME`), кто оказывает услугу (`OWNER`).
- Тексты блоков «Почему это работает», «Кому подходит», «Как работает», вопросы-ответы, бегущая строка сервисов.

Username менеджера не пишется в код: `server.js` подставляет `MANAGER_USERNAME` из `.env` в ссылку
`https://t.me/...` при отдаче страницы. `SITE_URL` в `.env` нужен для canonical и OpenGraph при сборке.
Текст политики — плейсхолдер в `src/app/politika`.

## Приём заявок

`POST /api/lead` с JSON `name`, `company`, `contact`, `service`, `amount`, `currency`, `comment`.
Обязательны имя, контакт и «что оплатить»; сумма, если указана, должна быть числом больше нуля.
Поля режутся до 500 символов, HTML экранируется, лимит 5 заявок с IP за 10 минут, время в сообщении по Москве.
Без токена сервер стартует и пишет заявки в лог с пометкой `[lead][stub]`. За nginx поставьте `TRUST_PROXY=1`.

## Структура

```
src/app/            layout (шрифты, метаданные), page (главная), politika, not-found
src/components/     Navbar, Hero, Marquee, Benefits, HowItWorks, Pricing, Faq, Cta, ContactForm, Footer,
                    Reveal (появление при прокрутке), MagneticButton
src/content/site.ts тексты, цены, контакты
server.js           боевой сервер
```

Логотип, favicon, иконка для iPhone и картинка превью для соцсетей (`public/og.png`) генерируются
`node scripts/make-brand.mjs`. Картинки с платёжными картами нарисованы кодом: `node scripts/make-cards.mjs` → `src/images/card-*.webp`
(нужен `sharp`). Промпты для замены на сгенерированные — в `docs/IMAGE-PROMPTS.md`.

Шрифты: Inter локально (`src/app/fonts`), Playfair Display и JetBrains Mono через `next/font/google`
с кириллицей (скачиваются на этапе сборки и раздаются с вашего домена). Анимации уважают
`prefers-reduced-motion`.
