import Image from 'next/image';

import logo from '@/images/logo.png';
import {SITE_NAME} from '@/content/site';

/** Фирменный знак и название. Исходник знака — brand/logo-source.png, сборка иконок — scripts/make-brand.mjs. */
export function Logo({className = ''}: {className?: string}) {
  return (
    <a href="#top" className={`flex items-center gap-3 font-semibold tracking-tight ${className}`}>
      <Image src={logo} alt="" width={36} height={36} priority className="h-9 w-9 shrink-0 rounded-[10px]" />
      <span>{SITE_NAME}</span>
    </a>
  );
}
