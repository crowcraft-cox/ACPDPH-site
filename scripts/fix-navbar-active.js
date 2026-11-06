const { readFileSync, writeFileSync } = require('fs');
const f = 'frontend/src/components/layout/Navbar.tsx';
let c = readFileSync(f, 'utf8');

// Fix isItemActive to strip /it and /de prefixes too
const oldPattern = "const cleanCurrent = location.pathname.replace(/^\\/en(\\/|$)/, '/');";
const newPattern = "const cleanCurrent = location.pathname.replace(/^\\/en(\\/|$)/, '/').replace(/^\\/it(\\/|$)/, '/').replace(/^\\/de(\\/|$)/, '/');";

if (c.includes(oldPattern)) {
  c = c.replace(oldPattern, newPattern);
  writeFileSync(f, c, 'utf8');
  console.log('Fixed isItemActive OK');
} else {
  // try to find it
  const idx = c.indexOf('cleanCurrent');
  console.log('cleanCurrent at:', idx);
  console.log(JSON.stringify(c.substring(idx - 10, idx + 200)));
}

// Also fix getLocalizedPath usage for /it /de in contact detection
const oldContact = 'const isContactActive = location.pathname.replace(/^\\/en(\\/|$)/, \'/\') === \'/contact\';';
const newContact = 'const isContactActive = location.pathname.replace(/^\\/en(\\/|$)/, \'/\').replace(/^\\/it(\\/|$)/, \'/\').replace(/^\\/de(\\/|$)/, \'/\') === \'/contact\';';
if (c.includes(oldContact)) {
  c = c.replace(oldContact, newContact);
  writeFileSync(f, c, 'utf8');
  console.log('Fixed isContactActive OK');
}

