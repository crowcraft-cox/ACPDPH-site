const { readFileSync, writeFileSync } = require('fs');

const files = [
  'frontend/src/pages/admin/ProjectsManager.tsx',
  'frontend/src/pages/admin/JobsManager.tsx',
  'frontend/src/pages/admin/NewsManager.tsx',
  'frontend/src/pages/admin/PillarsManager.tsx',
];

for (const file of files) {
  let c = readFileSync(file, 'utf8');
  if (c.includes('\n  const f = form as any;\n')) {
    c = c.replace('\n  const f = form as any;\n', '\n');
    writeFileSync(file, c, 'utf8');
    console.log('Removed unused f in', file);
  } else if (c.includes('  const f = form as any;')) {
    c = c.replace('  const f = form as any;', '  // form available as typed object');
    writeFileSync(file, c, 'utf8');
    console.log('Commented f in', file);
  } else {
    console.log('No match in', file);
  }
}

