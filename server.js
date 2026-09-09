// Боевой сервер: отдаёт статику из out/ и принимает заявки POST /api/lead.
// Только встроенные модули Node 20+: http, https, fs, path. Без express.
'use strict';

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

loadDotEnv(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT) || 3000;
const OUT_DIR = path.join(__dirname, 'out');
const TELEGRAM_BOT_TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const TELEGRAM_CHAT_ID = (process.env.TELEGRAM_CHAT_ID || '').trim();
const MANAGER_USERNAME = (process.env.MANAGER_USERNAME || '').trim().replace(/^@/, '');
const TRUST_PROXY = process.env.TRUST_PROXY === '1';

const USERNAME_PLACEHOLDER = '__MANAGER_USERNAME__';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_FIELD_LENGTH = 500;
const RATE_LIMIT = {max: 5, windowMs: 10 * 60 * 1000};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

// ---------- окружение ----------

function loadDotEnv(file) {
  // Крошечный загрузчик .env без зависимостей: KEY=value, комментарии через #.
  // Переменные, уже заданные в окружении, не перезаписываются.
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return;
  }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

if (!/^[A-Za-z0-9_]{5,32}$/.test(MANAGER_USERNAME)) {
  console.warn('[warn] MANAGER_USERNAME не задан или некорректен — кнопка «Написать в Telegram» будет вести на t.me/ без адресата');
}
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('[warn] TELEGRAM_BOT_TOKEN и/или TELEGRAM_CHAT_ID не заданы — отправка в Telegram заглушена, заявки пишутся в лог');
}
if (!fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
  console.warn('[warn] out/index.html не найден — сначала выполните `npm run build`');
}

// ---------- утилиты ----------

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clip(value) {
  return String(value ?? '').trim().slice(0, MAX_FIELD_LENGTH);
}

function moscowTime(date = new Date()) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatAmount(amount) {
  return new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2}).format(amount);
}

function clientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }
  }
  return req.socket.remoteAddress || 'unknown';
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

// ---------- лимит заявок: не больше 5 с одного IP за 10 минут ----------

const hits = new Map(); // ip -> массив отметок времени

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, stamps] of hits) {
    const recent = stamps.filter((t) => now - t < RATE_LIMIT.windowMs);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
  }
}, RATE_LIMIT.windowMs).unref();

// ---------- валидация заявки ----------

function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {error: 'Тело запроса должно быть JSON-объектом'};
  }
  const name = clip(input.name);
  const company = clip(input.company);
  const amountRaw = typeof input.amount === 'string' ? input.amount.replace(/\s+/g, '').replace(',', '.') : input.amount;
  const hasAmount = amountRaw !== undefined && amountRaw !== null && amountRaw !== '';
  const amount = hasAmount ? Number(amountRaw) : null;
  const currency = clip(input.currency).toUpperCase();
  const service = clip(input.service);
  const contact = clip(input.contact);
  const comment = clip(input.comment);

  if (!name) return {error: 'Укажите, как к вам обращаться'};
  if (!contact) return {error: 'Укажите контакт для связи: Telegram, телефон или почту'};
  if (!service) return {error: 'Напишите, что нужно оплатить'};
  if (hasAmount && (!Number.isFinite(amount) || amount <= 0)) return {error: 'Сумма должна быть числом больше нуля'};
  if (currency && !/^[A-Z]{3,10}$/.test(currency)) return {error: 'Некорректная валюта'};

  return {lead: {name, company, amount, currency, service, contact, comment}};
}

function buildMessage(lead) {
  const amountLine = lead.amount != null ? `${formatAmount(lead.amount)} ${lead.currency || ''}`.trim() : '—';
  const lines = [
    '<b>Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Компания:</b> ${lead.company ? escapeHtml(lead.company) : '—'}`,
    `<b>Сумма:</b> ${escapeHtml(amountLine)}`,
    `<b>Оплатить:</b> ${escapeHtml(lead.service)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    `<b>Комментарий:</b> ${lead.comment ? escapeHtml(lead.comment) : '—'}`,
    '',
    `<b>Время (МСК):</b> ${moscowTime()}`,
  ];
  return lines.join('\n');
}

// ---------- Telegram Bot API ----------

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 10000,
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            /* не JSON — обработаем ниже */
          }
          if (res.statusCode === 200 && parsed && parsed.ok) resolve(parsed);
          else reject(new Error(`Telegram HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        });
      },
    );
    req.on('timeout', () => req.destroy(new Error('Telegram: таймаут 10 с')));
    req.on('error', reject);
    req.end(body);
  });
}

// ---------- обработчики ----------

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Слишком большой запрос'), {status: 413}));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleLead(req, res) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return sendJson(res, 429, {ok: false, error: 'Слишком много заявок. Подождите немного или напишите менеджеру в Telegram.'});
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (err) {
    return sendJson(res, err.status || 400, {ok: false, error: err.message || 'Не удалось прочитать запрос'});
  }

  let parsed;
  try {
    parsed = JSON.parse(raw || '{}');
  } catch {
    return sendJson(res, 400, {ok: false, error: 'Некорректный JSON'});
  }

  const {error, lead} = validateLead(parsed);
  if (error) return sendJson(res, 400, {ok: false, error});

  const text = buildMessage(lead);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log(`[lead][stub] Telegram не настроен, заявка от ${ip}:\n${text.replace(/<[^>]+>/g, '')}`);
    return sendJson(res, 200, {ok: true});
  }

  try {
    await sendTelegram(text);
    console.log(`[lead] отправлена в Telegram (${lead.company}, ${lead.inn}, ip ${ip})`);
  } catch (err) {
    // Человек не виноват, что у нас упал бот: отвечаем успехом, а сбой пишем в лог.
    console.error(`[lead][error] Telegram не принял сообщение: ${err.message}\n${text.replace(/<[^>]+>/g, '')}`);
  }
  return sendJson(res, 200, {ok: true});
}

function resolveStatic(urlPath) {
  // Возвращает {file, redirect} для пути запроса. Защита от выхода за out/.
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return {status: 400};
  }
  if (decoded.includes('\0')) return {status: 400};

  const normalized = path.posix.normalize(decoded);
  const relative = normalized.replace(/^\/+/, '');
  const abs = path.join(OUT_DIR, relative);
  if (abs !== OUT_DIR && !abs.startsWith(OUT_DIR + path.sep)) return {status: 403};

  const hasExt = path.extname(relative) !== '';
  if (!hasExt) {
    // Маршрут страницы: единый вид URL со слэшем в конце.
    if (!decoded.endsWith('/')) {
      const dir = path.join(OUT_DIR, relative);
      if (fs.existsSync(path.join(dir, 'index.html'))) return {redirect: `${decoded}/`};
      return {status: 404};
    }
    const index = path.join(abs, 'index.html');
    return fs.existsSync(index) ? {file: index} : {status: 404};
  }

  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return {status: 404};
  return {file: abs};
}

function serveFile(res, file, statusCode = 200) {
  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const immutable = file.includes(`${path.sep}_next${path.sep}static${path.sep}`);
  const cacheControl = immutable ? 'public, max-age=31536000, immutable' : ext === '.html' ? 'no-cache' : 'public, max-age=3600';

  if (ext === '.html' || ext === '.txt' || ext === '.js') {
    // Username менеджера подставляется при отдаче, в сборке его нет.
    // Ссылка есть и в HTML, и в клиентских JS-чанках (кнопки — клиентские компоненты),
    // поэтому подмена идёт и в .js, иначе после гидрации React вернул бы плейсхолдер.
    fs.readFile(file, 'utf8', (err, text) => {
      if (err) return sendNotFound(res);
      const body = text.split(USERNAME_PLACEHOLDER).join(MANAGER_USERNAME);
      res.writeHead(statusCode, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': cacheControl,
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(body);
    });
    return;
  }

  fs.stat(file, (err, stat) => {
    if (err) return sendNotFound(res);
    res.writeHead(statusCode, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    });
    fs.createReadStream(file).pipe(res);
  });
}

function sendNotFound(res) {
  const notFound = path.join(OUT_DIR, '404.html');
  if (fs.existsSync(notFound)) return serveFile(res, notFound, 404);
  res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end('Not found');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');

  if (url.pathname === '/api/lead') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendJson(res, 405, {ok: false, error: 'Используйте POST'});
    }
    return handleLead(req, res);
  }
  if (url.pathname.startsWith('/api/')) return sendJson(res, 404, {ok: false, error: 'Не найдено'});

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD'});
    return res.end('Method not allowed');
  }

  const target = resolveStatic(url.pathname);
  if (target.redirect) {
    res.writeHead(301, {Location: target.redirect + url.search});
    return res.end();
  }
  if (target.file) return serveFile(res, target.file);
  if (target.status === 404) return sendNotFound(res);
  res.writeHead(target.status || 500, {'Content-Type': 'text/plain; charset=utf-8'});
  res.end(String(target.status || 500));
});

server.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT} · статика из ${OUT_DIR}`);
});
