import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../store/cart';

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/ponuda', label: 'Ponuda' },
  { href: '/kontakt', label: 'Kontakt' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5'
    : 'bg-transparent';

  const textClass = scrolled ? 'text-ink' : 'text-white';
  const logoClass = scrolled ? 'text-paprika' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
        <a
          href="/"
          className={`font-display text-2xl font-bold tracking-widest ${logoClass} hover:opacity-80 transition-opacity`}
        >
          VAU KETERING
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium ${textClass} hover:text-paprika transition-colors uppercase tracking-widest relative group`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-paprika transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="/korpa"
            className={`relative p-2 ${textClass} hover:text-paprika transition-colors`}
            aria-label="Korpa"
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-paprika text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <a
            href="/korpa"
            className={`relative p-2 ${textClass}`}
            aria-label="Korpa"
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-paprika text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2 ${textClass}`}
            aria-label="Meni"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-white/98 backdrop-blur-md border-t border-black/5 px-4 py-6 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-medium text-ink hover:text-paprika transition-colors uppercase tracking-widest py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
