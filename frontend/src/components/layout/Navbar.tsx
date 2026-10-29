import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import DisabilitySymbols from './DisabilitySymbols';

type DropdownKey = 'org' | 'resources' | 'lang' | 'lang-compact' | null;
type MobileSubmenu = 'org' | 'resources' | null;

const COMPACT_THRESHOLD_DOWN = 80;
const COMPACT_THRESHOLD_UP = 10;

export default function Navbar() {
  const { t, setLang, lang, languages } = useI18n();
  const location = useLocation();

  // États des menus et navigation
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<MobileSubmenu>(null);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  // État compact au scroll avec hystérésis (down > 80px, up <= 10px)
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY > COMPACT_THRESHOLD_DOWN;
    }
    return false;
  });
  const [isMounted, setIsMounted] = useState(false);
  const lastScrollYRef = useRef(0);

  // Fonctionnalité d'accessibilité : Contraste élevé (icône soleil/sombre)
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('acpdph_contrast') === 'true';
  });

  // Références DOM pour le focus clavier
  const navContainerRef = useRef<HTMLElement>(null);
  const orgBtnRef = useRef<HTMLButtonElement>(null);
  const resourcesBtnRef = useRef<HTMLButtonElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const compactLangBtnRef = useRef<HTMLButtonElement>(null);
  const langTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compactLangTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  // Nettoyage des timers de langue au démontage
  useEffect(() => {
    return () => {
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
      if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
    };
  }, []);

  // Nettoyage de toute ancienne valeur de taille de police mémorisée chez les visiteurs
  useEffect(() => {
    try {
      localStorage.removeItem('acpdph_font_size');
      document.documentElement.classList.remove('font-size-lg', 'font-size-xl');
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }
  }, []);

  // Montage initial : activation des transitions après le premier rendu pour éviter tout saut
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Détection du scroll avec hystérésis et rAF :
  // Passage en compact si scrollY > 80px ET défilement vers le bas
  // Retour au mode complet UNIQUEMENT si scrollY <= 10px
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(0, window.scrollY);
        const lastScrollY = lastScrollYRef.current;
        const scrollingDown = currentScrollY > lastScrollY;

        setIsCompact((prevCompact) => {
          if (!prevCompact && currentScrollY > COMPACT_THRESHOLD_DOWN && scrollingDown) {
            return true;
          }
          if (prevCompact && currentScrollY <= COMPACT_THRESHOLD_UP) {
            return false;
          }
          return prevCompact;
        });

        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Synchronisation avec Lenis si actif
    const lenis = window.__lenis;
    const unsubLenis = lenis ? lenis.on('scroll', handleScroll) : null;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsubLenis) unsubLenis();
    };
  }, []);

  // Fermeture des sous-menus au changement d'état compact / complet
  const prevCompactRef = useRef(isCompact);
  useEffect(() => {
    if (prevCompactRef.current !== isCompact) {
      setOpenDropdown(null);
      prevCompactRef.current = isCompact;
    }
  }, [isCompact]);

  // Application dynamique du contraste élevé
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('dark');
      localStorage.setItem('acpdph_contrast', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('acpdph_contrast', 'false');
    }
  }, [highContrast]);

  const toggleContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  const resetContrast = useCallback(() => {
    setHighContrast(false);
  }, []);

  // Fermeture du tiroir mobile IDDC (telephone <=768px) avec restauration du focus
  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
    setMobileSubmenu(null);
    setMobileLangOpen(false);
    setTimeout(() => burgerBtnRef.current?.focus(), 50);
  }, []);

  // Fermeture automatique lors d'un changement de route
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setMobileSubmenu(null);
    setMobileLangOpen(false);
  }, [location.pathname]);

  // Tiroir mobile (<=768px) : verrouillage du scroll arriere-plan, touche Echap, focus
  useEffect(() => {
    if (!isMobileOpen) return;
    const mql = window.matchMedia('(max-width: 768px)');
    if (!mql.matches) return;

    document.body.style.overflow = 'hidden';
    setTimeout(() => drawerCloseBtnRef.current?.focus(), 100);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setMobileSubmenu(null);
        setMobileLangOpen(false);
        setTimeout(() => burgerBtnRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobileOpen]);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation au clavier : touche Échap pour refermer les menus
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (openDropdown === 'org') {
        setOpenDropdown(null);
        orgBtnRef.current?.focus();
      } else if (openDropdown === 'resources') {
        setOpenDropdown(null);
        resourcesBtnRef.current?.focus();
      } else if (openDropdown === 'lang') {
        setOpenDropdown(null);
        langBtnRef.current?.focus();
      } else if (openDropdown === 'lang-compact') {
        setOpenDropdown(null);
        compactLangBtnRef.current?.focus();
      } else if (isMobileOpen) {
        setIsMobileOpen(false);
      }
    }
  }, [openDropdown, isMobileOpen]);

  // Détection des routes actives
  const isHomeActive = location.pathname === '/';
  const isOrgActive = ['/about', '/governance', '/pillars'].includes(location.pathname);
  const isProjectsActive = location.pathname.startsWith('/projects');
  const isNewsActive = location.pathname.startsWith('/news');
  const isResourcesActive = ['/publications', '/partners', '/careers'].includes(location.pathname);
  const isContactActive = location.pathname === '/contact';

  return (
    <>
      {/* 0. PLACEHOLDER QUI RÉSERVE LA HAUTEUR TOTALE DU HEADER (AUCUN LAYOUT SHIFT) */}
      <div className="header-placeholder shrink-0" aria-hidden="true" />

      <header
        role="banner"
        ref={navContainerRef}
        onKeyDown={handleKeyDown}
        className={`header-container fixed top-0 left-0 w-full z-40 overflow-visible font-heading selection:bg-[var(--color-accent)] selection:text-white ${
          isCompact ? 'is-compact' : ''
        } ${!isMounted ? 'header-no-anim' : ''}`}
      >
        {/* 0. SKIP LINK (Accessibilité Clavier WCAG 2.2) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[var(--color-primary)] focus:text-white focus:font-bold focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]"
        >
          Aller au contenu principal
        </a>

        {/* ========================================================================================= */}
        {/* 1. LOGO AGRANDI QUI DÉBORDE (Desktop : Débordement 60% blanc / 40% bleu)                    */}
        {/* 185px, border 3px blanche SANS OMBRE portée (boxShadow: none, filter: none)                */}
        {/* ========================================================================================= */}
        <Link
          to="/"
          className="header-logo-link hidden lg:block absolute z-50 transition-transform duration-200 hover:scale-[1.015] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)] rounded-full group shadow-none"
          style={{
            left: 'var(--logo-margin-left, 24px)',
            top: 'var(--logo-offset, 14px)',
            width: 'var(--logo-size, 185px)',
            height: 'var(--logo-size, 185px)',
            boxShadow: 'none',
            filter: 'none',
          }}
          tabIndex={isCompact ? -1 : 0}
          aria-hidden={isCompact ? 'true' : undefined}
          aria-label="ACPDPH – Agence Congolaise de Promotion des Droits des Personnes Handicapées - Retour à l'accueil"
        >
          <img
            src="/logo_ACPDPH.jpg"
            alt="ACPDPH – Agence Congolaise de Promotion des Droits des Personnes Handicapées"
            className="header-logo-img w-full h-full rounded-full object-cover border-white bg-white shadow-none"
            style={{
              borderWidth: 'var(--logo-border-width, 3px)',
              borderStyle: 'solid',
              boxShadow: 'none',
              filter: 'none',
            }}
          />
        </Link>

      {/* ========================================================================================= */}
      {/* BARRE MOBILE TELEPHONE (<=768px) — fond blanc, logo, FR, loupe, burger                    */}
      {/* ========================================================================================= */}
      <div className="mobile-header-bar">
        {/* Gauche : Logo compact */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          aria-label="ACPDPH - Retour a l'accueil"
          onClick={() => { setMobileLangOpen(false); }}
        >
          <img
            src="/logo_ACPDPH.jpg"
            alt=""
            className="h-[38px] w-[38px] rounded-full object-cover border-2 border-white bg-white shrink-0"
            style={{ boxShadow: 'none', filter: 'none' }}
          />
          <span className="font-heading font-extrabold text-[15px] leading-none text-gray-900 tracking-tight">
            ACPDPH
          </span>
        </Link>

        {/* Droite : FR + Loupe + Burger */}
        <div className="flex items-center gap-0.5">
          {/* Selecteur de langue FR */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileLangOpen(!mobileLangOpen)}
              className="flex items-center justify-center px-2.5 min-w-[44px] min-h-[44px] text-[13px] font-heading font-bold text-gray-900 tracking-wide uppercase cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label={`Langue : ${currentLang.name}. Cliquez pour changer`}
              aria-expanded={mobileLangOpen}
              aria-haspopup="true"
            >
              {currentLang.label}
            </button>
            {mobileLangOpen && (
              <div
                className="absolute z-[130] shadow-xl"
                style={{ top: 'calc(100% + 4px)', right: 0, minWidth: '150px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}
              >
                {languages.map((item, idx) => {
                  const isSelected = item.code === lang;
                  return (
                    <div key={item.code}>
                      <button
                        type="button"
                        onClick={() => { setLang(item.code); setMobileLangOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '11px 16px', minHeight: '44px',
                          fontSize: '13px', fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#1D4ED8' : '#111827',
                          background: isSelected ? '#EEF2FF' : 'transparent',
                          cursor: 'pointer', textAlign: 'left', border: 'none',
                        }}
                      >
                        <span>{item.name}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#9CA3AF', marginLeft: '8px' }}>
                          {item.label}
                        </span>
                      </button>
                      {idx < languages.length - 1 && (
                        <div style={{ height: '1px', background: '#F3F4F6', margin: '0 12px' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Icone de recherche (loupe) */}
          <Link
            to="/news"
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label="Rechercher"
            onClick={() => setMobileLangOpen(false)}
          >
            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Bouton burger (3 barres) */}
          <button
            ref={burgerBtnRef}
            type="button"
            onClick={() => { setIsMobileOpen(true); setMobileLangOpen(false); }}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-gray-900 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label="Ouvrir le menu"
            aria-expanded={isMobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* 2. BARRE HAUTE (FOND BLANC, REPLIABLE AU SCROLL EN MODE COMPACT)                           */}
      {/* ========================================================================================= */}
      <div className="header-top-bar relative z-30 overflow-visible w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="header-top-bar-content container-ba h-full flex items-center justify-between">
          
          {/* GAUCHE : Logo mobile (< 1024px) OU Titre décalé (>= 1024px) */}
          <div className="h-full flex items-center lg:hidden">
            
            {/* Version Mobile & Tablette (< 1024px) : Logo contenu dans la barre blanche (se réduit à ~44px en compact) */}
            <Link
              to="/"
              className="header-logo-link flex lg:hidden items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] shadow-none"
              style={{ boxShadow: 'none', filter: 'none' }}
              aria-label="ACPDPH – Agence Congolaise de Promotion des Droits des Personnes Handicapées"
            >
              <img
                src="/logo_ACPDPH.jpg"
                alt="ACPDPH – Agence Congolaise de Promotion des Droits des Personnes Handicapées"
                className="header-logo-img header-mobile-logo-img h-14 w-14 rounded-full object-cover border-white bg-white shrink-0 shadow-none"
                style={{
                  borderWidth: 'var(--logo-border-width, 2.5px)',
                  borderStyle: 'solid',
                  boxShadow: 'none',
                  filter: 'none',
                }}
              />
            </Link>
          </div>

          {/* DROITE : Accessibilité (Soleil + RESET si actif) + Langue + Bouton Soutenir + Burger */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 ml-auto">
            
            {/* RANGÉE D'ACCESSIBILITÉ (Symboles des handicaps + Icône soleil/contraste, RESET si actif) */}
            <div
              className="hidden md:flex items-center gap-2.5 lg:gap-3.5 pr-2.5 lg:pr-3.5 border-r border-gray-200 dark:border-zinc-700"
              role="group"
              aria-label="Options d'accessibilité et symboles des handicaps"
            >
              {/* SYMBOLES UNIVERSELS DU HANDICAP (Affichés juste avant l'icône de contraste) */}
              <DisabilitySymbols className="mr-1 lg:mr-2" />

              {/* Bouton Contraste élevé (icône soleil/mode sombre) */}
              <button
                type="button"
                onClick={toggleContrast}
                tabIndex={isCompact ? -1 : 0}
                className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3B9896] hover:text-[var(--color-accent)] dark:text-teal-400 dark:hover:text-[var(--color-accent)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  highContrast ? 'bg-teal-100/70 dark:bg-zinc-700 font-bold' : 'bg-transparent hover:bg-teal-50/70 dark:hover:bg-zinc-800'
                }`}
                title="Basculer le contraste élevé / mode sombre"
                aria-label="Basculer le contraste élevé"
                aria-pressed={highContrast}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>

              {/* Bouton RESET (réinitialise le contraste si actif) */}
              {highContrast && (
                <button
                  type="button"
                  onClick={resetContrast}
                  tabIndex={isCompact ? -1 : 0}
                  className="min-h-[44px] px-2 flex items-center justify-center text-xs uppercase font-bold tracking-wider text-gray-500 hover:text-red-600 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  title="Réinitialiser le contraste par défaut"
                  aria-label="Réinitialiser le contraste"
                >
                  RESET
                </button>
              )}
            </div>

            {/* SELECTEUR DE LANGUE (Globe SVG + FR, angles droits, focus contraste) */}
            <div
              className="relative z-50"
              onMouseEnter={() => {
                if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
              }}
              onMouseLeave={() => {
                if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
                langTimeoutRef.current = setTimeout(() => {
                  setOpenDropdown((prev) => (prev === 'lang' ? null : prev));
                }, 300);
              }}
            >
              <button
                ref={langBtnRef}
                type="button"
                tabIndex={isCompact ? -1 : 0}
                onClick={() => setOpenDropdown(openDropdown === 'lang' ? null : 'lang')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs lg:text-[13px] font-heading font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-none transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                aria-expanded={openDropdown === 'lang'}
                aria-haspopup="true"
                aria-label={`Langue : ${currentLang.name}. Cliquez pour changer`}
              >
                <svg className="w-4 h-4 text-[#3B9896] dark:text-teal-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>

                <span className="tracking-wide uppercase">{currentLang.label}</span>

                <svg
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-150 ${openDropdown === 'lang' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'lang' && (
                <div
                  className="absolute z-[100] shadow-2xl"
                  style={{
                    top: 'calc(100% + 4px)',
                    right: '0',
                    minWidth: '170px',
                    width: 'max-content',
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="Sélecteur de langue"
                  onMouseEnter={() => {
                    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
                    setOpenDropdown('lang');
                  }}
                  onMouseLeave={() => {
                    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
                    langTimeoutRef.current = setTimeout(() => {
                      setOpenDropdown((prev) => (prev === 'lang' ? null : prev));
                    }, 300);
                  }}
                >
                  {/* Pont invisible anti-gap */}
                  <div style={{ height: '4px' }} />
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #D9DEEA',
                      borderTop: '3px solid var(--color-accent)',
                      borderRadius: '0 0 8px 8px',
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {languages.map((item, idx) => {
                      const isSelected = item.code === lang;
                      return (
                        <div key={item.code}>
                          <button
                            type="button"
                            role="menuitem"
                            aria-current={isSelected ? 'true' : undefined}
                            onClick={() => {
                              setLang(item.code);
                              setOpenDropdown(null);
                              langBtnRef.current?.focus();
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '11px 18px',
                              minHeight: '44px',
                              fontSize: '13px',
                              fontWeight: isSelected ? 700 : 600,
                              color: isSelected ? '#1D4ED8' : '#101828',
                              background: isSelected ? '#EEF2FF' : 'transparent',
                              borderLeft: isSelected ? '3px solid #1D4ED8' : '3px solid transparent',
                              transition: 'background 150ms, color 150ms, border-left-color 150ms',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              whiteSpace: 'nowrap',
                              boxSizing: 'border-box',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                                (e.currentTarget as HTMLElement).style.color = '#1D4ED8';
                                (e.currentTarget as HTMLElement).style.borderLeftColor = '#1D4ED8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = '#101828';
                                (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                              }
                            }}
                          >
                            <span>{item.name}</span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                color: isSelected ? '#1D4ED8' : '#6B7280',
                                marginLeft: '10px',
                              }}
                            >
                              {item.label}
                            </span>
                          </button>
                          {idx < languages.length - 1 && (
                            <div style={{ height: '1px', background: '#EEF1F7', margin: '0 18px' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* BOUTON NOUS SOUTENIR (Rectangulaire, angles droits, couleur d'accent, texte blanc gras majuscules) */}
            <Link
              to="/support"
              tabIndex={isCompact ? -1 : 0}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-xs lg:text-sm uppercase tracking-wider rounded-none shadow-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] shrink-0"
            >
              <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{t.nav.support || 'Nous soutenir'}</span>
            </Link>

            {/* BOUTON BURGER (Mobile < 1024px) */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              type="button"
              className="lg:hidden p-2.5 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-none transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              aria-label={isMobileOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* 3. BARRE DE NAVIGATION (FOND COULEUR PRINCIPALE, HAUTEUR 76px, ACCUEIL DÉCALÉ SOUS ACPDPH)  */}
      {/* ========================================================================================= */}
      <nav
        aria-label="Navigation principale"
        className="header-nav-bar relative z-20 overflow-visible hidden lg:block w-full bg-[var(--color-primary)]"
      >
        <div className="container-ba flex items-stretch justify-between h-[76px]">
          
          {/* LIENS DE NAVIGATION (Avec espace réservé à gauche pour aligner Accueil avec le titre) */}
          <div className="flex items-center gap-5 xl:gap-8 2xl:gap-10 shrink-0">
            
            {/* Espace réservé pour que les liens ne passent pas sous le logo qui déborde (glisse vers 18px en compact) */}
            <div
              className="hidden lg:block shrink-0 header-menu-spacer"
              aria-hidden="true"
            />

            {/* ACCUEIL (Aligne verticalement sous le début de "ACPDPH") */}
            <Link
              to="/"
              aria-current={isHomeActive ? 'page' : undefined}
              className={`h-full flex items-center whitespace-nowrap shrink-0 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                isHomeActive
                  ? 'text-[var(--color-accent-text)]'
                  : 'text-white hover:text-[var(--color-accent-text)]'
              }`}
            >
              {t.nav.home}
            </Link>

            {/* ORGANISATION ▾ (Menu déroulant accessible) */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenDropdown('org')}
              onMouseLeave={() => {
                setTimeout(() => {
                  setOpenDropdown((prev) => (prev === 'org' ? null : prev));
                }, 150);
              }}
            >
              <button
                ref={orgBtnRef}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'org' ? null : 'org')}
                aria-expanded={openDropdown === 'org'}
                aria-haspopup="true"
                aria-current={isOrgActive ? 'true' : undefined}
                className={`h-full flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                  isOrgActive
                    ? 'text-[var(--color-accent-text)]'
                    : 'text-white hover:text-[var(--color-accent-text)]'
                }`}
              >
                <span>{t.nav_menu?.organisation ?? 'Organisation'}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'org' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Panneau déroulant Organisation */}
              {openDropdown === 'org' && (
                <div
                  className="absolute z-50"
                  style={{
                    top: '100%',
                    left: '-14px',
                    minWidth: '230px',
                    width: 'max-content',
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="Organisation"
                  onMouseEnter={() => setOpenDropdown('org')}
                >
                  {/* Pont invisible pour éviter le vide entre le bouton et le panneau */}
                  <div style={{ height: '4px' }} />
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #D9DEEA',
                      borderTop: '3px solid var(--color-accent)',
                      borderRadius: '0 0 8px 8px',
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  >
                    {[
                      { to: '/about', label: t.nav.about },
                      { to: '/governance', label: t.nav.governance || 'Gouvernance' },
                      { to: '/pillars', label: t.nav.pillars },
                    ].map((item, idx, arr) => (
                      <div key={item.to}>
                        <Link
                          to={item.to}
                          role="menuitem"
                          aria-current={location.pathname === item.to ? 'page' : undefined}
                          onClick={() => setOpenDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '11px 18px',
                            minHeight: '44px',
                            fontSize: '13px',
                            fontWeight: location.pathname === item.to ? 700 : 600,
                            color: location.pathname === item.to ? '#1D4ED8' : '#101828',
                            background: location.pathname === item.to ? '#EEF2FF' : 'transparent',
                            borderLeft: location.pathname === item.to ? '3px solid #1D4ED8' : '3px solid transparent',
                            transition: 'background 150ms, color 150ms, border-left-color 150ms',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                          onMouseEnter={(e) => {
                            if (location.pathname !== item.to) {
                              (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                              (e.currentTarget as HTMLElement).style.color = '#1D4ED8';
                              (e.currentTarget as HTMLElement).style.borderLeftColor = '#1D4ED8';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (location.pathname !== item.to) {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#101828';
                              (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                            }
                          }}
                        >
                          {item.label}
                        </Link>
                        {idx < arr.length - 1 && (
                          <div style={{ height: '1px', background: '#EEF1F7', margin: '0 18px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* NOS PROJETS */}
            <Link
              to="/projects"
              aria-current={isProjectsActive ? 'page' : undefined}
              className={`h-full flex items-center whitespace-nowrap shrink-0 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                isProjectsActive
                  ? 'text-[var(--color-accent-text)]'
                  : 'text-white hover:text-[var(--color-accent-text)]'
              }`}
            >
              {t.nav.projects}
            </Link>

            {/* ACTUALITÉS */}
            <Link
              to="/news"
              aria-current={isNewsActive ? 'page' : undefined}
              className={`h-full flex items-center whitespace-nowrap shrink-0 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                isNewsActive
                  ? 'text-[var(--color-accent-text)]'
                  : 'text-white hover:text-[var(--color-accent-text)]'
              }`}
            >
              {t.nav.news}
            </Link>

            {/* RESSOURCES ▾ (Menu déroulant accessible) */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => {
                setTimeout(() => {
                  setOpenDropdown((prev) => (prev === 'resources' ? null : prev));
                }, 150);
              }}
            >
              <button
                ref={resourcesBtnRef}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
                aria-expanded={openDropdown === 'resources'}
                aria-haspopup="true"
                aria-current={isResourcesActive ? 'true' : undefined}
                className={`h-full flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                  isResourcesActive
                    ? 'text-[var(--color-accent-text)]'
                    : 'text-white hover:text-[var(--color-accent-text)]'
                }`}
              >
                <span>{t.nav_menu?.resources ?? 'Ressources'}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${openDropdown === 'resources' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Panneau déroulant Ressources */}
              {openDropdown === 'resources' && (
                <div
                  className="absolute z-50"
                  style={{
                    top: '100%',
                    left: '-14px',
                    minWidth: '230px',
                    width: 'max-content',
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="Ressources"
                  onMouseEnter={() => setOpenDropdown('resources')}
                >
                  {/* Pont invisible pour éviter le vide entre le bouton et le panneau */}
                  <div style={{ height: '4px' }} />
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #D9DEEA',
                      borderTop: '3px solid var(--color-accent)',
                      borderRadius: '0 0 8px 8px',
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                  >
                    {[
                      { to: '/publications', label: t.nav.publications || 'Publications' },
                      { to: '/partners', label: t.nav.partners || 'Nos Partenaires' },
                      { to: '/careers', label: t.nav.careers || 'Offres & Emploi' },
                    ].map((item, idx, arr) => (
                      <div key={item.to}>
                        <Link
                          to={item.to}
                          role="menuitem"
                          aria-current={location.pathname === item.to ? 'page' : undefined}
                          onClick={() => setOpenDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '11px 18px',
                            minHeight: '44px',
                            fontSize: '13px',
                            fontWeight: location.pathname === item.to ? 700 : 600,
                            color: location.pathname === item.to ? '#1D4ED8' : '#101828',
                            background: location.pathname === item.to ? '#EEF2FF' : 'transparent',
                            borderLeft: location.pathname === item.to ? '3px solid #1D4ED8' : '3px solid transparent',
                            transition: 'background 150ms, color 150ms, border-left-color 150ms',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                          onMouseEnter={(e) => {
                            if (location.pathname !== item.to) {
                              (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                              (e.currentTarget as HTMLElement).style.color = '#1D4ED8';
                              (e.currentTarget as HTMLElement).style.borderLeftColor = '#1D4ED8';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (location.pathname !== item.to) {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = '#101828';
                              (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                            }
                          }}
                        >
                          {item.label}
                        </Link>
                        {idx < arr.length - 1 && (
                          <div style={{ height: '1px', background: '#EEF1F7', margin: '0 18px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EXTRÉMITÉ DROITE : Actions compactes (FR + Nous soutenir) + BLOC CONTACT */}
          <div className="flex items-stretch shrink-0">
            {/* ACTIONS COMPACTES (FR + Nous soutenir) - Visible uniquement en mode compact */}
            <div className="header-compact-actions flex items-center gap-2.5 xl:gap-3.5 pr-3 xl:pr-4">
              {/* SÉLECTEUR DE LANGUE COMPACT */}
              <div
                className="relative z-50"
                onMouseEnter={() => {
                  if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
                }}
                onMouseLeave={() => {
                  if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
                  compactLangTimeoutRef.current = setTimeout(() => {
                    setOpenDropdown((prev) => (prev === 'lang-compact' ? null : prev));
                  }, 300);
                }}
              >
                <button
                  ref={compactLangBtnRef}
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'lang-compact' ? null : 'lang-compact')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-none min-h-[38px]"
                  aria-expanded={openDropdown === 'lang-compact'}
                  aria-haspopup="true"
                  aria-label={`Langue : ${currentLang.name}. Cliquez pour changer`}
                  tabIndex={isCompact ? 0 : -1}
                >
                  <svg className="w-4 h-4 text-teal-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="tracking-wide uppercase">{currentLang.label}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-white/80 transition-transform duration-150 ${openDropdown === 'lang-compact' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === 'lang-compact' && (
                  <div
                    className="absolute z-[100] shadow-2xl"
                    style={{
                      top: 'calc(100% + 6px)',
                      right: '0',
                      minWidth: '170px',
                      width: 'max-content',
                    }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="Sélecteur de langue"
                    onMouseEnter={() => {
                      if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
                      setOpenDropdown('lang-compact');
                    }}
                    onMouseLeave={() => {
                      if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
                      compactLangTimeoutRef.current = setTimeout(() => {
                        setOpenDropdown((prev) => (prev === 'lang-compact' ? null : prev));
                      }, 300);
                    }}
                  >
                    <div style={{ height: '4px' }} />
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #D9DEEA',
                        borderTop: '3px solid var(--color-accent)',
                        borderRadius: '0 0 8px 8px',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {languages.map((item, idx) => {
                        const isSelected = item.code === lang;
                        return (
                          <div key={item.code}>
                            <button
                              type="button"
                              role="menuitem"
                              aria-current={isSelected ? 'true' : undefined}
                              onClick={() => {
                                setLang(item.code);
                                setOpenDropdown(null);
                                compactLangBtnRef.current?.focus();
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '11px 18px',
                                minHeight: '44px',
                                fontSize: '13px',
                                fontWeight: isSelected ? 700 : 600,
                                color: isSelected ? '#1D4ED8' : '#101828',
                                background: isSelected ? '#EEF2FF' : 'transparent',
                                borderLeft: isSelected ? '3px solid #1D4ED8' : '3px solid transparent',
                                transition: 'background 150ms, color 150ms, border-left-color 150ms',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                whiteSpace: 'nowrap',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                                  (e.currentTarget as HTMLElement).style.color = '#1D4ED8';
                                  (e.currentTarget as HTMLElement).style.borderLeftColor = '#1D4ED8';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                                  (e.currentTarget as HTMLElement).style.color = '#101828';
                                  (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                                }
                              }}
                            >
                              <span>{item.name}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  letterSpacing: '0.06em',
                                  color: isSelected ? '#1D4ED8' : '#6B7280',
                                  marginLeft: '10px',
                                }}
                              >
                                {item.label}
                              </span>
                            </button>
                            {idx < languages.length - 1 && (
                              <div style={{ height: '1px', background: '#EEF1F7', margin: '0 18px' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* BOUTON NOUS SOUTENIR COMPACT (Cœur seul < 1280px avec tooltip, Cœur + texte >= 1280px) */}
              <Link
                to="/support"
                title={t.nav.support || 'Nous soutenir'}
                aria-label={t.nav.support || 'Nous soutenir'}
                tabIndex={isCompact ? 0 : -1}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 xl:px-4 xl:py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-none shadow-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 min-h-[38px]"
              >
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden xl:inline">{t.nav.support || 'Nous soutenir'}</span>
              </Link>
            </div>

            {/* BLOC CONTACT */}
            <Link
              to="/contact"
              aria-current={isContactActive ? 'page' : undefined}
              className="h-full flex items-center justify-center px-6 xl:px-10 2xl:px-12 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-[14px] xl:text-[14.5px] uppercase tracking-wider rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset shrink-0 whitespace-nowrap"
            >
              {t.nav.contact || 'CONTACT'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ========================================================================================= */}
      {/* 4. MENU MOBILE (< 1024px)                                                                 */}
      {/* ========================================================================================= */}
      {isMobileOpen && (
        <div
          className="lg:hidden header-old-mobile-menu w-full bg-[var(--color-primary)] text-white border-t border-white/10 shadow-2xl transition-all"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal mobile"
        >
          <div className="container-ba py-4 space-y-1">
            
            {/* ACCUEIL */}
            <Link
              to="/"
              className={`flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] ${
                isHomeActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{t.nav.home}</span>
              {isHomeActive && <span className="w-2 h-2 bg-[var(--color-accent-text)]" />}
            </Link>

            {/* ORGANISATION (Accordéon) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'org' ? null : 'org')}
                className={`w-full flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] cursor-pointer ${
                  isOrgActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
                }`}
                aria-expanded={mobileSubmenu === 'org'}
              >
                <span>{t.nav_menu?.organisation ?? 'Organisation'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-150 ${mobileSubmenu === 'org' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileSubmenu === 'org' && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-black/15">
                  <Link
                    to="/about"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/about' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    to="/governance"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/governance' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.governance || 'Gouvernance'}
                  </Link>
                  <Link
                    to="/pillars"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/pillars' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.pillars}
                  </Link>
                </div>
              )}
            </div>

            {/* NOS PROJETS */}
            <Link
              to="/projects"
              className={`flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] ${
                isProjectsActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{t.nav.projects}</span>
              {isProjectsActive && <span className="w-2 h-2 bg-[var(--color-accent-text)]" />}
            </Link>

            {/* ACTUALITÉS */}
            <Link
              to="/news"
              className={`flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] ${
                isNewsActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{t.nav.news}</span>
              {isNewsActive && <span className="w-2 h-2 bg-[var(--color-accent-text)]" />}
            </Link>

            {/* RESSOURCES (Accordéon) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'resources' ? null : 'resources')}
                className={`w-full flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] cursor-pointer ${
                  isResourcesActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
                }`}
                aria-expanded={mobileSubmenu === 'resources'}
              >
                <span>{t.nav_menu?.resources ?? 'Ressources'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-150 ${mobileSubmenu === 'resources' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileSubmenu === 'resources' && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-black/15">
                  <Link
                    to="/publications"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/publications' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.publications || 'Publications'}
                  </Link>
                  <Link
                    to="/partners"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/partners' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.partners || 'Nos Partenaires'}
                  </Link>
                  <Link
                    to="/careers"
                    className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                      location.pathname === '/careers' ? 'text-[var(--color-accent-text)]' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.nav.careers || 'Offres & Emploi'}
                  </Link>
                </div>
              )}
            </div>

            {/* SECTION D'ACCESSIBILITÉ MOBILE */}
            <div className="pt-3 pb-2 border-t border-white/15 px-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Accessibilité &amp; Handicaps</div>
              
              {/* SYMBOLES UNIVERSELS DU HANDICAP EN MOBILE */}
              <div className="flex items-center justify-center py-2 px-3 mb-2.5 bg-white/10 border border-white/15 overflow-x-auto">
                <DisabilitySymbols
                  iconClassName="w-8 h-8 shrink-0"
                  showTooltip={false}
                />
              </div>

              <button
                type="button"
                onClick={toggleContrast}
                className={`w-full py-2.5 px-3 text-xs font-bold rounded-none border min-h-[44px] flex items-center justify-center gap-2 transition-colors ${
                  highContrast
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>{highContrast ? 'Mode Contraste Élevé Activé' : 'Activer le Contraste Élevé'}</span>
              </button>
            </div>

            {/* BOUTONS D'APPEL À L'ACTION MOBILE (Pleine largeur, angles droits) */}
            <div className="pt-2 pb-1 space-y-2">
              <Link
                to="/contact"
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-sm uppercase tracking-wider rounded-none min-h-[44px] transition-colors"
              >
                {t.nav.contact || 'CONTACT'}
              </Link>

              <Link
                to="/support"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-gray-100 text-[var(--color-primary)] font-heading font-bold text-sm uppercase tracking-wider rounded-none min-h-[44px] transition-colors"
              >
                <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{t.nav.support || 'Nous soutenir'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================================= */}
      </header>
{/* TIROIR LATERAL MOBILE IDDC (<=768px)                                    */}
      {/* ======================================================================= */}
      <div className="mobile-drawer-container">

        {/* Voile semi-transparent */}
        {isMobileOpen && (
          <div
            onClick={closeMobileMenu}
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0, zIndex: 115,
              background: 'rgba(0,0,0,0.55)',
            }}
          />
        )}

        {/* Panneau tiroir — positionnement absolu pour chaque zone */}
        <div
          role="dialog"
          aria-modal={isMobileOpen ? 'true' : undefined}
          aria-label="Menu principal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '75%',
            maxWidth: '320px',
            zIndex: 120,
            background: '#ffffff',
            transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 300ms ease-out',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* — Barre sombre du haut — */}
          <div style={{ display: 'flex', alignItems: 'center', height: 56, flexShrink: 0, background: '#222222' }}>
            <button
              ref={drawerCloseBtnRef}
              type="button"
              onClick={closeMobileMenu}
              aria-label="Fermer le menu"
              style={{
                width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, background: '#F26A4F', border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>&times;</span>
            </button>
            <span style={{ color: '#ffffff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 14, marginLeft: 16 }}>MENU</span>
          </div>

          {/* — Liste des liens — zone défilable principale — */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

            {/* Accueil */}
            <Link to="/" onClick={closeMobileMenu}
              style={{
                display: 'flex', alignItems: 'center', minHeight: 52,
                padding: '0 24px', fontSize: 18, fontWeight: 500,
                color: isHomeActive ? '#1D4ED8' : '#111827',
                textDecoration: 'none', background: 'transparent',
                borderBottom: '1px solid #F3F4F6',
              }}
            >Accueil</Link>

            {/* Organisation (accordéon) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'org' ? null : 'org')}
                aria-expanded={mobileSubmenu === 'org'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', minHeight: 52, padding: '0 24px',
                  fontSize: 18, fontWeight: 500,
                  color: isOrgActive ? '#1D4ED8' : '#111827',
                  background: 'transparent', border: 'none', borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                }}
              >
                <span>Organisation</span>
                <svg
                  width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24"
                  style={{ transition: 'transform 200ms', transform: mobileSubmenu === 'org' ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'org' && (
                <div style={{ background: '#F9FAFB', paddingLeft: 40, paddingRight: 24, paddingBottom: 4 }}>
                  <Link to="/about" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/about' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/about' ? 600 : 400 }}
                  >{t.nav.about}</Link>
                  <Link to="/governance" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/governance' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/governance' ? 600 : 400 }}
                  >{t.nav.governance || 'Gouvernance'}</Link>
                  <Link to="/pillars" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/pillars' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/pillars' ? 600 : 400 }}
                  >{t.nav.pillars}</Link>
                </div>
              )}
            </div>

            {/* Nos Projets */}
            <Link to="/projects" onClick={closeMobileMenu}
              style={{
                display: 'flex', alignItems: 'center', minHeight: 52,
                padding: '0 24px', fontSize: 18, fontWeight: 500,
                color: isProjectsActive ? '#1D4ED8' : '#111827',
                textDecoration: 'none', background: 'transparent',
                borderBottom: '1px solid #F3F4F6',
              }}
            >{t.nav.projects}</Link>

            {/* Actualités */}
            <Link to="/news" onClick={closeMobileMenu}
              style={{
                display: 'flex', alignItems: 'center', minHeight: 52,
                padding: '0 24px', fontSize: 18, fontWeight: 500,
                color: isNewsActive ? '#1D4ED8' : '#111827',
                textDecoration: 'none', background: 'transparent',
                borderBottom: '1px solid #F3F4F6',
              }}
            >{t.nav.news}</Link>

            {/* Ressources (accordéon) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'resources' ? null : 'resources')}
                aria-expanded={mobileSubmenu === 'resources'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', minHeight: 52, padding: '0 24px',
                  fontSize: 18, fontWeight: 500,
                  color: isResourcesActive ? '#1D4ED8' : '#111827',
                  background: 'transparent', border: 'none', borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                }}
              >
                <span>Ressources</span>
                <svg
                  width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24"
                  style={{ transition: 'transform 200ms', transform: mobileSubmenu === 'resources' ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === 'resources' && (
                <div style={{ background: '#F9FAFB', paddingLeft: 40, paddingRight: 24, paddingBottom: 4 }}>
                  <Link to="/publications" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/publications' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/publications' ? 600 : 400 }}
                  >{t.nav.publications || 'Publications'}</Link>
                  <Link to="/partners" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/partners' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/partners' ? 600 : 400 }}
                  >{t.nav.partners || 'Nos Partenaires'}</Link>
                  <Link to="/careers" onClick={closeMobileMenu}
                    style={{ display: 'flex', alignItems: 'center', minHeight: 44, fontSize: 15, color: location.pathname === '/careers' ? '#1D4ED8' : '#4B5563', textDecoration: 'none', fontWeight: location.pathname === '/careers' ? 600 : 400 }}
                  >{t.nav.careers || 'Offres & Emploi'}</Link>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link to="/contact" onClick={closeMobileMenu}
              style={{
                display: 'flex', alignItems: 'center', minHeight: 52,
                padding: '0 24px', fontSize: 18, fontWeight: 500,
                color: isContactActive ? '#1D4ED8' : '#111827',
                textDecoration: 'none', background: 'transparent',
                borderBottom: '1px solid #F3F4F6',
              }}
            >{t.nav.contact || 'Contact'}</Link>

          </div>

          {/* — Bouton Nous soutenir (bas du tiroir) — */}
          <div style={{ flexShrink: 0, padding: 16, borderTop: '1px solid #E5E7EB' }}>
            <Link
              to="/support"
              onClick={closeMobileMenu}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', minHeight: 48,
                background: '#1F4FDB', color: '#ffffff',
                fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
                letterSpacing: '0.08em', textDecoration: 'none',
              }}
            >
              Nous soutenir
            </Link>
          </div>

        </div>
      </div>

    </>
  );
}
