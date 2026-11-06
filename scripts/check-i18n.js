const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../frontend/src/locales');
const languages = ['fr', 'en', 'it', 'de'];

const frDir = path.join(localesDir, 'fr');
const frFiles = fs.readdirSync(frDir).filter((f) => f.endsWith('.json')).sort();

console.log(`====================================================`);
console.log(`Checking 4 languages (fr, en, it, de) across ${frFiles.length} namespaces...`);
console.log(`====================================================`);

let hasError = false;
let totalKeysByLang = { fr: 0, en: 0, it: 0, de: 0 };

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

for (const file of frFiles) {
  const frContent = JSON.parse(fs.readFileSync(path.join(frDir, file), 'utf8'));
  const frKeys = getKeys(frContent).sort();
  totalKeysByLang.fr += frKeys.length;

  for (const lang of ['en', 'it', 'de']) {
    const targetPath = path.join(localesDir, lang, file);
    if (!fs.existsSync(targetPath)) {
      console.error(`[ERROR] Missing locale file for ${lang.toUpperCase()}: ${file}`);
      hasError = true;
      continue;
    }

    const content = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const keys = getKeys(content).sort();
    totalKeysByLang[lang] += keys.length;

    const missingInTarget = frKeys.filter((k) => !keys.includes(k));
    const extraInTarget = keys.filter((k) => !frKeys.includes(k));

    if (missingInTarget.length > 0) {
      console.error(`[ERROR] ${file} in ${lang.toUpperCase()} has missing keys:`, missingInTarget);
      hasError = true;
    }
    if (extraInTarget.length > 0) {
      console.error(`[ERROR] ${file} in ${lang.toUpperCase()} has unexpected extra keys:`, extraInTarget);
      hasError = true;
    }
  }

  if (!hasError) {
    console.log(`✓ ${file}: ${frKeys.length} keys in perfect parity across FR, EN, IT, DE`);
  }
}

console.log(`\n----------------------------------------------------`);
console.log(`Summary of verified keys:`);
for (const lang of languages) {
  console.log(`  - ${lang.toUpperCase()}: ${totalKeysByLang[lang]} keys`);
}
console.log(`----------------------------------------------------`);

if (hasError) {
  console.error('\n✗ Error: Key parity test failed.');
  process.exit(1);
} else {
  console.log('\n✓ 100% key parity achieved across all 4 languages (fr, en, it, de)!');
}
