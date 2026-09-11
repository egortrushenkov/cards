// Логотип, favicon, иконка для iPhone и Open Graph-картинка: `node scripts/make-brand.mjs`.
// Знак: карта с чипом и символом рубля на красной плашке. Всё нарисовано кодом, без сторонних файлов.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RED = '#E5323A';
const RED_DARK = '#B01F27';
const INK = '#0C0C0F';
const BG = '#FBFAF8';

/** Знак 64×64: скруглённый квадрат с градиентом, внутри наклонённая карта и ₽. */
function mark(size = 64, radius = 16) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FF5A61"/><stop offset="1" stop-color="${RED_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="${radius}" fill="url(#g)"/>
  <g transform="translate(32 33) rotate(-12)">
    <rect x="-21" y="-14" width="42" height="28" rx="5" fill="#fff"/>
    <rect x="-15" y="-6" width="9" height="7" rx="1.5" fill="#E9C46A"/>
    <rect x="-15" y="6" width="16" height="2.5" rx="1.25" fill="${INK}" opacity="0.35"/>
    <text x="16" y="4" text-anchor="end" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="${RED}">₽</text>
  </g>
</svg>`;
}

/** Open Graph 1200×630: заголовок слева, стопка карт справа. */
function og() {
  const card = (x, y, rot, fill, text = '#fff', last4 = '4242') => `
  <g transform="translate(${x} ${y}) rotate(${rot})">
    <rect width="340" height="214" rx="22" fill="${fill}" filter="url(#sh)"/>
    <rect x="28" y="58" width="46" height="36" rx="8" fill="#E9C46A"/>
    <path d="M28 76h46M51 58v36" stroke="#C9A24B" stroke-width="2" fill="none"/>
    <g transform="translate(96 76)" fill="none" stroke="${text}" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
      <path d="M0 -10a13 13 0 0 1 0 20"/><path d="M7 -16a21 21 0 0 1 0 32"/><path d="M14 -22a29 29 0 0 1 0 44"/>
    </g>
    <text x="28" y="146" font-family="Consolas, JetBrains Mono, monospace" font-size="21" letter-spacing="2" fill="${text}">••••  ••••  ••••  ${last4}</text>
    <text x="28" y="184" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" letter-spacing="2" fill="${text}" opacity="0.85">OPLATA PODPISOK</text>
    <text x="312" y="50" text-anchor="end" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="${text}">₽</text>
  </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF5A61"/><stop offset="1" stop-color="${RED_DARK}"/></linearGradient>
    <linearGradient id="gInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A3B45"/><stop offset="1" stop-color="${INK}"/></linearGradient>
    <linearGradient id="gPaper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#ECEAE3"/></linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="${INK}" flood-opacity="0.22"/></filter>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${INK}" stroke-opacity="0.06"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1080" cy="80" r="170" fill="#FDE3E4"/>
  <circle cx="120" cy="600" r="130" fill="#D6F3F5"/>
  <g transform="translate(72 72)">
    <rect width="56" height="56" rx="14" fill="url(#gRed)"/>
    <g transform="translate(28 29) rotate(-12)">
      <rect x="-18" y="-12" width="36" height="24" rx="4" fill="#fff"/>
      <rect x="-13" y="-5" width="8" height="6" rx="1.5" fill="#E9C46A"/>
      <text x="14" y="4" text-anchor="end" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="${RED}">₽</text>
    </g>
    <text x="72" y="38" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="${INK}">Оплата подписок</text>
  </g>
  <text x="72" y="255" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="66" font-weight="800" letter-spacing="-2" fill="${INK}">Оплатим любую</text>
  <text x="72" y="330" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="66" font-weight="800" letter-spacing="-2" fill="${INK}">зарубежную подписку</text>
  <text x="72" y="410" font-family="Georgia, Times New Roman, serif" font-style="italic" font-size="52" fill="${RED}">нашей картой, сегодня</text>
  <text x="72" y="490" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" fill="#5F606B">ChatGPT · Netflix · Spotify · Apple · Google Ads · Figma · AWS</text>
  <text x="72" y="530" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" fill="#5F606B">Для себя и для компании · перевод по СБП · чек после оплаты</text>
  ${card(760, 300, -10, 'url(#gPaper)', INK, '1088')}
  ${card(800, 250, -6, 'url(#gInk)', '#fff', '7305')}
  ${card(840, 200, -2, 'url(#gRed)', '#fff', '4242')}
</svg>`;
}

fs.mkdirSync('public', {recursive: true});
fs.writeFileSync(path.join('public', 'logo.svg'), mark(64, 16));
fs.writeFileSync(path.join('src', 'app', 'icon.svg'), mark(64, 16));
await sharp(Buffer.from(mark(64, 14))).resize(180, 180).png().toFile(path.join('src', 'app', 'apple-icon.png'));
await sharp(Buffer.from(og())).png({quality: 90}).toFile(path.join('public', 'og.png'));
for (const f of ['public/logo.svg', 'src/app/icon.svg', 'src/app/apple-icon.png', 'public/og.png']) {
  console.log(f, Math.round(fs.statSync(f).size / 1024), 'KB');
}
