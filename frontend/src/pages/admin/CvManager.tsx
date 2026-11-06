import { useState, useRef } from 'react';
import { useAdminData } from '../../context/adminData';
import { DEFAULT_GOVERNANCE_MEMBERS } from '../../data/governanceData';
import type { MemberCv, GovernanceMember } from '../../types';
import { generateSlug } from '../../utils/slugify';
import { apiFetch } from '../../services/api';
import { resolveImageUrl, compressImageToDataUrl } from '../../utils/imageUrl';
import { translateFrTo, translateFrToAll } from '../../services/translationService';
import { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';
import type { TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';
import type { Lang } from '../../i18n';

export default function CvManager() {
  const { data, saveCv, deleteCv } = useAdminData();
  const allMembers: GovernanceMember[] =
    data.governanceMembers && data.governanceMembers.length > 0
      ? data.governanceMembers
      : DEFAULT_GOVERNANCE_MEMBERS;

  const cvs: MemberCv[] = data.cvs || [];

  // ── Modals & Wizard State ──
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // Données de travail pour le CV en cours d'édition / création
  const [editingCv, setEditingCv] = useState<MemberCv | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    sectionsFound: Record<string, boolean>;
    warnings: string[];
  } | null>(null);

  // Mode correction manuelle
  const [isEditingFields, setIsEditingFields] = useState(false);

  // Modal aperçu
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Modal confirmation suppression
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Multilingual state (FR, EN, IT, DE)
  const [cvLang, setCvLang] = useState<Lang>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const cvStatusByLang: Partial<Record<Lang, TranslationTabStatus>> = {
    en: !editingCv?.role_en && !editingCv?.about_en ? 'Manquant' : (editingCv?.needsReview_en ? 'À relire' : 'Relu'),
    it: !editingCv?.role_it && !editingCv?.about_it ? 'Manquant' : (editingCv?.needsReview_it ? 'À relire' : 'Relu'),
    de: !editingCv?.role_de && !editingCv?.about_de ? 'Manquant' : (editingCv?.needsReview_de ? 'À relire' : 'Relu'),
  };

  const handleTranslateCurrentTab = async () => {
    if (cvLang === 'fr' || !editingCv) return;
    const roleFr = editingCv.role || '';
    const aboutFr = editingCv.about || '';
    const skillsFr = (editingCv.skills || []).join('\n');
    if (!roleFr.trim() && !aboutFr.trim() && !skillsFr.trim()) return;

    setIsTranslating(true);
    setTranslateError(null);
    try {
      const res = await translateFrTo([roleFr, aboutFr, skillsFr], cvLang as 'en' | 'it' | 'de');
      if (res.success && res.translations) {
        const [tRole, tAbout, tSkills] = res.translations;
        const parsedSkills = tSkills ? tSkills.split('\n').map((s) => s.trim()).filter(Boolean) : [];
        setEditingCv({
          ...editingCv,
          [`role_${cvLang}`]: tRole || editingCv[`role_${cvLang}` as keyof MemberCv],
          [`about_${cvLang}`]: tAbout || editingCv[`about_${cvLang}` as keyof MemberCv],
          [`skills_${cvLang}`]: parsedSkills.length > 0 ? parsedSkills : editingCv[`skills_${cvLang}` as keyof MemberCv],
          [`needsReview_${cvLang}`]: true,
        });
      } else {
        setTranslateError(res.error || `Erreur de traduction vers ${cvLang}.`);
      }
    } catch (err: any) {
      setTranslateError(err.message || 'Erreur de traduction.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateAll = async () => {
    if (!editingCv) return;
    const roleFr = editingCv.role || '';
    const aboutFr = editingCv.about || '';
    const skillsFr = (editingCv.skills || []).join('\n');
    if (!roleFr.trim() && !aboutFr.trim() && !skillsFr.trim()) return;

    setIsTranslating(true);
    setTranslateError(null);
    try {
      const res = await translateFrToAll([roleFr, aboutFr, skillsFr]);
      if (res.success && res.translations) {
        const { en, it, de } = res.translations;
        setEditingCv({
          ...editingCv,
          role_en: en[0] || editingCv.role_en,
          about_en: en[1] || editingCv.about_en,
          skills_en: en[2] ? en[2].split('\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_en,
          needsReview_en: true,
          role_it: it[0] || editingCv.role_it,
          about_it: it[1] || editingCv.about_it,
          skills_it: it[2] ? it[2].split('\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_it,
          needsReview_it: true,
          role_de: de[0] || editingCv.role_de,
          about_de: de[1] || editingCv.about_de,
          skills_de: de[2] ? de[2].split('\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_de,
          needsReview_de: true,
        });
      } else {
        setTranslateError(res.error || 'Erreur de traduction globale.');
      }
    } catch (err: any) {
      setTranslateError(err.message || 'Erreur de traduction.');
    } finally {
      setIsTranslating(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Trouver le CV associé à un membre
  const getCvForMember = (member: GovernanceMember): MemberCv | undefined => {
    const slug = generateSlug(member.name);
    return cvs.find((c) => c.memberId === member.id || c.slug === slug || generateSlug(c.memberId || '') === slug);
  };

  // Ouvrir l'assistant pour ajouter / remplacer
  const openWizard = (member?: GovernanceMember) => {
    const targetMember = member || allMembers[0];
    setSelectedMemberId(targetMember ? targetMember.id : '');
    setUploadError(null);
    setVerificationResult(null);
    setIsEditingFields(false);
    setCvLang('fr');
    setTranslateError(null);

    const existingCv = targetMember ? getCvForMember(targetMember) : undefined;
    if (existingCv) {
      setEditingCv({ ...existingCv });
      setWizardStep(2); // Directement à l'étape de vérification si déjà présent
    } else {
      setEditingCv({
        memberId: targetMember ? targetMember.id : '',
        slug: targetMember ? generateSlug(targetMember.name) : '',
        givenNames: targetMember ? targetMember.name.split(' ')[0] : '',
        familyNames: targetMember ? targetMember.name.split(' ').slice(1).join(' ') : '',
        role: targetMember ? targetMember.role : '',
        about: '',
        contact: { phone: '', email: '', address: '' },
        skills: [],
        languages: [],
        experiences: [],
        education: [],
        photo: targetMember?.photo,
        visibility: { phone: false, email: false, address: false },
        published: true,
      });
      setWizardStep(1);
    }

    setIsWizardOpen(true);
  };

  // Changement de membre dans l'assistant
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = allMembers.find((mem) => mem.id === memberId);
    if (!m) return;

    const existingCv = getCvForMember(m);
    if (existingCv) {
      setEditingCv({ ...existingCv });
    } else {
      setEditingCv({
        memberId: m.id,
        slug: generateSlug(m.name),
        givenNames: m.name.split(' ')[0],
        familyNames: m.name.split(' ').slice(1).join(' '),
        role: m.role,
        about: '',
        contact: { phone: '', email: '', address: '' },
        skills: [],
        languages: [],
        experiences: [],
        education: [],
        photo: m.photo,
        visibility: { phone: false, email: false, address: false },
        published: true,
      });
    }
  };

  // Gestion de l'import .docx
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validation stricte de l'extension
    const nameLower = file.name.toLowerCase();
    if (!nameLower.endsWith('.docx')) {
      setUploadError('Format refusé : Seuls les fichiers Word au format .docx sont acceptés (.doc, .docm et PDF sont refusés).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validation de la taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Taille excessive : Le fichier dépasse la limite maximale de 5 Mo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch<any>('/cvs/parse', {
        method: 'POST',
        body: formData,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Impossible d\'analyser le fichier Word.');
      }

      const parsed = res.data;
      const targetMember = allMembers.find((m) => m.id === selectedMemberId);

      // Fusion des données extraites avec le membre sélectionné
      const mergedCv: MemberCv = {
        memberId: selectedMemberId,
        slug: targetMember ? generateSlug(targetMember.name) : generateSlug(`${parsed.givenNames} ${parsed.familyNames}`),
        givenNames: parsed.givenNames || (targetMember ? targetMember.name.split(' ')[0] : ''),
        familyNames: parsed.familyNames || (targetMember ? targetMember.name.split(' ').slice(1).join(' ') : ''),
        role: parsed.role || targetMember?.role || '',
        about: parsed.about || '',
        contact: {
          phone: parsed.contact?.phone || '',
          email: parsed.contact?.email || '',
          address: parsed.contact?.address || '',
        },
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        photo: editingCv?.photo || targetMember?.photo,
        visibility: editingCv?.visibility || { phone: false, email: false, address: false },
        published: true,
      };

      setEditingCv(mergedCv);
      setVerificationResult((res as any).verification || null);
      setWizardStep(2);
    } catch (err: any) {
      setUploadError(err.message || 'Erreur lors de l\'analyse du document.');
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Upload d'une photo personnalisée
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCv) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 10 Mo.');
      return;
    }

    try {
      const dataUrl = await compressImageToDataUrl(file, 1200, 1200, 0.82);
      setEditingCv({ ...editingCv, photo: dataUrl });
    } catch (err: any) {
      alert(`Erreur traitement photo : ${err.message || 'erreur'}`);
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // Publication définitive du CV
  const handlePublish = async () => {
    if (!editingCv || !selectedMemberId) return;

    setIsSaving(true);
    const targetMember = allMembers.find((m) => m.id === selectedMemberId);
    const slug = targetMember ? generateSlug(targetMember.name) : editingCv.slug;

    const payload: MemberCv = {
      ...editingCv,
      memberId: selectedMemberId,
      slug,
      published: true,
      updatedAt: new Date().toISOString(),
    };

    const ok = await saveCv(payload);
    setIsSaving(false);

    if (ok) {
      setActionSuccess('Le CV a été publié avec succès et est immédiatement visible en ligne.');
      setIsWizardOpen(false);
      setTimeout(() => setActionSuccess(null), 5000);
    } else {
      alert('Une erreur est survenue lors de l\'enregistrement sur le serveur.');
    }
  };

  // Suppression
  const confirmDelete = async () => {
    if (!cvToDelete) return;
    setIsDeleting(true);

    const ok = await deleteCv(cvToDelete);
    setIsDeleting(false);
    setCvToDelete(null);

    if (ok) {
      setActionSuccess('Le CV a été définitivement supprimé.');
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Curriculum Vitae des Membres
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gérez les fiches CV publiques des membres de la gouvernance à partir des documents Word officiels.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/modeles/modele-cv-acpdph.docx"
            download="modele-cv-acpdph.docx"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors border border-slate-700"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Télécharger le modèle (.docx)
          </a>

          <button
            onClick={() => openWizard()}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter un CV
          </button>
        </div>
      </div>

      {/* Message de succès */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {actionSuccess}
        </div>
      )}

      {/* Tableau des membres et statut CV */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Membre</th>
                <th className="py-3.5 px-4">Organe &amp; Fonction</th>
                <th className="py-3.5 px-4 text-center">Statut CV</th>
                <th className="py-3.5 px-4 text-center">Visibilité Coordonnées</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allMembers.map((member) => {
                const memberCv = getCvForMember(member);
                const hasCv = Boolean(memberCv);
                const isPub = Boolean(memberCv?.published);
                const organLabel =
                  member.organ === 'board'
                    ? 'Conseil d\'Administration'
                    : member.organ === 'audit'
                    ? 'Commission de Contrôle'
                    : 'Secrétariat Exécutif';

                return (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {member.photo || memberCv?.photo ? (
                          <img
                            src={resolveImageUrl(memberCv?.photo || member.photo)}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          style={{ display: member.photo || memberCv?.photo ? 'none' : 'flex' }}
                          className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center shrink-0"
                        >
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-xs text-slate-500">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-xs font-medium text-blue-400">{organLabel}</div>
                      <div className="text-xs text-slate-400">{member.role}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isPub ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Publié
                        </span>
                      ) : hasCv ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Brouillon
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Aucun CV
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {hasCv ? (
                        <div className="inline-flex items-center gap-2 text-xs">
                          <span
                            title="Téléphone"
                            className={`px-2 py-0.5 rounded font-mono ${
                              memberCv?.visibility?.phone
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-800/50 text-slate-600 line-through'
                            }`}
                          >
                            Tél
                          </span>
                          <span
                            title="Email"
                            className={`px-2 py-0.5 rounded font-mono ${
                              memberCv?.visibility?.email
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-800/50 text-slate-600 line-through'
                            }`}
                          >
                            Mail
                          </span>
                          <span
                            title="Adresse"
                            className={`px-2 py-0.5 rounded font-mono ${
                              memberCv?.visibility?.address
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : 'bg-slate-800/50 text-slate-600 line-through'
                            }`}
                          >
                            Adr
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasCv ? (
                          <>
                            <a
                              href={`/gouvernance/${memberCv?.slug || generateSlug(member.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                            >
                              Voir
                            </a>
                            <button
                              type="button"
                              onClick={() => openWizard(member)}
                              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-800 text-xs font-medium transition-colors"
                            >
                              Remplacer
                            </button>
                            <button
                              type="button"
                              onClick={() => setCvToDelete(member.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-medium transition-colors"
                            >
                              Supprimer
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openWizard(member)}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                          >
                            Ajouter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ASSISTANT MODAL "AJOUTER / REMPLACER UN CV" ── */}
      {isWizardOpen && editingCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingCv.experiences?.length > 0 ? 'Mettre à jour le Curriculum Vitae' : 'Ajouter un Curriculum Vitae'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assistant d&apos;import Word (.docx) et configuration du profil public.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Étapes (Tabs de navigation) */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold text-center">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className={`py-3 transition-colors ${
                  wizardStep === 1
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Membre &amp; Fichier Word
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className={`py-3 transition-colors ${
                  wizardStep === 2
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Vérification &amp; Champs
              </button>
              <button
                type="button"
                onClick={() => setWizardStep(3)}
                className={`py-3 transition-colors ${
                  wizardStep === 3
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Options &amp; Publication
              </button>
            </div>

            {/* Corps du modal selon l'étape */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* ── ÉTAPE 1 : Choix du membre & Import Word ── */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      1. Sélectionner le membre concerné
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => handleSelectMember(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {allMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — {m.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Carte téléchargement du modèle */}
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-200">
                        Besoin du modèle Word conforme ?
                      </h4>
                      <p className="text-xs text-blue-300/80 mt-0.5">
                        Téléchargez le modèle officiel pré-formaté pour remplir les sections sans risque d&apos;erreur.
                      </p>
                    </div>
                    <a
                      href="/modeles/modele-cv-acpdph.docx"
                      download="modele-cv-acpdph.docx"
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      Télécharger le modèle (.docx)
                    </a>
                  </div>

                  {/* Zone d'import du fichier Word */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      2. Importer le fichier Word (.docx)
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <svg className="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="block text-sm font-semibold text-white">
                        {isParsing ? 'Extraction des données en cours...' : 'Cliquez pour sélectionner un document Word (.docx)'}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1">
                        Format .docx uniquement (refuse .doc, .docm, PDF) — 5 Mo maximum.
                      </span>
                    </div>

                    {uploadError && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium">
                        {uploadError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ÉTAPE 2 : Vérification des données extraites ── */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  {/* Résumé de vérification */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-white mb-3">
                      Liste de contrôle des sections reconnues
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { label: 'Identité', key: 'identity', ok: Boolean(editingCv.givenNames || editingCv.familyNames) },
                        { label: 'À propos', key: 'about', ok: Boolean(editingCv.about && editingCv.about.length > 5) },
                        { label: 'Contact', key: 'contact', ok: Boolean(editingCv.contact?.phone || editingCv.contact?.email) },
                        { label: 'Compétences', key: 'skills', ok: editingCv.skills?.length > 0 },
                        { label: 'Langues', key: 'languages', ok: editingCv.languages?.length > 0 },
                        { label: 'Expériences', key: 'experiences', ok: editingCv.experiences?.length > 0 },
                        { label: 'Formation', key: 'education', ok: editingCv.education?.length > 0 },
                      ].map((sec) => (
                        <div
                          key={sec.key}
                          className={`p-2 rounded-lg border flex items-center gap-2 ${
                            sec.ok
                              ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                              : 'bg-amber-950/30 border-amber-800 text-amber-300'
                          }`}
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            {sec.ok ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            )}
                          </svg>
                          <span className="font-medium truncate">{sec.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Avertissements */}
                    {verificationResult?.warnings && verificationResult.warnings.length > 0 && (
                      <div className="mt-3 p-3 bg-amber-950/50 border border-amber-900 rounded-lg text-xs text-amber-200">
                        <span className="font-semibold block mb-1">Avertissements :</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {verificationResult.warnings.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Vous pouvez corriger ou compléter chaque champ manuellement avant publication.
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingFields(!isEditingFields)}
                        className="px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 border border-blue-700 text-xs font-semibold transition-colors"
                      >
                        {isEditingFields ? 'Fermer le formulaire' : 'Corriger les champs'}
                      </button>
                    </div>
                  </div>

                  {/* Formulaire complet de correction des champs */}
                  {isEditingFields && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 text-xs">
                      <h5 className="font-bold text-white uppercase text-sm border-b border-slate-800 pb-2">
                        Édition détaillée des données
                      </h5>

                      <AdminLanguageTabs
                        currentLang={cvLang}
                        onLangChange={setCvLang}
                        onTranslateTab={cvLang !== 'fr' ? handleTranslateCurrentTab : undefined}
                        onTranslateAll={handleTranslateAll}
                        isTranslating={isTranslating}
                        translateError={translateError}
                        statusByLang={cvStatusByLang}
                      />

                      {cvLang === 'fr' ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1">Prénom(s)</label>
                              <input
                                type="text"
                                value={editingCv.givenNames}
                                onChange={(e) => setEditingCv({ ...editingCv, givenNames: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Nom(s)</label>
                              <input
                                type="text"
                                value={editingCv.familyNames}
                                onChange={(e) => setEditingCv({ ...editingCv, familyNames: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">Fonction officielle (FR)</label>
                            <input
                              type="text"
                              value={editingCv.role}
                              onChange={(e) => setEditingCv({ ...editingCv, role: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">À propos (FR)</label>
                            <textarea
                              rows={3}
                              value={editingCv.about}
                              onChange={(e) => setEditingCv({ ...editingCv, about: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1">Téléphone</label>
                              <input
                                type="text"
                                value={editingCv.contact?.phone || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, phone: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">E-mail</label>
                              <input
                                type="text"
                                value={editingCv.contact?.email || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, email: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Adresse</label>
                              <input
                                type="text"
                                value={editingCv.contact?.address || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, address: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Compétences (FR, une par ligne)
                            </label>
                            <textarea
                              rows={3}
                              value={editingCv.skills?.join('\n') || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  skills: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              Traduction ({cvLang.toUpperCase()})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const key = `needsReview_${cvLang}` as keyof MemberCv;
                                setEditingCv({
                                  ...editingCv,
                                  [key]: !editingCv[key],
                                });
                              }}
                              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                                editingCv[`needsReview_${cvLang}` as keyof MemberCv]
                                  ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                                  : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                              }`}
                            >
                              {editingCv[`needsReview_${cvLang}` as keyof MemberCv]
                                ? 'Marquer comme relu'
                                : 'Statut : Relu'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Fonction officielle ({cvLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={(editingCv[`role_${cvLang}` as keyof MemberCv] as string) || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [`role_${cvLang}`]: e.target.value,
                                  [`needsReview_${cvLang}`]: false,
                                })
                              }
                              placeholder={`Fonction en ${cvLang.toUpperCase()}`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              À propos ({cvLang.toUpperCase()})
                            </label>
                            <textarea
                              rows={3}
                              value={(editingCv[`about_${cvLang}` as keyof MemberCv] as string) || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [`about_${cvLang}`]: e.target.value,
                                  [`needsReview_${cvLang}`]: false,
                                })
                              }
                              placeholder={`À propos en ${cvLang.toUpperCase()}`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Compétences ({cvLang.toUpperCase()}, une par ligne)
                            </label>
                            <textarea
                              rows={3}
                              value={((editingCv[`skills_${cvLang}` as keyof MemberCv] as string[]) || []).join('\n')}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [`skills_${cvLang}`]: e.target.value.split('\n').filter((s) => s.trim().length > 0),
                                  [`needsReview_${cvLang}`]: false,
                                })
                              }
                              placeholder={`Compétences en ${cvLang.toUpperCase()}`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Résumé textuel */}
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Nom complet :</span> {editingCv.givenNames} {editingCv.familyNames}
                    </div>
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Nombre d&apos;expériences :</span> {editingCv.experiences?.length || 0}
                    </div>
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Nombre de formations :</span> {editingCv.education?.length || 0}
                    </div>
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Langues reconnues :</span>{' '}
                      {editingCv.languages?.map((l) => `${l.name} (${l.level}%)`).join(', ') || 'Aucune'}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ÉTAPE 3 : Options de visibilité & Photo ── */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  {/* Gestion de la Photo */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Photo du membre pour le CV
                    </label>
                    <div className="flex items-center gap-4">
                      {editingCv.photo ? (
                        <>
                          <img
                            src={resolveImageUrl(editingCv.photo)}
                            alt=""
                            className="w-16 h-20 rounded-lg object-cover border border-slate-700 shrink-0"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="w-16 h-20 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center shrink-0"
                          >
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <div className="w-16 h-20 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-slate-400 mb-2">
                          Par défaut, la photo de la carte du membre est utilisée. Vous pouvez la remplacer par un portrait dédié (JPEG/PNG/WebP, max 3 Mo).
                        </p>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                        >
                          Remplacer la photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Options d'affichage des coordonnées (Protection de la vie privée) */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        Protection des données personnelles
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                        À cocher uniquement avec l&apos;accord du membre
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Par défaut, toutes les coordonnées sont masquées aux visiteurs publics. Cochez les cases suivantes uniquement si le membre a donné son accord écrit :
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingCv.visibility?.phone || false}
                          onChange={(e) =>
                            setEditingCv({
                              ...editingCv,
                              visibility: { ...editingCv.visibility, phone: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                        />
                        <span>Afficher publiquement le numéro de téléphone ({editingCv.contact?.phone || 'non renseigné'})</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingCv.visibility?.email || false}
                          onChange={(e) =>
                            setEditingCv({
                              ...editingCv,
                              visibility: { ...editingCv.visibility, email: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                        />
                        <span>Afficher publiquement l&apos;adresse e-mail ({editingCv.contact?.email || 'non renseigné'})</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={editingCv.visibility?.address || false}
                          onChange={(e) =>
                            setEditingCv({
                              ...editingCv,
                              visibility: { ...editingCv.visibility, address: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                        />
                        <span>Afficher publiquement l&apos;adresse géographique ({editingCv.contact?.address || 'non renseignée'})</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pied du modal avec actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Précédent
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                    >
                      Aperçu
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? 'Publication en cours...' : 'PUBLIER LE CV'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL APERÇU COMPLET ── */}
      {isPreviewOpen && editingCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-[900px] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-2xl my-6">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Aperçu du CV — Mode prévisualisation (non publié)
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                Fermer l&apos;aperçu
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[85vh] bg-slate-200">
              {/* Contenu rendu comme sur la page publique */}
              <div className="bg-white shadow-xl relative overflow-hidden text-slate-900 min-h-[900px]">
                {/* Entête */}
                <div className="relative pt-10 px-8 pb-6">
                  <div
                    className="absolute top-0 right-0 w-[42%] h-[200px] rounded-b-[100px] z-0"
                    style={{ backgroundColor: 'var(--cv-navy, #1F3757)' }}
                  />
                  <div className="absolute right-[8%] top-[25px] w-[24%] max-w-[180px] aspect-[0.7] rounded-full border-[3px] border-white z-10 overflow-hidden shadow-lg bg-slate-100 flex items-center justify-center">
                    {editingCv.photo ? (
                      <img
                        src={resolveImageUrl(editingCv.photo)}
                        alt=""
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          const fb = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fb) fb.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: editingCv.photo ? 'none' : 'flex' }}
                      className="w-full h-full items-center justify-center bg-slate-300"
                    >
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="max-w-[54%] pr-4 z-10 relative">
                    <h1 className="font-josefin font-light text-3xl uppercase tracking-tight text-slate-800 m-0">
                      {editingCv.givenNames}
                    </h1>
                    <h2 className="font-josefin font-bold text-2xl uppercase tracking-tight mt-1 mb-2" style={{ color: 'var(--cv-navy, #1F3757)' }}>
                      {editingCv.familyNames}
                    </h2>
                    <p className="font-josefin font-semibold text-black uppercase tracking-[0.15em] text-xs">
                      {editingCv.role}
                    </p>
                  </div>
                </div>

                {/* Corps */}
                <div className="flex items-stretch">
                  <div
                    className="w-[38%] text-white p-6 rounded-tr-[100px] flex flex-col gap-6"
                    style={{ backgroundColor: 'var(--cv-navy, #1F3757)' }}
                  >
                    {editingCv.about && (
                      <div>
                        <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider text-white mb-2">À PROPOS</h3>
                        <p className="font-montserrat text-xs leading-relaxed text-slate-100 whitespace-pre-line m-0">{editingCv.about}</p>
                      </div>
                    )}
                    {editingCv.skills?.length > 0 && (
                      <div>
                        <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider text-white mb-2">COMPÉTENCES</h3>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-100 font-montserrat">
                          {editingCv.skills.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="w-[62%] p-6 flex flex-col gap-8">
                    {editingCv.experiences?.length > 0 && (
                      <div>
                        <div className="border-y-2 border-l-2 rounded-l-full py-1.5 pl-4 pr-2 mb-4" style={{ borderColor: '#BCC7D2' }}>
                          <h3 className="font-montserrat font-bold text-sm uppercase tracking-widest m-0" style={{ color: 'var(--cv-navy, #1F3757)' }}>
                            EXPÉRIENCE
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {editingCv.experiences.map((exp, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-bold text-slate-600 uppercase">{exp.title}</span>
                              <div className="flex justify-between font-bold text-slate-900 mt-0.5 mb-1">
                                <span>{exp.organization}</span>
                                <span>{exp.period}</span>
                              </div>
                              <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                                {exp.bullets?.map((b, bI) => (
                                  <li key={bI}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {editingCv.education?.length > 0 && (
                      <div>
                        <div className="border-y-2 border-l-2 rounded-l-full py-1.5 pl-4 pr-2 mb-4" style={{ borderColor: '#BCC7D2' }}>
                          <h3 className="font-montserrat font-bold text-sm uppercase tracking-widest m-0" style={{ color: 'var(--cv-navy, #1F3757)' }}>
                            FORMATION
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {editingCv.education.map((edu, i) => (
                            <div key={i} className="text-xs">
                              <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                                <span>{edu.institution}</span>
                                <span>{edu.period}</span>
                              </div>
                              <p className="text-slate-600 m-0">{edu.degree}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMATION SUPPRESSION ── */}
      {cvToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Supprimer ce CV ?</h3>
              <p className="text-sm text-slate-400 mt-1">
                Cette action est définitive. La fiche CV sera retirée du site et la photo du membre sur la page Gouvernance ne sera plus cliquable.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCvToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

