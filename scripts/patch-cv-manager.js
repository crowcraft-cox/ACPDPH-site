const { readFileSync, writeFileSync } = require('fs');

const f = 'frontend/src/pages/admin/CvManager.tsx';
let c = readFileSync(f, 'utf8');

// 1. Add imports
const oldImports = "import { resolveImageUrl, compressImageToDataUrl } from '../../utils/imageUrl';";
const newImports = `import { resolveImageUrl, compressImageToDataUrl } from '../../utils/imageUrl';
import { translateFrTo, translateFrToAll } from '../../services/translationService';
import { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';
import type { TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';
import type { Lang } from '../../i18n';`;

c = c.replace(oldImports, newImports);

// 2. Add state & handlers
const oldStateAnchor = "  const fileInputRef = useRef<HTMLInputElement>(null);";
const newStateAndHandlers = `  // Multilingual state (FR, EN, IT, DE)
  const [cvLang, setCvLang] = useState<Lang>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const cvStatusByLang: Partial<Record<Lang, TranslationTabStatus>> = {
    en: !editingCv?.role_en && !editingCv?.about_en ? 'Manquant' : (editingCv?.needsReview_en ? 'À relire' : 'Relu'),
    it: !editingCv?.role_it && !editingCv?.about_it ? 'Manquant' : (editingCv?.needsReview_it ? 'À relire' : 'Relu'),
    de: !editingCv?.role_de && !editingCv?.about_de ? 'Manquant' : (editingCv?.needsReview_de ? 'À relire' : 'Relu'),
  };

  const handleTranslateCurrentTab = async () => {
    if (cvLang === 'fr' || !editingCv) return;
    const roleFr = editingCv.role || '';
    const aboutFr = editingCv.about || '';
    const skillsFr = (editingCv.skills || []).join('\\n');
    if (!roleFr.trim() && !aboutFr.trim() && !skillsFr.trim()) return;

    setIsTranslating(true);
    setTranslateError(null);
    try {
      const res = await translateFrTo([roleFr, aboutFr, skillsFr], cvLang as 'en' | 'it' | 'de');
      if (res.success && res.translations) {
        const [tRole, tAbout, tSkills] = res.translations;
        const parsedSkills = tSkills ? tSkills.split('\\n').map((s) => s.trim()).filter(Boolean) : [];
        setEditingCv({
          ...editingCv,
          [\`role_\${cvLang}\`]: tRole || editingCv[\`role_\${cvLang}\` as keyof MemberCv],
          [\`about_\${cvLang}\`]: tAbout || editingCv[\`about_\${cvLang}\` as keyof MemberCv],
          [\`skills_\${cvLang}\`]: parsedSkills.length > 0 ? parsedSkills : editingCv[\`skills_\${cvLang}\` as keyof MemberCv],
          [\`needsReview_\${cvLang}\`]: true,
        });
      } else {
        setTranslateError(res.error || \`Erreur de traduction vers \${cvLang}.\`);
      }
    } catch (err: any) {
      setTranslateError(err.message || 'Erreur de traduction.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateAll = async () => {
    if (!editingCv) return;
    const roleFr = editingCv.role || '';
    const aboutFr = editingCv.about || '';
    const skillsFr = (editingCv.skills || []).join('\\n');
    if (!roleFr.trim() && !aboutFr.trim() && !skillsFr.trim()) return;

    setIsTranslating(true);
    setTranslateError(null);
    try {
      const res = await translateFrToAll([roleFr, aboutFr, skillsFr]);
      if (res.success && res.translations) {
        const { en, it, de } = res.translations;
        setEditingCv({
          ...editingCv,
          role_en: en[0] || editingCv.role_en,
          about_en: en[1] || editingCv.about_en,
          skills_en: en[2] ? en[2].split('\\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_en,
          needsReview_en: true,
          role_it: it[0] || editingCv.role_it,
          about_it: it[1] || editingCv.about_it,
          skills_it: it[2] ? it[2].split('\\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_it,
          needsReview_it: true,
          role_de: de[0] || editingCv.role_de,
          about_de: de[1] || editingCv.about_de,
          skills_de: de[2] ? de[2].split('\\n').map((s) => s.trim()).filter(Boolean) : editingCv.skills_de,
          needsReview_de: true,
        });
      } else {
        setTranslateError(res.error || 'Erreur de traduction globale.');
      }
    } catch (err: any) {
      setTranslateError(err.message || 'Erreur de traduction.');
    } finally {
      setIsTranslating(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);`;

c = c.replace(oldStateAnchor, newStateAndHandlers);

// 3. Reset in openWizard
c = c.replace(
  "    setIsEditingFields(false);",
  "    setIsEditingFields(false);\n    setCvLang('fr');\n    setTranslateError(null);"
);

// 4. Update isEditingFields block to include AdminLanguageTabs
const oldFieldsTarget = `                      <h5 className="font-bold text-white uppercase text-sm border-b border-slate-800 pb-2">
                        Édition détaillée des données
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Prénom(s)</label>
                          <input
                            type="text"
                            value={editingCv.givenNames}
                            onChange={(e) => setEditingCv({ ...editingCv, givenNames: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Nom(s)</label>
                          <input
                            type="text"
                            value={editingCv.familyNames}
                            onChange={(e) => setEditingCv({ ...editingCv, familyNames: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Fonction officielle</label>
                        <input
                          type="text"
                          value={editingCv.role}
                          onChange={(e) => setEditingCv({ ...editingCv, role: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">À propos (Paragraphe de présentation)</label>
                        <textarea
                          rows={3}
                          value={editingCv.about}
                          onChange={(e) => setEditingCv({ ...editingCv, about: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Téléphone</label>
                          <input
                            type="text"
                            value={editingCv.contact?.phone || ''}
                            onChange={(e) =>
                              setEditingCv({
                                ...editingCv,
                                contact: { ...editingCv.contact, phone: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">E-mail</label>
                          <input
                            type="text"
                            value={editingCv.contact?.email || ''}
                            onChange={(e) =>
                              setEditingCv({
                                ...editingCv,
                                contact: { ...editingCv.contact, email: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Adresse</label>
                          <input
                            type="text"
                            value={editingCv.contact?.address || ''}
                            onChange={(e) =>
                              setEditingCv({
                                ...editingCv,
                                contact: { ...editingCv.contact, address: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      {/* Aperçu rapide des compétences */}
                      <div>
                        <label className="block text-slate-400 mb-1">
                          Compétences (séparées par des retours à la ligne)
                        </label>
                        <textarea
                          rows={3}
                          value={editingCv.skills?.join('\\n') || ''}
                          onChange={(e) =>
                            setEditingCv({
                              ...editingCv,
                              skills: e.target.value.split('\\n').filter((s) => s.trim().length > 0),
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                        />
                      </div>`;

const newFieldsReplacement = `                      <h5 className="font-bold text-white uppercase text-sm border-b border-slate-800 pb-2">
                        Édition détaillée des données
                      </h5>

                      <AdminLanguageTabs
                        currentLang={cvLang}
                        onLangChange={setCvLang}
                        onTranslateTab={cvLang !== 'fr' ? handleTranslateCurrentTab : undefined}
                        onTranslateAll={handleTranslateAll}
                        isTranslating={isTranslating}
                        translateError={translateError}
                        statusByLang={cvStatusByLang}
                      />

                      {cvLang === 'fr' ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1">Prénom(s)</label>
                              <input
                                type="text"
                                value={editingCv.givenNames}
                                onChange={(e) => setEditingCv({ ...editingCv, givenNames: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Nom(s)</label>
                              <input
                                type="text"
                                value={editingCv.familyNames}
                                onChange={(e) => setEditingCv({ ...editingCv, familyNames: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">Fonction officielle (FR)</label>
                            <input
                              type="text"
                              value={editingCv.role}
                              onChange={(e) => setEditingCv({ ...editingCv, role: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">À propos (FR)</label>
                            <textarea
                              rows={3}
                              value={editingCv.about}
                              onChange={(e) => setEditingCv({ ...editingCv, about: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1">Téléphone</label>
                              <input
                                type="text"
                                value={editingCv.contact?.phone || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, phone: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">E-mail</label>
                              <input
                                type="text"
                                value={editingCv.contact?.email || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, email: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Adresse</label>
                              <input
                                type="text"
                                value={editingCv.contact?.address || ''}
                                onChange={(e) =>
                                  setEditingCv({
                                    ...editingCv,
                                    contact: { ...editingCv.contact, address: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Compétences (FR, une par ligne)
                            </label>
                            <textarea
                              rows={3}
                              value={editingCv.skills?.join('\\n') || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  skills: e.target.value.split('\\n').filter((s) => s.trim().length > 0),
                                })
                              }
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              Traduction ({cvLang.toUpperCase()})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const key = \`needsReview_\${cvLang}\` as keyof MemberCv;
                                setEditingCv({
                                  ...editingCv,
                                  [key]: !editingCv[key],
                                });
                              }}
                              className={\`px-2.5 py-0.5 rounded text-[11px] font-semibold border cursor-pointer \${
                                editingCv[\`needsReview_\${cvLang}\` as keyof MemberCv]
                                  ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                                  : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                              }\`}
                            >
                              {editingCv[\`needsReview_\${cvLang}\` as keyof MemberCv]
                                ? 'Marquer comme relu'
                                : 'Statut : Relu'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Fonction officielle ({cvLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={(editingCv[\`role_\${cvLang}\` as keyof MemberCv] as string) || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [\`role_\${cvLang}\`]: e.target.value,
                                  [\`needsReview_\${cvLang}\`]: false,
                                })
                              }
                              placeholder={\`Fonction en \${cvLang.toUpperCase()}\`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              À propos ({cvLang.toUpperCase()})
                            </label>
                            <textarea
                              rows={3}
                              value={(editingCv[\`about_\${cvLang}\` as keyof MemberCv] as string) || ''}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [\`about_\${cvLang}\`]: e.target.value,
                                  [\`needsReview_\${cvLang}\`]: false,
                                })
                              }
                              placeholder={\`À propos en \${cvLang.toUpperCase()}\`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1">
                              Compétences ({cvLang.toUpperCase()}, une par ligne)
                            </label>
                            <textarea
                              rows={3}
                              value={((editingCv[\`skills_\${cvLang}\` as keyof MemberCv] as string[]) || []).join('\\n')}
                              onChange={(e) =>
                                setEditingCv({
                                  ...editingCv,
                                  [\`skills_\${cvLang}\`]: e.target.value.split('\\n').filter((s) => s.trim().length > 0),
                                  [\`needsReview_\${cvLang}\`]: false,
                                })
                              }
                              placeholder={\`Compétences en \${cvLang.toUpperCase()}\`}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                            />
                          </div>
                        </div>
                      )}`;

if (c.includes(oldFieldsTarget)) {
  c = c.replace(oldFieldsTarget, newFieldsReplacement);
  writeFileSync(f, c, 'utf8');
  console.log('Successfully patched CvManager.tsx!');
} else {
  console.error('Could not find oldFieldsTarget in CvManager.tsx');
  process.exit(1);
}
