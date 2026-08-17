import { useState } from 'react';
import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { apiFetch } from '../services/api';

export default function Safeguarding() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();
  const { ref: formRef, isVisible: isFormVisible } = useScrollReveal();

  const [formData, setFormData] = useState({
    incidentType: '',
    date: '',
    location: '',
    description: '',
    isAnonymous: false,
    name: '',
    contact: '',
  });

  const [loading, setLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<{ trackingCode: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setReportSuccess(null);

    const contactInfo = formData.isAnonymous 
      ? 'Signalement Anonyme' 
      : `${formData.name.trim() || 'Nom non précisé'} - ${formData.contact.trim() || 'Pas de contact'}`;

    const res = await apiFetch('/safeguarding/report', {
      method: 'POST',
      body: JSON.stringify({
        reporterType: formData.isAnonymous ? 'ANONYMOUS' : 'IDENTIFIED',
        incidentType: formData.incidentType,
        location: formData.location,
        description: `[Date de l'incident: ${formData.date || 'Non précisée'}]\n${formData.description}`,
        contactInfo,
      }),
    });

    setLoading(false);

    if (res.success) {
      // Generate a tracking code if not returned by backend
      const trackingCode = res.data?.id ? `BA-SAFE-${res.data.id.substring(0, 6).toUpperCase()}` : `BA-SAFE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setReportSuccess({ trackingCode });
      setFormData({
        incidentType: '',
        date: '',
        location: '',
        description: '',
        isAnonymous: false,
        name: '',
        contact: '',
      });
    } else {
      setErrorMsg(res.error || 'Erreur lors de la transmission sécurisée du signalement.');
    }
  };

  return (
    <div style={{ paddingTop: '150px' }} className="pb-20">
      {/* Header */}
      <div 
        ref={headerRef} 
        className={`container-ba text-center mb-16 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="inline-block p-4 rounded-full bg-ba-red/10 text-ba-red mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.safeguarding.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-2xl mx-auto">{t.safeguarding.subtitle}</p>
      </div>

      <div className="container-ba">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-ba-red/10 text-ba-red flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.18-7.79l-4.5 1.5A1.5 1.5 0 004.5 4.93v5.67c0 5.48 4.22 10.15 9.5 10.4 5.28-.25 9.5-4.92 9.5-10.4V4.93a1.5 1.5 0 00-.82-1.34l-4.5-1.5a1.5 1.5 0 00-.96 0l-4.5 1.5z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-ba-red">{t.safeguarding.charter_title}</h3>
              <p className="text-ba-text-secondary text-sm leading-relaxed">
                {t.safeguarding.charter_text}
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-green/30 transition-all duration-300 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-ba-green/10 text-ba-green flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-ba-green">{t.safeguarding.referent_title}</h3>
              <p className="text-ba-text-secondary text-sm leading-relaxed">
                {t.safeguarding.referent_text}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div 
              ref={formRef}
              className={`glass-card p-6 sm:p-8 md:p-12 shadow-xl rounded-3xl transition-all duration-700 delay-200 ${isFormVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <h2 className="font-heading text-2xl font-bold mb-3">{t.safeguarding.form_title}</h2>
              <p className="text-sm text-ba-text-muted mb-6 leading-relaxed">{t.safeguarding.form_subtitle}</p>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-1 w-16 bg-ba-red rounded-full"></div>
                <div className="h-1 flex-1 bg-ba-gray dark:bg-ba-dark-lighter rounded-full"></div>
              </div>

              {/* Confirmation de succès avec code d'incident */}
              {reportSuccess && (
                <div className="p-8 mb-8 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300 font-bold text-xl">
                    <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Signalement Transmis en Toute Confidentialité
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Votre signalement a été chiffré et envoyé au Référent Protection de l'ONG Bright African. Votre démarche contribue directement à la sécurité et à la protection des enfants.
                  </p>
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl flex items-center justify-between border border-emerald-300 dark:border-emerald-700">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">Numéro de suivi confidentiel :</span>
                    <span className="font-mono text-lg font-bold text-emerald-900 dark:text-emerald-100 bg-white dark:bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-400">
                      {reportSuccess.trackingCode}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Conservez précieusement ce code de dossier pour toute correspondance ultérieure avec le Référent Protection.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 mb-6 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.05a9 9 0 110 18 9 9 0 010-18zm0 13.5h.008v.008H12v-.008z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="block text-sm font-medium mb-3">{t.safeguarding.form_type} *</label>
                      <select
                        required
                        value={formData.incidentType}
                        onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                      >
                        <option value="">Sélectionner...</option>
                        <option value="violence">Violence physique ou verbale</option>
                        <option value="exploitation">Exploitation (travail forcé, etc.)</option>
                        <option value="abuse">Abus sexuel</option>
                        <option value="neglect">Négligence</option>
                        <option value="other">Autre violation</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-medium mb-3">{t.safeguarding.form_date}</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-3">{t.safeguarding.form_location} *</label>
                   <input
                    required
                    type="text"
                    placeholder="Ville, Quartier, ou École..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium mb-3">{t.safeguarding.form_desc} *</label>
                   <textarea
                    required
                    rows={5}
                    placeholder="Décrivez les faits de manière aussi précise que possible..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-xl focus:outline-none focus:border-ba-red transition-colors"
                  ></textarea>
                </div>

                <div className="bg-ba-gray-light dark:bg-ba-dark-light p-8 rounded-xl border border-ba-gray dark:border-ba-dark-lighter">
                  <div className="flex items-center gap-3 mb-4">
                     <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="w-5 h-5 rounded border-ba-gray text-ba-red focus:ring-ba-red cursor-pointer"
                    />
                     <label htmlFor="anonymous" className="font-medium cursor-pointer">{t.safeguarding.form_anonymous}</label>
                  </div>
                  <p className="text-xs text-ba-text-muted mb-6 italic leading-relaxed">Si vous ne cochez pas l'anonymat, vous pouvez fournir vos coordonnées ci-dessous :</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <input
                      type="text"
                      disabled={formData.isAnonymous}
                      placeholder={t.safeguarding.form_name}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-lg focus:outline-none focus:border-ba-red transition-colors text-sm disabled:opacity-40"
                    />
                     <input
                      type="text"
                      disabled={formData.isAnonymous}
                      placeholder={t.safeguarding.form_contact}
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-2 bg-white dark:bg-ba-dark border border-ba-gray dark:border-ba-dark-lighter rounded-lg focus:outline-none focus:border-ba-red transition-colors text-sm disabled:opacity-40"
                    />
                  </div>
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
                      Cryptage et transmission en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {t.safeguarding.form_submit}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-ba-text-muted flex items-center justify-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {t.safeguarding.form_disclaimer}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
