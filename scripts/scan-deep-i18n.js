const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'frontend', 'src');

function getFiles(dir, exts = ['.tsx', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('locales')) {
        results = results.concat(getFiles(full, exts));
      }
    } else if (exts.some(ext => file.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const files = getFiles(srcDir);
console.log('Total files to scan:', files.length);

const results = [];

for (const file of files) {
  const rel = path.relative(srcDir, file).replace(/\\/g, '/');
  if (rel.startsWith('locales') || rel.startsWith('i18n') || rel.includes('test') || rel.includes('scripts')) continue;
  
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    // Check 1: lang === 'en' without it/de
    if (line.includes("lang === 'en'") && !line.includes("lang === 'it'") && !line.includes("lang === 'de'")) {
      results.push({ type: 'BINARY_LANG_CHECK', file: rel, lineNum, line: line.trim() });
    }
    // Check 2: Direct unlocalized project/news/job/pillar field access
    if (/(?:projects?|news|article|jobs?|pillar|item|proj|member)\.(?:title|description|excerpt|missions|bulletPoints|bio|role|qualification)\b/.test(line)) {
      if (!line.includes('getLocalized') && !line.includes('_en') && !line.includes('_it') && !line.includes('_de') && !line.includes('interface') && !line.includes('type ') && !file.includes('admin') && !file.includes('context')) {
        results.push({ type: 'DIRECT_FIELD_ACCESS', file: rel, lineNum, line: line.trim() });
      }
    }
    // Check 3: Bare Link to= on public pages (not admin)
    if (line.includes('<Link') && line.includes('to="/') && !line.includes('getLocalizedPath') && !file.includes('admin')) {
      results.push({ type: 'BARE_LINK', file: rel, lineNum, line: line.trim() });
    }
  });
}

console.log('--- SCAN RESULTS BY CATEGORY ---');
const byType = {};
results.forEach(r => {
  byType[r.type] = (byType[r.type] || 0) + 1;
});
console.log(byType);

console.log('\n--- SCAN RESULTS BY FILE ---');
const byFile = {};
results.forEach(r => {
  if (!byFile[r.file]) byFile[r.file] = [];
  byFile[r.file].push(r);
});
for (const [f, items] of Object.entries(byFile)) {
  console.log(`\n[${f}] (${items.length} issues):`);
  items.slice(0, 15).forEach(i => console.log(`  L${i.lineNum} [${i.type}]: ${i.line.slice(0, 95)}`));
  if (items.length > 15) console.log(`  ... et ${items.length - 15} autres.`);
}

