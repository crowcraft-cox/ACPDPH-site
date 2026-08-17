import { useState } from 'react';
import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { apiFetch } from '../services/api';

export default function Contact() {
  const { t } = useI18n();
  const { ref, isVisible } = useScrollReveal();
  const { data } = useAdminData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const res = await apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
      });
    }
  };

  return (
    <div style={{ paddingTop: '150px' }} className="pb-20">
      <div 
        ref={ref} 
        className={`container-ba text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.contact.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-2xl mx-auto">{t.contact.subtitle}</p>
      </div>

      <div className="container-ba">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-6">{t.contact.address_title}</h3>
              <p className="text-ba-text-secondary mb-4 flex items-start gap-3">
                <svg className="w-6 h-6 text-ba-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {data.contact.address || t.contact.address}
              </p>
              <p className="text-ba-text-secondary mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-ba-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {data.contact.email || 'contact@brightafrica.org'}
              </p>
              <p className="text-ba-text-secondary mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-ba-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {data.contact.phone || '+243 XX XXX XXXX'}
              </p>

              {/* Social Channels */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-ba-text-muted mb-3">Réseaux Sociaux</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/share/1atRhwrxaY/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm group"
                  >
                    <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Page Facebook Officielle</span>
                    <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="glass-card overflow-hidden h-64 bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
               <span className="text-ba-text-muted">Carte interactive de Goma (Intégration Google Maps)</span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {statusMsg && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {statusMsg.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.05a9 9 0 110 18 9 9 0 010-18zm0 13.5h.008v.008H12v-.008z" />
                    )}
                  </svg>
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.form_name}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.form_email}</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.form_subject}</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.form_message}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-red w-full flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  t.contact.form_send
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
