import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import DisabilitySymbols from './DisabilitySymbols';
import { NAV_ITEMS, CONTACT_ITEM, type NavItem } from '../../constants/navigation';

type DropdownKey = 'org' | 'lang' | 'lang-compact' | null;
type MobileSubmenu = 'org' | null;

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

  // Accessibilité : Contraste élevé (icône soleil/sombre)
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('acpdph_contrast') === 'true';
  });

  // Références DOM
  const navContainerRef = useRef<HTMLElement>(null);
  const orgBtnRef = useRef<HTMLButtonElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const compactLangBtnRef = useRef<HTMLButtonElement>(null);
  const langTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compactLangTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  // Nettoyage des timers
  useEffect(() => {
    return () => {
      if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
      if (compactLangTimeoutRef.current) clearTimeout(compactLangTimeoutRef.current);
    };
  }, []);

  // Nettoyage de l'ancienne taille de police
  useEffect(() => {
    try {
      localStorage.removeItem('acpdph_font_size');
      document.documentElement.classList.remove('font-size-lg', 'font-size-xl');
    } catch {
      // Ignorer
    }
  }, []);

  // Montage initial
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Détection du scroll avec hystérésis
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
    const lenis = window.__lenis;
    const unsubLenis = lenis ? lenis.on('scroll', handleScroll) : null;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (unsubLenis) unsubLenis();
    };
  }, []);

  // Fermeture des sous-menus au changement d'état compact
  const prevCompactRef = useRef(isCompact);
  useEffect(() => {
    if (prevCompactRef.current !== isCompact) {
      setOpenDropdown(null);
      prevCompactRef.current = isCompact;
    }
  }, [isCompact]);

  // Contraste élevé
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

  // Fermeture du tiroir mobile
  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
    setMobileSubmenu(null);
    setMobileLangOpen(false);
    setTimeout(() => burgerBtnRef.current?.focus(), 50);
  }, []);

  // Fermeture automatique au changement de route
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setMobileSubmenu(null);
    setMobileLangOpen(false);
  }, [location.pathname]);

  // Verrouillage du scroll en mobile drawer
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

  // Touche Échap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openDropdown === 'org') {
          setOpenDropdown(null);
          orgBtnRef.current?.focus();
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
    },
    [openDropdown, isMobileOpen]
  );

  // Fonction stricte pour déterminer l'état actif (exactement UN lien actif à la fois)
  const isItemActive = useCallback(
    (item: NavItem): boolean => {
      if (item.exact || item.to === '/') {
        return location.pathname === '/';
      }
      if (item.dropdown) {
        return item.dropdown.some((sub) => location.pathname === sub.to);
      }
      if (item.to) {
        return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
      }
      return false;
    },
    [location.pathname]
  );

  const isContactActive = location.pathname === '/contact';

  return (
    <>
      {/* 0. PLACEHOLDER QUI RÉSERVE LA HAUTEUR TOTALE DU HEADER */}
      <div className="header-placeholder shrink-0" aria-hidden="true" />

      <header
        role="banner"
        ref={navContainerRef}
        onKeyDown={handleKeyDown}
        className={`header-container fixed top-0 left-0 w-full z-40 overflow-visible font-heading selection:bg-[var(--color-accent)] selection:text-white ${
          isCompact ? 'is-compact' : ''
        } ${!isMounted ? 'header-no-anim' : ''}`}
      >
        {/* Skip Link (WCAG 2.2) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[var(--color-primary)] focus:text-white focus:font-bold focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]"
        >
          Aller au contenu principal
        </a>

        {/* ========================================================================================= */}
        {/* 1. LOGO AGRANDI QUI DÉBORDE (Desktop xl+ : 185px, débordement 60% blanc / 40% bleu)       */}
        {/* ========================================================================================= */}
        <Link
          to="/"
          className="header-logo-link hidden xl:block absolute z-50 transition-transform duration-200 hover:scale-[1.015] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)] rounded-full group shadow-none"
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
          aria-label="ACPDPH – Retour à l'accueil"
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
        {/* BARRE MOBILE TÉLÉPHONE (<=768px) — fond blanc, logo, FR, loupe, burger                    */}
        {/* ========================================================================================= */}
        <div className="mobile-header-bar">
          {/* Gauche : Logo compact */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            aria-label="ACPDPH - Retour a l'accueil"
            onClick={() => {
              setMobileLangOpen(false);
            }}
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
            {/* Sélecteur de langue FR */}
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
                  style={{
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '150px',
                    background: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {languages.map((item, idx) => {
                    const isSelected = item.code === lang;
                    return (
                      <div key={item.code}>
                        <button
                          type="button"
                          onClick={() => {
                            setLang(item.code);
                            setMobileLangOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '11px 16px',
                            minHeight: '44px',
                            fontSize: '13px',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#1D4ED8' : '#111827',
                            background: isSelected ? '#EEF2FF' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            border: 'none',
                          }}
                        >
                          <span>{item.name}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isSelected ? '#1D4ED8' : '#9CA3AF',
                              marginLeft: '8px',
                            }}
                          >
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

            {/* Recherche (loupe) */}
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

            {/* Bouton burger */}
            <button
              ref={burgerBtnRef}
              type="button"
              onClick={() => {
                setIsMobileOpen(true);
                setMobileLangOpen(false);
              }}
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
        {/* 2. BARRE HAUTE BLANCHE (Desktop xl+ : repliable au scroll en mode compact)                 */}
        {/* ========================================================================================= */}
        <div className="header-top-bar relative z-30 overflow-visible w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors">
          <div className="header-top-bar-content container-ba h-full flex items-center">
            {/* Espace réservé desktop pour le grand logo rond */}
            <div
              className="hidden xl:flex flex-1"
              style={{ minWidth: 'var(--menu-reserved-space, 240px)' }}
              aria-hidden="true"
            />

            {/* Logo tablette / écran moyen (< 1280px) */}
            <div className="h-full flex items-center xl:hidden">
              <Link
                to="/"
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                aria-label="ACPDPH – Retour à l'accueil"
              >
                <img
                  src="/logo_ACPDPH.jpg"
                  alt="ACPDPH"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white bg-white shrink-0"
                  style={{ boxShadow: 'none', filter: 'none' }}
                />
                <span className="font-heading font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight">
                  ACPDPH
                </span>
              </Link>
            </div>

            {/* Droite : Accessibilité + Langue + NOUS SOUTENIR + Burger (sur < 1280px) */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0 ml-auto">
              {/* Rangée d'accessibilité (Symboles handicaps + Icône contraste/soleil) */}
              <div
                className="hidden md:flex items-center gap-2.5 xl:gap-3.5 pr-2.5 xl:pr-3.5 border-r border-gray-200 dark:border-zinc-700"
                role="group"
                aria-label="Options d'accessibilité et symboles des handicaps"
              >
                <DisabilitySymbols className="mr-1 xl:mr-2" />

                <button
                  type="button"
                  onClick={toggleContrast}
                  tabIndex={isCompact ? -1 : 0}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-[#3B9896] hover:text-[var(--color-accent)] dark:text-teal-400 dark:hover:text-[var(--color-accent)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    highContrast
                      ? 'bg-teal-100/70 dark:bg-zinc-700 font-bold'
                      : 'bg-transparent hover:bg-teal-50/70 dark:hover:bg-zinc-800'
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

              {/* Sélecteur de langue standard (Globe SVG + FR) */}
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
                  className="flex items-center gap-1.5 px-3 py-2 text-xs xl:text-[13px] font-heading font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-none transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
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
                    <div style={{ height: '4px' }} />
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #D9DEEA',
                        borderTop: '3px solid var(--color-accent)',
                        borderRadius: '0 0 8px 8px',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
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
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <span>{item.name}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
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

              {/* Bouton NOUS SOUTENIR avant scroll (Orange plein) */}
              <Link
                to="/support"
                tabIndex={isCompact ? -1 : 0}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 xl:px-6 xl:py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-xs xl:text-sm uppercase tracking-wider rounded-none shadow-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] shrink-0"
              >
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{t.nav.support || 'Nous soutenir'}</span>
              </Link>

              {/* Bouton burger pour tablette / écran moyen (< 1280px) */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                type="button"
                className="xl:hidden p-2.5 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-none transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
        {/* 3. BARRE DE NAVIGATION BLEUE (Desktop xl+ >=1280px, hauteur 76px)                          */}
        {/* ========================================================================================= */}
        <nav
          aria-label="Navigation principale"
          className="header-nav-bar relative z-20 overflow-visible hidden xl:block w-full bg-[var(--color-primary)]"
        >
          <div className="container-ba flex items-stretch justify-between h-[76px] pr-0">
            {/* ZONE GAUCHE & CENTRE : Logo + Liens NAV_ITEMS */}
            <div className="flex items-center gap-1.5 xl:gap-2.5 2xl:gap-4 flex-1 min-w-0">
              {/* Avant scroll : Espace réservé pour le grand logo rond débordant */}
              {!isCompact && (
                <div
                  className="shrink-0 header-menu-spacer"
                  style={{ width: 'var(--menu-reserved-space, 220px)' }}
                  aria-hidden="true"
                />
              )}

              {/* Après scroll : Petit logo rond compact (40px) */}
              {isCompact && (
                <Link
                  to="/"
                  className="flex items-center shrink-0 mr-2 xl:mr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
                  aria-label="ACPDPH - Accueil"
                >
                  <img
                    src="/logo_ACPDPH.jpg"
                    alt="ACPDPH"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white bg-white shrink-0 shadow-sm"
                  />
                </Link>
              )}

              {/* Mapping unifié depuis NAV_ITEMS */}
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);

                // Cas 1 : Dropdown (ORGANISATION)
                if (item.dropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative h-full flex items-center shrink-0"
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
                        aria-current={active ? 'true' : undefined}
                        className={`h-full flex items-center gap-1.5 px-2 xl:px-2.5 2xl:px-3 whitespace-nowrap shrink-0 text-[13px] xl:text-[13.5px] 2xl:text-[14px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                          active
                            ? 'text-[var(--color-accent-text)] font-extrabold'
                            : 'text-white hover:text-white/85 hover:underline underline-offset-8'
                        }`}
                      >
                        <span>{item.label}</span>
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
                            left: '0',
                            minWidth: '240px',
                            width: 'max-content',
                          }}
                          role="menu"
                          aria-label={item.label}
                          onMouseEnter={() => setOpenDropdown('org')}
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
                              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                            }}
                          >
                            {item.dropdown.map((sub, idx, arr) => {
                              const isSubActive = location.pathname === sub.to;
                              return (
                                <div key={sub.to}>
                                  <Link
                                    to={sub.to}
                                    role="menuitem"
                                    aria-current={isSubActive ? 'page' : undefined}
                                    onClick={() => setOpenDropdown(null)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '100%',
                                      padding: '11px 18px',
                                      minHeight: '44px',
                                      fontSize: '13px',
                                      fontWeight: isSubActive ? 700 : 600,
                                      color: isSubActive ? '#1D4ED8' : '#101828',
                                      background: isSubActive ? '#EEF2FF' : 'transparent',
                                      borderLeft: isSubActive ? '3px solid #1D4ED8' : '3px solid transparent',
                                      textDecoration: 'none',
                                      whiteSpace: 'nowrap',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                      transition: 'background 150ms, color 150ms',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSubActive) {
                                        (e.currentTarget as HTMLElement).style.background = '#EEF2FF';
                                        (e.currentTarget as HTMLElement).style.color = '#1D4ED8';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSubActive) {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = '#101828';
                                      }
                                    }}
                                  >
                                    {sub.label}
                                  </Link>
                                  {idx < arr.length - 1 && (
                                    <div style={{ height: '1px', background: '#EEF1F7', margin: '0 18px' }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Cas 2 : Lien direct
                return (
                  <Link
                    key={item.to}
                    to={item.to || '/'}
                    aria-current={active ? 'page' : undefined}
                    className={`h-full flex items-center px-2 xl:px-2.5 2xl:px-3 whitespace-nowrap shrink-0 text-[13px] xl:text-[13.5px] 2xl:text-[14px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      active
                        ? 'text-[var(--color-accent-text)] font-extrabold'
                        : 'text-white hover:text-white/85 hover:underline underline-offset-8'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* ZONE DROITE : Actions compactes (FR + NOUS SOUTENIR) + Bouton CONTACT */}
            <div className="flex items-stretch shrink-0">
              {/* Visible UNIQUEMENT après scroll (isCompact) : FR + NOUS SOUTENIR (contour blanc) */}
              {isCompact && (
                <div className="flex items-center gap-2 xl:gap-2.5 pr-2 xl:pr-3">
                  {/* Sélecteur de langue compact */}
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
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-heading font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-none min-h-[38px]"
                      aria-expanded={openDropdown === 'lang-compact'}
                      aria-haspopup="true"
                      aria-label={`Langue : ${currentLang.name}. Cliquez pour changer`}
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
                          top: 'calc(100% + 4px)',
                          right: '0',
                          minWidth: '170px',
                          width: 'max-content',
                        }}
                        role="menu"
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
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
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
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                >
                                  <span>{item.name}</span>
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
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

                  {/* Bouton NOUS SOUTENIR compact (Contour blanc, fond transparent) */}
                  <Link
                    to="/support"
                    title={t.nav.support || 'Nous soutenir'}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-white bg-transparent hover:bg-white/10 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 min-h-[38px]"
                  >
                    <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{t.nav.support || 'Nous soutenir'}</span>
                  </Link>
                </div>
              )}

              {/* Bouton CONTACT orange : Toujours présent, collé à l'extrême droite */}
              <Link
                to={CONTACT_ITEM.to}
                aria-current={isContactActive ? 'page' : undefined}
                className="h-full flex items-center justify-center px-6 xl:px-8 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-[13.5px] xl:text-[14px] uppercase tracking-wider rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset shrink-0 whitespace-nowrap ml-1"
              >
                {CONTACT_ITEM.label}
              </Link>
            </div>
          </div>
        </nav>

        {/* ========================================================================================= */}
        {/* 4. MENU DÉROULANT TABLETTE / ÉCRAN MOYEN (< 1280px)                                       */}
        {/* ========================================================================================= */}
        {isMobileOpen && (
          <div
            className="xl:hidden header-old-mobile-menu w-full bg-[var(--color-primary)] text-white border-t border-white/10 shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div className="container-ba py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);

                // Accordéon Organisation
                if (item.dropdown) {
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => setMobileSubmenu(mobileSubmenu === 'org' ? null : 'org')}
                        className={`w-full flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] cursor-pointer ${
                          active ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
                        }`}
                        aria-expanded={mobileSubmenu === 'org'}
                      >
                        <span>{item.label}</span>
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
                          {item.dropdown.map((sub) => {
                            const isSubActive = location.pathname === sub.to;
                            return (
                              <Link
                                key={sub.to}
                                to={sub.to}
                                onClick={closeMobileMenu}
                                className={`block py-2.5 px-3 text-xs font-heading font-semibold min-h-[44px] flex items-center ${
                                  isSubActive
                                    ? 'text-[var(--color-accent-text)]'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Lien simple
                return (
                  <Link
                    key={item.to}
                    to={item.to || '/'}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] ${
                      active ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-2 h-2 bg-[var(--color-accent-text)]" />}
                  </Link>
                );
              })}

              {/* Bouton Contact */}
              <Link
                to={CONTACT_ITEM.to}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3 px-4 text-sm font-heading font-bold uppercase tracking-wider rounded-none min-h-[44px] ${
                  isContactActive ? 'bg-white/15 text-[var(--color-accent-text)]' : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{CONTACT_ITEM.label}</span>
                {isContactActive && <span className="w-2 h-2 bg-[var(--color-accent-text)]" />}
              </Link>

              {/* Section d'accessibilité mobile */}
              <div className="pt-3 pb-2 border-t border-white/15 px-3">
                <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Accessibilité</div>
                <div className="flex items-center justify-center py-2 px-3 mb-2.5 bg-white/10 border border-white/15 overflow-x-auto">
                  <DisabilitySymbols iconClassName="w-8 h-8 shrink-0" showTooltip={false} />
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

              {/* Bouton d'action NOUS SOUTENIR */}
              <div className="pt-2 pb-1 space-y-2">
                <Link
                  to="/support"
                  onClick={closeMobileMenu}
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
      </header>

      {/* ======================================================================= */}
      {/* 5. TIROIR LATÉRAL MOBILE TÉLÉPHONE (<=768px)                            */}
      {/* ======================================================================= */}
      <div className="mobile-drawer-container">
        {/* Voile semi-transparent */}
        {isMobileOpen && (
          <div
            onClick={closeMobileMenu}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 115,
              background: 'rgba(0,0,0,0.55)',
            }}
          />
        )}

        {/* Panneau tiroir */}
        <div
          role="dialog"
          aria-modal={isMobileOpen ? 'true' : undefined}
          aria-label="Menu principal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '78%',
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
          {/* Barre sombre du haut */}
          <div style={{ display: 'flex', alignItems: 'center', height: 56, flexShrink: 0, background: '#222222' }}>
            <button
              ref={drawerCloseBtnRef}
              type="button"
              onClick={closeMobileMenu}
              aria-label="Fermer le menu"
              style={{
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: '#C2530A',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>&times;</span>
            </button>
            <span style={{ color: '#ffffff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 14, marginLeft: 16 }}>
              MENU
            </span>
          </div>

          {/* Liste des liens — défilement vertical */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);

              if (item.dropdown) {
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setMobileSubmenu(mobileSubmenu === 'org' ? null : 'org')}
                      aria-expanded={mobileSubmenu === 'org'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        minHeight: 52,
                        padding: '0 24px',
                        fontSize: 16,
                        fontWeight: 600,
                        color: active ? '#1D4ED8' : '#111827',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{item.label}</span>
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#9CA3AF"
                        viewBox="0 0 24 24"
                        style={{
                          transition: 'transform 200ms',
                          transform: mobileSubmenu === 'org' ? 'rotate(180deg)' : 'rotate(0deg)',
                          flexShrink: 0,
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileSubmenu === 'org' && (
                      <div style={{ background: '#F9FAFB', paddingLeft: 36, paddingRight: 20, paddingBottom: 4 }}>
                        {item.dropdown.map((sub) => {
                          const isSubActive = location.pathname === sub.to;
                          return (
                            <Link
                              key={sub.to}
                              to={sub.to}
                              onClick={closeMobileMenu}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: 44,
                                fontSize: 14,
                                color: isSubActive ? '#1D4ED8' : '#4B5563',
                                textDecoration: 'none',
                                fontWeight: isSubActive ? 700 : 500,
                              }}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to || '/'}
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 52,
                    padding: '0 24px',
                    fontSize: 16,
                    fontWeight: 600,
                    color: active ? '#1D4ED8' : '#111827',
                    textDecoration: 'none',
                    background: 'transparent',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Lien Contact */}
            <Link
              to={CONTACT_ITEM.to}
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 52,
                padding: '0 24px',
                fontSize: 16,
                fontWeight: 600,
                color: isContactActive ? '#1D4ED8' : '#111827',
                textDecoration: 'none',
                background: 'transparent',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              {CONTACT_ITEM.label}
            </Link>
          </div>

          {/* Bouton Nous soutenir (bas du tiroir) */}
          <div style={{ flexShrink: 0, padding: 16, borderTop: '1px solid #E5E7EB' }}>
            <Link
              to="/support"
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 48,
                background: '#1F4FDB',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
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
