import {Footer} from '@/components/Footer';
import {Navbar} from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-40 pb-32">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Страница не найдена</h1>
        <a href="/" className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 font-semibold text-background">
          На главную
        </a>
      </main>
      <Footer />
    </>
  );
}
