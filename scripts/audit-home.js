const fs = require('fs');
const content = fs.readFileSync('frontend/src/pages/Home.tsx', 'utf-8');
const lines = content.split('\n');

console.log('=== HOME.TSX AUDIT ===');
lines.forEach((l, i) => {
  const lineNum = i + 1;
  if (l.includes("lang === 'en'") || l.includes('lang ==') || l.includes('buildHeroHookTitle') || (l.includes('projects[') && l.includes('.title'))) {
    console.log(`L${lineNum}: ${l.trim()}`);
  }
});

