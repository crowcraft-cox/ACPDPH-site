
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-4 text-ba-blue">{t.about.history_title}</h2>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.history_text}
                </p>
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

              {/* Statuts Summary Grid */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <h4 className="font-heading font-bold text-lg mb-4" style={{ color: '#111827' }}>
                  Fiche d'Identité Statutaire
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Organisation :', value: 'ACPDPH' },
                    { label: 'Forme Juridique :', value: 'ONG & ASBL (RDC)' },
                    { label: 'Siège Social :', value: 'Beni (Nord-Kivu, RDC)' },
                    { label: "Rayon d'Action :", value: 'République Démocratique du Congo' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="card-sm p-4 rounded-xl border border-gray-200 bg-white hover:border-ba-blue transition-colors"
                    >
                      <span className="font-bold text-xs uppercase tracking-wider block text-ba-blue mb-1">{item.label}</span>
                      <span className="text-gray-900 text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Card */}
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center card p-8"
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
