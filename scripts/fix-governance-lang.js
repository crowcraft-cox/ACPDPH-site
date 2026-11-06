const { readFileSync, writeFileSync } = require('fs');

// Fix Governance.tsx - update MemberCard to use Lang type properly
let c = readFileSync('frontend/src/pages/Governance.tsx', 'utf8');

// Import Lang type
if (!c.includes("import type { Lang }") && !c.includes("import { Lang }")) {
  c = c.replace(
    "import { useI18n, getLocalizedPath } from '../i18n';",
    "import { useI18n, getLocalizedPath, type Lang } from '../i18n';"
  );
  console.log('Added Lang import');
}

// Revert lang type in MemberCardProps back to Lang (not string)
c = c.replace(
  "  lang: string;\n}",
  "  lang: Lang;\n}"
);

writeFileSync('frontend/src/pages/Governance.tsx', c, 'utf8');
console.log('Fixed Governance.tsx Lang type');

// Fix JobDetail.tsx - import Lang type and fix formatDeadline  
let jd = readFileSync('frontend/src/pages/JobDetail.tsx', 'utf8');
if (!jd.includes("import { useI18n, getLocalized }")) {
  console.log('JobDetail import not found as expected');
}
// The formatDeadline signature already fixed to 'string', should work
// But lang comes from useI18n which returns Lang — string is broader, OK
console.log('JobDetail.tsx should be fine with string type');

