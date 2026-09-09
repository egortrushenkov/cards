import type {Metadata, Viewport} from 'next';
import type {ReactNode} from 'react';
import localFont from 'next/font/local';
import {JetBrains_Mono, Playfair_Display} from 'next/font/google';

import './globals.css';
import {SITE_NAME, SITE_URL} from '@/content/site';

const inter = localFont({
  src: './fonts/InterVariable.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-playfair',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Оплата зарубежных подписок и сервисов картой',
  description:
    'Оплачу ChatGPT, Netflix, Spotify, Apple, Google Ads, Figma, AWS и любую подписку, которая не берёт российскую карту. Для себя и для компании. Перевод по СБП, оплата в день обращения, чек.',
  alternates: {canonical: '/'},
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
    title: 'Оплата зарубежных подписок и сервисов картой',
    description: 'Перевод по СБП, оплата зарубежной картой в день обращения, чек после оплаты.',
    url: '/',
  },
  robots: {index: true, follow: true},
};

export const viewport: Viewport = {
  themeColor: '#fbfaf8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
