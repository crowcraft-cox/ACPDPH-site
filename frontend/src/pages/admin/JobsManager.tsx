import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { JobOffer } from '../../types';
import { translateFrTo, translateFrToAll } from '../../services/translationService';
import { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';
import type { TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';
import type { Lang } from '../../i18n';

const emptyJob: Omit<JobOffer, 'id' | 'createdAt'> = {
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
  title_en: '',
  location_en: '',
  contractType_en: '',
  description_en: '',
  missions_en: [],
  profile_en: '',
  applicationDossier_en: '',
  needsReview_en: false,
  title_it: '',
  location_it: '',
  contractType_it: '',
  description_it: '',
  missions_it: [],
  profile_it: '',
  applicationDossier_it: '',
  needsReview_it: false,
  title_de: '',
  location_de: '',
  contractType_de: '',
  description_de: '',
  missions_de: [],
  profile_de: '',
  applicationDossier_de: '',
  needsReview_de: false,
};

export default function JobsManager() {
  const { data, addJob, updateJob, deleteJob } = useAdminData();
  const jobs = data.jobs || [];

  const [editing, setEditing] = useState<JobOffer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<JobOffer, 'id' | 'createdAt'>>(emptyJob);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formLang, setFormLang] = useState<Lang>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const getTabStatus = (lang: 'en' | 'it' | 'de'): TranslationTabStatus => {
    const hasContent = Boolean(
      (form as any)[`title_${lang}`] ||
      (form as any)[`description_${lang}`]
    );
    if (!hasContent) return 'Manquant';
    return (form as any)[`needsReview_${lang}`] ? 'À relire' : 'Relu';
  };

  const statusByLang: Partial<Record<Lang, TranslationTabStatus>> = {
    en: getTabStatus('en'),
    it: getTabStatus('it'),
    de: getTabStatus('de'),
  };

  const openAdd = () => { setForm(emptyJob); setFormLang('fr'); setTranslateError(null); setIsAdding(true); setEditing(null); setSaveSuccess(false); };

  const openEdit = (item: JobOffer) => {
    const it = item as any;
    setForm({
      title: item.title,
      location: item.location,
      contractType: item.contractType,
      contractPrecision: item.contractPrecision || '',
      description: item.description || '',
      missions: item.missions && item.missions.length > 0 ? [...item.missions] : [''],
      profile: item.profile || '',
      applicationDossier: item.applicationDossier || '',
      deadline: item.deadline || '',
      applicationLink: item.applicationLink || '',
      title_en: it.title_en || '',
      location_en: it.location_en || '',
      contractType_en: it.contractType_en || '',
      description_en: it.description_en || '',
      missions_en: it.missions_en || [],
      profile_en: it.profile_en || '',
      applicationDossier_en: it.applicationDossier_en || '',
      needsReview_en: it.needsReview_en || false,
      title_it: it.title_it || '',
      location_it: it.location_it || '',
      contractType_it: it.contractType_it || '',
      description_it: it.description_it || '',
      missions_it: it.missions_it || [],
      profile_it: it.profile_it || '',
      applicationDossier_it: it.applicationDossier_it || '',
      needsReview_it: it.needsReview_it || false,
      title_de: it.title_de || '',
      location_de: it.location_de || '',
      contractType_de: it.contractType_de || '',
      description_de: it.description_de || '',
      missions_de: it.missions_de || [],
      profile_de: it.profile_de || '',
      applicationDossier_de: it.applicationDossier_de || '',
      needsReview_de: it.needsReview_de || false,
    });
    setFormLang('fr');
    setTranslateError(null);
    setEditing(item);
    setIsAdding(false);
    setSaveSuccess(false);
  };

  const handleTranslateCurrentTab = async () => {
    if (formLang === 'fr') return;
    if (!form.title) { alert("Veuillez d'abord renseigner le titre en français."); return; }
    setIsTranslating(true);
    setTranslateError(null);
    const missionsText = (form.missions || []).join('\n');
    const texts = [form.title || '', form.location || '', form.contractType || '', form.description || '', form.profile || '', form.applicationDossier || '', missionsText];
    const res = await translateFrTo(texts, formLang as 'en' | 'it' | 'de');
    if (res.success && res.translations) {
      const [tTitle, tLocation, tContractType, tDesc, tProfile, tDossier, tMissions] = res.translations;
      setForm((prev) => ({
        ...prev,
        [`title_${formLang}`]: tTitle || (prev as any)[`title_${formLang}`],
        [`location_${formLang}`]: tLocation || (prev as any)[`location_${formLang}`],
        [`contractType_${formLang}`]: tContractType || (prev as any)[`contractType_${formLang}`],
        [`description_${formLang}`]: tDesc || (prev as any)[`description_${formLang}`],
        [`profile_${formLang}`]: tProfile || (prev as any)[`profile_${formLang}`],
        [`applicationDossier_${formLang}`]: tDossier || (prev as any)[`applicationDossier_${formLang}`],
        [`missions_${formLang}`]: tMissions ? tMissions.split('\n').filter(Boolean) : (prev as any)[`missions_${formLang}`],
        [`needsReview_${formLang}`]: true,
      }));
    } else {
      setTranslateError(res.error || `Erreur lors de la traduction vers ${formLang}.`);
    }
    setIsTranslating(false);
  };

  const handleTranslateAll = async () => {
    if (!form.title) { alert("Veuillez d'abord renseigner le titre en français."); return; }
    setIsTranslating(true);
    setTranslateError(null);
    const missionsText = (form.missions || []).join('\n');
    const texts = [form.title || '', form.location || '', form.contractType || '', form.description || '', form.profile || '', form.applicationDossier || '', missionsText];
    const res = await translateFrToAll(texts);
    if (res.success && res.translations) {
      const { en, it, de } = res.translations;
      setForm((prev) => ({
        ...prev,
        title_en: en[0] || (prev as any).title_en,
        location_en: en[1] || (prev as any).location_en,
        contractType_en: en[2] || (prev as any).contractType_en,
        description_en: en[3] || (prev as any).description_en,
        profile_en: en[4] || (prev as any).profile_en,
        applicationDossier_en: en[5] || (prev as any).applicationDossier_en,
        missions_en: en[6] ? en[6].split('\n').filter(Boolean) : (prev as any).missions_en,
        needsReview_en: true,
        title_it: it[0] || (prev as any).title_it,
        location_it: it[1] || (prev as any).location_it,
        contractType_it: it[2] || (prev as any).contractType_it,
        description_it: it[3] || (prev as any).description_it,
        profile_it: it[4] || (prev as any).profile_it,
        applicationDossier_it: it[5] || (prev as any).applicationDossier_it,
        missions_it: it[6] ? it[6].split('\n').filter(Boolean) : (prev as any).missions_it,
        needsReview_it: true,
        title_de: de[0] || (prev as any).title_de,
        location_de: de[1] || (prev as any).location_de,
        contractType_de: de[2] || (prev as any).contractType_de,
        description_de: de[3] || (prev as any).description_de,
        profile_de: de[4] || (prev as any).profile_de,
        applicationDossier_de: de[5] || (prev as any).applicationDossier_de,
        missions_de: de[6] ? de[6].split('\n').filter(Boolean) : (prev as any).missions_de,
        needsReview_de: true,
      }));
    } else {
      setTranslateError(res.error || 'Erreur lors de la traduction globale.');
    }
    setIsTranslating(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) { alert("Veuillez entrer le titre de l'offre d'emploi."); return; }
    if (!form.location.trim()) { alert('Veuillez préciser le lieu de travail.'); return; }
    const cleanedMissions = (form.missions || []).map((m) => m.trim()).filter((m) => m.length > 0);
    const payload = { ...form, title: form.title.trim(), location: form.location.trim(), contractPrecision: form.contractPrecision?.trim() || '', description: form.description?.trim() || '', missions: cleanedMissions, profile: form.profile?.trim() || '', applicationDossier: form.applicationDossier?.trim() || '', deadline: form.deadline?.trim() || '', applicationLink: form.applicationLink?.trim() || '' };
    if (editing) { updateJob(editing.id, payload); } else { addJob(payload); }
    setEditing(null); setIsAdding(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string) => { deleteJob(id); setDeleteConfirm(null); };
  const addMissionField = () => setForm((prev) => ({ ...prev, missions: [...(prev.missions || []), ''] }));
  const updateMissionField = (index: number, val: string) => setForm((prev) => { const next = [...(prev.missions || [])]; next[index] = val; return { ...prev, missions: next }; });
  const removeMissionField = (index: number) => setForm((prev) => { const next = (prev.missions || []).filter((_, i) => i !== index); return { ...prev, missions: next.length > 0 ? next : [''] }; });


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Gestion des Offres d'Emploi & Stages</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Publiez et gérez les offres d'emploi, avis de recrutement et opportunités de stage.</p>
        </div>
        <button className="admin-btn admin-btn-blue" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Ajouter une offre
        </button>
      </div>

      {saveSuccess && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ADE80', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Offre d'emploi enregistrée et synchronisée avec succès !
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1rem' }}>Aucune offre d'emploi active pour le moment.</p>
          <button className="admin-btn admin-btn-blue" onClick={openAdd}>Créer la première offre</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {jobs.map((job) => {
            const isClosed = job.deadline ? new Date(job.deadline) < new Date(new Date().setHours(0, 0, 0, 0)) : false;
            return (
              <div key={job.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: job.contractType === 'CDI' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: job.contractType === 'CDI' ? '#4ADE80' : '#60A5FA' }}>
                      {job.contractType} {job.contractPrecision ? `(${job.contractPrecision})` : ''}
                    </span>
                    {isClosed ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#EF4444', background: 'rgba(239,68,68,0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Clôturé</span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#22C55E' }}>En cours</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.5rem' }}>{job.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    <span>{job.location}</span>
                  </div>
                  {job.deadline && (
                    <div style={{ color: '#CBD5E1', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Date limite : {job.deadline}</div>
                  )}
                  {job.description && (
                    <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                  <button className="admin-btn admin-btn-ghost" style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', justifyContent: 'center' }} onClick={() => openEdit(job)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    Modifier
                  </button>
                  <button className="admin-btn admin-btn-red" style={{ padding: '0.4rem 0.75rem' }} onClick={() => setDeleteConfirm(job.id)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>
                {editing ? "Modifier l'offre d'emploi" : "Ajouter une nouvelle offre d'emploi"}
              </h3>
              <button className="admin-btn admin-btn-ghost admin-btn-icon" onClick={() => { setIsAdding(false); setEditing(null); }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <AdminLanguageTabs
              currentLang={formLang}
              onLangChange={setFormLang}
              onTranslateTab={formLang !== 'fr' ? handleTranslateCurrentTab : undefined}
              onTranslateAll={handleTranslateAll}
              isTranslating={isTranslating}
              translateError={translateError}
              statusByLang={statusByLang}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* FR Fields */}
              {formLang === 'fr' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-label">Intitulé du poste *</label>
                    <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex : Chargé(e) de Plaidoyer Juridique" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Lieu de travail *</label>
                      <input type="text" className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex : Beni (Nord-Kivu, RDC)" />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Type de contrat *</label>
                      <select className="admin-input" value={form.contractType} onChange={(e) => setForm({ ...form, contractType: e.target.value as any })}>
                        <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                        <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                        <option value="Stage">Stage Professionnel</option>
                        <option value="Consultance">Consultance / Prestation</option>
                        <option value="Bénévolat">Bénévolat / Volontariat</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Précision du contrat</label>
                      <input type="text" className="admin-input" value={form.contractPrecision} onChange={(e) => setForm({ ...form, contractPrecision: e.target.value })} placeholder="Ex : 12 mois, Temps plein" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Date limite de dépôt (optionnel)</label>
                      <input type="date" className="admin-input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Lien externe pour postuler (optionnel)</label>
                      <input type="url" className="admin-input" value={form.applicationLink} onChange={(e) => setForm({ ...form, applicationLink: e.target.value })} placeholder="Laisser vide pour recevoir par email" />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Description générale du poste</label>
                    <textarea className="admin-textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Contexte, objectifs du poste et impact attendu..." />
                  </div>
                  <div className="admin-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Missions principales</label>
                      <button type="button" onClick={addMissionField} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>+ Ajouter une mission</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(form.missions || []).map((mission, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input type="text" className="admin-input" value={mission} onChange={(e) => updateMissionField(idx, e.target.value)} placeholder={`Mission ${idx + 1}...`} />
                          {(form.missions || []).length > 1 && (
                            <button type="button" onClick={() => removeMissionField(idx)} style={{ padding: '0.5rem', borderRadius: '0.375rem', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Profil & Compétences requises</label>
                    <textarea className="admin-textarea" rows={4} value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} placeholder="Diplômes, expériences professionnelles requises, compétences linguistiques..." />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Composition du dossier de candidature</label>
                    <textarea className="admin-textarea" rows={3} value={form.applicationDossier} onChange={(e) => setForm({ ...form, applicationDossier: e.target.value })} placeholder="Pièces à fournir (CV, lettre de motivation, attestations, copies diplômes...)" />
                  </div>
                </>
              )}

              {/* Non-FR Fields (en, it, de) */}
              {formLang !== 'fr' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      Langue : <strong style={{ color: '#F1F5F9' }}>{formLang.toUpperCase()}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const key = `needsReview_${formLang}` as keyof typeof form;
                        setForm((prev) => ({ ...prev, [key]: !(prev as any)[key] }));
                      }}
                      style={{
                        background: (form as any)[`needsReview_${formLang}`] ? 'rgba(234,179,8,0.15)' : 'rgba(16,185,129,0.15)',
                        color: (form as any)[`needsReview_${formLang}`] ? '#FDE68A' : '#A7F3D0',
                        border: `1px solid ${(form as any)[`needsReview_${formLang}`] ? '#F59E0B' : '#10B981'}`,
                        borderRadius: '0.375rem',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {(form as any)[`needsReview_${formLang}`] ? 'Marquer comme relu' : 'Statut : Relu'}
                    </button>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Intitulé du poste ({formLang.toUpperCase()}) *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={(form as any)[`title_${formLang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`title_${formLang}`]: e.target.value })}
                      placeholder={`Intitulé du poste en ${formLang.toUpperCase()}`}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Lieu ({formLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(form as any)[`location_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`location_${formLang}`]: e.target.value })}
                        placeholder={`Lieu en ${formLang.toUpperCase()}`}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Type de contrat ({formLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(form as any)[`contractType_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`contractType_${formLang}`]: e.target.value })}
                        placeholder={`Type de contrat en ${formLang.toUpperCase()}`}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Description ({formLang.toUpperCase()})</label>
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      value={(form as any)[`description_${formLang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`description_${formLang}`]: e.target.value })}
                      placeholder={`Description du poste en ${formLang.toUpperCase()}...`}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Missions ({formLang.toUpperCase()}) — une par ligne</label>
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      value={((form as any)[`missions_${formLang}`] || []).join('\n')}
                      onChange={(e) => setForm({ ...form, [`missions_${formLang}`]: e.target.value.split('\n') })}
                      placeholder={`Missions en ${formLang.toUpperCase()} (une par ligne)...`}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Profil ({formLang.toUpperCase()})</label>
                    <textarea
                      className="admin-textarea"
                      rows={4}
                      value={(form as any)[`profile_${formLang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`profile_${formLang}`]: e.target.value })}
                      placeholder={`Profil et compétences requises en ${formLang.toUpperCase()}...`}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Dossier de candidature ({formLang.toUpperCase()})</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={(form as any)[`applicationDossier_${formLang}`] || ''}
                      onChange={(e) => setForm({ ...form, [`applicationDossier_${formLang}`]: e.target.value })}
                      placeholder={`Composition du dossier de candidature en ${formLang.toUpperCase()}...`}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setIsAdding(false); setEditing(null); }}>Annuler</button>
              <button className="admin-btn admin-btn-blue" onClick={handleSave}>{editing ? 'Enregistrer les modifications' : "Publier l'offre"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#EF4444', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.5rem' }}>Confirmer la suppression</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="admin-btn admin-btn-red" onClick={() => handleDelete(deleteConfirm)}>Supprimer définitivement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
