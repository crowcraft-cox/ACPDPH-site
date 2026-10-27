import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ========================================================================================= */
/* LES 4 SYMBOLES OFFICIELS DU HANDICAP DANS LE LOGO ACPDPH                                  */
/* Extraits fidèlement et trait pour trait du logo officiel de l'organisation :              */
/* 1. Handicap Visuel (Œil barré & cécité)                                                   */
/* 2. Handicap Moteur (Fauteuil roulant & mobilité réduite)                                  */
/* 3. Handicap Mental / Psychique (Visage bicolore & déficience intellectuelle)             */
/* 4. Handicap Auditif (Oreille barrée & surdité)                                            */
/* ========================================================================================= */

export const ACPDPH_LOGO_SYMBOLS = [
  {
    id: 'visuel',
    title: 'Handicap Visuel',
    desc: 'Cécité, basse vision et déficience visuelle.',
    image: '/acpdph_visuel.png',
  },
  {
    id: 'moteur',
    title: 'Handicap Moteur',
    desc: 'Mobilité réduite, fauteuil roulant et accessibilité physique.',
    image: '/acpdph_moteur.png',
  },
  {
    id: 'mental',
    title: 'Handicap Mental & Psychique',
    desc: 'Déficience intellectuelle, troubles cognitifs et psychiques.',
    image: '/acpdph_mental.png',
  },
  {
    id: 'auditif',
    title: 'Handicap Auditif',
    desc: 'Surdité, malentendance et appareils auditifs.',
    image: '/acpdph_auditif.png',
  },
];

interface DisabilitySymbolsProps {
  className?: string;
  iconClassName?: string;
  showTooltip?: boolean;
}

export default function DisabilitySymbols({
  className = '',
  iconClassName = 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10',
  showTooltip = true,
}: DisabilitySymbolsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3 ${className}`}
      role="group"
      aria-label="Symboles officiels du handicap – Logo ACPDPH"
    >
      {ACPDPH_LOGO_SYMBOLS.map(({ id, title, desc, image }) => (
        <Link
          key={id}
          to="/pillars"
          title={`${title} : ${desc}`}
          aria-label={`${title} : ${desc}`}
          className="relative group p-0.5 flex items-center justify-center transition-all duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
          onMouseEnter={() => setActiveTooltip(id)}
          onMouseLeave={() => setActiveTooltip(null)}
          onFocus={() => setActiveTooltip(id)}
          onBlur={() => setActiveTooltip(null)}
        >
          <img
            src={image}
            alt={title}
            className={`${iconClassName} object-contain rounded-md shadow-sm border border-slate-300/80 dark:border-zinc-600 bg-white transition-all duration-150 group-hover:shadow-md group-hover:border-[var(--color-accent)]`}
          />

          {/* Micro-tooltip élégant au survol */}
          {showTooltip && activeTooltip === id && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none hidden md:block whitespace-nowrap bg-gray-900/95 text-white dark:bg-zinc-800 dark:text-gray-100 text-[11px] font-semibold tracking-wide py-1.5 px-3 rounded shadow-xl border border-gray-700/60 dark:border-zinc-700 animate-fadeIn"
              role="tooltip"
            >
              <div className="font-bold text-[var(--color-accent)]">{title}</div>
              <div className="text-[10px] text-gray-300 font-normal max-w-[210px] whitespace-normal leading-tight mt-0.5">
                {desc}
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
