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

        <button onClick={fetchSubscribers} className="admin-btn admin-btn-ghost flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualiser ({subscribers.length} abonnés)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Formulaire de Diffusion E-mail */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>Diffuser un message aux abonnés</span>
          </h3>

          {sendSuccess && (
            <div style={{ padding: '0.85rem', background: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', borderRadius: '0.75rem', color: '#4ADE80', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg className="w-4 h-4 shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {sendSuccess}
            </div>
          )}

          {sendError && (
            <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', borderRadius: '0.75rem', color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {sendError}
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
              className="admin-btn admin-btn-green flex items-center justify-center gap-2"
              style={{ padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, opacity: isSending ? 0.6 : 1 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              {isSending ? 'Envoi en cours vers les boîtes de réception...' : `Envoyer à tous les ${subscribers.length} abonnés`}
            </button>
          </form>
        </div>

        {/* Liste des Abonnés enregistrés dans MongoDB Atlas */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)' }}>
            <h4 style={{ fontWeight: 700, color: '#F8FAFC', margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Abonnés enregistrés ({subscribers.length})
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
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
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
