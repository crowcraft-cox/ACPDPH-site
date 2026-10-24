import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { animate, stagger } from 'animejs';

export default function Navbar() {
  const { t, toggleLang, lang } = useI18n();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  /* Track scroll position to adjust navbar height and elevation */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Mobile menu entry animation */
  useEffect(() => {
    if (isMobileOpen && mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateX: [-16, 0],
          duration: 320,
          delay: stagger(35, { start: 40 }),
          ease: 'outExpo',
        });
      }
    }
  }, [isMobileOpen]);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/pillars', label: t.nav.pillars },
    { path: '/projects', label: t.nav.projects },
    { path: '/safeguarding', label: t.nav.safeguarding },
    { path: '/act', label: t.nav.act },
    { path: '/news', label: t.nav.news },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-ba-dark/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800 py-2'
          : 'bg-white/90 dark:bg-ba-dark/90 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800/60 py-3'
      }`}
    >
      <nav aria-label="Navigation principale" className="container-ba">
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          
          {/* 1. LEFT: Brand & Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ba-blue rounded-lg"
          >
            <div className="relative">
              <img
                src="/logo_ACPDPH.jpg"
                alt="ACPDPH Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border border-ba-blue/20 transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg sm:text-xl leading-none text-ba-blue dark:text-white tracking-tight">
                ACPDPH
              </span>
              <span className="text-[10px] font-heading font-semibold tracking-wider uppercase text-ba-text-secondary mt-0.5 hidden xl:block">
                Droits & Inclusion
              </span>
            </div>
          </Link>

          {/* 2. MIDDLE / RIGHT: Navigation Links (Optimized for 1024px-1280px viewports) */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all duration-150 ${
                    isActive
                      ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                      : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* 3. FAR RIGHT: Language Selector & Primary CTA Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Segmented Language Switcher */}
            <div
              className="inline-flex items-center p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200/80 dark:border-gray-700"
              role="group"
              aria-label="Sélecteur de langue"
            >
              <button
                type="button"
                onClick={() => lang !== 'fr' && toggleLang()}
                className={`px-2 py-0.5 text-[11px] font-heading font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-white dark:bg-gray-700 text-ba-blue dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Passer en français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => lang !== 'en' && toggleLang()}
                className={`px-2 py-0.5 text-[11px] font-heading font-bold rounded-md transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white dark:bg-gray-700 text-ba-blue dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Primary CTA Button */}
            <Link
              to="/act"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-ba-blue hover:bg-ba-blue-dark active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 text-white"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{t.nav.donate}</span>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileOpen
              ? 'max-h-[600px] opacity-100 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-item flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-heading font-medium transition-colors ${
                    isActive
                      ? 'bg-ba-blue/10 text-ba-blue dark:text-white font-bold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-ba-blue" />
                  )}
                </Link>
              );
            })}
            <div className="pt-3 pb-1">
              <Link
                to="/act"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-ba-blue hover:bg-ba-blue-dark active:scale-95 transition-all text-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{t.nav.donate}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
