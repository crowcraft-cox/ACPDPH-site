import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface SafeguardingReport {
  _id: string;
  reporterType: string;
  incidentType: string;
  location: string;
  description: string;
  contactInfo?: string;
  createdAt: string;
}

export default function MessagesManager() {
  const [activeTab, setActiveTab] = useState<'contact' | 'safeguarding'>('contact');
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [reports, setReports] = useState<SafeguardingReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | SafeguardingReport | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const [resContact, resSafe] = await Promise.all([
        apiFetch<ContactMessage[]>('/contact'),
        apiFetch<SafeguardingReport[]>('/safeguarding/reports'),
      ]);

      if (resContact.success && Array.isArray(resContact.data)) {
        setContacts(resContact.data);
      }
      if (resSafe.success && Array.isArray(resSafe.data)) {
        setReports(resSafe.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteContact = async (id: string) => {
    try {
      const res = await apiFetch(`/contact/${id}`, { method: 'DELETE' });
      if (res.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedMessage && '_id' in selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const res = await apiFetch(`/safeguarding/reports/${id}`, { method: 'DELETE' });
      if (res.success) {
        setReports((prev) => prev.filter((r) => r._id !== id));
        if (selectedMessage && '_id' in selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.25rem' }}>
            Messages & Signalements Reçus
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>
            Consultez les messages envoyés depuis le formulaire de contact et les signalements Safeguarding.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="admin-btn admin-btn-ghost"
          style={{ fontSize: '0.85rem' }}
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => { setActiveTab('contact'); setSelectedMessage(null); }}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '0.75rem',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'contact' ? '#E30613' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'contact' ? '#FFFFFF' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          ✉️ Formulaire de Contact ({contacts.length})
        </button>

        <button
          onClick={() => { setActiveTab('safeguarding'); setSelectedMessage(null); }}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '0.75rem',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'safeguarding' ? '#1A8F0A' : 'rgba(255,255,255,0.06)',
            color: activeTab === 'safeguarding' ? '#FFFFFF' : '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          🛡️ Signalements Safeguarding ({reports.length})
        </button>
      </div>

      {/* Main Grid: List + Detail Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Messages List Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              Chargement des messages...
            </div>
          ) : activeTab === 'contact' ? (
            contacts.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Expéditeur</th>
                      <th>Sujet</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((msg) => (
                      <tr
                        key={msg._id}
                        onClick={() => setSelectedMessage(msg)}
                        style={{
                          cursor: 'pointer',
                          background: selectedMessage && '_id' in selectedMessage && selectedMessage._id === msg._id ? 'rgba(227, 6, 19, 0.12)' : 'transparent',
                        }}
                      >
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{msg.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#38BDF8' }}>{msg.email}</div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#E2E8F0', fontSize: '0.85rem' }}>{msg.subject}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {msg.message}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                          {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(msg._id); }}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.35rem' }}
                            title="Supprimer"
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
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                Aucun message de contact reçu pour le moment.
              </div>
            )
          ) : (
            reports.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Incident</th>
                      <th>Lieu</th>
                      <th>Rapporteur</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((rep) => (
                      <tr
                        key={rep._id}
                        onClick={() => setSelectedMessage(rep)}
                        style={{
                          cursor: 'pointer',
                          background: selectedMessage && '_id' in selectedMessage && selectedMessage._id === rep._id ? 'rgba(26, 143, 10, 0.12)' : 'transparent',
                        }}
                      >
                        <td>
                          <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{rep.incidentType}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{rep.location}</td>
                        <td style={{ fontSize: '0.75rem', color: '#38BDF8' }}>{rep.reporterType}</td>
                        <td style={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                          {new Date(rep.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(rep._id); }}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.35rem' }}
                            title="Supprimer"
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
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                Aucun signalement Safeguarding reçu.
              </div>
            )
          )}
        </div>

        {/* Selected Message Detail View */}
        {selectedMessage && (
          <div className="admin-card" style={{ padding: '1.5rem', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                {'subject' in selectedMessage ? '✉️ Détails du Message' : '🛡️ Détails du Signalement'}
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {'subject' in selectedMessage ? (
              /* Contact Message Detail */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Expéditeur</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>{(selectedMessage as ContactMessage).name}</div>
                  <a href={`mailto:${(selectedMessage as ContactMessage).email}`} style={{ fontSize: '0.85rem', color: '#38BDF8' }}>
                    ✉️ {(selectedMessage as ContactMessage).email}
                  </a>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Sujet</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#E2E8F0' }}>{(selectedMessage as ContactMessage).subject}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Message</span>
                  <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '0.75rem', color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {(selectedMessage as ContactMessage).message}
                  </div>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.75rem' }}>
                  <a
                    href={`mailto:${(selectedMessage as ContactMessage).email}?subject=RE: ${(selectedMessage as ContactMessage).subject}`}
                    className="admin-btn admin-btn-green"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    ✉️ Répondre par e-mail
                  </a>
                </div>
              </div>
            ) : (
              /* Safeguarding Report Detail */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Type d'incident</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#EF4444' }}>{(selectedMessage as SafeguardingReport).incidentType}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Lieu</span>
                  <div style={{ fontSize: '0.95rem', color: '#E2E8F0' }}>{(selectedMessage as SafeguardingReport).location}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Description de l'incident</span>
                  <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '0.75rem', color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {(selectedMessage as SafeguardingReport).description}
                  </div>
                </div>

                {(selectedMessage as SafeguardingReport).contactInfo && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Informations de contact fournies</span>
                    <div style={{ fontSize: '0.85rem', color: '#38BDF8' }}>{(selectedMessage as SafeguardingReport).contactInfo}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#F1F5F9', fontWeight: 700, marginBottom: '0.5rem' }}>Supprimer ce message ?</h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirmId(null)}>Annuler</button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => activeTab === 'contact' ? handleDeleteContact(deleteConfirmId) : handleDeleteReport(deleteConfirmId)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
