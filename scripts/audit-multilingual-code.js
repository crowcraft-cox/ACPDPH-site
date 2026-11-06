const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

const frontendSrc = path.join(__dirname, '..', 'frontend', 'src');

console.log('=== AUDIT DES MOTIFS MULTILINGUES INCOMPLETS DANS LE CODE ===\n');

// 1. Chercher tous les "lang === 'en'" qui n'ont pas de 'it' ou 'de' sur la même ligne ou les 3 suivantes
const langEnMatches = [];
// 2. Chercher les champs accédés en direct sans getLocalized sur les entités (project.title, etc.)
const directFieldMatches = [];

walkDir(frontendSrc, (file) => {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
  if (file.includes('locales')) return;
  
  const relPath = path.relative(path.join(__dirname, '..'), file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check ternary lang === 'en'
    if (line.includes("lang === 'en'") || line.includes('lang === "en"')) {
      const surrounding = lines.slice(idx, idx + 5).join(' ');
      if (!surrounding.includes("'it'") && !surrounding.includes('"it"') && !surrounding.includes("'de'") && !surrounding.includes('"de"')) {
        langEnMatches.push({
          file: relPath,
          lineNum: idx + 1,
          line: line.trim(),
          context: surrounding.trim().slice(0, 150)
        });
      }
    }

    // Check direct project.title etc in public pages (excluding admin managers and types)
    if (!relPath.includes('admin') && !relPath.includes('types') && !relPath.includes('i18n')) {
      if (line.match(/\b(project|proj|article|job|pillar|member)\.(title|description|role|about|excerpt|missions|profile)\b/) &&
          !line.includes('getLocalized') && !line.includes('_en') && !line.includes('_it') && !line.includes('_de') && !line.includes('title_')) {
        directFieldMatches.push({
          file: relPath,
          lineNum: idx + 1,
          line: line.trim()
        });
      }
    }
  });
});

console.log(`--- MOTIF 1: "lang === 'en'" SANS IT/DE (${langEnMatches.length} occurrences trouvées) ---`);
langEnMatches.forEach(m => {
  console.log(`[${m.file}:${m.lineNum}] ${m.line}`);
});

console.log(`\n--- MOTIF 2: ACCÈS DIRECT SANS getLocalized SUR PAGES PUBLIQUES (${directFieldMatches.length} occurrences trouvées) ---`);
directFieldMatches.slice(0, 50).forEach(m => {
  console.log(`[${m.file}:${m.lineNum}] ${m.line}`);
});

