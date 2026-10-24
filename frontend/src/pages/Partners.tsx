import { useState } from 'react';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';

interface Partner {
  id: string;
  name: string;
  category: 'donor' | 'network' | 'institution' | 'community';
  role: string;
  location: string;
  description: string;
}

const PARTNERS_LIST: Partner[] = [
  // Bailleurs de fonds & Coopération
  {
    id: '1',
    name: 'Coopération Internationale & Bailleurs Humanitaires',
    category: 'donor',
    role: 'Appui Financier & Technique',
    location: 'RDC & International',
    description: 'Partenariats stratégiques pour le financement des programmes d\'appareillage, de bourses scolaires inclusives et de formation professionnelle.',
  },
  {
    id: '2',
    name: 'Fondations Partenaires pour l\'Inclusion',
    category: 'donor',
    role: 'Mécénat & Subventions Projets',
    location: 'Afrique Centrale & Europe',
    description: 'Soutien aux infrastructures adaptées, dotation de fauteuils roulants tout-terrain et accompagnement médico-social.',
  },
  // Réseaux & OPH
  {
    id: '3',
    name: 'Collectif des Organisations de Personnes avec Handicap (OPH)',
    category: 'network',
    role: 'Plaidoyer Conjoint & Réseau National',
    location: 'Kinshasa & Nord-Kivu',
    description: 'Synergie d\'actions de plaidoyer pour l\'application stricte de la Loi organique n°22/003 et la promotion des droits fondamentaux.',
  },
  {
    id: '4',
    name: 'Réseau pour l\'Éducation Inclusive en Milieu Vulnérable',
    category: 'network',
    role: 'Mutualisation & Pratiques Pédagogiques',
    location: 'Nord-Kivu (Beni, Butembo, Goma)',
    description: 'Échange d\'expériences et de modules de formation pour l\'accueil d\'enfants handicapés dans le système scolaire régulier.',
  },
  // Institutions Publiques
  {
    id: '5',
    name: 'Ministère en charge des Personnes Vivant avec Handicap (PVH)',
    category: 'institution',
    role: 'Tutelle Institutionnelle & Alignement Stratégique',
    location: 'Kinshasa (RDC)',
    description: 'Coordination des politiques publiques sectorielles, harmonisation des critères d\'accessibilité et participation aux consultations nationales.',
  },
  {
    id: '6',
    name: 'Mairie de Beni & Division Provinciale des Affaires Sociales',
    category: 'institution',
    role: 'Partenaire Institutionnel Local',
    location: 'Beni, Nord-Kivu',
    description: 'Collaboration étroite pour l\'accessibilité physique des voiries urbaines, des édifices publics et l\'identification des bénéficiaires prioritaires.',
  },
  // Établissements & Communautaire
  {
    id: '7',
    name: 'Centres de Réadaptation & Hôpitaux Partenaires',
    category: 'community',
    role: 'Prise en Charge Médicale & Kinésithérapie',
    location: 'Beni & Région',
    description: 'Prise en charge orthopédique, suivi kinésithérapeutique et appareillage personnalisé pour les personnes à mobilité réduite.',
  },
  {
    id: '8',
    name: 'Écoles Primaires & Centres de Formation Professionnelle Pilotes',
    category: 'community',
    role: 'Intégration Pédagogique & Apprentissage',
    location: 'Ville et Territoire de Beni',
    description: 'Établissements partenaires accueillant nos boursiers et formant les jeunes adultes handicapés aux métiers d\'autonomisation.',
  },
];

export default function Partners() {
  const { ref: headerRef } = useScrollReveal();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'donor' | 'network' | 'institution' | 'community'>('all');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    type: 'Bailleur / Financement',
    message: '',
  });

  const { ref: listRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.partner-card',
    staggerDelay: 60,
  });

  const filteredPartners = selectedFilter === 'all'
    ? PARTNERS_LIST
    : PARTNERS_LIST.filter((p) => p.category === selectedFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3">
          Synergie & Coopération
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Nos Partenaires
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Bailleurs de fonds, institutions publiques, ONG et réseaux partenaires unissent leurs forces avec l'ACPDPH pour transformer durablement la vie des personnes en situation de handicap en République Démocratique du Congo.
        </p>
      </section>

      {/* ── STATS PARTENARIAT ── */}
      <section className="container-ba mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '15+', label: 'Organisations partenaires', sub: 'En RDC et à l\'international' },
            { value: '4', label: 'Bailleurs & Fondations', sub: 'Engagés à nos côtés' },
            { value: '25+', label: 'Écoles & Centres affiliés', sub: 'Pour l\'accueil inclusif' },
            { value: '100%', label: 'Redevabilité certifiée', sub: 'Rapports financiers transparents' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl bg-white dark:bg-zinc-800 text-center border border-black/[0.08] dark:border-white/[0.08]">
              <span className="font-heading text-3xl font-extrabold text-ba-blue dark:text-blue-400 block mb-1">
                {stat.value}
              </span>
              <span className="font-semibold text-xs text-gray-800 dark:text-gray-200 block uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-[11px] text-gray-500 block mt-1">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTRES ── */}
      <section className="container-ba mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { key: 'all', label: 'Tous les Partenaires' },
            { key: 'donor', label: 'Bailleurs & Fondations' },
            { key: 'network', label: 'Réseaux & OPH' },
            { key: 'institution', label: 'Institutions Publiques' },
            { key: 'community', label: 'Santé & Éducation' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer ${
                selectedFilter === filter.key
                  ? 'bg-ba-blue text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── GRILLE DES PARTENAIRES ── */}
      <section className="container-ba mb-20">
        <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="partner-card glass-card rounded-2xl p-6 bg-white dark:bg-zinc-800/90 border border-black/[0.08] dark:border-white/[0.08] hover:border-ba-blue/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-blue-950 dark:text-blue-300">
                    {partner.role}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {partner.location}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2.5">
                  {partner.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {partner.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-zinc-700/60 flex items-center justify-between text-xs text-ba-blue dark:text-blue-300 font-semibold">
                <span>Partenariat actif</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION DEVENIR PARTENAIRE ── */}
      <section className="container-ba">
        <div className="glass-card rounded-3xl p-8 md:p-12 bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3 inline-block">
                Appel à collaboration
              </span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Devenir Partenaire de l'ACPDPH
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                Vous êtes un bailleur de fonds, une ONG internationale, une institution publique ou une entreprise souhaitant soutenir l'inclusion en RDC ? Associons nos compétences pour démultiplier l'impact sur le terrain à Beni et dans toute la région.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  'Ancrage local fort et connaissance approfondie des réalités de Beni',
                  'Équipe dirigeante majoritairement composée de personnes handicapées',
                  'Transparence financière absolue avec rapports narratifs et financiers certifiés',
                  'Co-construction de projets sur mesure adaptés à vos priorités d\'intervention',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-ba-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire de Partenariat */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-700">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-2">
                    Proposition reçue avec succès
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    Merci pour votre intérêt pour l'ACPDPH. Notre direction exécutive prendra contact avec vous dans un délai de 48 heures.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90 transition-colors"
                  >
                    Envoyer une autre proposition
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-1">
                    Formulaire de Proposition de Partenariat
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Renseignez vos coordonnées pour initier un dialogue institutionnel.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Organisation / Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="Ex: Fondation Solidarité, ONG..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Nom du contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="Prénom et Nom"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Courriel professionnel *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@organisation.org"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Téléphone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+243..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Type de Partenariat envisagé
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                    >
                      <option value="Bailleur / Financement de projets">Bailleur / Financement de projets</option>
                      <option value="Partenariat Technique & Formations">Partenariat Technique & Formations</option>
                      <option value="Coopération Institutionnelle / Étatique">Coopération Institutionnelle / Étatique</option>
                      <option value="Dotation en matériel & Aides techniques">Dotation en matériel & Aides techniques</option>
                      <option value="Recherche & Études conjointes">Recherche & Études conjointes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Votre Message / Proposition *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Précisez les axes de collaboration souhaités..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-ba-blue text-white font-heading font-bold text-sm hover:bg-ba-blue/90 shadow-xs transition-colors cursor-pointer"
                  >
                    Transmettre la Proposition de Partenariat
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
