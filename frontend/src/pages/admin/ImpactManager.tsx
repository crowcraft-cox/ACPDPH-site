import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { ImpactCounter } from '../../types';

export default function ImpactManager() {
  const { data, addImpact, updateImpact, deleteImpact } = useAdminData();
  const [editing, setEditing] = useState<ImpactCounter | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState({ value: 0, label: '', color: 'ba-blue' as 'ba-red' | 'ba-green' | 'ba-blue' });

  const openAdd = () => {
    setForm({ value: 0, label: '', color: 'ba-blue' });
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: ImpactCounter) => {
    setForm({ value: item.value, label: item.label, color: item.color });
    setEditing(item);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.label.trim()) return;
    if (editing) {
      updateImpact(editing.id, form);
    } else {
      addImpact(form);
    }
    closeModal();
  };

  const closeModal = () => {
    setEditing(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteImpact(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
            Gérez les compteurs d'impact affichés sur la page d'accueil.
          </p>
        </div>
        <button className="admin-btn admin-btn-blue" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
          <thead>
            <tr>
              <th>Valeur</th>
              <th>Label</th>
              <th>Couleur</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.impact.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: '#60A5FA' }}>
                    {item.value.toLocaleString()}+
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{item.label}</td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#60A5FA', fontWeight: 600 }}>
                    Bleu ACPDPH
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', color: '#E5E7EB', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.8rem', padding: '0.375rem 0' }}>
                      Modifier
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.375rem', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {data.impact.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <svg width="28" height="28" fill="none" stroke="#475569" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
              </svg>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Aucun compteur d'impact. Cliquez sur "Ajouter" pour en créer un.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editing ? 'Modifier le compteur' : 'Nouveau compteur'}
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
                  <label className="admin-label">Valeur numérique</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    placeholder="Ex: 2500"
                  />
                </div>
                <div>
                  <label className="admin-label">Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Ex: Enfants accompagnés"
                  />
                </div>
                <div>
                  <label className="admin-label">Couleur d'accent</label>
                  <select
                    className="admin-select"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value as 'ba-red' | 'ba-green' | 'ba-blue' })}
                  >
                    <option value="ba-blue">Bleu Principal (ACPDPH)</option>
                    <option value="ba-red">Bleu Cobalt</option>
                    <option value="ba-green">Bleu Océan</option>
                  </select>
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
              Supprimer ce compteur ?
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
