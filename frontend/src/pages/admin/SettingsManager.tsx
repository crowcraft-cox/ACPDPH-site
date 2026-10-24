import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { AdminUser } from '../../types';

/* ===================================================
   VUE ÉDITEUR — Modifier son propre profil
=================================================== */
function EditorProfileSettings() {
  const { currentUser, updateUser } = useAdminData();

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const [pwdForm, setPwdForm] = useState({
    currentPwd: '',
    newPwd: '',
    confirmPwd: '',
  });

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (
    setter: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; text: string } | null>>,
    type: 'success' | 'error',
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter(null), 4000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showMsg(setProfileMsg, 'error', 'Veuillez remplir tous les champs.');
      return;
    }
    if (!currentUser?.id) return;
    const res = updateUser(currentUser.id, {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });
    if (res.success) {
      showMsg(setProfileMsg, 'success', 'Profil mis à jour avec succès.');
    } else {
      showMsg(setProfileMsg, 'error', res.error || 'Erreur lors de la mise à jour.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdForm.currentPwd || !pwdForm.newPwd || !pwdForm.confirmPwd) {
      showMsg(setPwdMsg, 'error', 'Veuillez remplir tous les champs.');
      return;
    }
    if (pwdForm.currentPwd !== currentUser?.password) {
      showMsg(setPwdMsg, 'error', 'Le mot de passe actuel est incorrect.');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      showMsg(setPwdMsg, 'error', 'Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      showMsg(setPwdMsg, 'error', 'Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (!currentUser?.id) return;
    const res = updateUser(currentUser.id, { password: pwdForm.newPwd });
    if (res.success) {
      setPwdForm({ currentPwd: '', newPwd: '', confirmPwd: '' });
      showMsg(setPwdMsg, 'success', 'Mot de passe modifié avec succès.');
    } else {
      showMsg(setPwdMsg, 'error', res.error || 'Erreur lors du changement.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Avatar / Infos */}
      <div className="flex items-center gap-5 p-5 rounded-2xl"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
          {currentUser?.name?.[0]?.toUpperCase() || 'E'}
        </div>
        <div>
          <div className="text-white font-bold text-lg">{currentUser?.name}</div>
          <div className="text-white/50 text-sm mt-0.5">@{currentUser?.username}</div>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)' }}>
            ÉDITEUR
          </span>
        </div>
      </div>

      {/* Section : Informations personnelles */}
      <div className="rounded-2xl overflow-hidden"
           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="px-6 py-4 flex items-center gap-3"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(59,130,246,0.15)' }}>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Informations personnelles</h3>
            <p className="text-white/40 text-xs">Modifier votre nom d'affichage et votre adresse email</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          {profileMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                 style={{
                   background: profileMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.1)',
                   border: `1px solid ${profileMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(220,38,38,0.3)'}`,
                   color: profileMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
                 }}>
              {profileMsg.type === 'success'
                ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                : <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              }
              {profileMsg.text}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Nom complet</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <input type="text" required value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(59,130,246,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Adresse email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input type="email" required value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(59,130,246,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Identifiant de connexion</label>
            <div className="flex items-center pl-4 py-3 rounded-xl font-mono text-sm text-white/30"
                 style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              @{currentUser?.username}
              <span className="ml-auto mr-4 text-xs px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                Non modifiable
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>

      {/* Section : Changer le mot de passe */}
      <div className="rounded-2xl overflow-hidden"
           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="px-6 py-4 flex items-center gap-3"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(220,38,38,0.15)' }}>
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Sécurité du compte</h3>
            <p className="text-white/40 text-xs">Modifier votre mot de passe de connexion</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          {pwdMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                 style={{
                   background: pwdMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.1)',
                   border: `1px solid ${pwdMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(220,38,38,0.3)'}`,
                   color: pwdMsg.type === 'success' ? '#6ee7b7' : '#fca5a5',
                 }}>
              {pwdMsg.type === 'success'
                ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                : <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              }
              {pwdMsg.text}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Mot de passe actuel</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input type="password" required placeholder="Votre mot de passe actuel" value={pwdForm.currentPwd}
                onChange={e => setPwdForm({ ...pwdForm, currentPwd: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(220,38,38,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Nouveau mot de passe</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input type="password" required placeholder="Minimum 6 caractères" value={pwdForm.newPwd}
                onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(220,38,38,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <input type="password" required placeholder="Répétez le nouveau mot de passe" value={pwdForm.confirmPwd}
                onChange={e => setPwdForm({ ...pwdForm, confirmPwd: e.target.value })}
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(220,38,38,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Changer le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================================================
   VUE ADMIN — Gérer les éditeurs
=================================================== */
function AdminEditorSettings() {
  const { data, addUser, deleteUser, currentUser } = useAdminData();
  const users = data.users || [];
  const MAX_EDITORS = 5;
  const isLimitReached = users.length >= MAX_EDITORS;

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleOpenAddModal = () => {
    if (isLimitReached) return;
    setForm({ name: '', username: '', email: '', password: '' });
    setError('');
    setModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const res = addUser({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'EDITOR',
    });
    if (!res.success) {
      setError(res.error || "Erreur lors de la création de l'éditeur.");
    } else {
      setModalOpen(false);
      setSuccessMsg(`L'éditeur "${form.name}" a été ajouté avec succès.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModalId) {
      deleteUser(deleteModalId);
      setDeleteModalId(null);
      setSuccessMsg('Éditeur supprimé avec succès.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="admin-card p-6 border border-gray-100 shadow-sm rounded-2xl bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-ba-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Gestion des Utilisateurs Éditeurs
            </h2>
            <p className="text-white text-sm mt-1">
              Gérez les accès et les comptes d'éditeurs autorisés à modifier le contenu du site (Maximum 5 éditeurs).
            </p>
          </div>
          <button onClick={handleOpenAddModal} disabled={isLimitReached}
            className={`btn btn-primary text-sm flex items-center gap-2 transition-all ${isLimitReached ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600 border-gray-300 hover:bg-gray-300' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter un Éditeur
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Quota d'Éditeurs :</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isLimitReached ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
              {users.length} / {MAX_EDITORS} Éditeurs enregistrés
            </span>
          </div>
          {isLimitReached && (
            <span className="text-xs font-medium text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Limite maximale de 5 éditeurs atteinte
            </span>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Current User Info */}
      <div className="admin-card p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ba-red/10 text-ba-red font-bold flex items-center justify-center border border-ba-red/20">
            {currentUser?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              {currentUser?.name || 'Administrateur Principal'}
              <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold uppercase">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            <div className="text-xs text-white">Connecté en tant que: @{currentUser?.username || 'admin'}</div>
          </div>
        </div>
      </div>

      {/* Editors Table */}
      <div className="admin-card border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-white">Liste des Éditeurs</h3>
          <span className="text-xs text-white">Total : {users.length}</span>
        </div>
        <div className="admin-table-wrapper">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-white text-xs uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Éditeur / Nom</th>
                <th className="p-4">Nom d'utilisateur</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Ajouté le</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white">
                    Aucun éditeur ajouté. Vous pouvez ajouter jusqu'à 5 éditeurs.
                  </td>
                </tr>
              ) : (
                users.map((user: AdminUser) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-white text-xs">@{user.username}</td>
                    <td className="p-4 text-white">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-white text-xs">{user.createdAt}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setDeleteModalId(user.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Supprimer cet éditeur">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Editor */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10"
               style={{ background: 'linear-gradient(145deg, #1a1f2e 0%, #111827 60%, #0f172a 100%)' }}>
            <div className="relative px-8 pt-8 pb-6"
                 style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(17,24,39,0) 70%)' }}>
              <button onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                     style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Nouvel Éditeur</h3>
                  <p className="text-sm text-white/50 mt-0.5">Remplissez les informations du compte</p>
                </div>
              </div>
              <div className="mt-5 h-px bg-white/5">
                <div className="h-full w-2/3 rounded-full" style={{ background: 'linear-gradient(90deg, #dc2626, transparent)' }}></div>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-5">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-2xl border"
                     style={{ background: 'rgba(220,38,38,0.1)', borderColor: 'rgba(220,38,38,0.3)' }}>
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                {[
                  { label: 'Nom Complet *', type: 'text', key: 'name', placeholder: 'Ex: Jean Mukendi', mono: false,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
                  { label: 'Identifiant *', type: 'text', key: 'username', placeholder: 'Ex: jmukendi', mono: true,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" /> },
                  { label: 'Email *', type: 'email', key: 'email', placeholder: 'Ex: jean.m@acpdph.org', mono: false,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /> },
                  { label: 'Mot de Passe *', type: 'password', key: 'password', placeholder: 'Mot de passe sécurisé', mono: false,
                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /> },
                ].map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">{field.label}</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>{field.icon}</svg>
                      </div>
                      <input type={field.type} required placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className={`w-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 rounded-xl outline-none transition-all ${field.mono ? 'font-mono' : ''}`}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(220,38,38,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-xs text-white/40">Ce compte sera créé avec le rôle <span className="text-white/70 font-semibold">ÉDITEUR</span> — accès limité.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 text-sm font-semibold text-white/60 hover:text-white rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Annuler
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Créer le compte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.05a9 9 0 110 18 9 9 0 010-18zm0 13.5h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">Confirmer la suppression</h3>
            <p className="text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer cet éditeur ? Il ne pourra plus accéder au panel.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={handleDeleteConfirm}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm">
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================================================
   COMPOSANT PRINCIPAL — Router selon le rôle
=================================================== */
export default function SettingsManager() {
  const { currentUser } = useAdminData();
  const isEditor = currentUser?.role === 'EDITOR';
  return isEditor ? <EditorProfileSettings /> : <AdminEditorSettings />;
}

