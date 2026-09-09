// Иллюстрации с платёжными картами: `node scripts/make-cards.mjs` → src/images/card-*.webp.
// Карты нарисованы кодом, без логотипов платёжных систем.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('src/images');
fs.mkdirSync(OUT_DIR, {recursive: true});

const C = {
  red: '#E5323A',
  redDark: '#B01F27',
  ink: '#0C0C0F',
  inkSoft: '#2A2B33',
  paper: '#FFFFFF',
  bg: '#FBFAF8',
  line: '#D9D6CF',
  teal: '#0FA3B1',
  tealSoft: '#D6F3F5',
  mint: '#22A06B',
  mintSoft: '#D9F4E6',
  apricot: '#F59E0B',
  apricotSoft: '#FFEFD1',
  lavender: '#7C5CFF',
  lavenderSoft: '#E9E3FF',
  redSoft: '#FDE3E4',
};

const font = 'font-family="Segoe UI, Inter, Arial, sans-serif"';
const mono = 'font-family="Consolas, JetBrains Mono, monospace"';

const defs = `
<defs>
  <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FF5A61"/><stop offset="1" stop-color="${C.redDark}"/>
  </linearGradient>
  <linearGradient id="gInk" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3A3B45"/><stop offset="1" stop-color="${C.ink}"/>
  </linearGradient>
  <linearGradient id="gPaper" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#ECEAE3"/>
  </linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#0C0C0F" flood-opacity="0.22"/>
  </filter>
</defs>`;

/** Платёжная карта 420×264 с чипом, бесконтактной иконкой и маской номера. */
function card({x, y, rotate = 0, fill, text = C.paper, last4 = '4242', label = 'OPLATA ZA RUBEZH', sub = 'BUSINESS'}) {
  const w = 420;
  const h = 264;
  return `
  <g transform="translate(${x} ${y}) rotate(${rotate})" filter="url(#shadow)">
    <rect width="${w}" height="${h}" rx="26" fill="${fill}"/>
    <rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
    <!-- чип -->
    <rect x="34" y="70" width="58" height="44" rx="9" fill="#E9C46A" stroke="#C9A24B" stroke-width="2"/>
    <path d="M34 92h58M63 70v44M46 70v14M80 70v14M46 100v14M80 100v14" stroke="#C9A24B" stroke-width="2" fill="none"/>
    <!-- бесконтактная оплата -->
    <g transform="translate(120 92)" fill="none" stroke="${text}" stroke-width="3" stroke-linecap="round" opacity="0.9">
      <path d="M0 -12 a16 16 0 0 1 0 24"/><path d="M8 -20 a26 26 0 0 1 0 40"/><path d="M16 -28 a36 36 0 0 1 0 56"/>
    </g>
    <text x="34" y="176" ${mono} font-size="26" letter-spacing="3" fill="${text}">••••  ••••  ••••  ${last4}</text>
    <text x="34" y="224" ${font} font-size="15" letter-spacing="2" fill="${text}" opacity="0.9">${label}</text>
    <text x="${w - 34}" y="224" text-anchor="end" ${font} font-size="13" letter-spacing="2" fill="${text}" opacity="0.7">${sub}</text>
    <text x="${w - 34}" y="60" text-anchor="end" ${font} font-size="30" font-weight="700" fill="${text}">₽</text>
  </g>`;
}

/** Плитка сервиса с монограммой. */
function tile(x, y, letters, soft, strong, size = 96) {
  return `
  <g transform="translate(${x} ${y})" filter="url(#shadow)">
    <rect width="${size}" height="${size}" rx="${size * 0.26}" fill="${soft}"/>
    <text x="${size / 2}" y="${size / 2 + 12}" text-anchor="middle" ${font} font-size="${size * 0.36}" font-weight="700" fill="${strong}">${letters}</text>
  </g>`;
}

function check(x, y, color = C.mint) {
  return `<polyline points="${x},${y + 10} ${x + 11},${y + 21} ${x + 32},${y}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// 1. Стопка карт и плитки сервисов вокруг — первый экран.
const cardsStack = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">${defs}
  <rect width="1200" height="800" rx="48" fill="${C.bg}"/>
  <circle cx="1010" cy="150" r="150" fill="${C.redSoft}"/>
  <circle cx="170" cy="680" r="130" fill="${C.tealSoft}"/>
  ${card({x: 330, y: 330, rotate: -8, fill: 'url(#gPaper)', text: C.ink, last4: '1088', sub: 'CORPORATE'})}
  ${card({x: 390, y: 270, rotate: -4, fill: 'url(#gInk)', last4: '7305'})}
  ${card({x: 450, y: 210, rotate: 0, fill: 'url(#gRed)', last4: '4242'})}
  ${tile(150, 150, 'G', C.redSoft, C.red)}
  ${tile(260, 90, 'aws', C.apricotSoft, C.apricot, 88)}
  ${tile(120, 320, 'F', C.lavenderSoft, C.lavender, 80)}
  ${tile(960, 420, 'N', C.tealSoft, C.teal, 90)}
  ${tile(1000, 560, 'AI', C.mintSoft, C.mint, 84)}
  ${tile(880, 640, 'JB', C.redSoft, C.red, 76)}
</svg>`;

// 2. Карта и чек с оплаченными сервисами — «за что платим».
const cardServices = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">${defs}
  <rect width="1200" height="800" rx="48" fill="${C.bg}"/>
  <circle cx="180" cy="160" r="140" fill="${C.redSoft}"/>
  <circle cx="1040" cy="660" r="150" fill="${C.mintSoft}"/>
  ${card({x: 110, y: 300, rotate: -6, fill: 'url(#gRed)', last4: '4242'})}
  <!-- чек -->
  <g transform="translate(640 120)" filter="url(#shadow)">
    <rect width="440" height="560" rx="24" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>
    <text x="40" y="64" ${font} font-size="14" letter-spacing="3" fill="${C.inkSoft}" opacity="0.7">ОПЛАЧЕНО</text>
    <line x1="40" y1="84" x2="400" y2="84" stroke="${C.line}" stroke-width="2"/>
    ${[
      ['Google Ads', '2 400 $', C.redSoft, C.red, 'G'],
      ['AWS', '1 180 $', C.apricotSoft, C.apricot, 'a'],
      ['Figma', '45 $', C.lavenderSoft, C.lavender, 'F'],
      ['Notion', '96 $', C.tealSoft, C.teal, 'N'],
      ['OpenAI', '320 $', C.mintSoft, C.mint, 'AI'],
    ]
      .map(
        ([name, sum, soft, strong, letter], i) => `
      <g transform="translate(40 ${112 + i * 82})">
        <rect width="52" height="52" rx="14" fill="${soft}"/>
        <text x="26" y="34" text-anchor="middle" ${font} font-size="20" font-weight="700" fill="${strong}">${letter}</text>
        <text x="72" y="22" ${font} font-size="20" font-weight="600" fill="${C.ink}">${name}</text>
        <text x="72" y="46" ${font} font-size="14" fill="${C.inkSoft}" opacity="0.7">подписка · ежемесячно</text>
        <text x="300" y="33" text-anchor="end" ${mono} font-size="18" fill="${C.ink}">${sum}</text>
        ${check(330, 14)}
      </g>`,
      )
      .join('')}
    <line x1="40" y1="530" x2="400" y2="530" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 8"/>
  </g>
</svg>`;

// 3. Карта, договор и отметка банка — «как это работает».
const cardDocuments = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">${defs}
  <rect width="1200" height="800" rx="48" fill="${C.bg}"/>
  <circle cx="1000" cy="170" r="150" fill="${C.apricotSoft}"/>
  <circle cx="200" cy="660" r="130" fill="${C.lavenderSoft}"/>
  <!-- документ -->
  <g transform="translate(560 110)" filter="url(#shadow)">
    <rect width="440" height="580" rx="22" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>
    <rect x="0" y="0" width="440" height="64" rx="22" fill="${C.red}"/>
    <rect x="36" y="24" width="190" height="14" rx="7" fill="${C.paper}"/>
    ${[280, 220, 300, 170, 300, 240, 190].map((w, i) => `<rect x="36" y="${104 + i * 40}" width="${w}" height="12" rx="6" fill="${C.line}"/>`).join('')}
    <g transform="translate(300 470) rotate(-12)">
      <circle r="78" fill="${C.mintSoft}"/><circle r="78" fill="none" stroke="${C.mint}" stroke-width="6"/><circle r="56" fill="none" stroke="${C.mint}" stroke-width="3"/>
      ${check(-16, -10)}
    </g>
  </g>
  ${card({x: 120, y: 330, rotate: -8, fill: 'url(#gInk)', last4: '7305'})}
  <!-- стрелка от карты к документу -->
  <g stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M500 300 C 540 260, 560 240, 600 210" stroke-dasharray="14 18"/>
  </g>
</svg>`;

// 4. Карта и валюты мира — оплата за рубеж.
const cardWorld = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">${defs}
  <rect width="1200" height="800" rx="48" fill="${C.bg}"/>
  <g fill="${C.line}">
    ${Array.from({length: 12}, (_, r) =>
      Array.from({length: 22}, (_, c) => {
        const x = 110 + c * 46;
        const y = 90 + r * 44;
        const land = (r + c) % 3 !== 0 && r > 0 && r < 11 && c > 1 && c < 20;
        return land ? `<circle cx="${x}" cy="${y}" r="8"/>` : '';
      }).join(''),
    ).join('')}
  </g>
  ${[
    [760, 200, C.apricot, '¥'],
    [900, 330, C.teal, '¥'],
    [620, 250, C.lavender, '₺'],
    [700, 400, C.mint, 'د.إ'],
    [520, 210, C.teal, '€'],
    [1000, 220, C.red, '$'],
  ]
    .map(
      ([x, y, color, sym]) => `
    <g transform="translate(${x} ${y})">
      <path d="M0 0 C-36 -46 -36 -100 0 -100 C36 -100 36 -46 0 0Z" fill="${color}"/>
      <circle cy="-68" r="22" fill="${C.paper}"/>
      <text y="-58" text-anchor="middle" ${font} font-size="26" font-weight="700" fill="${C.ink}">${sym}</text>
    </g>`,
    )
    .join('')}
  ${card({x: 90, y: 420, rotate: -6, fill: 'url(#gRed)', last4: '4242'})}
  <path d="M480 470 C 560 330, 640 300, 760 200" fill="none" stroke="${C.red}" stroke-width="6" stroke-dasharray="14 18" stroke-linecap="round"/>
  <path d="M480 470 C 600 420, 780 420, 900 330" fill="none" stroke="${C.teal}" stroke-width="6" stroke-dasharray="14 18" stroke-linecap="round"/>
</svg>`;

const images = {
  'card-stack': cardsStack,
  'card-services': cardServices,
  'card-documents': cardDocuments,
  'card-world': cardWorld,
};

for (const [name, svg] of Object.entries(images)) {
  const file = path.join(OUT_DIR, `${name}.webp`);
  await sharp(Buffer.from(svg)).resize({width: 1200}).webp({quality: 84}).toFile(file);
  console.log(`${name}.webp  ${Math.round(fs.statSync(file).size / 1024)} KB`);
}
