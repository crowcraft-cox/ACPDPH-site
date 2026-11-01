import { useState, useEffect } from 'react';
import { apiFetch, API_BASE_URL } from '../../services/api';
import type { CandidateApplication } from '../../types';

export default function ApplicationsManager() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch<CandidateApplication[]>('/applications');
      if (res.success && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setError(res.error || 'Impossible de récupérer les candidatures.');
      }
    } catch (err: any) {
      console.error('Fetch applications error:', err);
      setError('Erreur lors du chargement des candidatures.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await apiFetch(`/applications/${id}`, { method: 'DELETE' });
      if (res.success) {
        setApplications((prev) => prev.filter((a) => (a._id || a.id) !== id));
        if (selectedApp && (selectedApp._id === id || selectedApp.id === id)) {
          setSelectedApp(null);
        }
      } else {
        alert(res.error || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error('Delete application error:', err);
      alert('Erreur réseau lors de la suppression.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleDownloadDoc = async (
    appId: string,
    type: 'cv' | 'coverLetter' | 'certificate',
    index?: number,
    filename?: string
  ) => {
    try {
      const token = sessionStorage.getItem('ba-admin-token');
      const url = `${API_BASE_URL}/applications/${appId}/document/${type}${index !== undefined ? `/${index}` : ''}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        alert('Fichier introuvable sur le serveur.');
        return;
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || `${type}_document`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
      alert('Erreur lors du téléchargement du document.');
    }
  };

  // Filtrage et recherche
  const jobTitles = Array.from(new Set(applications.map((a) => a.jobTitle).filter(Boolean)));

  const filteredApplications = applications.filter((app) => {
    const matchesJob = selectedJobFilter === 'ALL' || app.jobTitle === selectedJobFilter;
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${app.nom} ${app.postnom || ''} ${app.prenom}`.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      fullName.includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      app.telephone.toLowerCase().includes(searchLower) ||
      app.jobTitle.toLowerCase().includes(searchLower);

    return matchesJob && matchesSearch;
  });

  const handicapCount = applications.filter((a) => a.enSituationHandicap === 'Oui').length;
  const womenCount = applications.filter((a) => a.sexe === 'Femme').length;

  return (
    <div className="space-y-6">
      {/* ── En-tête et statistiques ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Candidatures Recrutement
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestion et consultation des dossiers de candidature soumis en ligne.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
        >
          <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      {/* Cartes métriques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Total candidatures</p>
          <p className="text-2xl font-heading font-extrabold text-[#2350D9] dark:text-blue-400 mt-1">
            {applications.length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Inclusion (Handicap)</p>
          <p className="text-2xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {handicapCount}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Candidatures Femmes</p>
          <p className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {womenCount}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Offres concernées</p>
          <p className="text-2xl font-heading font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {jobTitles.length}
          </p>
        </div>
      </div>

      {/* ── Filtres et recherche ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone, poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {jobTitles.length > 0 && (
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#2350D9]"
          >
            <option value="ALL">Toutes les offres ({applications.length})</option>
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── État de chargement / erreur ── */}
      {isLoading && (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div className="inline-block w-8 h-8 border-3 border-[#2350D9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Chargement des candidatures...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchApplications} className="font-bold underline hover:no-underline">
            Réessayer
          </button>
        </div>
      )}

      {/* ── Liste des candidatures ── */}
      {!isLoading && filteredApplications.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <svg className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">Aucune candidature trouvée</p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            {searchTerm ? 'Essayez de modifier vos critères de recherche.' : 'Les candidatures envoyées apparaîtront ici.'}
          </p>
        </div>
      )}

      {!isLoading && filteredApplications.length > 0 && (
        <div className="space-y-3">
          {filteredApplications.map((app) => {
            const appId = app._id || app.id || '';
            const appDate = app.createdAt
              ? new Date(app.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date inconnue';

            return (
              <div
                key={appId}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 transition hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                        {app.jobTitle}
                      </span>
                      {app.reference && (
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold">
                          {app.reference}
                        </span>
                      )}
                      {app.enSituationHandicap === 'Oui' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Priorité Inclusion
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500">{appDate}</span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      {app.nom.toUpperCase()} {app.postnom ? `${app.postnom} ` : ''}{app.prenom}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-zinc-400 pt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span>{app.telephone}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                        </svg>
                        <span>{app.niveauEducation}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-[#2350D9] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Voir dossier</span>
                    </button>

                    <button
                      onClick={() => handleDownloadDoc(appId, 'cv', undefined, `CV_${app.nom}_${app.prenom}.pdf`)}
                      title="Télécharger le CV"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      <span className="hidden md:inline">CV</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(appId)}
                      title="Supprimer la candidature"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Détail Dossier Candidat ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-zinc-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                  {selectedApp.jobTitle}
                </span>
                <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedApp.nom.toUpperCase()} {selectedApp.postnom ? `${selectedApp.postnom} ` : ''}{selectedApp.prenom}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Identité & Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                1. Identité & Contact
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                <div><span className="text-slate-400">Sexe :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.sexe}</strong></div>
                <div><span className="text-slate-400">Date naissance :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.dateNaissance}</strong></div>
                <div><span className="text-slate-400">E-mail :</span> <a href={`mailto:${selectedApp.email}`} className="text-[#2350D9] hover:underline font-semibold">{selectedApp.email}</a></div>
                <div><span className="text-slate-400">Téléphone :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.telephone}</strong></div>
                <div className="col-span-2"><span className="text-slate-400">Adresse :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.adresse || 'Non renseignée'}, {selectedApp.ville || ''} ({selectedApp.province || ''}, {selectedApp.pays || 'RDC'})</strong></div>
              </div>
            </div>

            {/* Études & Langues */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                2. Parcours & Compétences
              </h3>
              <div className="text-xs bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-2">
                <div><span className="text-slate-400">Niveau d'études :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.niveauEducation}</strong></div>
                <div>
                  <span className="text-slate-400">Langues parlées :</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedApp.langues && selectedApp.langues.length > 0 ? (
                      selectedApp.langues.map((l, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold">
                          {l.langue} ({l.niveau})
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Non renseigné</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expériences */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                3. Expériences professionnelles
              </h3>
              <div className="text-xs bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                {selectedApp.experiences && selectedApp.experiences.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedApp.experiences.map((exp, i) => (
                      <li key={i} className="border-l-2 border-[#2350D9] pl-3 py-0.5">
                        <strong className="text-slate-900 dark:text-white">{exp.titrePoste || 'Poste'}</strong> chez <span className="text-slate-600 dark:text-zinc-300">{exp.organisation}</span> ({exp.anneesExperience})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400">Aucune expérience enregistrée.</p>
                )}
              </div>
            </div>

            {/* Accessibilité & Inclusion */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                4. Accessibilité & Aménagements
              </h3>
              <div className="text-xs bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-1">
                <div><span className="text-slate-400">Personne en situation de handicap :</span> <strong className="text-slate-900 dark:text-white">{selectedApp.enSituationHandicap}</strong></div>
                {selectedApp.amenagementsSouhaites && (
                  <div className="pt-1"><span className="text-slate-400">Aménagements souhaités :</span> <p className="text-slate-700 dark:text-zinc-200 mt-0.5">{selectedApp.amenagementsSouhaites}</p></div>
                )}
              </div>
            </div>

            {/* Pièces jointes & Téléchargements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2350D9] dark:text-blue-400">
                5. Pièces Jointes du Dossier
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleDownloadDoc(selectedApp._id || selectedApp.id || '', 'cv', undefined, `CV_${selectedApp.nom}_${selectedApp.prenom}.pdf`)}
                  className="px-4 py-2 rounded-lg bg-[#2350D9] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Télécharger CV</span>
                </button>

                <button
                  onClick={() => handleDownloadDoc(selectedApp._id || selectedApp.id || '', 'coverLetter', undefined, `Lettre_${selectedApp.nom}_${selectedApp.prenom}.pdf`)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Lettre de motivation</span>
                </button>

                {selectedApp.documents?.certificates && selectedApp.documents.certificates.length > 0 && (
                  selectedApp.documents.certificates.map((cert, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDownloadDoc(selectedApp._id || selectedApp.id || '', 'certificate', idx, cert.originalname || `Attestation_${idx + 1}`)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span>Attestation {idx + 1}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmation Suppression ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-zinc-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base">
              Supprimer cette candidature ?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Cette action supprimera définitivement le dossier et l'ensemble des fichiers joints associés.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider"
              >
                Annuler
              </button>
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                {isDeleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

