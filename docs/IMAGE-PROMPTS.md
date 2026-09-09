# Промпты для генерации картинок с платёжными картами

На сайте стоят картинки с картами, нарисованные кодом (`scripts/make-cards.mjs` → `src/images/card-*.webp`).
Чтобы заменить их нейросетевыми, сгенерируйте изображения по промптам ниже, сохраните в webp 1200×800
под теми же именами в `src/images/` и выполните `npm run build`. Alt-тексты и размеры подставятся сами.

## Общий стиль (добавляйте к каждому промпту)

```
Premium fintech product illustration, realistic payment card mockups with chip and contactless symbol,
card colors: coral red (#E5323A) gradient, matte black, pearl white; light warm studio background (#FBFAF8),
soft shadows, subtle pastel accents (teal, mint, apricot, lavender), no bank logos, no Visa/Mastercard logos,
no real brand logos, no people, no hands, generous negative space, 3:2 aspect ratio, 1200x800.
```

Негатив (Midjourney `--no`, Stable Diffusion negative prompt):

```
visa, mastercard, mir, real bank logo, real numbers, people, hands, coins, cash, cryptocurrency,
dark background, text, watermark, blurry, low quality
```

## 1. `card-stack.webp` — первый экран

Куда: справа от заголовка «Оплатим любой зарубежный счёт».

```
A fanned stack of three business payment cards floating at a slight angle: coral red on top, matte black
and pearl white behind, chip and contactless waves visible, masked card number with dots. Around the cards
float small rounded app tiles with single letters: G, aws, F, N, AI. Clean 3D render style, soft studio light.
```

## 2. `card-services.webp` — блок «Почему мы», верхняя картинка

Куда: справа от списка «За что платим чаще всего».

```
A coral red business payment card lying next to a paper receipt that lists paid subscriptions with green
check marks: Google Ads, AWS, Figma, Notion, OpenAI (written as generic monogram tiles, not logos).
Subscriptions paid by card concept, light background, clean editorial fintech style.
```

## 3. `card-world.webp` — блок «Почему мы», нижняя картинка

```
A coral red payment card in the foreground and a stylized dotted world map behind it with colorful
location pins holding currency symbols: euro, yuan, lira, dirham, yen, dollar. Dashed routes fly from
the card to the pins. International payments concept, flat vector with soft shadows, light background.
```

## 4. `card-documents.webp` — блок «Как это работает»

Куда: под текстом слева от четырёх шагов.

```
A matte black payment card next to a signed agreement document with a coral red header and a round green
bank stamp with a check mark. A dashed red line connects the card and the document. Payment backed by
paperwork concept, light warm background, soft shadow, minimal.
```

## Если генерируете в Figma / Recraft / Ideogram

Выбирайте стиль «3D render» или «product mockup», отключайте генерацию текста и логотипов, задавайте
палитру вручную: фон `#FBFAF8`, акцент `#E5323A`, поддерживающие `#0FA3B1`, `#22A06B`, `#F59E0B`, `#7C5CFF`.
Номер карты в готовой картинке должен быть замаскирован точками, чтобы не выглядел как настоящий.
