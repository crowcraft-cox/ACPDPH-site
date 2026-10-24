import { useState } from 'react';
import { useAdminData } from '../../context/adminData';

export default function ContactManager() {
  const { data, updateContact } = useAdminData();
  const [form, setForm] = useState({
    address: data.contact.address,
    email: data.contact.email,
    phone: data.contact.phone,
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
          Modifiez les informations de contact officielles de l'ACPDPH (AGENCE CONGOLAISE DE PROMOTION DES DROITS DES PERSONNES HANDICAPEES-ACPDPH).
        </p>
      </div>

      <div className="admin-card" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="admin-label">Adresse physique du siège social</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ex: N° 08, Avenue Ruwenzori, Quartier Résidentiel, Ville de Beni, Nord-Kivu, RDC"
              required
            />
          </div>

          <div>
            <label className="admin-label">Adresse Email officielle</label>
            <input
              type="email"
              className="admin-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Ex: contact@acpdph.org"
              required
            />
          </div>

          <div>
            <label className="admin-label">Numéro de Téléphone / WhatsApp</label>
            <input
              type="text"
              className="admin-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Ex: +243 XX XXX XXXX"
              required
            />
          </div>

          {saved && (
            <div
              style={{
                background: 'rgba(37, 99, 235, 0.12)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                color: '#60A5FA',
                padding: '0.75rem 1rem',
                borderRadius: '0.625rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Coordonnées de contact mises à jour avec succès !
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="admin-btn admin-btn-blue">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
