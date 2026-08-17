import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();
  const { ref: historyRef, isVisible: isHistoryVisible } = useScrollReveal();
  const { ref: govRef, isVisible: isGovVisible } = useScrollReveal();

  return (
    <div style={{ background: '#ffffff', paddingTop: '150px' }} className="pb-20">

      {/* ── HEADER ── */}
      <div
        ref={headerRef}
        className={`container-ba text-center mb-16 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: '#111827' }}>
          {t.about.title}
        </h1>
        <p className="text-lg text-justify" style={{ color: '#374151' }}>
          {t.about.subtitle}
        </p>
      </div>

      {/* ── HISTORY & CONTEXT ── */}
      <div style={{ background: '#ffffff', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div
          ref={historyRef}
          className={`container-ba transition-all duration-700 ${isHistoryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-4 text-ba-red">{t.about.history_title}</h2>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.history_text}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-ba-green">{t.about.vision_title}</h3>
                <p className="text-base md:text-lg leading-loose text-justify" style={{ color: '#374151' }}>
                  {t.about.vision_text}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-ba-green">{t.about.mission_title}</h3>
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
                    { label: 'Forme Juridique :', value: 'ONG & ASBL (Loi n° 004/2001)' },
                    { label: 'Date de Création :', value: '1er Janvier 2026 (Durée illimitée)' },
                    { label: 'Siège Social :', value: 'Av. de la Paix, Q. Himbi, Goma (Nord-Kivu)' },
                    { label: "Rayon d'Action :", value: 'Afrique' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass-card p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-slate-50/90 dark:bg-zinc-800/80 hover:border-ba-red/30 transition-all duration-300"
                    >
                      <span className="font-bold text-xs uppercase tracking-wider block text-ba-red mb-1">{item.label}</span>
                      <span className="text-ba-text-primary text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-ba-red/20 to-ba-green/20 rounded-3xl transform translate-x-4 translate-y-4" />
              <div
                className="relative rounded-3xl overflow-hidden aspect-square flex items-center justify-center shadow-xl glass-card border border-black/[0.08] dark:border-white/[0.08] p-8"
              >
                <img
                  src="/logo.png"
                  alt="Bright African Logo"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GOVERNANCE & DOCUMENTS ── */}
      <div style={{ background: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div
          ref={govRef}
          className={`container-ba transition-all duration-700 ${isGovVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-red/10 text-ba-red mb-3">
              Structure & Organisation
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
              {t.about.governance_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.about.ag,        desc: t.about.ag_desc,        color: 'ba-red' },
              { title: t.about.ca,        desc: t.about.ca_desc,        color: 'ba-green' },
              { title: t.about.bureau,    desc: t.about.bureau_desc,    color: 'ba-red' },
              { title: t.about.direction, desc: t.about.direction_desc, color: 'ba-green' },
            ].map((card, i) => (
              <div
                key={card.title}
                className="glass-card group p-8 rounded-3xl flex flex-col justify-between border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl mx-auto mb-5 flex items-center justify-center font-bold text-sm ${card.color === 'ba-red' ? 'bg-ba-red/10 text-ba-red' : 'bg-ba-green/10 text-ba-green'} transition-transform duration-300 group-hover:scale-110`}>
                    0{i + 1}
                  </div>
                  <h4 className="font-heading font-bold text-xl mb-4 text-ba-text-primary leading-tight">
                    {card.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-ba-text-secondary">
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
