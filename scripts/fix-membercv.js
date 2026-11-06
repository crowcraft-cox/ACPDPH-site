const { readFileSync, writeFileSync } = require('fs');
const f = 'frontend/src/pages/MemberCv.tsx';
let c = readFileSync(f, 'utf8');

// Fix loading text
c = c.replace(
  "{lang === 'en' ? 'Loading biographical profile...' : 'Chargement du curriculum vitae...'}",
  "{lang === 'en' ? 'Loading biographical profile...' : lang === 'it' ? 'Caricamento del curriculum vitae...' : lang === 'de' ? 'Lebenslauf wird geladen...' : 'Chargement du curriculum vitae...'}"
);

// Fix not-found title
c = c.replace(
  "{lang === 'en' ? 'This profile is not available.' : \"Ce CV n'est pas disponible.\"}",
  "{lang === 'en' ? 'This profile is not available.' : lang === 'it' ? 'Questo profilo non è disponibile.' : lang === 'de' ? 'Dieses Profil ist nicht verfügbar.' : \"Ce CV n'est pas disponible.\"}"
);

// Fix not-found description
c = c.replace(
  `{lang === 'en'
            ? 'The requested profile has not been published yet or is temporarily unavailable.'
            : "Le profil demandé n'a pas encore été publié ou a été temporairement retiré par l'administration."}`,
  `{lang === 'en'
            ? 'The requested profile has not been published yet or is temporarily unavailable.'
            : lang === 'it'
            ? "Il profilo richiesto non è ancora stato pubblicato o è temporaneamente non disponibile."
            : lang === 'de'
            ? "Das angeforderte Profil wurde noch nicht veröffentlicht oder ist vorübergehend nicht verfügbar."
            : "Le profil demandé n'a pas encore été publié ou a été temporairement retiré par l'administration."}`
);

// Fix back link texts
c = c.replace(
  /\{lang === 'en' \? 'Back to governance' : 'Retour à la gouvernance'\}/g,
  "{lang === 'en' ? 'Back to governance' : lang === 'it' ? 'Torna alla governance' : lang === 'de' ? 'Zurück zur Governance' : 'Retour à la gouvernance'}"
);

// Fix photo alt texts
c = c.replace(
  /lang === 'en' \? `Photo of \$\{cv\.givenNames\} \$\{cv\.familyNames\}` : `Photo de \$\{cv\.givenNames\} \$\{cv\.familyNames\}`/g,
  "lang === 'en' ? `Photo of ${cv.givenNames} ${cv.familyNames}` : lang === 'it' ? `Foto di ${cv.givenNames} ${cv.familyNames}` : lang === 'de' ? `Foto von ${cv.givenNames} ${cv.familyNames}` : `Photo de ${cv.givenNames} ${cv.familyNames}`"
);

// Fix section headings
c = c.replace(
  "{lang === 'en' ? 'ABOUT' : 'À PROPOS'}",
  "{lang === 'en' ? 'ABOUT' : lang === 'it' ? 'CHI SONO' : lang === 'de' ? 'ÜBER MICH' : 'À PROPOS'}"
);
c = c.replace(
  "{lang === 'en' ? 'SKILLS' : 'COMPÉTENCES'}",
  "{lang === 'en' ? 'SKILLS' : lang === 'it' ? 'COMPETENZE' : lang === 'de' ? 'KOMPETENZEN' : 'COMPÉTENCES'}"
);
c = c.replace(
  "{lang === 'en' ? 'LANGUAGES' : 'LANGUES'}",
  "{lang === 'en' ? 'LANGUAGES' : lang === 'it' ? 'LINGUE' : lang === 'de' ? 'SPRACHEN' : 'LANGUES'}"
);
c = c.replace(
  "{lang === 'en' ? 'EXPERIENCE' : 'EXPÉRIENCE'}",
  "{lang === 'en' ? 'EXPERIENCE' : lang === 'it' ? 'ESPERIENZA' : lang === 'de' ? 'ERFAHRUNG' : 'EXPÉRIENCE'}"
);
c = c.replace(
  "{lang === 'en' ? 'EDUCATION' : 'FORMATION'}",
  "{lang === 'en' ? 'EDUCATION' : lang === 'it' ? 'FORMAZIONE' : lang === 'de' ? 'AUSBILDUNG' : 'FORMATION'}"
);

writeFileSync(f, c, 'utf8');
console.log('MemberCv.tsx fixed OK');

