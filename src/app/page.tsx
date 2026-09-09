import {Benefits} from '@/components/Benefits';
import {ContactForm} from '@/components/ContactForm';
import {Cta} from '@/components/Cta';
import {Faq} from '@/components/Faq';
import {Footer} from '@/components/Footer';
import {Hero} from '@/components/Hero';
import {HowItWorks} from '@/components/HowItWorks';
import {Marquee} from '@/components/Marquee';
import {Navbar} from '@/components/Navbar';
import {Pricing} from '@/components/Pricing';

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        К содержанию
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Cta />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
