import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';

export default function Navbar() {
  const { t, toggleLang, lang } = useI18n();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100 py-3 transition-all duration-300">
      <div className="container-ba flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Bright African"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <span className="font-heading font-bold text-lg leading-none">
              <span className="text-ba-red">Bright</span>{' '}
              <span className="text-ba-green">African</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm ${
                location.pathname === link.path ? 'active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-gray-200 text-gray-700 hover:border-ba-red transition-all"
          >
            {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>

          {/* CTA Donate */}
          <Link to="/act" className="hidden md:flex btn btn-red btn-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.nav.donate}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {isMobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${
          isMobileOpen ? 'max-h-[950px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-ba py-6 space-y-5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-4 px-5 rounded-2xl text-lg font-bold transition-all border-b border-gray-100/80 last:border-none ${
                location.pathname === link.path
                  ? 'bg-ba-red/10 text-ba-red font-extrabold shadow-sm'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link to="/act" className="btn btn-red w-full py-4 text-lg font-bold text-center shadow-lg">
              {t.nav.donate}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
