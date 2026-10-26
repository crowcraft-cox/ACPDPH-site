import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';

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
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compactLangTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fermeture automatique lors d'un changement de route
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setMobileSubmenu(null);
  }, [location.pathname]);

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
        className={`header-container fixed top-0 left-0 w-full z-40 font-heading selection:bg-[var(--color-accent)] selection:text-white ${
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
          className="header-logo-link hidden lg:block absolute z-30 transition-transform duration-200 hover:scale-[1.015] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)] rounded-full group shadow-none"
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
      {/* 2. BARRE HAUTE (FOND BLANC, REPLIABLE AU SCROLL EN MODE COMPACT)                           */}
      {/* ========================================================================================= */}
      <div className="header-top-bar relative z-30 w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="header-top-bar-content container-ba h-full flex items-center justify-between">
          
          {/* GAUCHE : Logo mobile (< 1024px) OU Titre décalé (>= 1024px) */}
          <div className="h-full flex items-center">
            
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
              <div className="flex flex-col justify-center">
                <span className="font-heading font-extrabold text-lg leading-none text-gray-900 dark:text-white tracking-tight">
                  ACPDPH
                </span>
                <span className="font-heading font-bold text-[10px] tracking-wider uppercase text-[var(--color-accent)] mt-0.5 leading-tight">
                  Droits &amp; Inclusion
                </span>
              </div>
            </Link>

            {/* Version Desktop (>= 1024px) : Titre décalé après le logo */}
            <Link
              to="/"
              className="hidden lg:flex flex-col justify-center h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              style={{ paddingLeft: 'var(--menu-reserved-space, 250px)' }}
              tabIndex={isCompact ? -1 : 0}
              aria-label="ACPDPH – Droits & Inclusion - Retour à l'accueil"
            >
              <span className="font-heading font-extrabold text-2xl lg:text-[2.1rem] leading-none text-gray-900 dark:text-white tracking-tight transition-colors group-hover:text-[var(--color-primary)]">
                ACPDPH
              </span>
              <span className="font-heading font-bold text-xs lg:text-[0.95rem] tracking-wider uppercase text-[var(--color-accent)] mt-1.5 leading-tight">
                Droits &amp; Inclusion
              </span>
            </Link>
          </div>

          {/* DROITE : Accessibilité (Soleil + RESET si actif) + Langue + Bouton Soutenir + Burger */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            
            {/* RANGÉE D'ACCESSIBILITÉ (Icône soleil/contraste, RESET si actif) */}
            <div
              className="hidden md:flex items-center gap-2 pr-2 lg:pr-3 border-r border-gray-200 dark:border-zinc-700"
              role="group"
              aria-label="Options d'accessibilité du site"
            >
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="header-nav-bar relative z-20 hidden lg:block w-full bg-[var(--color-primary)]"
      >
        <div className="container-ba flex items-stretch justify-between h-[76px]">
          
          {/* LIENS DE NAVIGATION (Avec espace réservé à gauche pour aligner Accueil avec le titre) */}
          <div className="flex items-center gap-7 xl:gap-10">
            
            {/* Espace réservé pour que les liens ne passent pas sous le logo qui déborde (glisse vers 18px en compact) */}
            <div
              className="hidden lg:block shrink-0 header-menu-spacer"
              aria-hidden="true"
            />

            {/* ACCUEIL (Aligne verticalement sous le début de "ACPDPH") */}
            <Link
              to="/"
              aria-current={isHomeActive ? 'page' : undefined}
              className={`h-full flex items-center text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
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
                className={`h-full flex items-center gap-1.5 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                  isOrgActive
                    ? 'text-[var(--color-accent-text)]'
                    : 'text-white hover:text-[var(--color-accent-text)]'
                }`}
              >
                <span>Organisation</span>
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
              className={`h-full flex items-center text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
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
              className={`h-full flex items-center text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
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
                className={`h-full flex items-center gap-1.5 text-[14px] xl:text-[15px] font-heading font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-primary)] ${
                  isResourcesActive
                    ? 'text-[var(--color-accent-text)]'
                    : 'text-white hover:text-[var(--color-accent-text)]'
                }`}
              >
                <span>Ressources</span>
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
              className="h-full flex items-center justify-center px-8 xl:px-12 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-heading font-bold text-[14.5px] uppercase tracking-wider rounded-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset shrink-0"
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
          className="lg:hidden w-full bg-[var(--color-primary)] text-white border-t border-white/10 shadow-2xl transition-all"
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
                <span>Organisation</span>
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
                <span>Ressources</span>
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

            {/* SECTION D'ACCESSIBILITÉ MOBILE (Contraste élevé uniquement) */}
            <div className="pt-3 pb-2 border-t border-white/15 px-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Accessibilité</div>
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
      </header>
    </>
  );
}
