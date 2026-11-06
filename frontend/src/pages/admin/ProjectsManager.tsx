import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { Project, ProjectImage } from '../../types';
import { compressImage } from '../../utils/imageUrl';
import { translateFrTo, translateFrToAll } from '../../services/translationService';
import { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';
import type { TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';
import type { Lang } from '../../i18n';

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  hookTitle: '',
  location: '',
  type: '',
  status: 'En cours',
  description: '',
  color: 'bg-ba-red',
  image: '',
  images: [],
  title_en: '',
  location_en: '',
  type_en: '',
  description_en: '',
  needsReview_en: false,
  title_it: '',
  location_it: '',
  type_it: '',
  description_it: '',
  needsReview_it: false,
  title_de: '',
  location_de: '',
  type_de: '',
  description_de: '',
  needsReview_de: false,
};

const typeColors: Record<string, string> = {
  'Protection': 'bg-ba-red',
  'Santé': 'bg-ba-green',
  'Éducation': 'bg-orange-500',
  'Environnement': 'bg-emerald-500',
};

export default function ProjectsManager() {
  const { data, addProject, updateProject, deleteProject } = useAdminData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(emptyProject);
  const [isUploading, setIsUploading] = useState(false);
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

  const openAdd = () => {
    setForm(emptyProject);
    setFormLang('fr');
    setTranslateError(null);
    setIsAdding(true);
    setEditing(null);
    setSaveSuccess(false);
  };

  const openEdit = (item: Project) => {
    setForm({
      title: item.title,
      hookTitle: item.hookTitle || '',
      location: item.location,
      type: item.type || 'Protection',
      status: item.status || 'En cours',
      description: item.description,
      color: item.color || 'bg-ba-red',
      image: item.image,
      images: item.images || (item.image ? [{ id: '1', url: item.image, caption: 'Photo principale' }] : []),
      title_en: item.title_en || '',
      location_en: item.location_en || '',
      type_en: item.type_en || '',
      description_en: item.description_en || '',
      needsReview_en: item.needsReview_en || false,
      title_it: item.title_it || '',
      location_it: item.location_it || '',
      type_it: item.type_it || '',
      description_it: item.description_it || '',
      needsReview_it: item.needsReview_it || false,
      title_de: item.title_de || '',
      location_de: item.location_de || '',
      type_de: item.type_de || '',
      description_de: item.description_de || '',
      needsReview_de: item.needsReview_de || false,
    });
    setFormLang('fr');
    setTranslateError(null);
    setEditing(item);
    setIsAdding(false);
    setSaveSuccess(false);
  };

  const handleTranslateCurrentTab = async () => {
    if (formLang === 'fr') return;
    if (!form.title && !form.description) {
      alert("Veuillez d'abord renseigner le titre et la description en français.");
      return;
    }
    setIsTranslating(true);
    setTranslateError(null);
    const texts = [form.title || '', form.location || '', form.description || '', form.type || ''];
    const res = await translateFrTo(texts, formLang as 'en' | 'it' | 'de');
    if (res.success && res.translations) {
      const [tTitle, tLocation, tDesc, tType] = res.translations;
      setForm((prev) => ({
        ...prev,
        [`title_${formLang}`]: tTitle || (prev as any)[`title_${formLang}`],
        [`location_${formLang}`]: tLocation || (prev as any)[`location_${formLang}`],
        [`description_${formLang}`]: tDesc || (prev as any)[`description_${formLang}`],
        [`type_${formLang}`]: tType || (prev as any)[`type_${formLang}`],
        [`needsReview_${formLang}`]: true,
      }));
    } else {
      setTranslateError(res.error || `Erreur lors de la traduction vers ${formLang}.`);
    }
    setIsTranslating(false);
  };

  const handleTranslateAll = async () => {
    if (!form.title && !form.description) {
      alert("Veuillez d'abord renseigner le titre et la description en français.");
      return;
    }
    setIsTranslating(true);
    setTranslateError(null);
    const texts = [form.title || '', form.location || '', form.description || '', form.type || ''];
    const res = await translateFrToAll(texts);
    if (res.success && res.translations) {
      const { en, it, de } = res.translations;
      setForm((prev) => ({
        ...prev,
        title_en: en[0] || prev.title_en,
        location_en: en[1] || prev.location_en,
        description_en: en[2] || prev.description_en,
        type_en: en[3] || prev.type_en,
        needsReview_en: true,
        title_it: it[0] || prev.title_it,
        location_it: it[1] || prev.location_it,
        description_it: it[2] || prev.description_it,
        type_it: it[3] || prev.type_it,
        needsReview_it: true,
        title_de: de[0] || prev.title_de,
        location_de: de[1] || prev.location_de,
        description_de: de[2] || prev.description_de,
        type_de: de[3] || prev.type_de,
        needsReview_de: true,
      }));
    } else {
      setTranslateError(res.error || 'Erreur lors de la traduction globale.');
    }
    setIsTranslating(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Veuillez entrer le titre du projet.');
      return;
    }
    const firstPhotoUrl = form.images && form.images.length > 0 ? form.images[0].url : '';
    const coverUrl = form.image || firstPhotoUrl;
    const projectData: Omit<Project, 'id'> = {
      ...form,
      hookTitle: form.hookTitle?.trim() || '',
      color: typeColors[form.type] || form.color || 'bg-ba-red',
      image: coverUrl,
    };
    try {
      if (editing) { updateProject(editing.id, projectData); }
      else { addProject(projectData); }
      setSaveSuccess(true);
      setTimeout(() => { closeModal(); }, 400);
    } catch (err) {
      console.error('Save error:', err);
      alert('Une erreur est survenue lors de la sauvegarde.');
    }
  };

  const closeModal = () => { setEditing(null); setIsAdding(false); setSaveSuccess(false); };
  const handleDelete = (id: string) => { deleteProject(id); setDeleteConfirm(null); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const compressedDataUrls = await Promise.all(Array.from(files).map((file) => compressImage(file)));
      setForm((prev) => {
        const currentImages = prev.images || [];
        const newImages: ProjectImage[] = compressedDataUrls
          .filter((url) => Boolean(url))
          .map((url, idx) => ({
            id: String(Date.now() + Math.random() + idx),
            url,
            caption: files[idx] ? files[idx].name.replace(/\.[^/.]+$/, '') : `Photo ${currentImages.length + idx + 1}`,
          }));
        const updatedImages = [...currentImages, ...newImages];
        return { ...prev, images: updatedImages, image: prev.image || (updatedImages.length > 0 ? updatedImages[0].url : '') };
      });
    } catch (err) { console.error('Failed to compress images:', err); }
    finally { setIsUploading(false); e.target.value = ''; }
  };

  const removePhoto = (photoId: string) => {
    setForm((prev) => {
      const updatedImages = (prev.images || []).filter((img) => img.id !== photoId);
      const coverImage = prev.image === (prev.images || []).find((img) => img.id === photoId)?.url
        ? (updatedImages.length > 0 ? updatedImages[0].url : '') : prev.image;
      return { ...prev, images: updatedImages, image: coverImage };
    });
  };

  const setAsCover = (url: string) => setForm((prev) => ({ ...prev, image: url }));

  const insertPhotoTagIntoDescription = (index: number) => {
    const tag = `\n[photo:${index + 1}]\n`;
    setForm((prev) => ({ ...prev, description: prev.description + tag }));
  };

  const updateCaption = (photoId: string, caption: string) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) => (img.id === photoId ? { ...img, caption } : img)),
    }));
  };


  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
          Gérez les projets, uploadez plusieurs photos et insérez-les dans les paragraphes.
        </p>
        <button className="admin-btn admin-btn-red" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau projet
        </button>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Projet & Photos</th>
                <th>Lieu</th>
                <th>Type</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((project) => {
                const photoCount = project.images ? project.images.length : (project.image ? 1 : 0);
                return (
                  <tr key={project.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 54, height: 54, borderRadius: '0.625rem', overflow: 'hidden', flexShrink: 0, background: '#1E293B', position: 'relative' }}>
                          {project.image ? (
                            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" fill="none" stroke="#475569" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                              </svg>
                            </div>
                          )}
                          {photoCount > 1 && (
                            <span style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,0.75)', color: '#FFF', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                              +{photoCount}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{project.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#E5E7EB', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '280px' }}>
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#FFFFFF', fontSize: '0.875rem' }}>{project.location}</td>
                    <td><span style={{ fontSize: '0.8rem', color: '#E5E7EB', fontWeight: 600 }}>{project.type}</span></td>
                    <td><span style={{ fontSize: '0.8rem', color: '#E5E7EB', fontWeight: 600 }}>{project.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEdit(project)} style={{ background: 'none', border: 'none', color: '#E5E7EB', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.8rem', padding: '0.375rem 0' }}>Modifier</button>
                        <button onClick={() => setDeleteConfirm(project.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.375rem', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data.projects.length === 0 && (
          <div className="admin-empty">
            <p style={{ color: '#E5E7EB' }}>Aucun projet. Cliquez sur "Nouveau projet" pour en créer un.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editing ? 'Modifier le projet' : 'Nouveau projet'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Language tabs */}
                <AdminLanguageTabs
                  currentLang={formLang}
                  onLangChange={setFormLang}
                  onTranslateTab={formLang !== 'fr' ? handleTranslateCurrentTab : undefined}
                  onTranslateAll={handleTranslateAll}
                  isTranslating={isTranslating}
                  translateError={translateError}
                  statusByLang={statusByLang}
                />

                {/* FR Fields */}
                {formLang === 'fr' && (
                  <>
                    <div>
                      <label className="admin-label">Titre du projet *</label>
                      <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Construction de l'École Espoir" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label className="admin-label" style={{ marginBottom: 0 }}>Titre d'accroche pour la page d'accueil</label>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{(form.hookTitle || '').length}/80 car. (optionnel)</span>
                      </div>
                      <input type="text" maxLength={80} className="admin-input" value={form.hookTitle || ''} onChange={(e) => setForm({ ...form, hookTitle: e.target.value })} placeholder="Ex: ÉDUCATION INCLUSIVE : DES ENFANTS HANDICAPÉS ENFIN À L'ÉCOLE" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="admin-label">Localisation</label>
                        <input type="text" className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Goma, Nord-Kivu" />
                      </div>
                      <div>
                        <label className="admin-label">Type d'intervention</label>
                        <select className="admin-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                          <option value="">— Choisir —</option>
                          <option value="Protection">Protection</option>
                          <option value="Santé">Santé</option>
                          <option value="Éducation">Éducation</option>
                          <option value="Environnement">Environnement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Statut d'avancement</label>
                      <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
                        <option value="En cours">En cours</option>
                        <option value="Achevé">Achevé</option>
                        <option value="En planification">En planification</option>
                      </select>
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

                    <div>
                      <label className="admin-label">Titre ({formLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(form as any)[`title_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`title_${formLang}`]: e.target.value })}
                        placeholder={`Titre en ${formLang.toUpperCase()}`}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Localisation ({formLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(form as any)[`location_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`location_${formLang}`]: e.target.value })}
                        placeholder={`Localisation en ${formLang.toUpperCase()}`}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Type d'intervention ({formLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(form as any)[`type_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`type_${formLang}`]: e.target.value })}
                        placeholder={`Type en ${formLang.toUpperCase()}`}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Description ({formLang.toUpperCase()})</label>
                      <textarea
                        className="admin-textarea"
                        rows={6}
                        value={(form as any)[`description_${formLang}`] || ''}
                        onChange={(e) => setForm({ ...form, [`description_${formLang}`]: e.target.value })}
                        placeholder={`Description complète en ${formLang.toUpperCase()}...`}
                      />
                    </div>
                  </>
                )}

                {/* Photos (always visible) */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0 }}>Photos du projet ({form.images ? form.images.length : 0})</label>
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', border: '2px dashed #4B5563', borderRadius: '0.75rem', background: '#1F2937', cursor: 'pointer', textAlign: 'center', marginBottom: '1rem' }}>
                    <svg width="32" height="32" fill="none" stroke="#E30613" viewBox="0 0 24 24" strokeWidth={1.5} style={{ marginBottom: '0.5rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>
                      {isUploading ? 'Chargement et optimisation des images...' : 'Cliquez pour uploader une ou plusieurs photos'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>JPG, PNG, WEBP — compressés automatiquement en WebP.</span>
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={isUploading} style={{ display: 'none' }} />
                  </label>

                  {form.images && form.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
                      {form.images.map((img, idx) => {
                        const isCover = form.image === img.url;
                        return (
                          <div key={img.id} style={{ background: '#1F2937', borderRadius: '0.625rem', overflow: 'hidden', border: isCover ? '2px solid #E30613' : '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', height: '110px', background: '#111827' }}>
                              <img src={img.url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <span style={{ position: 'absolute', top: 4, left: 4, background: '#E30613', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>[photo:{idx + 1}]</span>
                              {isCover && <span style={{ position: 'absolute', top: 4, right: 4, background: '#1A8F0A', color: '#FFF', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Couverture</span>}
                            </div>
                            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                              <input type="text" className="admin-input" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} value={img.caption || ''} onChange={(e) => updateCaption(img.id, e.target.value)} placeholder="Légende de la photo..." />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' }}>
                                {!isCover && (
                                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center' }} onClick={() => setAsCover(img.url)}>Couverture</button>
                                )}
                                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center' }} onClick={() => insertPhotoTagIntoDescription(idx)}>Placer dans le texte</button>
                                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center' }} onClick={() => removePhoto(img.id)}>Supprimer</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center', padding: '0.5rem' }}>Aucune photo téléversée pour ce projet.</div>
                  )}
                </div>

                {/* Description FR (always visible in FR tab) */}
                {formLang === 'fr' && (
                  <div>
                    <label className="admin-label">Description & Paragraphes</label>
                    <textarea className="admin-textarea" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Rédigez ici la description complète. Utilisez [photo:1], [photo:2]... pour placer des photos entre les paragraphes." />
                  </div>
                )}

                {saveSuccess && (
                  <div style={{ background: 'rgba(26,143,10,0.2)', border: '1px solid rgba(26,143,10,0.4)', color: '#4ADE80', padding: '0.75rem 1rem', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Projet enregistré avec succès !
                  </div>
                )}

              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="admin-btn admin-btn-green" onClick={handleSave} disabled={isUploading}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                {editing ? 'Sauvegarder les modifications' : 'Créer le projet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="28" height="28" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#F1F5F9', marginBottom: '0.5rem' }}>Supprimer ce projet ?</h3>
            <p style={{ color: '#E5E7EB', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
