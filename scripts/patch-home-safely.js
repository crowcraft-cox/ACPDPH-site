const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../frontend/src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8').replace(/\r\n/g, '\n');

function replaceExact(findStr, replaceStr, label) {
  findStr = findStr.replace(/\r\n/g, '\n');
  replaceStr = replaceStr.replace(/\r\n/g, '\n');
  if (!content.includes(findStr)) {
    console.error('Target string not found for: ' + label);
    process.exit(1);
  }
  content = content.replace(findStr, replaceStr);
  console.log('Successfully patched: ' + label);
}

// 1. Imports
replaceExact(
  "import { useI18n } from '../i18n';",
  "import { useI18n, getLocalized } from '../i18n';",
  "i18n import"
);

// 2. HeroSection
replaceExact(
  "function HeroSection() {\n  const { t } = useI18n();",
  "function HeroSection() {\n  const { t, lang, getLocalizedPath } = useI18n();",
  "HeroSection useI18n"
);

replaceExact(
  'aria-label="Carousel de projets et actualités"',
  'aria-label={t.home.carouselAriaLabel || (lang === \'en\' ? \'Projects and news carousel\' : \'Carousel de projets et actualités\')}',
  "Hero carousel aria-label"
);

replaceExact(
  'aria-label="Diapositive précédente"',
  'aria-label={t.home.previousSlide || (lang === \'en\' ? \'Previous slide\' : \'Diapositive précédente\')}',
  "Hero prev slide aria-label"
);

replaceExact(
  'aria-label="Diapositive suivante"',
  'aria-label={t.home.nextSlide || (lang === \'en\' ? \'Next slide\' : \'Diapositive suivante\')}',
  "Hero next slide aria-label"
);

replaceExact(
  'aria-label={`${currentIndex + 1} sur ${totalSlides}`}',
  'aria-label={lang === \'en\' ? `${currentIndex + 1} of ${totalSlides}` : `${currentIndex + 1} sur ${totalSlides}`}',
  "Hero slide index aria-label"
);

replaceExact(
  `            <Link
              to={currentSlide.link}
              aria-label={\`Lire plus : \${currentSlide.rawTitle}\`}
              className="hero-read-more-btn group"
            >
              <span>Lire plus</span>`,
  `            <Link
              to={getLocalizedPath(currentSlide.link)}
              aria-label={lang === 'en' ? \`Read more: \${currentSlide.rawTitle}\` : \`Lire plus : \${currentSlide.rawTitle}\`}
              className="hero-read-more-btn group"
            >
              <span>{lang === 'en' ? 'Read more' : 'Lire plus'}</span>`,
  "Hero read more link"
);

replaceExact(
  '<Link to="/support" className="btn btn-blue btn-lg group shadow-lg">',
  '<Link to={getLocalizedPath("/support")} className="btn btn-blue btn-lg group shadow-lg">',
  "Hero support CTA"
);

// 3. AboutSection
const aboutOld = `function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal();

  const paragraphs = [
    "L'Agence Congolaise de Promotion des Droits des Personnes Handicapées (ACPDPH) est une ONG nationale, apolitique et sans but lucratif, créée le 3 décembre 2018 à Beni, dans la province du Nord-Kivu, en République démocratique du Congo.",
    "Notre mission est de promouvoir les droits, l'inclusion et l'autonomisation des personnes handicapées, en favorisant l'égalité des chances, l'accès aux services essentiels et la pleine participation à la vie sociale, économique et communautaire.",
    "À travers une approche communautaire fondée sur les droits humains, nous intervenons notamment dans l'éducation inclusive, la santé, la protection, l'assistance humanitaire, la lutte contre les violences basées sur le genre et l'autonomisation économique.",
    "Nous œuvrons pour une société inclusive, juste et solidaire, dans laquelle chaque personne handicapée peut exercer pleinement ses droits, développer son potentiel et contribuer activement au développement de sa communauté.",
    "Notre vision : bâtir une société sans discrimination fondée sur le handicap, où chaque personne handicapée vit dans un état de bien-être socio-économique.",
  ]`;

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
    "Nous œuvrons pour une société inclusive, juste et solidaire, dans laquelle chaque personne handicapée peut exercer pleinement ses droits, développer son potentiel et contribuer activement au développement de sa communauté.",
    "Notre vision : bâtir une société sans discrimination fondée sur le handicap, où chaque personne handicapée vit dans un état de bien-être socio-économique."
  ];`;

replaceExact(aboutOld, aboutNew, "AboutSection paragraphs");

replaceExact(
  '<span className="about-line-light" aria-hidden="true">À propos</span>',
  '<span className="about-line-light" aria-hidden="true">{lang === \'en\' ? \'About Us\' : \'À propos\'}</span>',
  "About heading line"
);

replaceExact(
  '<span className="sr-only">À propos de l\'ACPDPH</span>',
  '<span className="sr-only">{lang === \'en\' ? \'About ACPDPH\' : "À propos de l\'ACPDPH"}</span>',
  "About sr-only"
);

replaceExact(
  'alt="Équipe de l\'ACPDPH à l\'issue d\'un atelier de formation à l\'entrepreneuriat pour femmes et filles handicapées déplacées internes"',
  'alt={lang === \'en\' ? "ACPDPH team after an entrepreneurship workshop for displaced women and girls with disabilities" : "Équipe de l\'ACPDPH à l\'issue d\'un atelier de formation à l\'entrepreneuriat pour femmes et filles handicapées déplacées internes"}',
  "About team photo alt"
);

replaceExact(
  `            <Link
              to="/about"
              className="about-cta-btn"
              aria-label="Lire plus sur l'ACPDPH"
            >
              Lire plus
            </Link>`,
  `            <Link
              to={getLocalizedPath("/about")}
              className="about-cta-btn"
              aria-label={lang === 'en' ? "Read more about ACPDPH" : "Lire plus sur l'ACPDPH"}
            >
              {lang === 'en' ? 'Read more' : 'Lire plus'}
            </Link>`,
  "About read more link"
);

// 4. ImpactSection & PrimaryCounterCard
replaceExact(
  "function ImpactSection() {\n  const { t } = useI18n();",
  "function ImpactSection() {\n  const { t, lang } = useI18n();",
  "ImpactSection useI18n"
);

replaceExact(
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            Des avancées concrètes, mesurables et durables pour l'inclusion des personnes handicapées en République Démocratique du Congo. À travers nos programmes intégrés d'accompagnement juridique, de réadaptation fonctionnelle, d'éducation inclusive et d'insertion socio-économique, nous œuvrons sans relâche pour transformer le quotidien des personnes vulnérables et de leurs familles. Chaque action menée sur le terrain renforce l'autonomie, restaure la dignité humaine et favorise une participation citoyenne équitable et respectueuse des droits fondamentaux.
          </p>`,
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            {lang === 'en'
              ? "Concrete, measurable, and lasting progress for the inclusion of persons with disabilities in the Democratic Republic of the Congo. Through our integrated programs of legal assistance, functional rehabilitation, inclusive education, and socio-economic integration, we work tirelessly to improve the lives of vulnerable individuals and their families. Each action on the ground strengthens autonomy, restores human dignity, and promotes equitable citizen participation respectful of fundamental rights."
              : "Des avancées concrètes, mesurables et durables pour l'inclusion des personnes handicapées en République Démocratique du Congo. À travers nos programmes intégrés d'accompagnement juridique, de réadaptation fonctionnelle, d'éducation inclusive et d'insertion socio-économique, nous œuvrons sans relâche pour transformer le quotidien des personnes vulnérables et de leurs familles. Chaque action menée sur le terrain renforce l'autonomie, restaure la dignité humaine et favorise une participation citoyenne équitable et respectueuse des droits fondamentaux."}
          </p>`,
  "Impact paragraph text"
);

replaceExact(
  `            <PrimaryCounterCard 
              value={primaryItem.value} 
              label={primaryItem.label} 
              description="Bénéficiaires directs et familles accompagnés vers l'accès aux soins, à l'éducation inclusive, à l'autonomie et aux droits fondamentaux."
            />`,
  `            <PrimaryCounterCard 
              value={primaryItem.value} 
              label={lang === 'en' && primaryItem.label_en ? primaryItem.label_en : primaryItem.label} 
              description={lang === 'en' ? 'Direct beneficiaries and families supported towards access to healthcare, inclusive education, autonomy and fundamental rights.' : "Bénéficiaires directs et familles accompagnés vers l'accès aux soins, à l'éducation inclusive, à l'autonomie et aux droits fondamentaux."}
            />`,
  "PrimaryCounterCard props"
);

replaceExact(
  "function PrimaryCounterCard({ value, label, description }: { value: number; label: string; description: string }) {\n  const { count, ref } = useCountUp(value, 2200);",
  "function PrimaryCounterCard({ value, label, description }: { value: number; label: string; description: string }) {\n  const { lang } = useI18n();\n  const { count, ref } = useCountUp(value, 2200);",
  "PrimaryCounterCard useI18n"
);

replaceExact(
  '<span style={{ color: \'#6B7280\', fontSize: \'0.75rem\' }}>Région Nord-Kivu</span>',
  '<span style={{ color: \'#6B7280\', fontSize: \'0.75rem\' }}>{lang === \'en\' ? \'North Kivu Region\' : \'Région Nord-Kivu\'}</span>',
  "PrimaryCounterCard region tag"
);

// 5. PillarsSection
replaceExact(
  "function PillarsSection() {\n  const { t } = useI18n();",
  "function PillarsSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();",
  "PillarsSection useI18n"
);

replaceExact(
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            L'ACPDPH déploie une approche globale et multisectorielle structurée autour d'axes d'intervention prioritaires pour garantir l'épanouissement intégral, l'égalité des chances et la pleine participation citoyenne des personnes en situation de handicap. De la promotion des droits et de l'accessibilité universelle du cadre bâti jusqu'à l'accès prioritaire à l'éducation inclusive, aux soins adaptés et à l'autonomie financière, nous construisons des solutions pérennes pour surmonter les barrières discriminatoires et promouvoir une société congolaise juste et solidaire.
          </p>`,
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            {lang === 'en'
              ? "ACPDPH deploys a comprehensive and multisectoral approach structured around priority intervention axes to ensure holistic fulfillment, equal opportunities, and full citizen participation for persons with disabilities. From rights advocacy and universal physical accessibility to inclusive education, adapted healthcare, and economic autonomy, we build lasting solutions to overcome discriminatory barriers and foster a just Congolese society."
              : "L'ACPDPH déploie une approche globale et multisectorielle structurée autour d'axes d'intervention prioritaires pour garantir l'épanouissement intégral, l'égalité des chances et la pleine participation citoyenne des personnes en situation de handicap. De la promotion des droits et de l'accessibilité universelle du cadre bâti jusqu'à l'accès prioritaire à l'éducation inclusive, aux soins adaptés et à l'autonomie financière, nous construisons des solutions pérennes pour surmonter les barrières discriminatoires et promouvoir une société congolaise juste et solidaire."}
          </p>`,
  "Pillars paragraph text"
);

replaceExact(
  'to="/pillars"',
  'to={getLocalizedPath("/pillars")}',
  "Pillars link to localized path"
);

replaceExact(
  '<h3 className="font-heading text-xl font-bold leading-tight" style={{ color: \'#fff\' }}>{pillar.title}</h3>',
  '<h3 className="font-heading text-xl font-bold leading-tight" style={{ color: \'#fff\' }}>{getLocalized(pillar, \'title\')}</h3>',
  "Pillars localized title"
);

replaceExact(
  '<p style={{ color: \'#000000\', fontSize: \'0.9rem\', lineHeight: 1.5, marginBottom: \'16px\' }}>{pillar.description}</p>',
  '<p style={{ color: \'#000000\', fontSize: \'0.9rem\', lineHeight: 1.5, marginBottom: \'16px\' }}>{getLocalized(pillar, \'description\')}</p>',
  "Pillars localized description"
);

replaceExact(
  '<span style={{ color: \'#6B7280\', fontSize: \'0.75rem\' }}>En savoir plus</span>',
  '<span style={{ color: \'#6B7280\', fontSize: \'0.75rem\' }}>{lang === \'en\' ? \'Learn more\' : \'En savoir plus\'}</span>',
  "Pillars learn more label"
);

// 6. ValuesSection
replaceExact(
  `interface ValueItem {
  id: string;
  name: string;
  icon: () => React.ReactNode;
  explanation: string;
  link: string;
}`,
  `interface ValueItem {
  id: string;
  name: string;
  name_en?: string;
  icon: () => React.ReactNode;
  explanation: string;
  explanation_en?: string;
  link: string;
}`,
  "ValueItem interface"
);

const oldValuesData = `const VALUES_DATA: ValueItem[] = [
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

const newValuesData = `const VALUES_DATA: ValueItem[] = [
  {
    id: "professionnalisme",
    name: "Professionnalisme",
    name_en: "Professionalism",
    icon: IconProfessionnalisme,
    explanation:
      "L'ACPDPH applique une rigueur exemplaire, de la transparence et des standards éthiques élevés dans la conduite de tous ses projets sur le terrain. Nos interventions reposent sur une gestion responsable des ressources, une expertise technique éprouvée et une obligation constante de redevabilité envers nos bénéficiaires et nos partenaires institutionnels. Cette exigence garantit un impact durable et mesurable pour l'inclusion des personnes en situation de handicap.",
    explanation_en:
      "ACPDPH applies exemplary rigor, transparency, and high ethical standards across all field initiatives. Our interventions rely on responsible resource management, verified technical expertise, and continuous accountability towards our beneficiaries and institutional partners.",
    link: "/about",
  },
  {
    id: "solidarite",
    name: "Solidarité",
    name_en: "Solidarity",
    icon: IconSolidarite,
    explanation:
      "Nous croyons fermement à la force de l'entraide communautaire et à l'action collective pour surmonter les barrières de l'exclusion. L'ACPDPH mobilise les personnes vivant avec handicap, leurs familles et les acteurs locaux dans un esprit de fraternité et de soutien mutuel. En unissant nos forces au quotidien, nous construisons un filet de protection sociale et favorisons une véritable résilience communautaire.",
    explanation_en:
      "We firmly believe in community mutual aid and collective action to overcome barriers of exclusion. ACPDPH unites persons with disabilities, their families, and local actors in a spirit of mutual support and resilience.",
    link: "/about",
  },
  {
    id: "non-discrimination",
    name: "Non-discrimination",
    name_en: "Non-discrimination",
    icon: IconNonDiscrimination,
    explanation:
      "L'égalité absolue de traitement et l'égalité des chances pour chaque individu constituent le fondement inaliénable de notre engagement. Nous luttons vigoureusement contre tous les préjugés, les stigmatisations et les disparités d'accès qui marginalisent les personnes handicapées dans la société congolaise. Chaque citoyen, sans distinction aucune, a le droit légitime de participer pleinement à la vie publique, économique et citoyenne.",
    explanation_en:
      "Equal treatment and equal opportunities for every individual constitute the cornerstone of our commitment. We actively combat prejudice, stigma, and accessibility disparities that marginalize persons with disabilities.",
    link: "/about",
  },
  {
    id: "dignite-humaine",
    name: "Respect de la dignité humaine",
    name_en: "Respect for human dignity",
    icon: IconDigniteHumaine,
    explanation:
      "Chaque personne possède une valeur intrinsèque inestimable et des droits universels qui doivent être reconnus, protégés et promus sans réserve. Notre approche place l'individu au cœur de nos actions en valorisant son autonomie, sa voix et sa capacité d'autodétermination. Préserver et restaurer la dignité de chacun est au centre de notre combat pour la justice sociale.",
    explanation_en:
      "Every individual possesses intrinsic value and universal human rights that must be acknowledged, protected, and championed. Our rights-based approach places each person at the center by empowering their self-determination.",
    link: "/about",
  },
  {
    id: "bien-etre",
    name: "Bien-être",
    name_en: "Well-being",
    icon: IconBienEtre,
    explanation:
      "L'épanouissement global de la personne, tant sur le plan physique et psychologique que social et économique, guide nos programmes intégrés. Nous facilitons l'accès aux soins de santé adaptés, à la réadaptation fonctionnelle, à l'éducation inclusive et aux opportunités de subsistance autonome. Favoriser le bien-être, c'est offrir à chacun la possibilité de mener une vie équilibrée, autonome et digne.",
    explanation_en:
      "Holistic fulfillment across physical, psychosocial, and socio-economic dimensions guides our integrated programs. We facilitate access to adapted healthcare, functional rehabilitation, inclusive education, and sustainable livelihoods.",
    link: "/about",
  },
];`;

replaceExact(oldValuesData, newValuesData, "VALUES_DATA bilingual definitions");

replaceExact(
  "function ValuesSection() {\n  const [selectedIndex, setSelectedIndex] = useState(0);",
  "function ValuesSection() {\n  const { lang } = useI18n();\n  const [selectedIndex, setSelectedIndex] = useState(0);",
  "ValuesSection useI18n"
);

replaceExact(
  `        <h2
          id="values-heading"
          className="font-heading font-bold text-[#1F4FDB] text-center mb-[26px] leading-tight"
          style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}
        >
          Nos valeurs
        </h2>`,
  `        <h2
          id="values-heading"
          className="font-heading font-bold text-[#1F4FDB] text-center mb-[26px] leading-tight"
          style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}
        >
          {lang === 'en' ? 'Our Values' : 'Nos valeurs'}
        </h2>`,
  "ValuesSection title"
);

replaceExact(
  'aria-label="Nos valeurs"',
  'aria-label={lang === \'en\' ? \'Our Values\' : \'Nos valeurs\'}',
  "ValuesSection aria-label"
);

replaceExact(
  `                      {val.name}
                    </span>`,
  `                      {lang === 'en' ? (val.name_en || val.name) : val.name}
                    </span>`,
  "Values tile item name"
);

replaceExact(
  `                <h3
                  className="font-bold text-[#C4540A] text-[22px] md:text-[24px] mb-4 leading-snug"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {currentVal.name}
                </h3>

                {/* Explication : 16px, gris foncé, interligne ~1.9, largeur <= 65ch */}
                <p className="text-[#000000] text-[16px] leading-[1.9] max-w-[65ch] text-justify">
                  {currentVal.explanation}
                </p>`,
  `                <h3
                  className="font-bold text-[#C4540A] text-[22px] md:text-[24px] mb-4 leading-snug"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {lang === 'en' ? (currentVal.name_en || currentVal.name) : currentVal.name}
                </h3>

                {/* Explication : 16px, gris foncé, interligne ~1.9, largeur <= 65ch */}
                <p className="text-[#000000] text-[16px] leading-[1.9] max-w-[65ch] text-justify">
                  {lang === 'en' ? (currentVal.explanation_en || currentVal.explanation) : currentVal.explanation}
                </p>`,
  "Values active item details"
);

// 7. ProjectsPreviewSection
replaceExact(
  "function ProjectsPreviewSection() {\n  const { data } = useAdminData();",
  "function ProjectsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();\n  const { data } = useAdminData();",
  "ProjectsPreviewSection useI18n"
);

replaceExact(
  `<h2 id="projects-heading" className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: '#1F4FDB' }}>Nos Projets</h2>
            <Link to="/projects" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">
              Tous les projets`,
  `<h2 id="projects-heading" className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: '#1F4FDB' }}>{t.projects.title || (lang === 'en' ? 'Our Projects' : 'Nos Projets')}</h2>
            <Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">
              {t.projects.filterAll || (lang === 'en' ? 'All projects' : 'Tous les projets')}`,
  "ProjectsPreviewSection header desktop"
);

replaceExact(
  `<div className="flex justify-center sm:hidden mb-4">
            <Link to="/projects" className="btn btn-outline btn-sm">
              Tous les projets`,
  `<div className="flex justify-center sm:hidden mb-4">
            <Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm">
              {t.projects.filterAll || (lang === 'en' ? 'All projects' : 'Tous les projets')}`,
  "ProjectsPreviewSection header mobile"
);

replaceExact(
  'to={`/projects/${proj.id}`}',
  'to={getLocalizedPath(`/projects/${proj.id}`)}',
  "ProjectsPreviewSection card link"
);

replaceExact(
  `<h3 className="project-card-title">
                      {proj.title}
                    </h3>`,
  `<h3 className="project-card-title">
                      {getLocalized(proj, 'title')}
                    </h3>`,
  "ProjectsPreviewSection localized card title"
);

// 8. NewsPreviewSection
replaceExact(
  "function NewsPreviewSection() {\n  const { t } = useI18n();\n  const { data } = useAdminData();",
  "function NewsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();\n  const { data } = useAdminData();",
  "NewsPreviewSection useI18n"
);

replaceExact(
  '<Link to="/news" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">',
  '<Link to={getLocalizedPath("/news")} className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">',
  "NewsPreviewSection desktop link"
);

replaceExact(
  '<Link to="/news" className="btn btn-outline btn-sm">',
  '<Link to={getLocalizedPath("/news")} className="btn btn-outline btn-sm">',
  "NewsPreviewSection mobile link"
);

replaceExact(
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            Suivez au quotidien nos actions de terrain, nos prises de position publiques, nos ateliers de sensibilisation et les témoignages inspirants de résilience portés par nos membres. À travers nos publications, articles et plaidoyers institutionnels réguliers, l'ACPDPH informe la société civile, interpelle les pouvoirs publics et partage les progrès accomplis dans la promotion et la protection des droits des personnes en situation de handicap en République Démocratique du Congo.
          </p>`,
  `<p className="text-base leading-relaxed text-justify w-full" style={{ color: '#000000' }}>
            {lang === 'en'
              ? "Follow our field actions, public statements, awareness workshops, and inspiring resilience stories led by our members. Through regular publications, articles, and institutional advocacy, ACPDPH informs civil society, engages public authorities, and shares progress achieved in promoting and protecting the rights of persons with disabilities in the DRC."
              : "Suivez au quotidien nos actions de terrain, nos prises de position publiques, nos ateliers de sensibilisation et les témoignages inspirants de résilience portés par nos membres. À travers nos publications, articles et plaidoyers institutionnels réguliers, l'ACPDPH informe la société civile, interpelle les pouvoirs publics et partage les progrès accomplis dans la promotion et la protection des droits des personnes en situation de handicap en République Démocratique du Congo."}
          </p>`,
  "NewsPreviewSection paragraph"
);

replaceExact(
  'to={`/news/${article.id}`}',
  'to={getLocalizedPath(`/news/${article.id}`)}',
  "NewsPreviewSection card link"
);

replaceExact(
  `<h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: '#111827', fontSize: '1rem', lineHeight: 1.35 }}>
                    {article.title}
                  </h3>

                  <p className="line-clamp-2 mb-4" style={{ color: '#000000', fontSize: '0.85rem', lineHeight: 1.5 }}>{article.excerpt}</p>`,
  `<h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: '#111827', fontSize: '1rem', lineHeight: 1.35 }}>
                    {getLocalized(article, 'title')}
                  </h3>

                  <p className="line-clamp-2 mb-4" style={{ color: '#000000', fontSize: '0.85rem', lineHeight: 1.5 }}>{getLocalized(article, 'excerpt')}</p>`,
  "NewsPreviewSection localized title & excerpt"
);

// 9. CTASection
replaceExact(
  "function CTASection() {\n  const { t } = useI18n();",
  "function CTASection() {\n  const { t, getLocalizedPath } = useI18n();",
  "CTASection useI18n"
);

replaceExact(
  '<Link to="/act" className="btn btn-blue btn-lg">',
  '<Link to={getLocalizedPath("/support")} className="btn btn-blue btn-lg">',
  "CTASection donate button link"
);

replaceExact(
  '<Link to="/about" className="btn btn-outline btn-lg border-white/30 text-white hover:border-ba-blue hover:text-ba-blue">',
  '<Link to={getLocalizedPath("/about")} className="btn btn-outline btn-lg border-white/30 text-white hover:border-ba-blue hover:text-ba-blue">',
  "CTASection join button link"
);

fs.writeFileSync(homePath, content, 'utf8');
console.log('All patches applied cleanly to Home.tsx!');
