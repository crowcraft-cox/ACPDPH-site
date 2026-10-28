import { useState } from 'react';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';


interface Member {
  name: string;
  role: string;
  department?: string;
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

const EXECUTIVE_TEAM: Member[] = [
  {
    name: 'M. Germain Kasereka',
    role: 'Secrétaire Exécutif',
    department: 'Secrétariat Exécutif',
    bio: 'Supervision stratégique, relations avec les institutions étatiques, les bailleurs et les réseaux internationaux.',
  },
  {
    name: 'Me Esther Kahindo',
    role: 'Responsable Pôle Plaidoyer & Droits Humains',
    department: 'Pôle Juridique',
    bio: 'Assistance juridique, suivi des textes de lois (Loi 22/003) et défense des personnes victimes de discriminations.',
  },
  {
    name: 'M. David Muhindo',
    role: 'Responsable Projets & Accessibilité',
    department: 'Pôle Opérationnel',
    bio: 'Ingénierie de projets, audits d\'accessibilité des bâtiments publics et formation des maîtres d\'ouvrage.',
  },
  {
    name: 'Mme Jeanne Kavira',
    role: 'Chargée de l\'Éducation Inclusive & Genre',
    department: 'Pôle Inclusion',
    bio: 'Accompagnement scolaire, formation des enseignants et promotion des femmes et filles handicapées.',
  },
  {
    name: 'M. Samuel Kakule',
    role: 'Responsable Administration & Finances',
    department: 'Administration',
    bio: 'Gestion budgétaire rigoureuse, reporting financier aux bailleurs et gestion des ressources humaines.',
  },
];

export default function Governance() {

  const { ref: headerRef } = useScrollReveal();
  const [activeTab, setActiveTab] = useState<'board' | 'executive' | 'principles'>('board');

  const { ref: cardsRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.team-card',
    staggerDelay: 70,
  });

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3">
          Organisation & Redevabilité
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Gouvernance & Équipe Dirigeante
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          L'ACPDPH applique une gouvernance démocratique, transparente et inclusive. Conformément à notre principe fondamental « Rien sur nous sans nous », les personnes en situation de handicap sont au cœur de nos organes de décision.
        </p>
      </section>

      {/* ── PRINCIPES DE GOUVERNANCE ── */}
      <section className="container-ba mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'Rien sur nous sans nous',
              desc: 'Participation directe et majoritaire des personnes handicapées dans tous les organes délibérants.',
              tag: 'Inclusion',
            },
            {
              title: 'Transparence & Rigueur',
              desc: 'Gestion financière rigoureusement tracée, double signature et audits annuels indépendants.',
              tag: 'Éthique',
            },
            {
              title: 'Redevabilité Totale',
              desc: 'Rapports d\'activités réguliers partagés avec nos membres, les communautés et nos bailleurs.',
              tag: 'Responsabilité',
            },
            {
              title: 'Égalité des Chances',
              desc: 'Promotion active du leadership des femmes et des jeunes vivant avec un handicap.',
              tag: 'Équité',
            },
          ].map((principle, idx) => (
            <div
              key={idx}
              className="card card-interactive p-6 flex flex-col justify-between"
              style={{ background: '#ffffff' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue">
                  {principle.tag}
                </span>
                <span className="text-xs font-mono font-semibold text-gray-400">0{idx + 1}</span>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2" style={{ color: '#111827' }}>
                {principle.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NAVIGATION PAR ONGLETS ── */}
      <section className="container-ba mb-10">
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-5 py-2 rounded-lg text-sm font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'board'
                  ? 'bg-white text-ba-blue shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Conseil d'Administration
            </button>
            <button
              onClick={() => setActiveTab('executive')}
              className={`px-5 py-2 rounded-lg text-sm font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'executive'
                  ? 'bg-white text-ba-blue shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Secrétariat Exécutif & Pôles
            </button>
            <button
              onClick={() => setActiveTab('principles')}
              className={`px-5 py-2 rounded-lg text-sm font-heading font-semibold transition-all cursor-pointer ${
                activeTab === 'principles'
                  ? 'bg-white text-ba-blue shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Organigramme Institutionnel
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTENU DES ONGLETS ── */}
      <div className="container-ba">
        {activeTab === 'board' && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#111827' }}>
                Le Conseil d'Administration (C.A.)
              </h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Élu par l'Assemblée Générale, le Conseil d'Administration supervise l'orientation stratégique, garantit l'alignement sur notre mission sociale et valide les états financiers.
              </p>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BOARD_MEMBERS.map((member, i) => (
                <div
                  key={i}
                  className="team-card card card-interactive p-6 flex flex-col justify-between"
                  style={{ background: '#ffffff' }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-ba-blue/10 flex items-center justify-center text-ba-blue font-heading font-extrabold text-lg">
                        {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base" style={{ color: '#111827' }}>
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-ba-blue">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                      {member.bio}
                    </p>
                  </div>
                  <div className="card-footer text-xs text-gray-500">
                    <span>Mandat statutaire</span>
                    <span className="font-semibold text-gray-700">Organe élu</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executive' && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#111827' }}>
                Secrétariat Exécutif & Équipes de Terrain
              </h2>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Basée au siège de Beni (Nord-Kivu), l'équipe opérationnelle met en œuvre quotidiennement nos programmes de plaidoyer, d'accessibilité et d'autonomisation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXECUTIVE_TEAM.map((member, i) => (
                <div
                  key={i}
                  className="team-card card card-interactive p-6 flex flex-col justify-between"
                  style={{ background: '#ffffff' }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-ba-blue/15 text-ba-blue font-heading font-extrabold text-lg flex items-center justify-center">
                        {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base" style={{ color: '#111827' }}>
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-ba-blue">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {member.department && (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 mb-3">
                        {member.department}
                      </span>
                    )}
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                      {member.bio}
                    </p>
                  </div>
                  <div className="card-footer text-xs text-gray-500">
                    <span>Statut</span>
                    <span className="font-semibold text-ba-blue">Pôle Opérationnel</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'principles' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="card p-6 md:p-10" style={{ background: '#ffffff' }}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: '#111827' }}>
                Structure & Organigramme Institutionnel
              </h2>

              <div className="space-y-6">
                {/* Niveau 1: AG */}
                <div className="text-center p-5 rounded-xl bg-ba-blue text-white shadow-xs">
                  <span className="text-xs uppercase font-extrabold tracking-wider block opacity-90 mb-1">Organe Souverain</span>
                  <h3 className="font-heading text-xl font-bold">Assemblée Générale (AG)</h3>
                  <p className="text-xs text-blue-100 mt-1">Membres fondateurs, membres effectifs et représentants des personnes handicapées</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gray-300" />
                </div>

                {/* Niveau 2: CA & Commissariat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-xs uppercase font-extrabold tracking-wider block text-ba-blue mb-1">Organe d'Orientation</span>
                    <h3 className="font-heading text-lg font-bold" style={{ color: '#111827' }}>Conseil d'Administration (C.A.)</h3>
                    <p className="text-xs text-gray-600 mt-1">Supervision stratégique, validation budgétaire et contrôle</p>
                  </div>
                  <div className="text-center p-5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-xs uppercase font-extrabold tracking-wider block text-ba-blue mb-1">Organe de Contrôle</span>
                    <h3 className="font-heading text-lg font-bold" style={{ color: '#111827' }}>Commission de Contrôle</h3>
                    <p className="text-xs text-gray-600 mt-1">Audit financier interne, régularité et conformité statutaire</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gray-300" />
                </div>

                {/* Niveau 3: Secrétariat Exécutif */}
                <div className="text-center p-5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-xs uppercase font-extrabold tracking-wider block text-gray-500 mb-1">Organe de Gestion Quotidienne</span>
                  <h3 className="font-heading text-lg font-bold" style={{ color: '#111827' }}>Secrétariat Exécutif</h3>
                  <p className="text-xs text-gray-600 mt-1">Mise en œuvre des résolutions, gestion opérationnelle et coordination des projets</p>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-gray-300" />
                </div>

                {/* Niveau 4: Départements Opérationnels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  {[
                    'Pôle Plaidoyer & Accès au Droit',
                    'Pôle Accessibilité & Cadre Bâti',
                    'Pôle Éducation & Autonomisation',
                    'Pôle Administration & Finances',
                  ].map((dept, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
                      <span className="font-heading text-xs font-bold text-gray-800 block">
                        {dept}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents juridiques & officiels */}
            <div className="card p-6 md:p-8" style={{ background: '#ffffff' }}>
              <h3 className="font-heading font-bold text-xl mb-4" style={{ color: '#111827' }}>
                Statuts Juridiques & Fiche Statutaire
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div>
                  <strong className="block text-gray-900 dark:text-white">Dénomination officielle :</strong>
                  Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH)
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white">Forme légale :</strong>
                  Organisation Non Gouvernementale / ASBL de droit congolais
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white">Siège social :</strong>
                  Beni, Province du Nord-Kivu, République Démocratique du Congo
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white">Zone d'intervention :</strong>
                  Beni, Grand Nord-Kivu et République Démocratique du Congo
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 flex flex-wrap gap-4">
                <a
                  href="/Site web ACPDPH, Modele.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Consulter les Statuts Institutionnels (PDF)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
