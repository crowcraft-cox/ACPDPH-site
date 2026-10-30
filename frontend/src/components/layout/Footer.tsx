import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useAdminData } from '../../context/adminData';
import { OFFICE_ADDRESS } from '../../constants/contact';

/* ─── Utilities ─────────────────────────────────────── */
const isEmailValid = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* ─── Footer ─────────────────────────────────────────── */
export default function Footer() {
  const { t } = useI18n();
  const { data, addSubscriber } = useAdminData();

  const [email, setEmail]               = useState('');
  const [subscribed, setSubscribed]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [newsletterMsg, setNewsletterMsg] =
    useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();

    /* Anti-spam honeypot */
    if (honeypotRef.current?.value) return;

    if (!isEmailValid(email)) {
      setNewsletterMsg({ type: 'error', text: t.footer.newsletter_error_email ?? 'Entrez une adresse e-mail valide.' });
      return;
    }

    setLoading(true);
    setNewsletterMsg(null);

    setTimeout(() => {
      const res = addSubscriber(email.trim());
      setLoading(false);

      if (res.success) {
        setSubscribed(true);
        setNewsletterMsg({ type: 'success', text: 'Merci, vous êtes inscrit(e) !' });
        setEmail('');
      } else {
        setNewsletterMsg({
          type: 'error',
          text: res.message || "Erreur lors de l'inscription.",
        });
      }
    }, 400);
  };

  /* ── Données ── */
  const navLinks = [
    { path: '/',             label: t.nav.home },
    { path: '/about',        label: t.nav.about },
    { path: '/governance',   label: t.nav.governance  || 'Gouvernance & Équipe' },
    { path: '/projects',     label: t.nav.projects },
    { path: '/news',         label: t.nav.news },
    { path: '/contact',      label: t.nav.contact },
  ];

  const socialLinks = [
    { id: 'linkedin',  url: 'https://linkedin.com/company/acpdph',            label: 'LinkedIn' },
    { id: 'facebook',  url: 'https://www.facebook.com/share/1atRhwrxaY/',     label: 'Facebook' },
    { id: 'twitter',   url: 'https://x.com/acpdph',                           label: 'X (Twitter)' },
    { id: 'instagram', url: 'https://www.instagram.com/acpdph/',               label: 'Instagram' },
    { id: 'tiktok',    url: 'https://vm.tiktok.com/ZS9kHDsU4hALR-qa7BL/',    label: 'TikTok' },
  ];

  /* ── Rendu email inline ── */
  const showEmailError =
    emailTouched && !isEmailValid(email) && !subscribed && !newsletterMsg;

  return (
    <footer className="footer-root" aria-label="Pied de page">

      {/* ── Niveau 1 : trois colonnes ──────────────────── */}
      <div className="footer-main">
        <div className="container-ba">
          <div className="footer-grid">

            {/* Colonne 1 – Notre bureau */}
            <div>
              <h3 className="footer-col-title">Notre bureau</h3>
              <ul className="footer-contact-list">
                <li>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <PinIcon />
                  </span>
                  <span>{data?.contact?.address && data.contact.address !== 'Beni — Nord-Kivu, RDC' ? data.contact.address : OFFICE_ADDRESS}</span>
                </li>
                <li>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <a href={`mailto:${data?.contact?.email && data.contact.email !== 'contact@acpdph.org' ? data.contact.email : 'info.acpdph.asbl.rdc@gmail.com'}`} className="footer-contact-link">
                    {data?.contact?.email && data.contact.email !== 'contact@acpdph.org' ? data.contact.email : 'info.acpdph.asbl.rdc@gmail.com'}
                  </a>
                </li>
                <li>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <a href={`tel:${(data?.contact?.phone && !data.contact.phone.includes('000') && !data.contact.phone.includes('XX') ? data.contact.phone : '+243976992466').replace(/\s+/g, '')}`} className="footer-contact-link">
                    {data?.contact?.phone && !data.contact.phone.includes('000') && !data.contact.phone.includes('XX') ? data.contact.phone : '+243 976 992 466'}
                  </a>
                </li>
                <li>
                  <span className="footer-contact-icon" aria-hidden="true" style={{ color: "#25D366" }}>
                    <WhatsAppIcon />
                  </span>
                  <a href={`https://wa.me/${(data?.contact?.whatsapp || '+243852799553').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                    WhatsApp : {data?.contact?.whatsapp || '+243 852 799 553'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Colonne 2 – Liens rapides */}
            <div>
              <h3 className="footer-col-title">Liens rapides</h3>
              <nav aria-label="Liens du pied de page">
                <ul className="footer-nav-list">
                  {navLinks.map(link => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer-nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Colonne 3 – Suivez-nous + newsletter */}
            <div className="footer-col-social">
              <h3 className="footer-col-title">Suivez-nous</h3>

              <div className="footer-social-row">
                {socialLinks.map(s => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="footer-social-btn"
                  >
                    <SocialIcon name={s.id} />
                  </a>
                ))}
              </div>

              {/* Newsletter */}
              <div>
                <label htmlFor="footer-email-input" className="footer-newsletter-label">
                  {t.footer.newsletter_title}
                </label>

                <form onSubmit={handleNewsletter} noValidate>
                  {/* Honeypot anti-spam */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                  />

                  <div className="footer-newsletter-row">
                    <input
                      id="footer-email-input"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="nom@exemple.org"
                      className="footer-newsletter-input"
                      autoComplete="email"
                      required
                      disabled={subscribed}
                      aria-describedby="footer-newsletter-feedback"
                      aria-invalid={showEmailError ? 'true' : undefined}
                    />
                    <button
                      type="submit"
                      disabled={loading || subscribed}
                      className="footer-newsletter-btn"
                    >
                      {loading ? '...' : subscribed ? 'Inscrit(e)' : t.footer.newsletter_submit}
                    </button>
                  </div>

                  <div id="footer-newsletter-feedback" aria-live="polite">
                    {newsletterMsg ? (
                      <p
                        role="status"
                        className={`footer-newsletter-hint ${
                          newsletterMsg.type === 'success'
                            ? 'footer-newsletter-success'
                            : 'footer-newsletter-error'
                        }`}
                      >
                        {newsletterMsg.text}
                      </p>
                    ) : showEmailError ? (
                      <p role="alert" className="footer-newsletter-hint footer-newsletter-error">
                        Entrez une adresse e-mail valide.
                      </p>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Niveau 2 : barre du bas ────────────────────── */}
      <div className="footer-bar">
        <div className="container-ba footer-bar-inner footer-bar-inner--centered">
          <p className="footer-bar-copy">
            &copy; {new Date().getFullYear()} ACPDPH. {t.footer.rights}
          </p>
          <div className="footer-bar-links">
            <Link to="/legal"   className="footer-bar-link">{t.footer.terms}</Link>
            <Link to="/privacy" className="footer-bar-link">{t.footer.privacy}</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

/* ─── Icônes SVG ──────────────────────────────────────── */

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.83 2.42-1.43 0-2.83-.37-4.06-1.08l-.29-.17-3.08.81.82-3-.19-.3a8.177 8.177 0 01-1.25-4.52c0-4.54 3.7-8.24 8.25-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/>
    </svg>
  );
}

function SocialIcon({ name }: { name: string }) {
  const size = 18;
  const icons: Record<string, React.ReactNode> = {

    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),

    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),

    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),

    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),

    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  };

  return <>{icons[name] ?? null}</>;
}
