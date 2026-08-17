import { useI18n } from '../i18n';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';

export default function Pillars() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();
  const { data } = useAdminData();

  return (
    <div style={{ paddingTop: '150px' }} className="pb-20">
      <div 
        ref={headerRef} 
        className={`container-ba text-center mb-16 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{t.pillars.title}</h1>
        <p className="text-ba-text-secondary text-lg text-justify">{t.pillars.subtitle}</p>
      </div>

      <div className="container-ba space-y-12">
        {data.pillars.map((pillar, index) => {
          const isEven = index % 2 === 0;
          const titleColorClass = pillar.color === 'ba-red' ? 'text-ba-red' : 'text-ba-green';
          const isRed = pillar.color === 'ba-red';

          return (
            <div
              key={pillar.id || index}
              className="glass-card rounded-3xl p-8 md:p-12 border border-black/[0.06] dark:border-white/[0.08] hover:border-ba-red/30 transition-all duration-300 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
              <div className={isEven ? 'order-2 md:order-1' : ''}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isRed ? 'bg-ba-red/10 text-ba-red' : 'bg-ba-green/10 text-ba-green'}`}>
                    Pilier Fondateur #{index + 1}
                  </span>
                </div>
                <h2 className={`font-heading text-3xl font-bold mb-4 ${titleColorClass}`}>{pillar.title}</h2>
                <p className="text-ba-text-secondary leading-relaxed mb-6 text-base">
                  {pillar.description}
                </p>
                {pillar.bulletPoints && pillar.bulletPoints.length > 0 && (
                  <ul className="space-y-3 mb-4 text-sm text-ba-text-secondary">
                    {pillar.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className={`w-5 h-5 shrink-0 mt-0.5 ${isRed ? 'text-ba-red' : 'text-ba-green'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-normal">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={`overflow-hidden rounded-2xl shadow-xl h-80 relative group ${isEven ? 'order-1 md:order-2' : ''}`}>
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
