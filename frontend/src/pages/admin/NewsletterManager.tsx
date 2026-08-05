import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
}

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Broadcast Form
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch<Subscriber[]>('/newsletter');
      if (res.success && Array.isArray(res.data)) {
        setSubscribers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      alert('Veuillez remplir le sujet et le contenu du message.');
      return;
    }

    setIsSending(true);
    setSendSuccess(null);
    setSendError(null);

    try {
      const res = await apiFetch('/newsletter/broadcast', {
        method: 'POST',
        body: JSON.stringify({ subject, content }),
      });

      if (res.success) {
        setSendSuccess(res.message || `E-mails envoyés avec succès à ${subscribers.length} abonnés !`);
        setSubject('');
        setContent('');
      } else {
        setSendError(res.error || 'Erreur lors de l\'envoi de la newsletter.');
      }
    } catch (err: any) {
      console.error('Broadcast error:', err);
      setSendError('Impossible de contacter le serveur pour l\'envoi.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      const res = await apiFetch(`/newsletter/${id}`, { method: 'DELETE' });
      if (res.success) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.25rem' }}>
            Gestion de la Newsletter & Abonnés
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            Consultez les e-mails des abonnés et diffusez vos messages directement dans leurs boîtes de réception.
          </p>
        </div>

        <button onClick={fetchSubscribers} className="admin-btn admin-btn-ghost" style={{ fontSize: '0.85rem' }}>
          🔄 Actualiser ({subscribers.length} abonnés)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Formulaire de Diffusion E-mail */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✉️ Diffuser un message aux abonnés</span>
          </h3>

          {sendSuccess && (
            <div style={{ padding: '0.85rem', background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', borderRadius: '0.75rem', color: '#4ADE80', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ✅ {sendSuccess}
            </div>
          )}

          {sendError && (
            <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', borderRadius: '0.75rem', color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ❌ {sendError}
            </div>
          )}

          <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="admin-label">Sujet de l'e-mail *</label>
              <input
                type="text"
                className="admin-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Avancement de nos projets d'éducation à Goma"
                required
              />
            </div>

            <div>
              <label className="admin-label">Contenu du message (texte / HTML) *</label>
              <textarea
                className="admin-textarea"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez votre message ici. Il sera envoyé dans la boîte de réception de tous vos abonnés..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending || subscribers.length === 0}
              className="admin-btn admin-btn-green"
              style={{ padding: '0.85rem', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700, opacity: isSending ? 0.6 : 1 }}
            >
              {isSending ? '🚀 Envoi en cours vers les boîtes de réception...' : `✉️ Envoyer à tous les ${subscribers.length} abonnés`}
            </button>
          </form>
        </div>

        {/* Liste des Abonnés enregistrés dans MongoDB Atlas */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)' }}>
            <h4 style={{ fontWeight: 700, color: '#F8FAFC', margin: 0, fontSize: '0.95rem' }}>
              👥 Abonnés enregistrés ({subscribers.length})
            </h4>
          </div>

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              Chargement des abonnés...
            </div>
          ) : subscribers.length > 0 ? (
            <div className="admin-table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Adresse E-mail</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub._id}>
                      <td style={{ fontWeight: 600, color: '#38BDF8', fontSize: '0.85rem' }}>
                        {sub.email}
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setDeleteId(sub._id)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.35rem' }}
                          title="Désabonner"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748B' }}>
              Aucun abonné enregistré dans la base de données pour le moment.
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#F1F5F9', fontWeight: 700, marginBottom: '0.5rem' }}>Désabonner cet e-mail ?</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Cet e-mail ne recevra plus les newsletters.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteSubscriber(deleteId)}>Désabonner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
