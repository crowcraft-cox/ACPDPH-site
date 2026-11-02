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
    desc: "Accessibilité des édifices publics, rampes d'accès, voiries et autonomie en fauteuil roulant.",
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
  /** @deprecated - tooltip désactivé, conservé pour compatibilité ascendante */
  showTooltip?: boolean;
}

export default function DisabilitySymbols({
  className = '',
  iconClassName = 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10',
}: DisabilitySymbolsProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3 ${className}`}
      role="group"
      aria-label="Symboles officiels du handicap – Logo ACPDPH"
    >
      {ACPDPH_LOGO_SYMBOLS.map(({ id, title, image }) => (
        <Link
          key={id}
          to="/pillars"
          aria-label={title}
          className={`relative flex items-center justify-center transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-accent)] ${iconClassName}`}
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            padding: 0,
            borderRadius: 0,
            textDecoration: 'none',
          }}
        >
          {/*
           * Technique mask-image : utilise le PNG comme pochoir (alpha channel)
           * et remplit avec --color-primary (bleu menu nav #1D4ED8).
           * Le fond blanc original est transparent, le symbole apparaît en bleu.
           */}
          <span
            className="block w-full h-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              maskImage: `url(${image})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(${image})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
            }}
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}
