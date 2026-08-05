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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Forme Juridique :', value: 'ONG & ASBL (Loi n° 004/2001)' },
                    { label: 'Date de Création :', value: '1er Janvier 2026 (Durée illimitée)' },
                    { label: 'Siège Social :', value: 'Av. de la Paix, Q. Himbi, Goma (Nord-Kivu)' },
                    { label: "Rayon d'Action :", value: 'Afrique' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '0.6rem', border: '1px solid #E2E8F0' }}
                    >
                      <span className="font-semibold block text-ba-red">{item.label}</span>
                      <span style={{ color: '#374151' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-ba-red/20 to-ba-green/20 rounded-3xl transform translate-x-4 translate-y-4" />
              <div
                className="relative rounded-3xl overflow-hidden aspect-square flex items-center justify-center shadow-xl"
                style={{ background: '#ffffff', border: '2px solid #E5E7EB' }}
              >
                <img
                  src="/logo.png"
                  alt="Bright African Logo"
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
              {t.about.governance_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: t.about.ag,        desc: t.about.ag_desc,        border: '#DC2626' },
              { title: t.about.ca,        desc: t.about.ca_desc,        border: '#16A34A' },
              { title: t.about.bureau,    desc: t.about.bureau_desc,    border: '#DC2626' },
              { title: t.about.direction, desc: t.about.direction_desc, border: '#16A34A' },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8 text-center shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                style={{
                  background: '#ffffff',
                  borderRadius: '1rem',
                  borderTop: `4px solid ${card.border}`,
                  border: '1px solid #E5E7EB',
                  borderTopColor: card.border,
                }}
              >
                <h4 className="font-heading font-bold text-xl mb-4" style={{ color: '#111827' }}>
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
