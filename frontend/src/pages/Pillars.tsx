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
        className="container-ba mb-8"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.pillars.title}</h1>
        <p className="w-full text-left md:text-justify hyphens-auto text-ba-text-secondary text-lg leading-relaxed">
          {t.pillars.subtitle}
        </p>
      </div>

      <div ref={pillarsContainerRef} className="container-ba space-y-12">
        {data.pillars.map((pillar, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={pillar.id || index}
              className="pillar-row-card card card-interactive grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center p-6 md:p-10"
              style={{ background: '#ffffff' }}
            >
              <div className={isEven ? 'order-2 md:order-1' : ''}>
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: '#111827' }}>{pillar.title}</h2>
                <p className="leading-relaxed mb-6 text-base" style={{ color: '#6B7280' }}>
                  {pillar.description}
                </p>
                {pillar.bulletPoints && pillar.bulletPoints.length > 0 && (
                  <ul className="space-y-3 mb-4 text-sm" style={{ color: '#4B5563' }}>
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
              <div className={`overflow-hidden rounded-xl border border-gray-200 h-80 relative group ${isEven ? 'order-1 md:order-2' : ''}`}>
                {pillar.image ? (
                  <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
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
