const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../frontend/src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// 1. Ensure React imports include useMemo
content = content.replace(
  /import \{ useState, useEffect, useRef \} from 'react';/,
  "import { useState, useEffect, useRef, useMemo } from 'react';"
);

// 2. Ensure useI18n imports include getLocalized
content = content.replace(
  /import \{ useI18n \} from '\.\.\/i18n';/,
  "import { useI18n, getLocalized } from '../i18n';"
);

// 3. Fix HeroSection destructuring
content = content.replace(
  /function HeroSection\(\) \{\s+const \{ t \} = useI18n\(\);/,
  "function HeroSection() {\n  const { t, lang, getLocalizedPath } = useI18n();"
);

// 4. Fix AboutSection
const aboutOldRegex = /function AboutSection\(\) \{\s+const \{ ref: sectionRef, isVisible \} = useScrollReveal\(\);\s+const paragraphs = \[[\s\S]*?\];/;
const aboutNew = `function AboutSection() {
  const { lang, getLocalizedPath } = useI18n();
  const { ref: sectionRef, isVisible } = useScrollReveal();

  const paragraphs = lang === 'en' ? [
    "The Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH) is a national, non-political, non-profit NGO founded on December 3, 2018 in Beni, North Kivu province, Democratic Republic of the Congo.",
    "Our mission is to promote the rights, inclusion, and empowerment of persons with disabilities by fostering equal opportunities, access to essential services, and full participation in social, economic, and community life.",
    "Through a community-based human rights approach, our interventions focus on inclusive education, healthcare, protection, humanitarian assistance, combating gender-based violence, and economic empowerment.",
    "We strive for an inclusive, equitable, and supportive society where every person with a disability can fully exercise their rights, develop their potential, and actively contribute to community development.",
    "Our vision: building a society free from disability-based discrimination, where every person with a disability thrives in socio-economic well-being."
  ] : [
    "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est une ONG nationale, apolitique et sans but lucratif, créée le 3 décembre 2018 à Beni, dans la province du Nord-Kivu, en République démocratique du Congo.",
    "Notre mission est de promouvoir les droits, l'inclusion et l'autonomisation des personnes handicapées, en favorisant l'égalité des chances, l'accès aux services essentiels et la pleine participation à la vie sociale, économique et communautaire.",
    "À travers une approche communautaire fondée sur les droits humains, nous intervenons notamment dans l'éducation inclusive, la santé, la protection, l'assistance humanitaire, la lutte contre les violences basées sur le genre et l'autonomisation économique.",
    "Nous œuvrons pour une society inclusive, juste et solidaire, dans laquelle chaque personne handicapée peut exercer pleinement ses droits, développer son potentiel et contribuer activement au développement de sa communauté.",
    "Notre vision : bâtir une société sans discrimination fondée sur le handicap, où chaque personne handicapée vit dans un état de bien-être socio-économique."
  ];`;
content = content.replace(aboutOldRegex, aboutNew);

// In AboutSection, update link & title
content = content.replace(
  /<span className="about-line-light" aria-hidden="true">À propos<\/span>/,
  '<span className="about-line-light" aria-hidden="true">{lang === "en" ? "About Us" : "À propos"}</span>'
);
content = content.replace(
  /<span className="sr-only">À propos de l'ACPDPH<\/span>/,
  '<span className="sr-only">{lang === "en" ? "About ACPDPH" : "À propos de l\'ACPDPH"}</span>'
);
content = content.replace(
  /to="\/about"\s+className="about-cta-btn"\s+aria-label="Lire plus sur l'ACPDPH"\s*>\s*Lire plus/,
  'to={getLocalizedPath("/about")}\n              className="about-cta-btn"\n              aria-label={lang === "en" ? "Read more about ACPDPH" : "Lire plus sur l\'ACPDPH"}\n            >\n              {lang === "en" ? "Read more" : "Lire plus"}'
);

// 5. Fix ImpactSection & PrimaryCounterCard
content = content.replace(
  /function ImpactSection\(\) \{\s+const \{ t \} = useI18n\(\);/,
  "function ImpactSection() {\n  const { t, lang } = useI18n();"
);

content = content.replace(
  /function PrimaryCounterCard\(\{ value, label, description \}: \{ value: number; label: string; description: string \}\) \{/,
  "function PrimaryCounterCard({ value, label, description }: { value: number; label: string; description: string }) {\n  const { lang } = useI18n();"
);

// 6. Fix PillarsSection
content = content.replace(
  /function PillarsSection\(\) \{\s+const \{ t \} = useI18n\(\);/,
  "function PillarsSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();"
);

// 7. Fix VALUES_DATA to getValuesData(lang)
const getValuesDataFn = `function getValuesData(lang: string): ValueItem[] {
  return [
    {
      id: "professionnalisme",
      name: lang === 'en' ? "Professionalism" : "Professionnalisme",
      icon: IconProfessionnalisme,
      explanation: lang === 'en'
        ? "ACPDPH applies exemplary rigor, transparency, and high ethical standards across all field initiatives. Our interventions rely on responsible resource management, verified technical expertise, and continuous accountability towards our beneficiaries and institutional partners."
        : "L'ACPDPH applique une rigueur exemplaire, de la transparence et des standards éthiques élevés dans la conduite de tous ses projets sur le terrain. Nos interventions reposent sur une gestion responsable des ressources, une expertise technique éprouvée et une obligation constante de redevabilité envers nos bénéficiaires et nos partenaires institutionnels. Cette exigence garantit un impact durable et mesurable pour l'inclusion des personnes en situation de handicap.",
      link: "/about",
    },
    {
      id: "solidarite",
      name: lang === 'en' ? "Solidarity" : "Solidarité",
      icon: IconSolidarite,
      explanation: lang === 'en'
        ? "We firmly believe in community mutual aid and collective action to overcome barriers of exclusion. ACPDPH unites persons with disabilities, their families, and local actors in a spirit of mutual support and resilience."
        : "Nous croyons fermement à la force de l'entraide communautaire et à l'action collective pour surmonter les barrières de l'exclusion. L'ACPDPH mobilise les personnes vivant avec handicap, leurs familles et les acteurs locaux dans un esprit de fraternité et de soutien mutuel. En unissant nos forces au quotidien, nous construisons un filet de protection sociale et favorisons une véritable résilience communautaire.",
      link: "/about",
    },
    {
      id: "non-discrimination",
      name: lang === 'en' ? "Non-discrimination" : "Non-discrimination",
      icon: IconNonDiscrimination,
      explanation: lang === 'en'
        ? "Equal treatment and equal opportunities for every individual constitute the cornerstone of our commitment. We actively combat prejudice, stigma, and accessibility disparities that marginalize persons with disabilities."
        : "L'égalité absolue de traitement et l'égalité des chances pour chaque individu constituent le fondement inaliénable de notre engagement. Nous luttons vigoureusement contre tous les préjugés, les stigmatisations et les disparités d'accès qui marginalisent les personnes handicapées dans la société congolaise. Chaque citoyen, sans distinction aucune, a le droit légitime de participer pleinement à la vie publique, économique et citoyenne.",
      link: "/about",
    },
    {
      id: "dignite-humaine",
      name: lang === 'en' ? "Respect for human dignity" : "Respect de la dignité humaine",
      icon: IconDigniteHumaine,
      explanation: lang === 'en'
        ? "Every individual possesses intrinsic value and universal human rights that must be acknowledged, protected, and championed. Our rights-based approach places each person at the center by empowering their self-determination."
        : "Chaque personne possède une valeur intrinsèque inestimable et des droits universels qui doivent être reconnus, protégés et promus sans réserve. Notre approche place l'individu au cœur de nos actions en valorisant son autonomie, sa voix et sa capacité d'autodétermination. Préserver et restaurer la dignité de chacun est au centre de notre combat pour la justice sociale.",
      link: "/about",
    },
    {
      id: "bien-etre",
      name: lang === 'en' ? "Well-being" : "Bien-être",
      icon: IconBienEtre,
      explanation: lang === 'en'
        ? "Holistic fulfillment across physical, psychosocial, and socio-economic dimensions guides our integrated programs. We facilitate access to adapted healthcare, functional rehabilitation, inclusive education, and sustainable livelihoods."
        : "L'épanouissement global de la personne, tant sur le plan physique et psychologique que social et économique, guide nos programmes intégrés. Nous facilitons l'accès aux soins de santé adaptés, à la réadaptation fonctionnelle, à l'éducation inclusive et aux opportunités de subsistance autonome. Favoriser le bien-être, c'est offrir à chacun la possibilité de mener une vie équilibrée, autonome et digne.",
      link: "/about",
    },
  ];
}`;

content = content.replace(/const VALUES_DATA: ValueItem\[\] = \[[\s\S]*?\];/, getValuesDataFn);

content = content.replace(
  /function ValuesSection\(\) \{/,
  "function ValuesSection() {\n  const { lang, getLocalizedPath } = useI18n();"
);

content = content.replace(
  /const valuesData = useMemo\(\(\) => GET_VALUES_DATA\(lang\), \[lang\]\);/,
  "const valuesData = useMemo(() => getValuesData(lang), [lang]);"
);

content = content.replace(
  /\{valuesData\.map\(\(val, idx\) => \{/,
  "{valuesData.map((val: ValueItem, idx: number) => {"
);

content = content.replace(
  /to=\{currentVal\.link\}/g,
  "to={getLocalizedPath(currentVal.link)}"
);

// 8. Fix ProjectsPreviewSection
content = content.replace(
  /function ProjectsPreviewSection\(\) \{\s+const \{ data \} = useAdminData\(\);/,
  "function ProjectsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();\n  const { data } = useAdminData();"
);

content = content.replace(
  /<Link to="\/projects" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">\s+Tous les projets/,
  '<Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">\n              {t.projects.filterAll || (lang === "en" ? "All projects" : "Tous les projets")}'
);

content = content.replace(
  /<Link to="\/projects" className="btn btn-outline btn-sm">\s+Tous les projets/,
  '<Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm">\n              {t.projects.filterAll || (lang === "en" ? "All projects" : "Tous les projets")}'
);

content = content.replace(
  /<h3 className="project-card-title">\s+\{proj\.title\}\s+<\/h3>/,
  '<h3 className="project-card-title">\n                      {getLocalized(proj, "title")}\n                    </h3>'
);

// 9. Fix NewsPreviewSection
content = content.replace(
  /function NewsPreviewSection\(\) \{\s+const \{ t \} = useI18n\(\);\s+const \{ data \} = useAdminData\(\);/,
  "function NewsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();\n  const { data } = useAdminData();"
);

content = content.replace(
  /<h3 className="font-heading font-bold line-clamp-2 mb-2" style=\{\{ color: '#111827', fontSize: '1rem', lineHeight: 1.35 \}\}>\s+\{article\.title\}\s+<\/h3>/,
  '<h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: "#111827", fontSize: "1rem", lineHeight: 1.35 }}>\n                    {getLocalized(article, "title")}\n                  </h3>'
);

// 10. Fix CTASection
content = content.replace(
  /function CTASection\(\) \{\s+const \{ t \} = useI18n\(\);/,
  "function CTASection() {\n  const { t, getLocalizedPath } = useI18n();"
);

fs.writeFileSync(homePath, content, 'utf8');
console.log('Home.tsx successfully updated!');

