import Image from 'next/image';

import {Reveal} from './Reveal';
import documentsImage from '@/images/card-documents.webp';
import {STEPS} from '@/content/site';

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-y border-foreground/10 bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow mb-4">Как это работает</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Четыре шага. <span className="font-serif font-normal italic text-foreground/80">Один перевод по СБП.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              Без виртуальных карт, обменников и регистрации. Всё общение в Telegram, деньги переводите только после того,
              как согласовали сумму.
            </p>
            <Image
              src={documentsImage}
              alt="Зарубежная карта и подтверждение оплаты с отметкой: каждый платёж закрыт чеком"
              sizes="(max-width: 1024px) 100vw, 420px"
              className="illustration mt-10"
            />
          </Reveal>

          <ol className="relative space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="corner relative flex gap-6 border border-foreground/10 bg-background p-6 md:p-8">
                  <span className="font-serif text-4xl italic leading-none text-accent md:text-5xl">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold md:text-xl">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
