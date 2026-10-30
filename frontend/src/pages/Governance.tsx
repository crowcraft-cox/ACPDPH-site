import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';

interface Member {
  name: string;
  role: string;
  bio: string;
  isBoard?: boolean;
}

const BOARD_MEMBERS: Member[] = [
  {
    name: 'Me Moïse Kathembo',
    role: 'Président du Conseil d\'Administration',
    bio: 'Juriste et ardent défenseur des droits humains, spécialisé dans le plaidoyer pour les personnes vulnérables au Nord-Kivu.',
    isBoard: true,
  },
  {
    name: 'Mme Rachel Kavugho',
    role: 'Vice-Présidente',
    bio: 'Pédagogue et militante pour l\'éducation inclusive des enfants vivant avec un handicap physique et sensoriel.',
    isBoard: true,
  },
  {
    name: 'M. Jean-Paul Paluku',
    role: 'Secrétaire Général',
    bio: 'Expert en gestion associative et gouvernance démocratique des organisations de la société civile en RDC.',
    isBoard: true,
  },
  {
    name: 'Mme Sarah Masika',
    role: 'Trésorière Générale',
    bio: 'Auditrice comptable, garante de la transparence financière, de la redevabilité et de la traçabilité des fonds.',
    isBoard: true,
  },
  {
    name: 'Dr Justin Kambale',
    role: 'Président de la Commission de Contrôle',
    bio: 'Médecin spécialiste en réadaptation fonctionnelle et santé publique communautaire.',
    isBoard: true,
  },
];

const PRINCIPLES = [
  {
    title: 'Rien sur nous sans nous',
    desc: 'Participation directe et majoritaire des personnes handicapées dans tous les organes délibérants.',
  },
  {
    title: 'Transparence & Rigueur',
    desc: 'Gestion financière rigoureusement tracée, double signature et audits annuels indépendants.',
  },
  {
    title: 'Redevabilité Totale',
    desc: 'Rapports d\'activités réguliers partagés avec nos membres, les communautés et nos bailleurs.',
  },
  {
    title: 'Égalité des Chances',
    desc: 'Promotion active du leadership des femmes et des jeunes vivant avec un handicap.',
  },
];

export default function Governance() {
  const { ref: headerRef } = useScrollReveal();
  const { ref: cardsRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.team-card',
    staggerDelay: 70,
  });

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      <div className="container-ba">
        {/* ── SECTION GOUVERNANCE ── */}
        <section ref={headerRef} className="mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight mb-4 text-left">
            Gouvernance
          </h1>
          <p className="w-full text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-8">
            L'ACPDPH applique une gouvernance démocratique, transparente et inclusive. Conformément à notre principe fondamental « Rien sur nous sans nous », les personnes en situation de handicap sont au cœur de nos organes de décision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRINCIPLES.map((principle, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {principle.title}
                    </h3>
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500 shrink-0">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-2">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION CONSEIL D'ADMINISTRATION ── */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4 text-left">
            Conseil d'Administration
          </h2>
          <p className="w-full text-left md:text-justify text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-8">
            Élu par l'Assemblée Générale, le Conseil d'Administration supervise l'orientation stratégique, garantit l'alignement sur notre mission sociale et valide les états financiers.
          </p>

          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOARD_MEMBERS.map((member, i) => (
              <div
                key={i}
                className="team-card bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 h-full flex flex-col"
              >
                {/* Ligne du haut */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center shrink-0">
                    {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-3 flex-1">
                  {member.bio}
                </p>

                {/* Pied de carte */}
                <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-left">
                  <span>Organe élu</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
