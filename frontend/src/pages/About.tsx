
import { useI18n } from '../i18n';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';

export default function About() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: historyRef } = useScrollReveal();
  const { ref: govRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.gov-card',
    staggerDelay: 80,
  });

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-white dark:bg-ba-dark">

      {/* ── HEADER ── */}
      <div
        ref={headerRef}
        className="container-ba text-center mb-16"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: '#111827' }}>
          {t.about.title}
        </h1>
        <p className="text-lg text-justify max-w-3xl mx-auto" style={{ color: '#374151' }}>
          {t.about.subtitle}
        </p>
      </div>

      {/* ── HISTORY & CONTEXT ── */}
      <div style={{ background: '#ffffff', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div
          ref={historyRef}
          className="container-ba"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-5 text-ba-blue">{t.about.history_title}</h2>
                <div className="space-y-4 text-base md:text-lg leading-relaxed text-justify" style={{ color: '#374151' }}>
                  {t.about.history_text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-ba-blue">{t.about.vision_title}</h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.vision_text}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-ba-blue">{t.about.mission_title}</h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.mission_text}
                </p>
              </div>

              {/* Statuts & Reconnaissance Juridique */}
              <div className="pt-6 border-t border-gray-200 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-2.5">
                    Cadre Légal & Réglementaire
                  </span>
                  <h4 className="font-heading font-bold text-xl mb-3" style={{ color: '#111827' }}>
                    Statut juridique de l’ONG Nationale « ACPDPH »
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed text-justify" style={{ color: '#4B5563' }}>
                    L’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est une Organisation Nationale (ONG) de droit congolais, constituée conformément à la législation de la République démocratique du Congo applicable aux associations sans but lucratif, notamment la <strong>Loi n° 004/2001 du 20 juillet 2001</strong>.
                  </p>
                </div>

                {/* Synthèse Identité */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                  {[
                    { label: 'Organisation', value: 'ACPDPH' },
                    { label: 'Forme Juridique', value: 'ONG Nationale & ASBL (RDC)' },
                    { label: 'Cadre Légal', value: 'Loi n° 004/2001 du 20 juillet 2001' },
                    { label: 'Siège Social', value: 'Beni (Nord-Kivu, RDC)' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:border-ba-blue hover:bg-white transition-all duration-200"
                    >
                      <span className="font-bold text-xs uppercase tracking-wider block text-ba-blue mb-1">
                        {item.label}
                      </span>
                      <span className="text-gray-900 text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Reconnaissance administrative et juridique */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-ba-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h5 className="font-heading font-bold text-base md:text-lg uppercase tracking-wide" style={{ color: '#111827' }}>
                      Reconnaissance Administrative et Juridique
                    </h5>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                    L’Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) a connu les étapes suivantes dans son processus de reconnaissance institutionnelle :
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        date: '3 décembre 2018',
                        badge: 'Création',
                        title: 'Création officielle de l’association et adoption de ses statuts à Beni.',
                        ref: null,
                      },
                      {
                        date: '25 novembre 2020',
                        badge: 'Agrément Ministériel',
                        title: 'Obtention de l’Agrément Ministériel',
                        ref: 'Arrêté ministériel N° 064/CAB.MIN/AFF.SOC./RBM/AS/2020',
                      },
                      {
                        date: '10 février 2024',
                        badge: 'Personnalité Juridique',
                        title: 'Obtention de la personnalité juridique',
                        ref: 'Arrêté ministériel N° 367/CAB/ME/MIN/J&GS/2024',
                      },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-200 bg-white hover:border-ba-blue hover:shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-start gap-3.5"
                      >
                        <div className="shrink-0 flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 sm:w-36">
                          <span className="text-xs font-bold text-ba-blue bg-ba-blue/10 px-2.5 py-0.5 rounded-full inline-block">
                            {step.date}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            {step.badge}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {step.title}
                          </p>
                          {step.ref && (
                            <p className="text-xs font-mono text-ba-blue mt-1.5 bg-ba-blue/5 px-2.5 py-1 rounded inline-block border border-ba-blue/15">
                              {step.ref}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Card */}
            <div className="relative lg:sticky lg:top-28">
              <div
                className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center card p-8 shadow-sm"
              >
                <img
                  src="/logo_ACPDPH.jpg"
                  alt="ACPDPH Logo"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GOVERNANCE & DOCUMENTS ── */}
      <div style={{ background: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-ba">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
              Structure & Organisation
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
              {t.about.governance_title}
            </h2>
          </div>

          <div ref={govRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.about.ag,        desc: t.about.ag_desc },
              { title: t.about.ca,        desc: t.about.ca_desc },
              { title: t.about.bureau,    desc: t.about.bureau_desc },
              { title: t.about.direction, desc: t.about.direction_desc },
            ].map((card, i) => (
              <div
                key={card.title}
                className="gov-card card card-interactive group p-6 sm:p-8 flex flex-col justify-between text-center"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center font-bold text-sm bg-ba-blue/10 text-ba-blue transition-transform duration-200 group-hover:scale-105">
                    0{i + 1}
                  </div>
                  <h4 className="font-heading font-bold text-lg mb-3 leading-tight" style={{ color: '#111827' }}>
                    {card.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
