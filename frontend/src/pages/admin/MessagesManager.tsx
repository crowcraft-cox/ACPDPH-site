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
          className="admin-btn admin-btn-ghost flex items-center gap-2"
          style={{ fontSize: '0.85rem' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualiser
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Formulaire de Contact ({contacts.length})
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
          </svg>
          Signalements Safeguarding ({reports.length})
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {'subject' in selectedMessage ? (
                  <>
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Détails du Message
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
                    </svg>
                    Détails du Signalement
                  </>
                )}
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
                  <a href={`mailto:${(selectedMessage as ContactMessage).email}`} style={{ fontSize: '0.85rem', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {(selectedMessage as ContactMessage).email}
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

                <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Gmail Web Compose Button */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent((selectedMessage as ContactMessage).email)}&su=${encodeURIComponent('RE: ' + (selectedMessage as ContactMessage).subject)}&body=${encodeURIComponent('\n\n-----------------------------------\nMessage d\'origine de ' + (selectedMessage as ContactMessage).name + ' :\n' + (selectedMessage as ContactMessage).message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-red"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Répondre via Gmail
                  </a>

                  {/* Mailto App Fallback */}
                  <a
                    href={`mailto:${(selectedMessage as ContactMessage).email}?subject=${encodeURIComponent('RE: ' + (selectedMessage as ContactMessage).subject)}`}
                    className="admin-btn admin-btn-ghost"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                  >
                    Client Mail par défaut
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
