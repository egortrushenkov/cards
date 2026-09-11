import {SITE_NAME} from '@/content/site';

/** Знак и название. Тот же рисунок, что в favicon и og-картинке (scripts/make-brand.mjs). */
export function Logo({className = ''}: {className?: string}) {
  return (
    <a href="#top" className={`flex items-center gap-3 font-semibold tracking-tight ${className}`}>
      <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF5A61" />
            <stop offset="1" stopColor="#B01F27" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
        <g transform="translate(32 33) rotate(-12)">
          <rect x="-21" y="-14" width="42" height="28" rx="5" fill="#fff" />
          <rect x="-15" y="-6" width="9" height="7" rx="1.5" fill="#E9C46A" />
          <rect x="-15" y="6" width="16" height="2.5" rx="1.25" fill="#0C0C0F" opacity="0.35" />
          <text x="16" y="4" textAnchor="end" fontFamily="var(--font-inter), Arial, sans-serif" fontSize="14" fontWeight="700" fill="#E5323A">
            ₽
          </text>
        </g>
      </svg>
      <span>{SITE_NAME}</span>
    </a>
  );
}
