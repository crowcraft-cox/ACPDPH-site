import React from 'react';
import { Link } from 'react-router-dom';

export interface BoutonActionProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  fullWidthMobile?: boolean;
  ariaLabel?: string;
}

/**
 * BoutonAction - Composant bouton d'action partagé
 * Reprend fidèlement les attributs du bouton d'action ACPDPH :
 * - Fond orange #C2530A, texte blanc
 * - Texte en MAJUSCULES (via CSS uppercase), gras, léger espacement des lettres (tracking-wider)
 * - Angles très peu arrondis (rounded-md), sans bordure, sans ombre
 * - Même hauteur et padding horizontal (px-5 py-2.5)
 * - Sans icône de flèche par défaut
 * - Survol : orange un peu plus foncé (#A84508)
 * - Focus clavier accessible avec anneau visible
 * - Curseur main (cursor-pointer)
 * - Responsive : centré, pleine largeur adaptable sur mobile (max 320px) avec hauteur tactile >= 44px
 */
export function BoutonAction({
  to,
  href,
  onClick,
  children,
  className = '',
  showArrow = false,
  fullWidthMobile = false,
  ariaLabel,
}: BoutonActionProps) {
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'px-5 py-2.5 rounded-md',
    'text-xs font-bold uppercase tracking-wider text-white',
    'bg-[#C2530A] hover:bg-[#A84508]',
    'transition-colors duration-150',
    'border-0 shadow-none outline-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2530A] focus-visible:ring-offset-2',
    'cursor-pointer text-center leading-snug',
    fullWidthMobile ? 'w-full max-w-[320px] sm:w-auto min-h-[44px]' : 'min-h-[44px] sm:min-h-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="leading-snug">{children}</span>
      {showArrow && (
        <svg
          className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

export default BoutonAction;
