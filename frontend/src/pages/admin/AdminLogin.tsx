import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../context/adminData';
import '../../admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminData();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      {/* Decorative background subtle glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-ba-blue/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="admin-login-card">
        {/* Logo - Centered */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-gray-100 flex items-center justify-center">
            <img src="/logo_ACPDPH.jpg" alt="ACPDPH" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
            ACPDPH
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Panneau d'administration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="admin-label-light">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input-light"
              placeholder="Ex: admin ou votre identifiant"
              autoFocus
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="admin-label-light">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input-light"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '0.625rem',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              color: '#DC2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-red"
            style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem', borderRadius: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Se connecter
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
