import { useState } from 'react';
import { useScrollReveal, useAnimeReveal } from '../hooks/useScrollReveal';

interface JobOffer {
  id: string;
  title: string;
  contract: 'CDI' | 'CDD' | 'Stage' | 'Volontariat';
  location: string;
  department: string;
  deadline: string;
  summary: string;
  requirements: string[];
  responsibilities: string[];
}

const JOB_OFFERS: JobOffer[] = [
  {
    id: '1',
    title: 'Chargé(e) de Plaidoyer Juridique & Droits Fondamentaux',
    contract: 'CDD',
    location: 'Beni (Nord-Kivu, RDC)',
    department: 'Pôle Juridique & Plaidoyer',
    deadline: '30 Novembre 2026',
    summary: 'Conduire les actions de plaidoyer auprès des autorités locales, vulgariser la Loi organique n°22/003 et offrir une assistance juridique gratuite aux personnes handicapées victimes de discrimination.',
    responsibilities: [
      'Documenter les cas de violations de droits des personnes avec handicap dans le Grand Nord-Kivu.',
      'Organiser des séances de formation juridique pour les magistrats, policiers et agents administratifs.',
      'Rédiger des notes de position et des rapports de plaidoyer pour la direction.',
    ],
    requirements: [
      'Diplôme universitaire en Droit, Sciences Politiques ou Droits de l\'Homme.',
      'Expérience confirmée d\'au moins 2 ans dans une organisation de la société civile.',
      'Excellente maîtrise du cadre légal congolais sur le handicap.',
      'La candidature d\'une personne en situation de handicap est vivement encouragée.',
    ],
  },
  {
    id: '2',
    title: 'Animateur(trice) Communautaire — Éducation Inclusive & Sensibilisation',
    contract: 'CDI',
    location: 'Beni Ville & Territoire',
    department: 'Pôle Éducation Inclusive',
    deadline: 'Poste Ouvert',
    summary: 'Assurer la liaison quotidienne entre les familles, les écoles partenaires et les centres de réadaptation pour favoriser l\'intégration scolaire des enfants handicapés.',
    responsibilities: [
      'Identifier et recenser les enfants vivant avec un handicap non scolarisés dans les quartiers de Beni.',
      'Accompagner les directeurs d\'écoles et enseignants dans l\'aménagement des salles de classe.',
      'Animer des ateliers de sensibilisation communautaire contre la stigmatisation.',
    ],
    requirements: [
      'Diplôme en Pédagogie, Sciences Sociales, Travail Social ou domaine connexe.',
      'Sens aigu de l\'écoute, empathie et parfaite maîtrise du Swahili et du Français.',
      'Capacité à se déplacer sur le terrain dans les différents quartiers de Beni.',
    ],
  },
  {
    id: '3',
    title: 'Assistant(e) Logistique & Réadaptation Technique',
    contract: 'Stage',
    location: 'Beni (Nord-Kivu)',
    department: 'Pôle Réadaptation & Logistique',
    deadline: '15 Décembre 2026',
    summary: 'Stage professionnel indemnisé (6 mois) : Appuyer l\'assemblage, l\'entretien et la distribution des tricycles, fauteuils roulants et matériels orthopédiques.',
    responsibilities: [
      'Gérer l\'inventaire des aides techniques à la mobilité et fournitures adaptées.',
      'Participer aux séances d\'ajustement et de remise officielle du matériel aux bénéficiaires.',
      'Assurer le suivi technique et l\'évaluation de la satisfaction des usagers.',
    ],
    requirements: [
      'Formation technique ou logistique (Bac+2 minimum ou formation professionnelle équivalente).',
      'Rigueur, ponctualité et motivation pour la cause de l\'accessibilité.',
      'Possibilité d\'embauche à l\'issue du stage.',
    ],
  },
  {
    id: '4',
    title: 'Interprètes Volontaires en Langue des Signes & Bénévoles',
    contract: 'Volontariat',
    location: 'Beni (Présentiel ou Événementiel)',
    department: 'Cellule Communication & Accessibilité',
    deadline: 'Recrutement Continu',
    summary: 'Missions bénévoles ponctuelles lors de nos conférences, assemblées et sessions de formation pour assurer la traduction en langue des signes ou l\'accompagnement physique.',
    responsibilities: [
      'Assurer l\'interprétation simultanée lors des réunions publiques et ateliers.',
      'Participer à l\'encadrement des activités récréatives et sportives inclusives.',
    ],
    requirements: [
      'Maîtrise de la langue des signes congolaise ou francophone.',
      'Motivation et engagement pour les droits des personnes sourdes et malentendantes.',
    ],
  },
];

export default function Careers() {
  const { ref: headerRef } = useScrollReveal();
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [candidateData, setCandidateData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobApplied: 'Candidature Spontanée',
    disabilityAccommodation: '',
    coverLetter: '',
  });

  const { ref: jobsRef } = useAnimeReveal<HTMLDivElement>({
    variant: 'stagger-cards',
    itemSelector: '.job-card',
    staggerDelay: 70,
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const getContractBadge = (contract: string) => {
    switch (contract) {
      case 'CDI':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'CDD':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Stage':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
    }
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue dark:bg-ba-blue/25 dark:text-blue-300 mb-3">
          Opportunités & Recrutement Inclusif
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Offres & Emplois
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Rejoignez une équipe engagée et passionnée par la justice sociale. L'ACPDPH garantit un cadre de travail bienveillant, accessible et fondé sur l'égalité des chances.
        </p>
      </section>

      {/* ── CHARTE RECRUTEMENT INCLUSIF ── */}
      <section className="container-ba mb-14">
        <div className="card p-6 sm:p-8 border border-blue-200" style={{ background: '#ffffff' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ba-blue">
                Politique Institutionnelle d'Inclusion
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold" style={{ color: '#111827' }}>
                Candidatures de Personnes en Situation de Handicap Prioritaires
              </h2>
              <p className="text-sm max-w-3xl leading-relaxed" style={{ color: '#6B7280' }}>
                À compétences égales, l'ACPDPH accorde une priorité absolue aux candidatures de personnes vivant avec un handicap. Nous mettons en place tous les aménagements raisonnables nécessaires lors des entretiens de recrutement et dans l'environnement quotidien de travail.
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ba-blue text-white text-xs font-bold shadow-xs">
                Aménagements garantis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFRES D'EMPLOI ACTUELLES ── */}
      <section className="container-ba mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold" style={{ color: '#111827' }}>
              Postes Actuellement Ouverts
            </h2>
            <p className="text-xs text-gray-500">
              Consultez nos postes à pourvoir au siège de Beni et sur nos projets de terrain.
            </p>
          </div>
          <span className="text-xs font-bold text-ba-blue">
            {JOB_OFFERS.length} opportunités disponibles
          </span>
        </div>

        <div ref={jobsRef} className="space-y-6">
          {JOB_OFFERS.map((job) => (
            <div
              key={job.id}
              className="job-card card card-interactive p-6 sm:p-8"
              style={{ background: '#ffffff' }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${getContractBadge(job.contract)}`}>
                      {job.contract}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {job.department}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      Lieu : {job.location}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl" style={{ color: '#111827' }}>
                    {job.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {selectedJob?.id === job.id ? 'Masquer la fiche' : 'Voir les détails'}
                  </button>
                  <button
                    onClick={() => {
                      setCandidateData({ ...candidateData, jobApplied: job.title });
                      const el = document.getElementById('apply-form-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90 transition-colors shadow-2xs cursor-pointer"
                  >
                    Postuler
                  </button>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B7280' }}>
                {job.summary}
              </p>

              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>Date limite : <strong>{job.deadline}</strong></span>
              </div>

              {/* Fiche détaillée dépliée */}
              {selectedJob?.id === job.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-heading font-bold mb-2" style={{ color: '#111827' }}>
                      Missions Principales :
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside" style={{ color: '#4B5563' }}>
                      {job.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold mb-2" style={{ color: '#111827' }}>
                      Profil & Qualifications Requises :
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside" style={{ color: '#4B5563' }}>
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMULAIRE DE CANDIDATURE ── */}
      <section id="apply-form-section" className="container-ba">
        <div className="card p-6 sm:p-10 max-w-3xl mx-auto" style={{ background: '#ffffff' }}>
          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-2">
                Candidature Transmise avec Succès
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-lg mx-auto">
                Merci d'avoir postulé pour le poste <strong>{candidateData.jobApplied}</strong>. Notre équipe des ressources humaines examinera votre dossier avec la plus grande attention et vous répondra sous 10 jours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-ba-blue text-white text-xs font-bold hover:bg-ba-blue/90"
              >
                Soumettre une autre candidature
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-ba-blue/10 text-ba-blue mb-2 inline-block">
                  Postuler en ligne
                </span>
                <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                  Formulaire de Candidature
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Postulez à une offre précise ou déposez une candidature spontanée pour un emploi, un stage ou du volontariat.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Poste Ciblé *
                </label>
                <select
                  value={candidateData.jobApplied}
                  onChange={(e) => setCandidateData({ ...candidateData, jobApplied: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                >
                  <option value="Candidature Spontanée">Candidature Spontanée (Emploi / Stage)</option>
                  {JOB_OFFERS.map((job) => (
                    <option key={job.id} value={job.title}>{job.title} ({job.contract})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateData.fullName}
                    onChange={(e) => setCandidateData({ ...candidateData, fullName: e.target.value })}
                    placeholder="Votre nom complet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Courriel *
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateData.email}
                    onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })}
                    placeholder="votre-email@domaine.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Numéro de Téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={candidateData.phone}
                    onChange={(e) => setCandidateData({ ...candidateData, phone: e.target.value })}
                    placeholder="+243..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Besoin d'Aménagement Raisonnable (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={candidateData.disabilityAccommodation}
                    onChange={(e) => setCandidateData({ ...candidateData, disabilityAccommodation: e.target.value })}
                    placeholder="Ex: rampe d'accès, langue des signes..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lettre de Motivation / Synthèse de votre profil *
                </label>
                <textarea
                  required
                  rows={4}
                  value={candidateData.coverLetter}
                  onChange={(e) => setCandidateData({ ...candidateData, coverLetter: e.target.value })}
                  placeholder="Présentez vos motivations, vos compétences clés et votre attachement à la mission de l'ACPDPH..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-ba-blue focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-xs text-gray-500">
                Vous pouvez également joindre directement votre CV complet au format PDF par courriel à <strong>recrutement@acpdph.org</strong> en mentionnant l'intitulé du poste dans l'objet.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-ba-blue hover:bg-ba-blue/90 text-white font-heading font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Transmettre ma Candidature
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
