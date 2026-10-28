import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ========================================================================================= */
/* LES 4 SYMBOLES OFFICIELS DU HANDICAP DANS LE LOGO ACPDPH                                  */
/* Extraits fidèlement du logo officiel de l'organisation :                                 */
/* 1. Handicap Visuel (Œil barré & cécité)                                                   */
/* 2. Handicap Moteur (Fauteuil roulant & mobilité réduite)                                  */
/* 3. Handicap Mental / Psychique (Visage bicolore & déficience intellectuelle)             */
/* 4. Handicap Auditif (Oreille barrée & surdité)                                            */
/* ========================================================================================= */

export const ACPDPH_LOGO_SYMBOLS = [
  {
    id: 'visuel',
    title: 'Handicap Visuel',
    badge: 'Cécité & Malvoyance',
    desc: 'Accompagnement, supports en Braille, audio et accessibilité visuelle pour personnes aveugles ou malvoyantes.',
    image: '/acpdph_visuel.png',
  },
  {
    id: 'moteur',
    title: 'Handicap Moteur',
    badge: 'Mobilité réduite',
    desc: 'Accessibilité des édifices publics, rampes d\'accès, voiries et autonomie en fauteuil roulant.',
    image: '/acpdph_moteur.png',
  },
  {
    id: 'mental',
    title: 'Handicap Mental & Psychique',
    badge: 'Cognitif & Psychique',
    desc: 'Inclusion socioprofessionnelle, soutien adapté, lutte contre la stigmatisation et communication simplifiée.',
    image: '/acpdph_mental.png',
  },
  {
    id: 'auditif',
    title: 'Handicap Auditif',
    badge: 'Surdité & Malentendance',
    desc: 'Langue des signes, boucles à induction magnétique, interprétation et sous-titrage adapté.',
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
      {ACPDPH_LOGO_SYMBOLS.map(({ id, title, badge, desc, image }) => {
        const isHovered = activeTooltip === id;

        return (
          <Link
            key={id}
            to="/pillars"
            aria-label={`${title} : ${desc}`}
            className="relative group p-0.5 flex items-center justify-center transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
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

            {/* Message d'information (Tooltip) élégant et immédiat au survol */}
            {showTooltip && (
              <div
                role="tooltip"
                className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 z-[100] w-64 pointer-events-none bg-slate-900/95 dark:bg-zinc-850/98 backdrop-blur-md text-white rounded-lg p-3 shadow-2xl border border-slate-700/80 dark:border-zinc-700 transition-all duration-150 origin-top ${
                  isHovered
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0'
                }`}
              >
                {/* Flèche indicatrice orientée vers le symbole */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 dark:bg-zinc-850 rotate-45 border-t border-l border-slate-700/80 dark:border-zinc-700" />

                {/* En-tête avec titre du handicap et badge thématique */}
                <div className="relative z-10 flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-white/10">
                  <span className="font-heading font-extrabold text-[12px] text-teal-300 dark:text-teal-300 tracking-wide">
                    {title}
                  </span>
                  <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-400/30 shrink-0">
                    {badge}
                  </span>
                </div>

                {/* Description du type de handicap et actions ACPDPH */}
                <p className="relative z-10 text-[11px] text-slate-200 dark:text-zinc-200 font-normal leading-relaxed text-left">
                  {desc}
                </p>

                {/* Indication d'interaction */}
                <div className="relative z-10 mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-400 font-medium">
                  <span>Symbole officiel ACPDPH</span>
                  <span className="text-teal-300 underline decoration-teal-400/40">En savoir plus</span>
                </div>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
