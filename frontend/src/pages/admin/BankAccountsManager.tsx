import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { BankAccount } from '../../types';
import { DEFAULT_BANK_ACCOUNTS } from '../../config/donationConfig';

interface FormState {
  bankName: string;
  accountName: string;
  agency: string;
  accountNumber: string;
  swift: string;
  currency: string;
  iban: string;
  notes: string;
  active: boolean;
}

const INITIAL_FORM: FormState = {
  bankName: '',
  accountName: 'ACPDPH',
  agency: 'AGENCE DE BENI',
  accountNumber: '',
  swift: 'BCDCCDKI',
  currency: 'USD',
  iban: '',
  notes: '',
  active: true,
};

export default function BankAccountsManager() {
  const { data, updateBankAccount, addBankAccount, deleteBankAccount } = useAdminData();
  const bankAccounts = data.bankAccounts && data.bankAccounts.length > 0 ? data.bankAccounts : DEFAULT_BANK_ACCOUNTS;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setForm(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: BankAccount) => {
    setEditingAccount(acc);
    setForm({
      bankName: acc.bankName || '',
      accountName: acc.accountName || 'ACPDPH',
      agency: acc.agency || '',
      accountNumber: acc.accountNumber || '',
      swift: acc.swift || '',
      currency: acc.currency || 'USD',
      iban: acc.iban || '',
      notes: acc.notes || '',
      active: acc.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bankName.trim() || !form.accountNumber.trim()) {
      alert('Veuillez renseigner le nom de la banque et le numéro de compte.');
      return;
    }

    if (editingAccount) {
      updateBankAccount(editingAccount.id, {
        bankName: form.bankName.trim(),
        accountName: form.accountName.trim(),
        agency: form.agency.trim(),
        accountNumber: form.accountNumber.trim(),
        swift: form.swift.trim(),
        currency: form.currency.trim().toUpperCase(),
        iban: form.iban.trim(),
        notes: form.notes.trim(),
        active: form.active,
      });
    } else {
      addBankAccount({
        bankName: form.bankName.trim(),
        accountName: form.accountName.trim(),
        agency: form.agency.trim(),
        accountNumber: form.accountNumber.trim(),
        swift: form.swift.trim(),
        currency: form.currency.trim().toUpperCase(),
        iban: form.iban.trim(),
        notes: form.notes.trim(),
        active: form.active,
      });
    }

    setIsModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleDelete = (id: string) => {
    deleteBankAccount(id);
    setDeleteConfirmId(null);
  };

  const handleToggleActive = (acc: BankAccount) => {
    updateBankAccount(acc.id, { active: acc.active === false });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-white tracking-wide">
            Coordonnées Bancaires &amp; RIB Officiels
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gérez les comptes bancaires certifiés de l&apos;ACPDPH présentés aux donateurs lors des virements (USD, CDF, etc.).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="admin-btn admin-btn-primary text-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un compte bancaire
        </button>
      </div>

      {/* Notification de succès */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Coordonnées bancaires enregistrées et synchronisées vers MongoDB Atlas avec succès !</span>
        </div>
      )}

      {/* Liste des comptes bancaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bankAccounts.map((acc) => {
          const isActive = acc.active !== false;
          return (
            <div
              key={acc.id}
              className={`admin-card p-5 border transition-all ${
                isActive ? 'border-slate-800' : 'border-slate-800/60 opacity-60'
              }`}
            >
              {/* Entête de carte */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-bold text-base text-white tracking-wide">
                    {acc.bankName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-800">
                    {acc.currency || 'USD'}
                  </span>
                  {isActive ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      Actif (Visible)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                      Désactivé
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(acc)}
                    title={isActive ? 'Désactiver temporairement ce compte' : 'Activer ce compte'}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      {isActive ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(acc)}
                    title="Modifier ce compte bancaire"
                    className="p-1.5 hover:bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(acc.id)}
                    title="Supprimer ce compte bancaire"
                    className="p-1.5 hover:bg-slate-800 rounded text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Détails du compte */}
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Intitulé du compte :</span>
                  <span className="font-semibold text-white">{acc.accountName || 'ACPDPH'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Agence bancaire :</span>
                  <span className="text-slate-200">{acc.agency || 'AGENCE DE BENI'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Numéro de compte :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-400 tracking-wider">
                      {acc.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumber, `num-${acc.id}`)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copier le numéro de compte"
                    >
                      {copiedKey === `num-${acc.id}` ? (
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.615v.75m-7.332 0c-.055.194-.084.4-.084.615v.75m7.332 0c0 .414-.336.75-.75.75H8.25a.75.75 0 01-.75-.75v-.75m7.332 0h1.668A2.25 2.25 0 0118.75 6v13.5A2.25 2.25 0 0116.5 21.75H7.5A2.25 2.25 0 015.25 19.5V6a2.25 2.25 0 012.25-2.25h1.668" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Code SWIFT / BIC :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-200">
                      {acc.swift || 'BCDCCDKI'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.swift, `swift-${acc.id}`)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copier le code SWIFT"
                    >
                      {copiedKey === `swift-${acc.id}` ? (
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.849A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.599m7.332 0c.055.194.084.4.084.615v.75m-7.332 0c-.055.194-.084.4-.084.615v.75m7.332 0c0 .414-.336.75-.75.75H8.25a.75.75 0 01-.75-.75v-.75m7.332 0h1.668A2.25 2.25 0 0118.75 6v13.5A2.25 2.25 0 0116.5 21.75H7.5A2.25 2.25 0 015.25 19.5V6a2.25 2.25 0 012.25-2.25h1.668" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {acc.iban && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">IBAN international :</span>
                    <span className="font-mono text-slate-200">{acc.iban}</span>
                  </div>
                )}

                {acc.notes && (
                  <div className="pt-1 text-[11px] text-slate-400 italic">
                    {acc.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ajout / Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-white">
                {editingAccount ? 'Modifier le compte bancaire' : 'Ajouter un compte bancaire'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Nom de la banque *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: EQUITY BCDC, RAWBANK, TMB..."
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Intitulé du compte *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ACPDPH"
                    value={form.accountName}
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Devise du compte *
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD ($ - Dollar américain)</option>
                    <option value="CDF">CDF (FC - Franc congolais)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Adresse / Agence de la banque *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: AGENCE DE BENI"
                  value={form.agency}
                  onChange={(e) => setForm({ ...form, agency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Numéro de compte *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 00011150666200168501311"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Code SWIFT / BIC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BCDCCDKI"
                    value={form.swift}
                    onChange={(e) => setForm({ ...form, swift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Code IBAN (facultatif)
                  </label>
                  <input
                    type="text"
                    placeholder="Code IBAN si applicable"
                    value={form.iban}
                    onChange={(e) => setForm({ ...form, iban: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Notes ou instructions aux donateurs (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Compte dédié aux soutiens en USD. Préciser le nom du donateur en libellé."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Compte actif et visible immédiatement sur la page de soutien public</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  {editingAccount ? 'Enregistrer les modifications' : 'Ajouter le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation de suppression */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">
              Supprimer ce compte bancaire
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Êtes-vous certain de vouloir supprimer ce compte bancaire ? Les donateurs ne verront plus ce compte lors de leurs versements.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs shadow-xs"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

