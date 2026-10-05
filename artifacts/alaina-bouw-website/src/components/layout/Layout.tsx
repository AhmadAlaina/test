import { useEffect, type ReactNode } from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { phoneHref, whatsappHref } from '@/config/site';
import { Footer } from './Footer';
import { Header } from './Header';

const formRoutes = ['/offerte-aanvragen', '/contact'];

function MobileActionBar() {
  const [location] = useLocation();
  if (formRoutes.includes(location)) return null;
  const quick = phoneHref
    ? { href: phoneHref, label: 'Bellen', icon: Phone, external: false }
    : whatsappHref
      ? { href: whatsappHref, label: 'WhatsApp', icon: MessageCircle, external: true }
      : null;

  return (
    <div
      role="group"
      aria-label="Snelle acties"
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-line bg-cream/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
    >
      {quick ? (
        <a href={quick.href} {...(quick.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="btn btn-outline flex-1 px-3">
          <quick.icon className="size-4" /> {quick.label}
        </a>
      ) : (
        <Link href="/contact" className="btn btn-outline flex-1 px-3">Contact</Link>
      )}
      <Link href="/offerte-aanvragen" className="btn btn-primary flex-[1.6] px-3">
        Offerte aanvragen <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ga naar inhoud
      </a>
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
