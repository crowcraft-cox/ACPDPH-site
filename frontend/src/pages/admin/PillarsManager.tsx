import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { Pillar } from '../../types';

const emptyPillar: Omit<Pillar, 'id'> = {
  title: '',
  description: '',
  image: '',
  color: 'ba-blue',
  gradient: 'from-blue-600/15 to-blue-800/5',
  bulletPoints: ['', ''],
};

export default function PillarsManager() {
  const { data, addPillar, updatePillar, deletePillar } = useAdminData();
  const [editing, setEditing] = useState<Pillar | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPillar);

  const openAdd = () => {
    setForm(emptyPillar);
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: Pillar) => {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image,
      color: item.color,
      gradient: item.gradient,
      bulletPoints: [...item.bulletPoints],
    });
    setEditing(item);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const cleanedBullets = form.bulletPoints.filter(b => b.trim());
    const pillarData = { ...form, bulletPoints: cleanedBullets };

    if (editing) {
      updatePillar(editing.id, pillarData);
    } else {
      addPillar(pillarData);
    }
    closeModal();
  };

  const closeModal = () => {
    setEditing(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deletePillar(id);
    setDeleteConfirm(null);
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...form.bulletPoints];
    newBullets[index] = value;
    setForm({ ...form, bulletPoints: newBullets });
  };

  const addBullet = () => {
    setForm({ ...form, bulletPoints: [...form.bulletPoints, ''] });
  };

  const removeBullet = (index: number) => {
    setForm({ ...form, bulletPoints: form.bulletPoints.filter((_, i) => i !== index) });
  };

  const colorToGradient = (_color: 'ba-red' | 'ba-green' | 'ba-blue') => {
    return 'from-blue-600/15 to-blue-800/5';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
          Gérez les piliers d'intervention de l'ACPDPH.
        </p>
        <button className="admin-btn admin-btn-blue" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {data.pillars.map((pillar) => (
          <div key={pillar.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Image preview */}
            <div style={{ height: '140px', background: '#1E293B', position: 'relative', overflow: 'hidden' }}>
              {pillar.image ? (
                <img src={pillar.image} alt={pillar.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" fill="none" stroke="#475569" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5" />
                  </svg>
                </div>
              )}
              <span className="admin-badge admin-badge-blue"
                style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                Pilier ACPDPH
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                {pillar.title}
              </h3>
              <p style={{ color: '#E5E7EB', fontSize: '0.825rem', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {pillar.description}
              </p>

              {/* Bullet points preview */}
              {pillar.bulletPoints.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {pillar.bulletPoints.slice(0, 2).map((bp, i) => (
                    <div key={i} style={{ fontSize: '0.75rem', color: '#FFFFFF', display: 'flex', gap: '0.375rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: pillar.color === 'ba-red' ? '#FF4D57' : '#3DD632' }}>●</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1 }} onClick={() => openEdit(pillar)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  Modifier
                </button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm(pillar.id)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.pillars.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty">
            <p style={{ color: '#64748B' }}>Aucun pilier. Cliquez sur "Ajouter" pour en créer un.</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editing ? 'Modifier le pilier' : 'Nouveau pilier'}
              </h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Titre</label>
                  <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Protection de l'Enfant" />
                </div>
                <div>
                  <label className="admin-label">Description</label>
                  <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description détaillée du pilier..." />
                </div>
                <div>
                  <label className="admin-label">URL de l'image</label>
                  <input type="text" className="admin-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Ex: /pillars/protection.jpg" />
                </div>
                <div>
                  <label className="admin-label">Couleur d'accent</label>
                  <select className="admin-select" value={form.color} onChange={(e) => {
                    const color = e.target.value as 'ba-red' | 'ba-green' | 'ba-blue';
                    setForm({ ...form, color, gradient: colorToGradient(color) });
                  }}>
                    <option value="ba-blue">Bleu Principal (ACPDPH)</option>
                    <option value="ba-red">Bleu Cobalt</option>
                    <option value="ba-green">Bleu Océan</option>
                  </select>
                </div>

                {/* Bullet points */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0 }}>Points clés</label>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addBullet} type="button">
                      + Ajouter
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {form.bulletPoints.map((bp, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" className="admin-input" value={bp} onChange={(e) => updateBullet(i, e.target.value)} placeholder="Point clé..." />
                        <button className="admin-btn admin-btn-danger admin-btn-icon admin-btn-sm" onClick={() => removeBullet(i)} type="button">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="admin-btn admin-btn-blue" onClick={handleSave}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {editing ? 'Sauvegarder' : 'Créer'}
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
              <svg width="28" height="28" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#F1F5F9', marginBottom: '0.5rem' }}>
              Supprimer ce pilier ?
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Cette action est irréversible.
            </p>
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
