const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/admin/ProjectsManager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports
content = content.replace(
  "import { useState } from 'react';",
  "import { useState } from 'react';\nimport { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';\nimport { translateFrToEn } from '../../services/translationService';"
);

// 2. emptyProject
content = content.replace(
  `const emptyProject: Omit<Project, 'id'> = {
  title: '',
  hookTitle: '',
  location: '',
  type: '',
  status: 'En cours',
  description: '',
  color: 'bg-ba-red',
  image: '',
  images: [],
};`,
  `const emptyProject: Omit<Project, 'id'> = {
  title: '',
  title_en: '',
  hookTitle: '',
  location: '',
  location_en: '',
  type: '',
  type_en: '',
  status: 'En cours',
  status_en: '',
  description: '',
  description_en: '',
  color: 'bg-ba-red',
  image: '',
  images: [],
  needsReview_en: false,
};`
);

// 3. State hooks in ProjectsManager
content = content.replace(
  `  const [saveSuccess, setSaveSuccess] = useState(false);`,
  `  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formLang, setFormLang] = useState<'fr' | 'en'>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);`
);

// 4. openAdd & openEdit
content = content.replace(
  `  const openAdd = () => {
    setForm(emptyProject);
    setIsAdding(true);
    setEditing(null);
    setSaveSuccess(false);
  };`,
  `  const openAdd = () => {
    setForm(emptyProject);
    setIsAdding(true);
    setEditing(null);
    setSaveSuccess(false);
    setFormLang('fr');
    setTranslateError(null);
  };`
);

content = content.replace(
  `  const openEdit = (item: Project) => {
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
    });
    setEditing(item);
    setIsAdding(false);
    setSaveSuccess(false);
  };`,
  `  const openEdit = (item: Project) => {
    setForm({
      title: item.title,
      title_en: item.title_en || '',
      hookTitle: item.hookTitle || '',
      location: item.location,
      location_en: item.location_en || '',
      type: item.type || 'Protection',
      type_en: item.type_en || '',
      status: item.status || 'En cours',
      status_en: item.status_en || '',
      description: item.description,
      description_en: item.description_en || '',
      color: item.color || 'bg-ba-red',
      image: item.image,
      images: item.images || (item.image ? [{ id: '1', url: item.image, caption: 'Photo principale' }] : []),
      needsReview_en: item.needsReview_en || false,
    });
    setEditing(item);
    setIsAdding(false);
    setSaveSuccess(false);
    setFormLang('fr');
    setTranslateError(null);
  };`
);

// 5. handleAutoTranslate
const handleAutoTranslateFn = `
  const handleAutoTranslate = async () => {
    if (!form.title && !form.description) {
      alert("Veuillez d'abord renseigner le titre et la description en français.");
      return;
    }
    setIsTranslating(true);
    setTranslateError(null);
    const texts = [
      form.title || '',
      form.location || '',
      form.description || '',
      form.type || '',
    ];
    const res = await translateFrToEn(texts);
    if (res.success && res.translations) {
      const [tTitle, tLocation, tDesc, tType] = res.translations;
      setForm((prev) => ({
        ...prev,
        title_en: tTitle || prev.title_en,
        location_en: tLocation || prev.location_en,
        description_en: tDesc || prev.description_en,
        type_en: tType || prev.type_en,
        needsReview_en: true,
      }));
    } else {
      setTranslateError(res.error || 'Erreur lors de la traduction');
    }
    setIsTranslating(false);
  };
`;

content = content.replace(
  `  const handleSave = () => {`,
  `${handleAutoTranslateFn}\n  const handleSave = () => {`
);

// 6. Modal Inputs - Wrap in Language Tabs
const oldInputs = `              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Title */}
                <div>
                  <label className="admin-label">Titre du projet</label>
                  <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Construction de l'École Espoir" />
                </div>

                {/* Titre d'accroche pour la page d'accueil (optionnel, 80 caractères max) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0 }}>Titre d'accroche pour la page d'accueil</label>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {(form.hookTitle || '').length}/80 car. (optionnel)
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    className="admin-input"
                    value={form.hookTitle || ''}
                    onChange={(e) => setForm({ ...form, hookTitle: e.target.value })}
                    placeholder="Ex: ÉDUCATION INCLUSIVE : DES ENFANTS HANDICAPÉS ENFIN À L'ÉCOLE"
                  />
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                    Accroche percutante pour le grand titre du hero (6 à 10 mots, 70 car. max). Si vide, une accroche sera générée automatiquement.
                  </span>
                </div>

                {/* Location & Type */}
                <div className="admin-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                {/* Status */}
                <div>
                  <label className="admin-label">Statut d'avancement</label>
                  <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
                    <option value="En cours">En cours</option>
                    <option value="Achevé">Achevé</option>
                    <option value="En planification">En planification</option>
                  </select>
                </div>`;

const newInputs = `              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Language Switcher Tabs */}
                <AdminLanguageTabs
                  currentLang={formLang}
                  onLangChange={setFormLang}
                  onAutoTranslate={handleAutoTranslate}
                  isTranslating={isTranslating}
                  hasAutoTranslateError={translateError}
                  needsReview={form.needsReview_en}
                />

                {formLang === 'fr' ? (
                  <>
                    {/* Title FR */}
                    <div>
                      <label className="admin-label">Titre du projet (Français - Obligatoire)</label>
                      <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Construction de l'École Espoir" />
                    </div>

                    {/* Titre d'accroche pour la page d'accueil */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label className="admin-label" style={{ marginBottom: 0 }}>Titre d'accroche pour la page d'accueil</label>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {(form.hookTitle || '').length}/80 car. (optionnel)
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={80}
                        className="admin-input"
                        value={form.hookTitle || ''}
                        onChange={(e) => setForm({ ...form, hookTitle: e.target.value })}
                        placeholder="Ex: ÉDUCATION INCLUSIVE : DES ENFANTS HANDICAPÉS ENFIN À L'ÉCOLE"
                      />
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                        Accroche percutante pour le grand titre du hero (6 à 10 mots, 70 car. max). Si vide, une accroche sera générée automatiquement.
                      </span>
                    </div>

                    {/* Location & Type FR */}
                    <div className="admin-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="admin-label">Localisation (Français)</label>
                        <input type="text" className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Goma, Nord-Kivu" />
                      </div>
                      <div>
                        <label className="admin-label">Type d'intervention (Français)</label>
                        <select className="admin-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                          <option value="">— Choisir —</option>
                          <option value="Protection">Protection</option>
                          <option value="Santé">Santé</option>
                          <option value="Éducation">Éducation</option>
                          <option value="Environnement">Environnement</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Title EN */}
                    <div>
                      <label className="admin-label">Project Title (English)</label>
                      <input type="text" className="admin-input" value={form.title_en || ''} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Ex: Inclusive Schools & Educational Equity" />
                    </div>

                    {/* Location & Type EN */}
                    <div className="admin-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="admin-label">Location (English)</label>
                        <input type="text" className="admin-input" value={form.location_en || ''} onChange={(e) => setForm({ ...form, location_en: e.target.value })} placeholder="Ex: Beni, North Kivu, DRC" />
                      </div>
                      <div>
                        <label className="admin-label">Intervention Type (English)</label>
                        <input type="text" className="admin-input" value={form.type_en || ''} onChange={(e) => setForm({ ...form, type_en: e.target.value })} placeholder="Ex: Inclusive Education" />
                      </div>
                    </div>
                  </>
                )}

                {/* Status (Shared) */}
                <div>
                  <label className="admin-label">Statut d'avancement</label>
                  <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
                    <option value="En cours">En cours</option>
                    <option value="Achevé">Achevé</option>
                    <option value="En planification">En planification</option>
                  </select>
                </div>`;

content = content.replace(oldInputs, newInputs);

// 7. Description FR vs EN
const oldDesc = `                {/* Description */}
                <div>
                  <label className="admin-label">Description du projet</label>
                  <textarea rows={5} className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez les objectifs, les activités et les résultats du projet..." />
                </div>`;

const newDesc = `                {/* Description FR vs EN */}
                {formLang === 'fr' ? (
                  <div>
                    <label className="admin-label">Description du projet (Français - Obligatoire)</label>
                    <textarea rows={5} className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez les objectifs, les activités et les résultats du projet..." />
                  </div>
                ) : (
                  <div>
                    <label className="admin-label">Project Description (English)</label>
                    <textarea rows={5} className="admin-textarea" value={form.description_en || ''} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Describe the objectives, activities and results of the project..." />
                  </div>
                )}`;

content = content.replace(oldDesc, newDesc);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ProjectsManager.tsx successfully updated!');

