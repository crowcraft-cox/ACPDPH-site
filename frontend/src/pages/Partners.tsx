import { useScrollReveal } from '../hooks/useScrollReveal';
import { PARTNER_LOGOS } from '../constants/partnerLogos';

export default function Partners() {
  const { ref: headerRef } = useScrollReveal();

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-24 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── TITRE ── */}
      <section ref={headerRef} className="container-ba text-center mb-12 sm:mb-16">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-ba-blue dark:text-blue-400 uppercase tracking-tight">
          Nos Partenaires
        </h1>
      </section>

      {/* ── SECTION LOGOS DES PARTENAIRES ── */}
      <section className="container-ba pb-12">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-12 max-w-5xl mx-auto">
          {PARTNER_LOGOS.map((partner) => {
            const isClickable = partner.url && partner.url !== '#';
            return (
              <a
                key={partner.name}
                href={partner.url}
                target={isClickable ? '_blank' : undefined}
                rel={isClickable ? 'noopener noreferrer' : undefined}
                aria-label={`Site de ${partner.name}`}
                className="w-[calc(50%-1rem)] md:w-[calc((100%-4rem)/3)] flex items-center justify-center p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={!isClickable ? (e) => e.preventDefault() : undefined}
              >
                <div className="h-20 sm:h-24 w-full max-w-[220px] mx-auto flex items-center justify-center">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center leading-snug">
                      {partner.name}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
