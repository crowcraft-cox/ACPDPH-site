import { useState } from 'react';
import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import { apiFetch } from '../services/api';
import { OFFICE_ADDRESS, OFFICE_MAPS_EMBED_URL, OFFICE_MAPS_VIEW_URL } from '../constants/contact';

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

  // Coordonnées officielles réelles avec fallback garanti
  const contactAddress = data?.contact?.address && !data.contact.address.includes('XX') && data.contact.address !== 'Beni — Nord-Kivu, RDC'
    ? data.contact.address
    : OFFICE_ADDRESS;

  const contactEmail = data?.contact?.email && data.contact.email !== 'contact@acpdph.org'
    ? data.contact.email
    : 'info.acpdph.asbl.rdc@gmail.com';

  const contactPhone = data?.contact?.phone && !data.contact.phone.includes('000') && !data.contact.phone.includes('XX')
    ? data.contact.phone
    : '+243 976 992 466';

  const contactWhatsapp = data?.contact?.whatsapp || '+243 852 799 553';

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
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20">
      <div 
        ref={ref} 
        className={`container-ba text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.contact.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-2xl mx-auto">{t.contact.subtitle}</p>
      </div>

      <div className="container-ba">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Informations officielles de contact */}
          <div className="space-y-6">
            <div className="card p-6 sm:p-8" style={{ background: '#ffffff' }}>
              <div className="border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-bold" style={{ color: '#111827' }}>
                  {t.contact.address_title}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-ba-blue border border-blue-100">
                  Siège Social
                </span>
              </div>

              <div className="space-y-5">
                {/* Adresse */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-ba-blue flex items-center justify-center shrink-0 border border-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Adresse Physique
                    </span>
                    <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">
                      {contactAddress}
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-ba-blue flex items-center justify-center shrink-0 border border-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Téléphone Appel
                    </span>
                    <a 
                      href={`tel:${contactPhone.replace(/\s+/g, '')}`} 
                      className="text-gray-900 font-medium hover:text-ba-blue transition-colors text-sm sm:text-base inline-flex items-center gap-2"
                    >
                      <span>{contactPhone}</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.83 2.42-1.43 0-2.83-.37-4.06-1.08l-.29-.17-3.08.81.82-3-.19-.3a8.177 8.177 0 01-1.25-4.52c0-4.54 3.7-8.24 8.25-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      WhatsApp Officiel
                    </span>
                    <a 
                      href={`https://wa.me/${contactWhatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-900 font-medium hover:text-emerald-600 transition-colors text-sm sm:text-base inline-flex items-center gap-2"
                    >
                      <span>{contactWhatsapp}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Discuter en direct
                      </span>
                    </a>
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-ba-blue flex items-center justify-center shrink-0 border border-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Courriel Officiel
                    </span>
                    <a 
                      href={`mailto:${contactEmail}`} 
                      className="text-gray-900 font-medium hover:text-ba-blue transition-colors text-sm sm:text-base break-all"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte interactive de localisation */}
            <div className="card overflow-hidden h-72 relative border border-gray-200 rounded-2xl shadow-sm bg-gray-100">
              <iframe
                title="Localisation Siège ACPDPH — Beni, Nord-Kivu, RDC"
                src={OFFICE_MAPS_EMBED_URL}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl text-xs text-gray-700 shadow-sm border border-gray-100 flex items-center justify-between">
                <span className="font-medium truncate">{OFFICE_ADDRESS}</span>
                <a
                  href={OFFICE_MAPS_VIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ba-blue font-semibold hover:underline shrink-0 ml-2"
                >
                  Agrandir
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-6 sm:p-8" style={{ background: '#ffffff' }}>
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
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>{t.contact.form_name}</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-ba-blue transition-colors text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>{t.contact.form_email}</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-ba-blue transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>{t.contact.form_subject}</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-ba-blue transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#111827' }}>{t.contact.form_message}</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-ba-blue transition-colors text-gray-900"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-blue w-full flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
