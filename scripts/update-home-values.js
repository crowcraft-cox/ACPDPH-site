const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../frontend/src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

const oldValues = `const VALUES_DATA: ValueItem[] = [
  {
    id: "professionnalisme",
    name: "Professionnalisme",
    icon: IconProfessionnalisme,
    explanation:
      "L'ACPDPH applique une rigueur exemplaire, de la transparence et des standards éthiques élevés dans la conduite de tous ses projets sur le terrain. Nos interventions reposent sur une gestion responsable des ressources, une expertise technique éprouvée et une obligation constante de redevabilité envers nos bénéficiaires et nos partenaires institutionnels. Cette exigence garantit un impact durable et mesurable pour l'inclusion des personnes en situation de handicap.",
    link: "/about",
  },
  {
    id: "solidarite",
    name: "Solidarité",
    icon: IconSolidarite,
    explanation:
      "Nous croyons fermement à la force de l'entraide communautaire et à l'action collective pour surmonter les barrières de l'exclusion. L'ACPDPH mobilise les personnes vivant avec handicap, leurs familles et les acteurs locaux dans un esprit de fraternité et de soutien mutuel. En unissant nos forces au quotidien, nous construisons un filet de protection sociale et favorisons une véritable résilience communautaire.",
    link: "/about",
  },
  {
    id: "non-discrimination",
    name: "Non-discrimination",
    icon: IconNonDiscrimination,
    explanation:
      "L'égalité absolue de traitement et l'égalité des chances pour chaque individu constituent le fondement inaliénable de notre engagement. Nous luttons vigoureusement contre tous les préjugés, les stigmatisations et les disparités d'accès qui marginalisent les personnes handicapées dans la société congolaise. Chaque citoyen, sans distinction aucune, a le droit légitime de participer pleinement à la vie publique, économique et citoyenne.",
    link: "/about",
  },
  {
    id: "dignite-humaine",
    name: "Respect de la dignité humaine",
    icon: IconDigniteHumaine,
    explanation:
      "Chaque personne possède une valeur intrinsèque inestimable et des droits universels qui doivent être reconnus, protégés et promus sans réserve. Notre approche place l'individu au cœur de nos actions en valorisant son autonomie, sa voix et sa capacité d'autodétermination. Préserver et restaurer la dignité de chacun est au centre de notre combat pour la justice sociale.",
    link: "/about",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    icon: IconBienEtre,
    explanation:
      "L'épanouissement global de la personne, tant sur le plan physique et psychologique que social et économique, guide nos programmes intégrés. Nous facilitons l'accès aux soins de santé adaptés, à la réadaptation fonctionnelle, à l'éducation inclusive et aux opportunités de subsistance autonome. Favoriser le bien-être, c'est offrir à chacun la possibilité de mener une vie équilibrée, autonome et digne.",
    link: "/about",
  },
];`;

const newValues = `const GET_VALUES_DATA = (lang: string): ValueItem[] => [
  {
    id: "professionnalisme",
    name: lang === "en" ? "Professionalism" : "Professionnalisme",
    icon: IconProfessionnalisme,
    explanation: lang === "en"
      ? "ACPDPH applies exemplary rigor, transparency, and high ethical standards across all field projects. Our interventions rest on responsible resource management, proven technical expertise, and constant accountability to our beneficiaries and institutional partners. This rigor ensures lasting, measurable impact for the inclusion of persons with disabilities."
      : "L'ACPDPH applique une rigueur exemplaire, de la transparence et des standards éthiques élevés dans la conduite de tous ses projets sur le terrain. Nos interventions reposent sur une gestion responsable des ressources, une expertise technique éprouvée et une obligation constante de redevabilité envers nos bénéficiaires et nos partenaires institutionnels. Cette exigence garantit un impact durable et mesurable pour l'inclusion des personnes en situation de handicap.",
    link: "/about",
  },
  {
    id: "solidarite",
    name: lang === "en" ? "Solidarity" : "Solidarité",
    icon: IconSolidarite,
    explanation: lang === "en"
      ? "We firmly believe in community mutual support and collective action to overcome barriers of exclusion. ACPDPH rallies persons with disabilities, their families, and local actors in a spirit of fellowship and mutual assistance, building a social safety net and fostering community resilience."
      : "Nous croyons fermement à la force de l'entraide communautaire et à l'action collective pour surmonter les barrières de l'exclusion. L'ACPDPH mobilise les personnes vivant avec handicap, leurs familles et les acteurs locaux dans un esprit de fraternité et de soutien mutuel. En unissant nos forces au quotidien, nous construisons un filet de protection sociale et favorisons une véritable résilience communautaire.",
    link: "/about",
  },
  {
    id: "non-discrimination",
    name: lang === "en" ? "Non-discrimination" : "Non-discrimination",
    icon: IconNonDiscrimination,
    explanation: lang === "en"
      ? "Absolute equality of treatment and opportunities for every individual forms the inalienable foundation of our commitment. We actively combat prejudice, stigma, and access disparities that marginalize persons with disabilities in Congolese society. Every citizen has the legitimate right to fully participate in public, economic, and civic life."
      : "L'égalité absolue de traitement et l'égalité des chances pour chaque individu constituent le fondement inaliénable de notre engagement. Nous luttons vigoureusement contre tous les préjugés, les stigmatisations et les disparités d'accès qui marginalisent les personnes handicapées dans la société congolaise. Chaque citoyen, sans distinction aucune, a le droit légitime de participer pleinement à la vie publique, économique et citoyenne.",
    link: "/about",
  },
  {
    id: "dignite-humaine",
    name: lang === "en" ? "Respect for Human Dignity" : "Respect de la dignité humaine",
    icon: IconDigniteHumaine,
    explanation: lang === "en"
      ? "Every person possesses priceless intrinsic worth and universal rights that must be acknowledged, protected, and championed without reservation. Our approach places the person at the core of our work, valuing their autonomy, voice, and self-determination."
      : "Chaque personne possède une valeur intrinsèque inestimable et des droits universels qui doivent être reconnus, protégés et promus sans réserve. Notre approche place l'individu au cœur de nos actions en valorisant son autonomie, sa voix et sa capacité d'autodétermination. Préserver et restaurer la dignité de chacun est au centre de notre combat pour la justice sociale.",
    link: "/about",
  },
  {
    id: "bien-etre",
    name: lang === "en" ? "Well-being" : "Bien-être",
    icon: IconBienEtre,
    explanation: lang === "en"
      ? "Comprehensive personal growth—physically, psychologically, socially, and economically—guides our integrated programs. We facilitate access to adapted healthcare, functional rehabilitation, inclusive education, and sustainable livelihoods."
      : "L'épanouissement global de la personne, tant sur le plan physique et psychologique que social et économique, guide nos programmes intégrés. Nous facilitons l'accès aux soins de santé adaptés, à la réadaptation fonctionnelle, à l'éducation inclusive et aux opportunités de subsistance autonome. Favoriser le bien-être, c'est offrir à chacun la possibilité de mener une vie équilibrée, autonome et digne.",
    link: "/about",
  },
];`;

content = content.replace(oldValues, newValues);

// Update ValuesSection usage:
content = content.replace(
  "  const currentVal = VALUES_DATA[displayIndex] || VALUES_DATA[0];",
  `  const valuesData = useMemo(() => GET_VALUES_DATA(lang), [lang]);
  const currentVal = valuesData[displayIndex] || valuesData[0];`
);

content = content.replace(
  "const count = VALUES_DATA.length;",
  "const count = valuesData.length;"
);

content = content.replace(
  "{VALUES_DATA.map((val, idx) => {",
  "{valuesData.map((val, idx) => {"
);

// Add useMemo to imports if not present
if (!content.includes("useMemo")) {
  content = content.replace("import { useState, useEffect, useRef }", "import { useState, useEffect, useRef, useMemo }");
}

fs.writeFileSync(homePath, content, 'utf8');
console.log('Values in Home.tsx updated successfully');

