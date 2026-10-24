import { useI18n } from '../i18n';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';

export default function Pillars() {
  const { t } = useI18n();
  const { ref: headerRef } = useScrollReveal();
  const { ref: pillarsContainerRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.pillar-row-card',
    staggerDelay: 100,
  });
  const { data } = useAdminData();

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20">
      <div 
        ref={headerRef} 
        className="container-ba text-center mb-16"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-3">
          Cadre d'intervention stratégique
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.pillars.title}</h1>
        <p className="text-ba-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">{t.pillars.subtitle}</p>
      </div>

      <div ref={pillarsContainerRef} className="container-ba space-y-12">
        {data.pillars.map((pillar, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={pillar.id || index}
              className="pillar-row-card glass-card rounded-3xl p-8 md:p-12 border border-black/[0.08] dark:border-white/[0.08] hover:border-ba-blue/40 transition-colors grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              <div className={isEven ? 'order-2 md:order-1' : ''}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-ba-blue/10 text-ba-blue border border-ba-blue/20">
                    Pilier #{index + 1}
                  </span>
                </div>
                <h2 className="font-heading text-3xl font-bold mb-4 text-ba-blue">{pillar.title}</h2>
                <p className="text-ba-text-secondary leading-relaxed mb-6 text-base">
                  {pillar.description}
                </p>
                {pillar.bulletPoints && pillar.bulletPoints.length > 0 && (
                  <ul className="space-y-3 mb-4 text-sm text-ba-text-secondary">
                    {pillar.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 shrink-0 mt-0.5 text-ba-blue" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-normal">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] h-80 relative group ${isEven ? 'order-1 md:order-2' : ''}`}>
                {pillar.image ? (
                  <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-ba-dark-light flex items-center justify-center text-ba-text-muted">
                    Pas d'image
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
