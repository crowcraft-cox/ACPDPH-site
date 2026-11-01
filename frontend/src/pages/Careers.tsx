import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAdminData } from '../context/adminData';
import type { JobOffer } from '../types';

const GRADIENT_PALETTES = [
  'from-blue-950 via-blue-900 to-indigo-950',
  'from-slate-900 via-blue-950 to-cyan-950',
  'from-indigo-950 via-blue-900 to-sky-950',
  'from-blue-900 via-indigo-950 to-slate-950',
  'from-teal-950 via-blue-950 to-indigo-900',
  'from-sky-950 via-blue-900 to-indigo-950',
];

const emptyJobForm: Omit<JobOffer, 'id' | 'createdAt'> = {
  title: '',
  location: 'Beni (Nord-Kivu, RDC)',
  contractType: 'CDD',
  contractPrecision: '',
  description: '',
  missions: [''],
  profile: '',
  applicationDossier: '',
  deadline: '',
  applicationLink: '',
};

export default function Careers() {
  const { ref: headerRef } = useScrollReveal();
  const { data, isAuthenticated, addJob, deleteJob } = useAdminData();
  const jobs = data.jobs || [];

  // États pour l'administration directe (bullet 12)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<JobOffer, 'id' | 'createdAt'>>(emptyJobForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setForm(emptyJobForm);
    setIsAddModalOpen(true);
    setSuccessMessage(null);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim()) {
      alert("Veuillez renseigner l'intitulé du poste et le lieu de travail.");
      return;
    }

    const cleanedMissions = (form.missions || [])
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    addJob({
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      contractPrecision: form.contractPrecision?.trim() || '',
      description: form.description?.trim() || '',
      missions: cleanedMissions,
      profile: form.profile?.trim() || '',
      applicationDossier: form.applicationDossier?.trim() || '',
      deadline: form.deadline?.trim() || '',
      applicationLink: form.applicationLink?.trim() || '',
    });

    setIsAddModalOpen(false);
    setSuccessMessage("L'offre d'emploi a été publiée avec succès !");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteJob = (id: string) => {
    deleteJob(id);
    setDeleteConfirmId(null);
    setSuccessMessage("L'offre d'emploi a été supprimée.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const addMissionField = () => {
    setForm((prev) => ({
      ...prev,
      missions: [...(prev.missions || []), ''],
    }));
  };

  const updateMissionField = (index: number, val: string) => {
    setForm((prev) => {
      const next = [...(prev.missions || [])];
      next[index] = val;
      return { ...prev, missions: next };
    });
  };

  const removeMissionField = (index: number) => {
    setForm((prev) => {
      const next = (prev.missions || []).filter((_, i) => i !== index);
      return { ...prev, missions: next.length > 0 ? next : [''] };
    });
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 bg-slate-50 dark:bg-ba-dark min-h-screen">
      {/* ── HEADER HERO ── */}
      <section ref={headerRef} className="container-ba text-center mb-8">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase text-[#2350D9] dark:text-blue-400 tracking-tight">
          Offres & Emplois
        </h1>
      </section>

      {/* ── CHARTE RECRUTEMENT INCLUSIF (INCHANGÉE) ── */}
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

      {/* ── SECTION OFFRES D'EMPLOI ── */}
      <section className="container-ba mb-16">
        {/* Message de succès administrateur */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Barre d'administration (UNIQUEMENT si l'administrateur est connecté) */}
        {isAuthenticated && (
          <div className="mb-8 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-300">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-2.171 7.172A9 9 0 1120.25 12a8.966 8.966 0 01-2.171 6.172z" />
              </svg>
              <span>Session Administrateur active</span>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2350D9] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Ajouter une offre</span>
            </button>
          </div>
        )}

        {/* Grille des offres ou état vide */}
        {jobs.length === 0 ? (
          <div className="card p-12 text-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2350D9] dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Aucune offre disponible pour le moment. Revenez bientôt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => {
              const gradient = GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];

              return (
                <div
                  key={job.id}
                  className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col h-full border border-blue-900/10 group bg-[#1F4FDB]"
                >
                  {/* Bouton de suppression admin direct (UNIQUEMENT si connecté) */}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteConfirmId(job.id);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 p-2 rounded-xl bg-black/50 hover:bg-red-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Supprimer cette offre"
                      aria-label="Supprimer cette offre"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}

                  {/* Toute la carte est cliquable (un seul <Link>) vers la page de détail */}
                  <Link
                    to={`/offres-emplois/${job.id}`}
                    className="flex flex-col h-full text-white cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-white"
                  >
                    {/* Zone haut (h-40) : fond dégradé bleu foncé + titre en grand, centré, blanc, majuscule, font-bold, line-clamp-3 */}
                    <div
                      className={`h-40 px-6 py-4 flex items-center justify-center text-center bg-gradient-to-br ${gradient} border-b border-white/10`}
                    >
                      <h2 className="font-heading font-bold text-white text-base sm:text-lg uppercase line-clamp-3 leading-snug tracking-wide group-hover:scale-[1.02] transition-transform duration-200">
                        {job.title}
                      </h2>
                    </div>

                    {/* Zone bas : panneau bleu (#1F4FDB), padding p-4 pour ne pas toucher les bords */}
                    <div className="p-4 flex flex-col items-center justify-between gap-3 text-center flex-1 bg-[#1F4FDB]">
                      {/* Titre repris en plus petit (blanc, font-bold, text-center, line-clamp-2) */}
                      <h3 className="font-heading font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug text-center">
                        {job.title}
                      </h3>

                      {/* 2 petites informations centrées avec icônes (MapPin & Briefcase) */}
                      <div className="flex flex-col items-center justify-center gap-1.5 mt-auto pt-2 border-t border-white/10 w-full">
                        {/* Lieu de travail (icône MapPin) */}
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#FFD4A3]">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span className="truncate max-w-[200px]">{job.location}</span>
                        </div>

                        {/* Type de contrat (icône Briefcase) */}
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#FFD4A3]">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                          </svg>
                          <span>
                            {job.contractType}
                            {job.contractPrecision ? ` – ${job.contractPrecision}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL ADMIN : AJOUT D'UNE OFFRE ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Ajouter une offre d'emploi
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              {/* Titre */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Titre du poste *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Chargé(e) de Projet Inclusion"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                />
              </div>

              {/* Lieu & Type de contrat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Lieu de travail *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Ex : Beni (Nord-Kivu, RDC)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Type de contrat *
                  </label>
                  <select
                    value={form.contractType}
                    onChange={(e) => setForm({ ...form, contractType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                  >
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Consultance">Consultance</option>
                    <option value="Bénévolat">Bénévolat</option>
                  </select>
                </div>
              </div>

              {/* Précision contrat & Date limite */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Précision contrat (ex. 12 mois)
                  </label>
                  <input
                    type="text"
                    value={form.contractPrecision}
                    onChange={(e) => setForm({ ...form, contractPrecision: e.target.value })}
                    placeholder="Ex : 12 mois, renouvelable"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Date limite de candidature (optionnelle)
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Lien ou email de candidature */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Lien ou e-mail de candidature (optionnel)
                </label>
                <input
                  type="text"
                  value={form.applicationLink}
                  onChange={(e) => setForm({ ...form, applicationLink: e.target.value })}
                  placeholder="Lien web externe ou e-mail direct (sinon e-mail de contact du site par défaut)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Description du poste
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Présentation générale du poste et missions globales..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                />
              </div>

              {/* Missions (liste dynamique) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Missions principales
                  </label>
                  <button
                    type="button"
                    onClick={addMissionField}
                    className="text-xs font-bold text-[#2350D9] dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Ajouter un point
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.missions || []).map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => updateMissionField(idx, e.target.value)}
                        placeholder={`Mission ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                      />
                      {(form.missions || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMissionField(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          title="Supprimer ce point"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Profil recherché */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Profil recherché
                </label>
                <textarea
                  rows={3}
                  value={form.profile}
                  onChange={(e) => setForm({ ...form, profile: e.target.value })}
                  placeholder="Qualifications, compétences requises, expériences..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                />
              </div>

              {/* Dossier de candidature */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Dossier de candidature
                </label>
                <textarea
                  rows={2}
                  value={form.applicationDossier}
                  onChange={(e) => setForm({ ...form, applicationDossier: e.target.value })}
                  placeholder="Pièces à fournir (CV, lettre de motivation, attestations...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#2350D9] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2350D9] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
                >
                  Publier l'offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL ADMIN : CONFIRMATION SUPPRESSION ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-gray-200 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
              Supprimer cette offre ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-6">
              Cette action est définitive. L'offre sera immédiatement retirée du site et de la base de données.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteJob(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
