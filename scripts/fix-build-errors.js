const { readFileSync, writeFileSync } = require('fs');

// ─────────────────────────────────────────────────────────────
// 1. Fix TranslationTabStatus import in all admin managers
// ─────────────────────────────────────────────────────────────
const adminFiles = [
  'frontend/src/pages/admin/GalleryManager.tsx',
  'frontend/src/pages/admin/GovernanceManager.tsx',
  'frontend/src/pages/admin/JobsManager.tsx',
  'frontend/src/pages/admin/NewsManager.tsx',
  'frontend/src/pages/admin/PillarsManager.tsx',
  'frontend/src/pages/admin/ProjectsManager.tsx',
];

const oldImport = "import { AdminLanguageTabs, TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';";
const newImport = "import { AdminLanguageTabs } from '../../components/admin/AdminLanguageTabs';\nimport type { TranslationTabStatus } from '../../components/admin/AdminLanguageTabs';";

for (const f of adminFiles) {
  let c = readFileSync(f, 'utf8');
  if (c.includes(oldImport)) {
    c = c.replace(oldImport, newImport);
    writeFileSync(f, c, 'utf8');
    console.log('Fixed import in', f);
  } else {
    console.log('Import not found (maybe already fixed) in', f);
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Fix unused 'f' variables in managers (rename to _f or remove)
// ─────────────────────────────────────────────────────────────
const managersWithF = [
  'frontend/src/pages/admin/JobsManager.tsx',
  'frontend/src/pages/admin/NewsManager.tsx',
  'frontend/src/pages/admin/PillarsManager.tsx',
  'frontend/src/pages/admin/ProjectsManager.tsx',
];
for (const f of managersWithF) {
  let c = readFileSync(f, 'utf8');
  // Replace unused 'f' catch variable patterns like: } catch (f) { or .catch((f) =>
  // The common pattern from translateFrTo is: } catch (err: any) { — but unused var is likely named 'f'
  // Let's find and replace specific patterns
  c = c.replace(/\} catch \(f\) \{/g, '} catch (_err) {');
  c = c.replace(/\.catch\(\(f\) =>/g, '.catch((_err) =>');
  // Also handle: const f = ... patterns that are unused
  // This pattern: 'f' is declared but its value is never read — likely from destructuring or assignment
  writeFileSync(f, c, 'utf8');
}

// Check the actual unused 'f' in ProjectsManager
const pm = readFileSync('frontend/src/pages/admin/ProjectsManager.tsx', 'utf8');
const lines = pm.split('\n');
console.log('ProjectsManager line 246 context:');
for (let i = 243; i <= 249 && i < lines.length; i++) {
  console.log(i+1 + ':', lines[i]);
}

// ─────────────────────────────────────────────────────────────
// 3. Fix process references in i18n/index.tsx
// ─────────────────────────────────────────────────────────────
const i18nF = 'frontend/src/i18n/index.tsx';
let i18nC = readFileSync(i18nF, 'utf8');

// Remove the process.env.NODE_ENV checks (they're just dev warnings, safe to remove)
i18nC = i18nC.replace(
  /\s+if \(i > 0 && typeof process !== 'undefined' && process\.env\?\.NODE_ENV === 'development'\) \{\s+console\.warn\(`\[i18n fallback\] \$\{field\}: fallback de "\$\{lang\}" vers "\$\{l\}"\`\);\s+\}\s+/g,
  '\n          '
);
i18nC = i18nC.replace(
  /\s+if \(i > 0 && typeof process !== 'undefined' && process\.env\?\.NODE_ENV === 'development'\) \{\s+console\.warn\(`\[i18n fallback\] \$\{field\}: fallback array de "\$\{lang\}" vers "\$\{l\}"\`\);\s+\}\s+/g,
  '\n          '
);

writeFileSync(i18nF, i18nC, 'utf8');
console.log('Fixed i18n/index.tsx process references');

// ─────────────────────────────────────────────────────────────
// 4. Fix Governance.tsx MemberCard lang prop type
// ─────────────────────────────────────────────────────────────
let govC = readFileSync('frontend/src/pages/Governance.tsx', 'utf8');
// Change the MemberCard interface from 'fr' | 'en' to Lang
govC = govC.replace(
  "  lang: 'fr' | 'en';\n}",
  "  lang: string;\n}"
);
// Also fix the MemberCard component itself
govC = govC.replace(
  "function MemberCard({ name, role, photo, cvSlug, lang }: MemberCardProps) {",
  "function MemberCard({ name, role, photo, cvSlug, lang }: MemberCardProps) {"
);
writeFileSync('frontend/src/pages/Governance.tsx', govC, 'utf8');
console.log('Fixed Governance.tsx lang type');

// ─────────────────────────────────────────────────────────────
// 5. Fix JobDetail.tsx formatDeadline lang type
// ─────────────────────────────────────────────────────────────
let jdC = readFileSync('frontend/src/pages/JobDetail.tsx', 'utf8');
jdC = jdC.replace(
  "const formatDeadline = (dateStr?: string, lang: 'fr' | 'en' = 'fr') => {",
  "const formatDeadline = (dateStr?: string, lang: string = 'fr') => {"
);
jdC = jdC.replace(
  "return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'fr-FR', {",
  "return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang === 'it' ? 'it-IT' : lang === 'de' ? 'de-DE' : 'fr-FR', {"
);
writeFileSync('frontend/src/pages/JobDetail.tsx', jdC, 'utf8');
console.log('Fixed JobDetail.tsx lang type');

// ─────────────────────────────────────────────────────────────
// 6. Fix MemberCv.tsx implicit any on bullet/bIdx
// ─────────────────────────────────────────────────────────────
let mcC = readFileSync('frontend/src/pages/MemberCv.tsx', 'utf8');
mcC = mcC.replace(
  '{exp.bullets.map((bullet, bIdx) => (',
  '{exp.bullets.map((bullet: string, bIdx: number) => ('
);
writeFileSync('frontend/src/pages/MemberCv.tsx', mcC, 'utf8');
console.log('Fixed MemberCv.tsx bullet types');

console.log('\nAll fixes applied.');
