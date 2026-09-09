import {SERVICES_MARQUEE} from '@/content/site';

/** Бегущая строка сервисов, которые оплачиваем. Чистый CSS, без JS. */
export function Marquee() {
  const items = [...SERVICES_MARQUEE, ...SERVICES_MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-foreground/10 bg-surface py-5" aria-label="Что оплачиваем">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-foreground/60">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10" aria-hidden={i >= SERVICES_MARQUEE.length}>
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
