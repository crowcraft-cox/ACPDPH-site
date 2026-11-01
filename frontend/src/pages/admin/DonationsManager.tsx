import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import type { DonationItem } from '../../types';

export default function DonationsManager() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<DonationItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchDonations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch<DonationItem[]>('/donations');
      if (res.success && Array.isArray(res.data)) {
        setDonations(res.data);
      } else {
        setError(res.error || 'Impossible de charger les dons.');
      }
    } catch (err: any) {
      console.error('Fetch donations error:', err);
      setError('Erreur lors du chargement des intentions de dons.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setIsUpdatingStatus(true);
    try {
      const res = await apiFetch(`/donations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.success) {
        setDonations((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
        );
        if (selectedDonation && selectedDonation._id === id) {
          setSelectedDonation({ ...selectedDonation, status: newStatus });
        }
      } else {
        alert(res.error || 'Erreur lors de la mise à jour du statut.');
      }
    } catch (err) {
      console.error('Update donation status error:', err);
      alert('Erreur réseau lors de la mise à jour.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await apiFetch(`/donations/${id}`, { method: 'DELETE' });
      if (res.success) {
        setDonations((prev) => prev.filter((d) => d._id !== id));
        if (selectedDonation && selectedDonation._id === id) {
          setSelectedDonation(null);
        }
      } else {
        alert(res.error || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error('Delete donation error:', err);
      alert('Erreur réseau lors de la suppression.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // Filtrage
  const filteredDonations = donations.filter((donation) => {
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || donation.frequency === frequencyFilter;
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (donation.reference && donation.reference.toLowerCase().includes(s)) ||
      (donation.name && donation.name.toLowerCase().includes(s)) ||
      (donation.email && donation.email.toLowerCase().includes(s)) ||
      (donation.phone && donation.phone.toLowerCase().includes(s));

    return matchesStatus && matchesFrequency && matchesSearch;
  });

  // Métriques
  const totalAmountUSD = donations
    .filter((d) => d.status !== 'cancelled')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalPending = donations.filter((d) => d.status === 'pending').length;
  const totalConfirmed = donations.filter((d) => d.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-wide">
            Intentions de Dons &amp; Soutiens
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestion, validation et suivi des promesses de dons enregistrées via le site web.
          </p>
        </div>
        <button
          onClick={fetchDonations}
          className="admin-btn admin-btn-ghost text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Cartes métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card p-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Intentions</div>
          <div className="text-2xl font-bold font-heading text-white mt-1">{donations.length}</div>
          <div className="text-xs text-slate-500 mt-1">Toutes fréquences confondues</div>
        </div>
        <div className="admin-card p-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Volume estimé</div>
          <div className="text-2xl font-bold font-heading text-blue-400 mt-1">
            {totalAmountUSD.toLocaleString('fr-FR')} $
          </div>
          <div className="text-xs text-slate-500 mt-1">Hors dons annulés</div>
        </div>
        <div className="admin-card p-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">En attente</div>
          <div className="text-2xl font-bold font-heading text-amber-400 mt-1">{totalPending}</div>
          <div className="text-xs text-slate-500 mt-1">Règlement à valider</div>
        </div>
        <div className="admin-card p-4">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Confirmés / Reçus</div>
          <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">{totalConfirmed}</div>
          <div className="text-xs text-slate-500 mt-1">Contributions vérifiées</div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="admin-card p-4 flex flex-col md:flex-row gap-3">
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
            placeholder="Rechercher par référence, donateur, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes fréquences</option>
            <option value="monthly">Mensuel</option>
            <option value="single">Ponctuel</option>
          </select>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDonations} className="text-xs uppercase font-bold underline">
            Réessayer
          </button>
        </div>
      )}

      {/* Liste des intentions de dons */}
      {isLoading ? (
        <div className="admin-card p-12 text-center text-slate-400 text-sm">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
          <p>Chargement des dons en cours...</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="admin-card p-12 text-center text-slate-400 text-sm">
          <p>Aucune intention de don ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-heading text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Réf &bull; Date</th>
                  <th className="px-4 py-3">Donateur</th>
                  <th className="px-4 py-3">Montant &bull; Fréquence</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDonations.map((donation) => {
                  const dateStr = donation.createdAt
                    ? new Date(donation.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A';

                  return (
                    <tr key={donation._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-white text-xs">{donation.reference || 'DON-SANS-REF'}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{dateStr}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{donation.name}</div>
                        <div className="text-[11px] text-slate-400">{donation.email}</div>
                        {donation.phone && <div className="text-[11px] text-slate-500">{donation.phone}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-sm text-blue-400">
                          {donation.amount} {donation.currency || 'USD'}
                        </div>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            donation.frequency === 'monthly'
                              ? 'bg-blue-950/70 text-blue-300 border border-blue-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {donation.frequency === 'monthly' ? 'Tous les mois' : 'Une seule fois'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-300 font-medium">
                          {donation.paymentMethod === 'MOBILE_MONEY'
                            ? 'Mobile Money'
                            : donation.paymentMethod === 'BANK_TRANSFER'
                            ? 'Virement Bancaire'
                            : donation.paymentMethod}
                        </div>
                        {donation.paymentProvider && (
                          <div className="text-[11px] text-slate-500">{donation.paymentProvider}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            donation.status === 'confirmed'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : donation.status === 'cancelled'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {donation.status === 'confirmed'
                            ? 'Confirmé'
                            : donation.status === 'cancelled'
                            ? 'Annulé'
                            : 'En attente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDonation(donation)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                          >
                            Détails
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(donation._id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale Détails Donateur */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-blue-400 font-bold block">
                  {selectedDonation.reference}
                </span>
                <h3 className="font-heading font-bold text-base text-white mt-0.5">
                  Détail de l&apos;intention de don
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Engagement financier</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {selectedDonation.amount} {selectedDonation.currency || 'USD'}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {selectedDonation.frequency === 'monthly' ? 'Don régulier tous les mois' : 'Don ponctuel unique'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Statut actuel</span>
                  <select
                    disabled={isUpdatingStatus}
                    value={selectedDonation.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedDonation._id, e.target.value as any)
                    }
                    className="mt-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé / Reçu</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Nom complet</span>
                  <div className="text-white font-semibold mt-0.5">{selectedDonation.name}</div>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Pays / Résidence</span>
                  <div className="text-white font-semibold mt-0.5">{selectedDonation.country || 'Non précisé'}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">E-mail</span>
                  <div className="text-white font-mono mt-0.5">{selectedDonation.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedDonation.email, 'email')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                >
                  {copiedText === 'email' ? 'Copié' : 'Copier'}
                </button>
              </div>

              {selectedDonation.phone && (
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block">Téléphone</span>
                    <div className="text-white font-mono mt-0.5">{selectedDonation.phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDonation.phone!, 'phone')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    {copiedText === 'phone' ? 'Copié' : 'Copier'}
                  </button>
                </div>
              )}

              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Moyen de paiement choisi</span>
                <div className="text-white font-semibold mt-0.5">
                  {selectedDonation.paymentMethod === 'MOBILE_MONEY'
                    ? 'Mobile Money (RDC)'
                    : selectedDonation.paymentMethod === 'BANK_TRANSFER'
                    ? 'Virement bancaire'
                    : selectedDonation.paymentMethod}
                  {selectedDonation.paymentProvider ? ` — ${selectedDonation.paymentProvider}` : ''}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Newsletter ACPDPH</span>
                <div className="text-white mt-0.5">
                  {selectedDonation.newsletter
                    ? 'Oui, a accepté de recevoir les actualités'
                    : 'Non, désire ne pas recevoir d\'e-mails d\'actualité'}
                </div>
              </div>

              {selectedDonation.notes && (
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block">Note / Message du donateur</span>
                  <p className="text-slate-300 mt-1 whitespace-pre-wrap">{selectedDonation.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Suppression */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Confirmer la suppression</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Êtes-vous certain de vouloir supprimer cette intention de don ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
