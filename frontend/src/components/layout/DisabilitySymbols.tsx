import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ========================================================================================= */
/* 7 SYMBOLES UNIVERSELS DU HANDICAP ET DE L'ACCESSIBILITÉ                                    */
/* Conformes aux standards internationaux (Graphic Artists Guild / ISO 7001 / ADA)           */
/* 1. Fauteuil roulant (Handicap moteur)                                                     */
/* 2. Personne avec canne blanche (Cécité & Handicap visuel)                                 */
/* 3. Basse vision (Œil barré & champ visuel réduit)                                         */
/* 4. Closed Captioning CC (Sous-titrage sourds & malentendants)                             */
/* 5. Langue des signes (Interprétation gestuelle)                                           */
/* 6. TTY Téléscripteur (Télécommunication adaptée)                                          */
/* 7. Handicap auditif & boucle magnétique (Aide auditive)                                   */
/* ========================================================================================= */

// 1. Fauteuil roulant (Handicap moteur)
export function WheelchairIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11.5" cy="4" r="1.8" fill="currentColor" stroke="none" />
      <path d="M11.5 6.8v6.2h4.2v4.5h2.2" />
      <path d="M16.2 14A5.2 5.2 0 1 1 11.5 11" />
    </svg>
  );
}

// 2. Personne avec canne blanche (Cécité)
export function BlindWalkerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="10" cy="3.8" r="1.8" fill="currentColor" stroke="none" />
      <path d="M10 6.5l1.6 6.2-3.4 8.3" />
      <path d="M11.6 12.7l2.6 4.2-1.2 4.1" />
      <path d="M10.8 8.8l3.4 3.8" />
      <path d="M14.2 12.6l6 8.4" strokeWidth="1.9" />
    </svg>
  );
}

// 3. Basse vision (Œil hachuré et barre de cécité)
export function LowVisionIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2.5 12c2.8-5 7.2-7 10-7s7.2 2 10 7c-2.8 5-7.2 7-10 7s-7.2-2-10-7z" />
      <circle cx="14" cy="12" r="2.8" fill="currentColor" stroke="none" />
      <line x1="5.2" y1="11" x2="5.2" y2="13" strokeWidth="1.4" />
      <line x1="7.2" y1="9.5" x2="7.2" y2="14.5" strokeWidth="1.4" />
      <line x1="9.2" y1="8.3" x2="9.2" y2="15.7" strokeWidth="1.4" />
      <line x1="11.2" y1="7.5" x2="11.2" y2="16.5" strokeWidth="1.4" />
      <line x1="13.2" y1="4" x2="10.8" y2="20" strokeWidth="2.3" />
    </svg>
  );
}

// 4. Closed Captioning (CC)
export function ClosedCaptionIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10.6 8.5c-.5-.5-1.2-.9-2.1-.9-1.8 0-2.9 1.4-2.9 4.4s1.1 4.4 2.9 4.4c.9 0 1.6-.4 2.1-.9v2.5c-.7.4-1.6.6-2.6.6-3.4 0-5.6-2.4-5.6-6.6s2.2-6.6 5.6-6.6c1 0 1.9.2 2.6.6V8.5z" />
      <path d="M21.2 8.5c-.5-.5-1.2-.9-2.1-.9-1.8 0-2.9 1.4-2.9 4.4s1.1 4.4 2.9 4.4c.9 0 1.6-.4 2.1-.9v2.5c-.7.4-1.6.6-2.6.6-3.4 0-5.6-2.4-5.6-6.6s2.2-6.6 5.6-6.6c1 0 1.9.2 2.6.6V8.5z" />
    </svg>
  );
}

// 5. Langue des signes
export function SignLanguageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {/* Main gauche (poignet à gauche, geste index/pouce et doigts vers le haut) */}
      <path d="M2.8 17.2l3.8-2.6c.4-.3.9-.3 1.3 0l1 .7c.4.3.4.9.1 1.3l-2.4 2.8c-.6.7-1.6.8-2.3.2l-.9-.7c-.4-.4-.5-1-.1-1.7z" />
      <path d="M8 11.5c-.8.8-.8 2.1 0 2.9s2.1.8 2.9 0 .8-2.1 0-2.9-2.1-.8-2.9 0zm2 2c-.3.3-.9.3-1.2 0s-.3-.9 0-1.2.9-.3 1.2 0 .3.9 0 1.2z" />
      <path d="M10.2 10.8l2.2-2.2c.4-.4.4-1.1 0-1.5s-1.1-.4-1.5 0l-2 2 .9 1.7z" />
      <path d="M11.8 12.2l2.2-2.2c.4-.4.4-1.1 0-1.5s-1.1-.4-1.5 0l-2 2 .9 1.7z" />
      {/* Main droite (poignet à droite, doigts ouverts vers le bas-gauche) */}
      <path d="M21.2 6.8l-3.8 2.6c-.4.3-.9.3-1.3 0l-1-.7c-.4-.3-.4-.9-.1-1.3l2.4-2.8c.6-.7 1.6-.8 2.3-.2l.9.7c.4.4.5 1 .1 1.7z" />
      <path d="M16 12.5c.8-.8.8-2.1 0-2.9s-2.1-.8-2.9 0-.8 2.1 0 2.9 2.1.8 2.9 0zm-2-2c.3-.3.9-.3 1.2 0s.3.9 0 1.2-.9.3-1.2 0-.3-.9 0-1.2z" />
      <path d="M13.8 13.2l-2.2 2.2c-.4.4-.4 1.1 0 1.5s1.1.4 1.5 0l2-2-.9-1.7z" />
      <path d="M12.2 11.8l-2.2 2.2c-.4.4-.4 1.1 0 1.5s1.1.4 1.5 0l2-2-.9-1.7z" />
    </svg>
  );
}

// 6. Téléscripteur (TTY / TDD)
export function TtyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {/* Combiné téléphonique */}
      <path d="M5.5 8.5V6.8c0-1.8 1.5-3.3 3.3-3.3h6.4c1.8 0 3.3 1.5 3.3 3.3v1.7c0 .6-.4 1-1 1h-1.6c-.6 0-1-.4-1-1V6.8c0-.7-.6-1.3-1.3-1.3H8.9c-.7 0-1.3.6-1.3 1.3v1.7c0 .6-.4 1-1 1H5.5c-.6 0-1-.4-1-1z" />
      {/* Rangée 1 */}
      <circle cx="6" cy="11.8" r="1.1" />
      <circle cx="9" cy="11.8" r="1.1" />
      <circle cx="12" cy="11.8" r="1.1" />
      <circle cx="15" cy="11.8" r="1.1" />
      <circle cx="18" cy="11.8" r="1.1" />
      {/* Rangée 2 */}
      <circle cx="6" cy="14.6" r="1.1" />
      <circle cx="9" cy="14.6" r="1.1" />
      <circle cx="12" cy="14.6" r="1.1" />
      <circle cx="15" cy="14.6" r="1.1" />
      <circle cx="18" cy="14.6" r="1.1" />
      {/* Rangée 3 */}
      <circle cx="6" cy="17.4" r="1.1" />
      <circle cx="9" cy="17.4" r="1.1" />
      <circle cx="12" cy="17.4" r="1.1" />
      <circle cx="15" cy="17.4" r="1.1" />
      <circle cx="18" cy="17.4" r="1.1" />
      {/* Barre d'espace */}
      <rect x="5.5" y="19.5" width="13" height="1.8" rx="0.9" />
    </svg>
  );
}

// 7. Déficience auditive & boucle magnétique
export function AssistiveListeningIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Profil de l'oreille */}
      <path d="M11.5 5.2c3 0 5.3 2.3 5.3 5.3 0 2.4-1.3 4.2-2.3 5.7-.8 1.1-1.5 2-1.5 3.3s.7 1.5 1.5 1.5" />
      {/* Lobe intérieur */}
      <path d="M12.5 10.8c1 0 1.8.8 1.8 1.8" />
      {/* Barre oblique */}
      <path d="M4.5 21.5l15-17" strokeWidth="2.6" />
      <path d="M3.5 18l3 3.5" strokeWidth="2.4" />
      <path d="M17.5 2.5l3 3.5" strokeWidth="2.4" />
    </svg>
  );
}

export const DISABILITY_SYMBOLS_LIST = [
  {
    id: 'motor',
    title: 'Handicap moteur',
    desc: 'Accessibilité physique, mobilité réduite et aménagements architecturaux.',
    Icon: WheelchairIcon,
  },
  {
    id: 'blind',
    title: 'Cécité & Canne blanche',
    desc: 'Non-voyance, guidage tactile, bandes podotactiles et autonomie de déplacement.',
    Icon: BlindWalkerIcon,
  },
  {
    id: 'low-vision',
    title: 'Basse vision',
    desc: 'Malvoyance, contrastes renforcés, typographie agrandie et adaptation visuelle.',
    Icon: LowVisionIcon,
  },
  {
    id: 'cc',
    title: 'Sous-titrage & CC',
    desc: 'Retranscription textuelle et sous-titres adaptés pour personnes sourdes et malentendantes.',
    Icon: ClosedCaptionIcon,
  },
  {
    id: 'sign-lang',
    title: 'Langue des signes',
    desc: 'Interprétation en langue des signes congolaise et internationale.',
    Icon: SignLanguageIcon,
  },
  {
    id: 'tty',
    title: 'Télécommunication adaptée',
    desc: 'Appareils téléscripteurs (TTY/TDD), synthèse textuelle et communication adaptée.',
    Icon: TtyIcon,
  },
  {
    id: 'hearing',
    title: 'Handicap auditif',
    desc: 'Boucle d\'induction magnétique audio, appareils auditifs et alertes visuelles.',
    Icon: AssistiveListeningIcon,
  },
];

interface DisabilitySymbolsProps {
  className?: string;
  iconClassName?: string;
  showTooltip?: boolean;
}

export default function DisabilitySymbols({
  className = '',
  iconClassName = 'w-7 h-7 sm:w-[30px] sm:h-[30px] lg:w-[34px] lg:h-[34px]',
  showTooltip = true,
}: DisabilitySymbolsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3 text-[#3B9896] dark:text-teal-400 ${className}`}
      role="group"
      aria-label="Symboles universels de l'accessibilité et des handicaps"
    >
      {DISABILITY_SYMBOLS_LIST.map(({ id, title, desc, Icon }) => (
        <Link
          key={id}
          to="/pillars"
          title={`${title} : ${desc}`}
          aria-label={`${title} : ${desc}`}
          className="relative group p-1.5 flex items-center justify-center transition-all duration-150 hover:text-[var(--color-primary)] dark:hover:text-teal-300 hover:scale-115 hover:bg-teal-50/80 dark:hover:bg-zinc-800/80 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          onMouseEnter={() => setActiveTooltip(id)}
          onMouseLeave={() => setActiveTooltip(null)}
          onFocus={() => setActiveTooltip(id)}
          onBlur={() => setActiveTooltip(null)}
        >
          <Icon className={`${iconClassName} transition-transform duration-150`} />

          {/* Micro-tooltip élégant au survol */}
          {showTooltip && activeTooltip === id && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none hidden md:block whitespace-nowrap bg-gray-900/95 text-white dark:bg-zinc-800 dark:text-gray-100 text-[11px] font-semibold tracking-wide py-1 px-2.5 rounded shadow-lg border border-gray-700/60 dark:border-zinc-700 animate-fadeIn"
              role="tooltip"
            >
              <div className="font-bold text-[var(--color-accent)]">{title}</div>
              <div className="text-[10px] text-gray-300 font-normal max-w-[200px] whitespace-normal leading-tight">
                {desc}
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
