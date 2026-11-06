import React, { useEffect, useState } from 'react';
import { isAutoTranslateAvailable } from '../../services/translationService';
import type { Lang } from '../../i18n';

export type TranslationTabStatus = 'Manquant' | 'À relire' | 'Relu';

interface AdminLanguageTabsProps {
  currentLang: Lang;
  onLangChange: (lang: Lang) => void;
  onTranslateTab?: () => Promise<void>;
  onTranslateAll?: () => Promise<void>;
  isTranslating?: boolean;
  translateError?: string | null;
  statusByLang?: Partial<Record<Lang, TranslationTabStatus>>;
}

const TAB_CONFIG: Array<{ code: Lang; label: string }> = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
];

export const AdminLanguageTabs: React.FC<AdminLanguageTabsProps> = ({
  currentLang,
  onLangChange,
  onTranslateTab,
  onTranslateAll,
  isTranslating = false,
  translateError = null,
  statusByLang = {},
}) => {
  const [canAutoTranslate, setCanAutoTranslate] = useState(false);

  useEffect(() => {
    isAutoTranslateAvailable().then(setCanAutoTranslate);
  }, []);

  const getStatusBadgeStyle = (status: TranslationTabStatus) => {
    switch (status) {
      case 'Relu':
        return { background: '#065F46', color: '#A7F3D0' };
      case 'À relire':
        return { background: '#78350F', color: '#FDE68A' };
      case 'Manquant':
      default:
        return { background: '#374151', color: '#D1D5DB' };
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155',
          paddingBottom: '0.75rem',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {/* 4 Onglets de langue */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {TAB_CONFIG.map((tab) => {
            const isSelected = currentLang === tab.code;
            const isFr = tab.code === 'fr';
            const status: TranslationTabStatus = isFr
              ? 'Relu'
              : statusByLang[tab.code] || 'Manquant';
            const badgeStyle = getStatusBadgeStyle(status);

            return (
              <button
                key={tab.code}
                type="button"
                onClick={() => onLangChange(tab.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #3B82F6' : '1px solid #334155',
                  background: isSelected ? '#1D4ED8' : '#1E293B',
                  color: isSelected ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.2s',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    ...badgeStyle,
                  }}
                >
                  {isFr ? 'Obligatoire' : status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Boutons de traduction assistée (affichés si la clé Google est disponible sur le serveur) */}
        {canAutoTranslate && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {currentLang !== 'fr' && onTranslateTab && (
              <button
                type="button"
                onClick={onTranslateTab}
                disabled={isTranslating}
                className="admin-btn admin-btn-sm"
                style={{
                  background: '#0F766E',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: isTranslating ? 'not-allowed' : 'pointer',
                  opacity: isTranslating ? 0.7 : 1,
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>Traduire l&apos;onglet</span>
              </button>
            )}

            {onTranslateAll && (
              <button
                type="button"
                onClick={onTranslateAll}
                disabled={isTranslating}
                className="admin-btn admin-btn-sm"
                style={{
                  background: '#1E3A8A',
                  color: '#FFFFFF',
                  border: '1px solid #3B82F6',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: isTranslating ? 'not-allowed' : 'pointer',
                  opacity: isTranslating ? 0.7 : 1,
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>Traduire vers toutes les langues</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bannière d'état et d'information */}
      {currentLang !== 'fr' && (
        <div
          style={{
            marginTop: '0.625rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            background: '#0F172A',
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#94A3B8',
          }}
        >
          <div>
            <span>
              {statusByLang[currentLang] === 'À relire'
                ? 'Traduction automatique proposée — à relire avant publication.'
                : 'Les champs non renseignés retombent selon la cascade de repli (anglais puis français).'}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
            Statut : {statusByLang[currentLang] || 'Manquant'}
          </span>
        </div>
      )}

      {/* Message d'erreur éventuel */}
      {translateError && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            fontSize: '0.8rem',
          }}
        >
          {translateError}
        </div>
      )}
    </div>
  );
};
