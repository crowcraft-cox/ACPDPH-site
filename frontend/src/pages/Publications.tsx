import { useState } from 'react';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';

interface Publication {
  id: string;
  title: string;
  category: 'report' | 'legal' | 'study' | 'guide';
  date: string;
  pages: string;
  author: string;
  summary: string;
  fileUrl?: string;
  featured?: boolean;
}

const PUBLICATIONS_DATA: Publication[] = [
  {
    id: '1',
    title: 'Rapport Annuel d\'Activités & Bilan Financier ACPDPH (2025-2026)',
    category: 'report',
    date: 'Janvier 2026',
    pages: '48 pages',
    author: 'Direction Exécutive ACPDPH',
    summary: 'Rétrospective complète des actions menées à Beni : 2 500 personnes accompagnées, 1 200 appareillages distribués, 45 écoles appuyées et états financiers audités en toute transparence.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
    featured: true,
  },
  {
    id: '2',
    title: 'Loi Organique n°22/003 du 3 mai 2022 portant protection et promotion des droits des personnes avec handicap en RDC',
    category: 'legal',
    date: 'Mai 2022',
    pages: '36 pages',
    author: 'Journal Officiel RDC / Vulgarisation ACPDPH',
    summary: 'Texte intégral de la loi organique historique promulguée en République Démocratique du Congo, assorti d\'annotations juridiques et d\'un guide des recours légaux contre les discriminations.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
    featured: true,
  },
  {
    id: '3',
    title: 'Enquête Diagnostique sur l\'Accessibilité des Édifices Publics et Écoles à Beni',
    category: 'study',
    date: 'Octobre 2025',
    pages: '32 pages',
    author: 'Pôle Accessibilité & Recherche ACPDPH',
    summary: 'Audit architectural de 60 infrastructures publiques (mairie, tribunaux, centres de santé, écoles) à Beni révélant un taux d\'accessibilité de seulement 12%, avec recommandations concrètes.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
  },
  {
    id: '4',
    title: 'Guide Pratique pour l\'Inclusion Scolaire des Enfants Handicapés en Milieu Vulnérable',
    category: 'guide',
    date: 'Août 2025',
    pages: '24 pages',
    author: 'Pôle Éducation Inclusive ACPDPH',
    summary: 'Outil méthodologique destiné aux enseignants, directeurs d\'écoles primaires et parents d\'élèves pour adapter les apprentissages et lutter contre la stigmatisation en classe.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
  },
  {
    id: '5',
    title: 'Convention des Nations Unies relative aux droits des personnes handicapées (CDPH)',
    category: 'legal',
    date: 'Nations Unies',
    pages: '40 pages',
    author: 'ONU / Version Vulgarisée ACPDPH',
    summary: 'Traité international fondamental ratifié par la RDC, garantissant l\'égalité des droits civils, culturels, économiques, politiques et sociaux.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
  },
  {
    id: '6',
    title: 'Étude sur l\'Autonomisation Économique des Femmes Handicapées dans le Nord-Kivu',
    category: 'study',
    date: 'Juin 2025',
    pages: '28 pages',
    author: 'Pôle Genre & Autonomisation ACPDPH',
    summary: 'Analyse des barrières financières et propositions pour le développement de micro-crédits et d\'activités génératrices de revenus adaptées.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
  },
  {
    id: '7',
    title: 'Manuel des Normes d\'Accessibilité Architecturale et Urbaine en RDC',
    category: 'guide',
    date: 'Février 2025',
    pages: '20 pages',
    author: 'Comité Technique ACPDPH',
    summary: 'Fiches techniques illustrées pour la construction de rampes d\'accès, blocs sanitaires adaptés, signalétique tactile et portes élargies conformes aux standards universels.',
    fileUrl: '/Site web ACPDPH, Modele.pdf',
  },
];

export default function Publications() {
  const { ref: headerRef } = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState<'all' | 'report' | 'legal' | 'study' | 'guide'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingDoc, setReadingDoc] = useState<Publication | null>(null);

  const { ref: listRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.pub-card',
    staggerDelay: 60,
  });

  const filtered = PUBLICATIONS_DATA.filter((pub) => {
    const matchesCat = activeCategory === 'all' || pub.category === activeCategory;
    const matchesQuery =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'report':
        return { label: 'Rapport Annuel', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200' };
      case 'legal':
        return { label: 'Texte Légal', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200' };
      case 'study':
        return { label: 'Étude & Recherche', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' };
      case 'guide':
        return { label: 'Guide Pratique', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' };
      default:
        return { label: 'Document', bg: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' };
    }
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3">
          Centre de Documentation & Plaidoyer
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Publications & Études
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Accédez librement à nos rapports d'activités, documents institutionnels, études thématiques et textes juridiques pour soutenir la recherche, la transparence et le plaidoyer pour les droits des personnes handicapées.
        </p>
      </section>

      {/* ── RECHERCHE & FILTRES ── */}
      <section className="container-ba mb-12">
        <div className="card p-4 sm:p-6 shadow-xs max-w-4xl mx-auto" style={{ background: '#ffffff' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Champ de recherche */}
            <div className="relative w-full">
              <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une publication, une loi, un mot-clé..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Compteur */}
            <div className="shrink-0 text-xs font-semibold text-gray-500 whitespace-nowrap">
              {filtered.length} document{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Boutons de catégories */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'report', label: 'Rapports Annuels' },
              { key: 'legal', label: 'Textes de Lois' },
              { key: 'study', label: 'Études & Diagnostics' },
              { key: 'guide', label: 'Guides Pratiques' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.key
                    ? 'bg-ba-blue text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTE DES PUBLICATIONS ── */}
      <section className="container-ba">
        {filtered.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="font-heading font-bold text-gray-900 mb-2">Aucun document ne correspond à votre recherche</p>
            <p className="text-sm text-gray-500 mb-4">Essayez d'autres mots-clés ou sélectionnez une autre catégorie.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-ba-blue text-white text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub) => {
              const badge = getCategoryBadge(pub.category);

              return (
                <div
                  key={pub.id}
                  className="pub-card card card-interactive p-6 flex flex-col justify-between"
                  style={{ background: '#ffffff' }}
                >
                  <div>
                    <div className="card-row mb-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {pub.pages}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg mb-2.5 leading-snug" style={{ color: '#111827' }}>
                      {pub.title}
                    </h3>

                    <p className="text-sm leading-relaxed mb-4 break-words" style={{ color: '#6B7280' }}>
                      {pub.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-700/60">
                    <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                      <span>{pub.author}</span>
                      <span className="font-medium text-gray-400">{pub.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReadingDoc(pub)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Aperçu
                      </button>

                      <a
                        href={pub.fileUrl || '/Site web ACPDPH, Modele.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-ba-blue hover:bg-ba-blue/90 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL D'APERÇU DU DOCUMENT ── */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getCategoryBadge(readingDoc.category).bg}`}>
                {getCategoryBadge(readingDoc.category).label}
              </span>
              <button
                onClick={() => setReadingDoc(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-gray-900 dark:text-white mb-2 leading-snug">
              {readingDoc.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-700">
              <span>Auteur : <strong>{readingDoc.author}</strong></span>
              <span>Date : <strong>{readingDoc.date}</strong></span>
              <span>Volume : <strong>{readingDoc.pages}</strong></span>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-8">
              <h4 className="font-heading font-bold text-base text-gray-900 dark:text-white">
                Synthèse Exécutive du Document :
              </h4>
              <p>{readingDoc.summary}</p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-700 text-xs">
                Ce document officiel est édité par l'ACPDPH dans le cadre de sa mission d'information, de transparence et de plaidoyer pour la promotion des droits des personnes handicapées en République Démocratique du Congo.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setReadingDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Fermer
              </button>
              <a
                href={readingDoc.fileUrl || '/Site web ACPDPH, Modele.pdf'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90 shadow-xs flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Ouvrir / Télécharger le PDF Complet
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
