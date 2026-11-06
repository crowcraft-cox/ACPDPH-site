const { readFileSync, writeFileSync } = require('fs');

// Fix 'const f = form as any;' unused variable in managers
// These files have this pattern — rename to _f or replace usage
const files = [
  'frontend/src/pages/admin/ProjectsManager.tsx',
  'frontend/src/pages/admin/JobsManager.tsx',
  'frontend/src/pages/admin/NewsManager.tsx',
  'frontend/src/pages/admin/PillarsManager.tsx',
];

for (const file of files) {
  let c = readFileSync(file, 'utf8');
  if (c.includes('const f = form as any;')) {
    // Replace all occurrences of this pattern and then replace 'f.' usages with 'form.'
    // Actually let's check what 'f' is used for
    const idx = c.indexOf('const f = form as any;');
    console.log(file, '- found f at', idx);
    console.log('Context:', c.substring(idx, idx + 300));
  }
}
