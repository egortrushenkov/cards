// Favicon, иконка для iPhone, логотип для шапки и Open Graph-картинка из фирменного знака:
// `node scripts/make-brand.mjs`. Источник — brand/logo-source.png (красная плашка со знаком,
// вокруг может быть прозрачная тень: скрипт сам находит непрозрачный квадрат и вырезает его).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE = path.join('brand', 'logo-source.png');
const INK = '#0C0C0F';
const BG = '#FBFAF8';

// 1. Вырезаем плашку без тени: ищем bbox пикселей с alpha > 250.
const {data, info} = await sharp(SOURCE).ensureAlpha().raw().toBuffer({resolveWithObject: true});
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 250) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const square = sharp(SOURCE).extract({left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1});
const squarePng = await square.png().toBuffer();

// Цвет плашки для отчёта: пиксель в углу внутри скругления.
const px = await sharp(squarePng).extract({left: 120, top: 500, width: 1, height: 1}).raw().toBuffer();
const brandRed = '#' + [...px.slice(0, 3)].map((v) => v.toString(16).padStart(2, '0')).join('');

// 2. Иконки и логотип.
fs.mkdirSync('public', {recursive: true});
fs.mkdirSync(path.join('src', 'images'), {recursive: true});
await sharp(squarePng).resize(512, 512).png().toFile(path.join('src', 'images', 'logo.png'));
await sharp(squarePng).resize(192, 192).png().toFile(path.join('src', 'app', 'icon.png'));
await sharp(squarePng).resize(180, 180).png().toFile(path.join('src', 'app', 'apple-icon.png'));
await sharp(squarePng).resize(512, 512).png().toFile(path.join('public', 'logo.png'));

// 3. Open Graph 1200×630: заголовок слева, знак справа.
const logo64 = (await sharp(squarePng).resize(360, 360).png().toBuffer()).toString('base64');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${INK}" stroke-opacity="0.06"/></pattern>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="${brandRed}" flood-opacity="0.35"/></filter>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1080" cy="90" r="170" fill="${brandRed}" fill-opacity="0.10"/>
  <circle cx="110" cy="600" r="130" fill="#D6F3F5"/>
  <image href="data:image/png;base64,${logo64}" x="780" y="135" width="360" height="360" filter="url(#sh)"/>
  <g transform="translate(72 72)">
    <image href="data:image/png;base64,${logo64}" width="56" height="56"/>
    <text x="72" y="38" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26" font-weight="700" fill="${INK}">Оплата подписок</text>
  </g>
  <text x="72" y="255" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="64" font-weight="800" letter-spacing="-2" fill="${INK}">Оплатим любую</text>
  <text x="72" y="330" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="64" font-weight="800" letter-spacing="-2" fill="${INK}">зарубежную подписку</text>
  <text x="72" y="410" font-family="Georgia, Times New Roman, serif" font-style="italic" font-size="50" fill="${brandRed}">нашей картой, сегодня</text>
  <text x="72" y="490" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="23" fill="#5F606B">ChatGPT · Netflix · Spotify · Apple · Google Ads · Figma · AWS</text>
  <text x="72" y="530" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="23" fill="#5F606B">Для себя и для компании · перевод по СБП · чек после оплаты</text>
</svg>`;
await sharp(Buffer.from(og)).png({quality: 90}).toFile(path.join('public', 'og.png'));

console.log('brand red:', brandRed, '| square:', maxX - minX + 1, 'px');
for (const f of ['src/images/logo.png', 'src/app/icon.png', 'src/app/apple-icon.png', 'public/logo.png', 'public/og.png']) {
  console.log(f, Math.round(fs.statSync(f).size / 1024), 'KB');
}
