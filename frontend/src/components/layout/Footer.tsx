import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useAdminData } from '../../context/adminData';

export default function Footer() {
  const { t } = useI18n();
  const { addSubscriber } = useAdminData();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setNewsletterMsg(null);

    setTimeout(() => {
      const res = addSubscriber(email.trim());
      setLoading(false);

      if (res.success) {
        setSubscribed(true);
        setNewsletterMsg({
          type: 'success',
          text: 'Merci ! Votre inscription à la newsletter a été enregistrée avec succès. Vous recevrez nos futurs projets et actualités.',
        });
        setEmail('');
      } else {
        setNewsletterMsg({
          type: 'error',
          text: res.message || 'Erreur lors de l\'inscription.',
        });
      }
    }, 400);
  };

  const quickLinks = [
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
    <footer className="bg-ba-dark text-white">
      {/* Main Footer */}
      <div className="container-ba pt-20 pb-20 md:pt-28 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Bright African" className="h-14 w-auto brightness-110" />
              <div>
                <span className="font-heading font-bold text-xl leading-none text-white block">
                  <span className="text-ba-red">Bright</span>{' '}
                  <span className="text-ba-green">African</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-base leading-relaxed">
              {t.footer.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {[
                {
                  id: 'facebook',
                  url: 'https://www.facebook.com/share/1atRhwrxaY/',
                  label: 'Facebook - ONG Bright African',
                },
                {
                  id: 'twitter',
                  url: 'https://x.com/brightafric',
                  label: 'X (Twitter) - ONG Bright African',
                },
                {
                  id: 'instagram',
                  url: 'https://www.instagram.com/bright_african/',
                  label: 'Instagram - ONG Bright African',
                },
                {
                  id: 'tiktok',
                  url: 'https://vm.tiktok.com/ZS9kHDsU4hALR-qa7BL/',
                  label: 'TikTok - ONG Bright African',
                },
              ].map(social => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-ba-red flex items-center justify-center transition-all hover:-translate-y-1 text-white"
                  aria-label={social.label}
                  title={social.label}
                >
                  <SocialIcon name={social.id} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-8 text-white tracking-wide">{t.footer.quick_links}</h4>
            <ul className="space-y-5">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-ba-red text-base transition-colors flex items-center gap-2.5"
                  >
                    <svg className="w-3.5 h-3.5 text-ba-red shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-8 text-white tracking-wide">{t.footer.legal}</h4>
            <ul className="space-y-5">
              <li>
                <a href="#privacy" className="text-gray-300 hover:text-ba-green text-base transition-colors flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-ba-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-ba-green text-base transition-colors flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-ba-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href="#statuts" className="text-gray-300 hover:text-ba-green text-base transition-colors flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-ba-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {t.footer.statuts}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-8 text-white tracking-wide">{t.footer.newsletter_title}</h4>
            <p className="text-gray-300 text-base leading-relaxed mb-8">{t.footer.newsletter_subtitle}</p>
            <form onSubmit={handleNewsletter} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletter_placeholder}
                className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-base text-white placeholder-gray-400 focus:outline-none focus:border-ba-red focus:ring-1 focus:ring-ba-red transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-red w-full text-base py-3.5 flex items-center justify-center gap-2 ${loading ? 'opacity-60' : ''}`}
              >
                {loading ? 'Inscription...' : (subscribed ? 'Inscription confirmée !' : t.footer.newsletter_submit)}
              </button>

              {newsletterMsg && (
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed border font-medium ${
                  newsletterMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-red-950/80 text-red-300 border-red-500/40'
                }`}>
                  {newsletterMsg.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="container-ba py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            © {new Date().getFullYear()} ONG Bright African. {t.footer.rights}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-center md:text-right">
            Avenue de la Paix, Quartier Himbi, Goma — Nord-Kivu, RDC
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  };
  return icons[name] || null;
}
