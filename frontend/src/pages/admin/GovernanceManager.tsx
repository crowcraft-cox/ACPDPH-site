import { useState, useRef } from 'react';
import { useAdminData } from '../../context/adminData';
import { ORGAN_LABELS, type GovernanceOrganKey } from '../../data/governanceData';
import type { GovernanceMember } from '../../types';
import { resolveImageUrl, compressImageToDataUrl } from '../../utils/imageUrl';

export default function GovernanceManager() {
  const { data, addGovernanceMember, updateGovernanceMember, deleteGovernanceMember, isSyncing } = useAdminData();

  const members: GovernanceMember[] = data.governanceMembers || [];

  const [activeFilter, setActiveFilter] = useState<'all' | GovernanceOrganKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<GovernanceMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organ, setOrgan] = useState<GovernanceOrganKey>('board');
  const [photo, setPhoto] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = (defaultOrgan: GovernanceOrganKey = 'board') => {
    setEditingMember(null);
    setName('');
    setRole('');
    setOrgan(defaultOrgan);
    setPhoto('');
    setFormError(null);
    setPhotoUploadError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: GovernanceMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setOrgan(member.organ);
    setPhoto(member.photo || '');
    setFormError(null);
    setPhotoUploadError(null);
    setIsModalOpen(true);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploadError(null);

    // Validation du format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoUploadError('Format refusé : Seules les images JPG, PNG et WebP sont acceptées.');
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    // Validation de la taille (max 10 Mo)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoUploadError('Taille excessive : L\'image ne doit pas dépasser 10 Mo.');
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Compression et encodage immédiat en Data URL (JPEG ~640x800)
      // Garantit un affichage instantané, persistant et indépendant du serveur
      const compressedDataUrl = await compressImageToDataUrl(file, 1200, 1200, 0.82);
      setPhoto(compressedDataUrl);
      setPhotoUploadError(null);
    } catch (err: any) {
      setPhotoUploadError(err.message || 'Erreur lors de la compression de l\'image.');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Le nom du membre est obligatoire.');
      return;
    }
    if (!role.trim()) {
      setFormError('La fonction ou rôle du membre est obligatoire.');
      return;
    }

    if (editingMember) {
      updateGovernanceMember(editingMember.id, {
        name: name.trim(),
        role: role.trim(),
        organ,
        photo: photo.trim() || undefined,
      });
    } else {
      addGovernanceMember({
        name: name.trim(),
        role: role.trim(),
        organ,
        photo: photo.trim() || undefined,
      });
    }

    setIsModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    deleteGovernanceMember(id);
    setDeleteConfirmId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredMembers = members.filter((member) => {
    const matchesFilter = activeFilter === 'all' || member.organ === activeFilter;
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      member.name.toLowerCase().includes(s) ||
      member.role.toLowerCase().includes(s);
    return matchesFilter && matchesSearch;
  });

  const boardCount = members.filter((m) => m.organ === 'board').length;
  const auditCount = members.filter((m) => m.organ === 'audit').length;
  const secretariatCount = members.filter((m) => m.organ === 'secretariat').length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-wide">
            Gouvernance &amp; Organes Dirigeants
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gérez les animateurs du Conseil d&apos;Administration, de la Commission de Contrôle et du Secrétariat Exécutif.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAddModal(activeFilter !== 'all' ? activeFilter : 'board')}
          className="admin-btn admin-btn-blue text-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Ajouter un membre</span>
        </button>
      </div>

      {/* Message de succès */}
      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Mise à jour enregistrée et synchronisée avec le cloud MongoDB.</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">En direct</span>
        </div>
      )}

      {/* Filtres par organe & métriques */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#2350D9] text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Tous les organes</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {members.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('board')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'board'
              ? 'bg-[#2350D9] text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Conseil d&apos;Administration</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-mono">
            {boardCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('audit')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'audit'
              ? 'bg-[#2350D9] text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Commission de Contrôle</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
            {auditCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('secretariat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'secretariat'
              ? 'bg-[#2350D9] text-white shadow-xs'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>Secrétariat Exécutif</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
            {secretariatCount}
          </span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="admin-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom d'animateur ou fonction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grille des membres */}
      {filteredMembers.length === 0 ? (
        <div className="admin-card p-12 text-center text-slate-400 text-sm">
          <p>Aucun membre trouvé pour ce filtre de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const organBadgeColor =
              member.organ === 'board'
                ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                : member.organ === 'audit'
                ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800';

            return (
              <div
                key={member.id}
                className="admin-card p-4 flex flex-col justify-between gap-3 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${organBadgeColor}`}
                    >
                      {ORGAN_LABELS[member.organ]}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(member.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      <img
                        src={resolveImageUrl(member.photo)}
                        alt={`Photo de ${member.name}`}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-700"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: member.photo ? 'none' : 'flex' }}
                      className="w-10 h-10 rounded-lg bg-slate-800 text-slate-400 font-semibold text-xs items-center justify-center shrink-0 border border-slate-700"
                    >
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                {editingMember ? 'Modifier un animateur' : 'Ajouter un animateur'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Organe de gouvernance <span className="text-rose-400">*</span>
                </label>
                <select
                  value={organ}
                  onChange={(e) => setOrgan(e.target.value as GovernanceOrganKey)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="board">Conseil d&apos;Administration</option>
                  <option value="audit">Commission de Contrôle</option>
                  <option value="secretariat">Secrétariat Exécutif</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nom complet de l&apos;animateur <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Emmanuel KAKULE SYAYUKUMBITA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Fonction / Rôle <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Président du Conseil d’administration"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Photo de l&apos;animateur (depuis votre appareil)
                </label>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                {photo ? (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-700">
                    <img
                      src={resolveImageUrl(photo)}
                      alt="Aperçu animateur"
                      className="w-14 h-16 rounded-lg object-cover object-top border border-slate-600 shrink-0 bg-slate-800"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      style={{ display: 'none' }}
                      className="w-14 h-16 rounded-lg bg-slate-800 text-slate-400 items-center justify-center shrink-0 border border-slate-600"
                    >
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Photo sélectionnée
                      </div>
                      <div className="text-[11px] text-slate-400 truncate font-mono">
                        {photo.startsWith('data:') ? 'Image chargée depuis votre appareil (optimisée)' : photo}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-300 border border-blue-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Changer
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhoto('')}
                        disabled={isUploadingPhoto}
                        className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-950/40"
                  >
                    <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="block text-xs font-semibold text-white">
                      {isUploadingPhoto ? 'Téléversement de l\'image en cours...' : 'Sélectionner une photo depuis votre appareil'}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Formats acceptés : JPG, PNG, WebP (max 10 Mo) — Format portrait recommandé
                    </span>
                  </div>
                )}

                {photoUploadError && (
                  <div className="mt-2 p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                    {photoUploadError}
                  </div>
                )}

                <span className="text-[11px] text-slate-500 mt-2 block">
                  Laisser vide pour afficher l&apos;emplacement neutre tant que la photo n&apos;est pas disponible.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs disabled:opacity-50"
                >
                  {isSyncing ? 'Enregistrement...' : editingMember ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Suppression */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Confirmer la suppression</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Êtes-vous certain de vouloir supprimer cet animateur de l&apos;organe de gouvernance ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs"
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
