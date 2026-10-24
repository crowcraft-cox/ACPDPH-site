import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { animate, stagger } from 'animejs';

export default function Navbar() {
  const { t, setLang, lang, languages } = useI18n();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'org' | 'resources' | 'lang' | null>(null);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Track scroll position
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mobile menu entrance animation
  useEffect(() => {
    if (isMobileOpen && mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateX: [-16, 0],
          duration: 300,
          delay: stagger(30, { start: 30 }),
          ease: 'outExpo',
        });
      }
    }
  }, [isMobileOpen]);

  // Mobile nav list in order of the PDF model
  const mobileNavLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/governance', label: t.nav.governance || 'Gouvernance' },
    { path: '/pillars', label: t.nav.pillars },
    { path: '/projects', label: t.nav.projects },
    { path: '/news', label: t.nav.news },
    { path: '/partners', label: t.nav.partners || 'Nos Partenaires' },
    { path: '/publications', label: t.nav.publications || 'Publications' },
    { path: '/careers', label: t.nav.careers || 'Offres & Emploi' },
    { path: '/contact', label: t.nav.contact },
  ];

  const isOrgActive = ['/about', '/governance', '/pillars'].includes(location.pathname);
  const isResourcesActive = ['/publications', '/partners', '/careers'].includes(location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-ba-dark/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800 py-2'
          : 'bg-white/90 dark:bg-ba-dark/90 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800/60 py-3'
      }`}
    >
      <nav aria-label="Navigation principale" className="container-ba" ref={navContainerRef}>
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          
          {/* 1. BRAND LOGO */}
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

          {/* 2. DESKTOP NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Accueil */}
            <Link
              to="/"
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all ${
                location.pathname === '/'
                  ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
              }`}
            >
              {t.nav.home}
            </Link>

            {/* Dropdown: L'Organisation */}
            <div className="relative" onMouseLeave={() => setOpenDropdown(null)}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'org' ? null : 'org')}
                onMouseEnter={() => setOpenDropdown('org')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all cursor-pointer ${
                  isOrgActive
                    ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
                }`}
              >
                <span>Organisation</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'org' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'org' && (
                <div className="absolute left-0 top-full pt-1.5 w-60 z-50">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 space-y-1">
                    <Link
                      to="/about"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/about'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.about}</div>
                      <div className="text-[11px] text-gray-500 font-normal">Historique & Mission</div>
                    </Link>
                    <Link
                      to="/governance"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/governance'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.governance || 'Gouvernance & Équipe'}</div>
                      <div className="text-[11px] text-gray-500 font-normal">C.A., Direction & Éthique</div>
                    </Link>
                    <Link
                      to="/pillars"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/pillars'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.pillars}</div>
                      <div className="text-[11px] text-gray-500 font-normal">Droits, Accessibilité, Santé...</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Nos Projets */}
            <Link
              to="/projects"
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all ${
                location.pathname.startsWith('/projects')
                  ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
              }`}
            >
              {t.nav.projects}
            </Link>

            {/* Actualités */}
            <Link
              to="/news"
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all ${
                location.pathname.startsWith('/news')
                  ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
              }`}
            >
              {t.nav.news}
            </Link>

            {/* Dropdown: Ressources & Réseau */}
            <div className="relative" onMouseLeave={() => setOpenDropdown(null)}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
                onMouseEnter={() => setOpenDropdown('resources')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all cursor-pointer ${
                  isResourcesActive
                    ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
                }`}
              >
                <span>Ressources</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute left-0 top-full pt-1.5 w-64 z-50">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 space-y-1">
                    <Link
                      to="/publications"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/publications'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.publications || 'Publications & Études'}</div>
                      <div className="text-[11px] text-gray-500 font-normal">Rapports, Textes de lois, Guides</div>
                    </Link>
                    <Link
                      to="/partners"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/partners'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.partners || 'Nos Partenaires'}</div>
                      <div className="text-[11px] text-gray-500 font-normal">Bailleurs, ONG & Institutions</div>
                    </Link>
                    <Link
                      to="/careers"
                      className={`block px-3 py-2 rounded-xl text-xs font-heading transition-colors ${
                        location.pathname === '/careers'
                          ? 'bg-ba-blue/10 text-ba-blue font-bold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-bold">{t.nav.careers || 'Offres et Emploi'}</div>
                      <div className="text-[11px] text-gray-500 font-normal">Emplois, Stages & Bénévolat</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-[13.5px] font-heading transition-all ${
                location.pathname === '/contact'
                  ? 'text-ba-blue dark:text-white font-bold bg-ba-blue/10 dark:bg-ba-blue/25'
                  : 'text-gray-600 dark:text-gray-300 hover:text-ba-blue dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/60 font-medium'
              }`}
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* 3. RIGHT: Language Selector & CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative" onMouseLeave={() => openDropdown === 'lang' && setOpenDropdown(null)}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'lang' ? null : 'lang')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold text-gray-700 dark:text-gray-200 bg-gray-100/90 dark:bg-gray-800/90 hover:bg-gray-200/80 dark:hover:bg-gray-700 border border-gray-200/80 dark:border-gray-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ba-blue"
                aria-expanded={openDropdown === 'lang'}
                aria-label={`Langue : ${currentLang.name}. Cliquez pour changer`}
              >
                {/* Modern Globe SVG Icon */}
                <svg className="w-3.5 h-3.5 text-ba-blue dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>

                {/* Current Language Label */}
                <span className="font-bold tracking-wide">{currentLang.label}</span>

                {/* Chevron Tab */}
                <svg
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${openDropdown === 'lang' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown Menu */}
              {openDropdown === 'lang' && (
                <div className="absolute right-0 top-full pt-1.5 w-44 z-50">
                  <div className="p-1.5 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 space-y-0.5">
                    {languages.map((item) => {
                      const isSelected = item.code === lang;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setLang(item.code);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-heading transition-colors cursor-pointer text-left ${
                            isSelected
                              ? 'bg-ba-blue/10 dark:bg-ba-blue/20 text-ba-blue dark:text-blue-400 font-bold'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isSelected ? 'bg-ba-blue text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {item.label}
                            </span>
                            <span>{item.name}</span>
                          </div>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-ba-blue dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA Button: Nous Soutenir */}
            <Link
              to="/support"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-ba-blue hover:bg-ba-blue-dark active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{t.nav.support || 'Nous soutenir'}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 4. MOBILE MENU DROPDOWN */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileOpen
              ? 'max-h-[640px] opacity-100 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 overflow-y-auto'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-2 space-y-1">
            {mobileNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-nav-item flex items-center justify-between py-2 px-3.5 rounded-xl text-sm font-heading font-medium transition-colors ${
                    isActive
                      ? 'bg-ba-blue/10 text-ba-blue dark:text-white font-bold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ba-blue" />}
                </Link>
              );
            })}
            {/* Mobile language selector */}
            <div className="pt-2.5 pb-1 border-t border-gray-100 dark:border-gray-800 px-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-ba-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{lang === 'fr' ? 'Langue' : lang === 'it' ? 'Lingua' : lang === 'de' ? 'Sprache' : 'Language'}</span>
                </span>
                <span className="text-xs font-heading font-bold text-ba-blue dark:text-blue-400">
                  {currentLang.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {languages.map((item) => {
                  const isSelected = item.code === lang;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLang(item.code)}
                      className={`flex items-center justify-between px-2.5 py-2 text-xs font-heading rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-ba-blue text-white border-ba-blue font-bold shadow-xs'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 pb-1">
              <Link
                to="/support"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-ba-blue hover:bg-ba-blue-dark active:scale-95 transition-all text-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{t.nav.support || 'Nous soutenir'}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
