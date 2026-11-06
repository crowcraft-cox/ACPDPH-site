const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../frontend/src/pages/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// 1. In HeroSection:
content = content.replace(
  "function HeroSection() {\n  const { t } = useI18n();",
  "function HeroSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();"
);

content = content.replace(
  "aria-label=\"Carousel de projets et actualités\"",
  "aria-label={t.home.carouselAriaLabel || (lang === 'en' ? 'Projects and news carousel' : 'Carousel de projets et actualités')}"
);

content = content.replace(
  "aria-label=\"Diapositive précédente\"",
  "aria-label={t.home.previousSlide || (lang === 'en' ? 'Previous slide' : 'Diapositive précédente')}"
);

content = content.replace(
  "aria-label=\"Diapositive suivante\"",
  "aria-label={t.home.nextSlide || (lang === 'en' ? 'Next slide' : 'Diapositive suivante')}"
);

content = content.replace(
  "aria-label={`${currentIndex + 1} sur ${totalSlides}`}",
  "aria-label={lang === 'en' ? `${currentIndex + 1} of ${totalSlides}` : `${currentIndex + 1} sur ${totalSlides}`}"
);

content = content.replace(
  "to={currentSlide.link}\n              aria-label={`Lire plus : ${currentSlide.rawTitle}`}\n              className=\"hero-read-more-btn group\"\n            >\n              <span>Lire plus</span>",
  "to={getLocalizedPath(currentSlide.link)}\n              aria-label={`${t.common.readMore} : ${currentSlide.rawTitle}`}\n              className=\"hero-read-more-btn group\"\n            >\n              <span>{t.common.readMore}</span>"
);

content = content.replace(
  'to="/support" className="btn btn-blue btn-lg group shadow-lg"',
  'to={getLocalizedPath("/support")} className="btn btn-blue btn-lg group shadow-lg"'
);

// 2. In AboutSection:
content = content.replace(
  "function AboutSection() {\n  const { ref: sectionRef, isVisible } = useScrollReveal();\n\n  const paragraphs = [",
  `function AboutSection() {
  const { t, lang, getLocalizedPath } = useI18n();
  const { ref: sectionRef, isVisible } = useScrollReveal();

  const paragraphs = lang === 'en' ? [
    "The Congolese Agency for the Promotion of the Rights of Persons with Disabilities (ACPDPH) is a national, non-political, non-profit NGO founded on December 3, 2018 in Beni, North Kivu Province, Democratic Republic of the Congo.",
    "Our mission is to promote the rights, inclusion and empowerment of persons with disabilities, advancing equal opportunities, access to essential services and full participation in social, economic and community life.",
    "Through a community-based approach grounded in human rights, we intervene in inclusive education, healthcare, protection, humanitarian assistance, combating gender-based violence, and economic empowerment.",
    "We strive for an inclusive, just and united society where every person with disabilities can fully exercise their rights, develop their potential and actively contribute to their community.",
    "Our vision: building a society free from disability discrimination, where every person with disabilities lives in socio-economic well-being."
  ] : [`
);

content = content.replace(
  "<span className=\"about-line-light\" aria-hidden=\"true\">À propos</span>\n              <span className=\"sr-only\">À propos de l'ACPDPH</span>",
  "<span className=\"about-line-light\" aria-hidden=\"true\">{lang === 'en' ? 'About us' : 'À propos'}</span>\n              <span className=\"sr-only\">{lang === 'en' ? 'About ACPDPH' : \"À propos de l'ACPDPH\"}</span>"
);

content = content.replace(
  "to=\"/about\"\n              className=\"about-cta-btn\"\n              aria-label=\"Lire plus sur l'ACPDPH\"\n            >\n              Lire plus\n            </Link>",
  "to={getLocalizedPath('/about')}\n              className=\"about-cta-btn\"\n              aria-label={lang === 'en' ? 'Read more about ACPDPH' : \"Lire plus sur l'ACPDPH\"}\n            >\n              {t.common.readMore}\n            </Link>"
);

// 3. In ImpactSection:
content = content.replace(
  "function ImpactSection() {\n  const { t } = useI18n();",
  "function ImpactSection() {\n  const { t, lang, getLocalized } = useI18n();"
);

content = content.replace(
  "description=\"Bénéficiaires directs et familles accompagnés vers l'accès aux soins, à l'éducation inclusive, à l'autonomie et aux droits fondamentaux.\"",
  "description={lang === 'en' ? 'Direct beneficiaries and families supported towards access to healthcare, inclusive education, autonomy and fundamental rights.' : \"Bénéficiaires directs et familles accompagnés vers l'accès aux soins, à l'éducation inclusive, à l'autonomie et aux droits fondamentaux.\"}"
);

content = content.replace(
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Région Nord-Kivu</span>",
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{lang === 'en' ? 'North Kivu Region' : 'Région Nord-Kivu'}</span>"
);

content = content.replace(
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Rapport de terrain 2026</span>\n        <span className=\"font-semibold\" style={{ color: '#1D4ED8', fontSize: '0.75rem' }}>Audit annuel conforme</span>",
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{lang === 'en' ? '2026 Field Report' : 'Rapport de terrain 2026'}</span>\n        <span className=\"font-semibold\" style={{ color: '#1D4ED8', fontSize: '0.75rem' }}>{lang === 'en' ? 'Annual Audit Compliant' : 'Audit annuel conforme'}</span>"
);

// 4. In PillarsSection:
content = content.replace(
  "function PillarsSection() {\n  const { t } = useI18n();",
  "function PillarsSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();"
);

content = content.replace(
  'to="/pillars"',
  'to={getLocalizedPath("/pillars")}'
);

content = content.replace(
  "<h3 className=\"font-heading text-xl font-bold leading-tight\" style={{ color: '#fff' }}>{pillar.title}</h3>",
  "<h3 className=\"font-heading text-xl font-bold leading-tight\" style={{ color: '#fff' }}>{getLocalized(pillar, 'title')}</h3>"
);

content = content.replace(
  "<p style={{ color: '#000000', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>{pillar.description}</p>",
  "<p style={{ color: '#000000', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>{getLocalized(pillar, 'description')}</p>"
);

content = content.replace(
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>En savoir plus</span>",
  "<span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{lang === 'en' ? 'Learn more' : 'En savoir plus'}</span>"
);

// 5. In ValuesSection:
content = content.replace(
  "function ValuesSection() {\n  const [selectedIndex, setSelectedIndex] = useState(0);",
  `function ValuesSection() {
  const { lang, getLocalizedPath } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);`
);

content = content.replace(
  'id="values-heading"\n          className="font-heading font-bold text-[#1F4FDB] text-center mb-[26px] leading-tight"\n          style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}\n        >\n          Nos valeurs\n        </h2>',
  'id="values-heading"\n          className="font-heading font-bold text-[#1F4FDB] text-center mb-[26px] leading-tight"\n          style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}\n        >\n          {lang === "en" ? "Our Values" : "Nos valeurs"}\n        </h2>'
);

// 6. In ProjectsPreviewSection:
content = content.replace(
  "function ProjectsPreviewSection() {\n  const { data } = useAdminData();",
  "function ProjectsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();\n  const { data } = useAdminData();"
);

content = content.replaceAll(
  '<Link to="/projects" className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">\n              Tous les projets',
  '<Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm shrink-0 absolute right-0 hidden sm:flex">\n              {lang === "en" ? "All projects" : "Tous les projets"}'
);

content = content.replaceAll(
  '<Link to="/projects" className="btn btn-outline btn-sm">\n              Tous les projets',
  '<Link to={getLocalizedPath("/projects")} className="btn btn-outline btn-sm">\n              {lang === "en" ? "All projects" : "Tous les projets"}'
);

content = content.replace(
  '<h2 id="projects-heading" className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: \'#1F4FDB\' }}>Nos Projets</h2>',
  '<h2 id="projects-heading" className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: \'#1F4FDB\' }}>{t.projects.title || (lang === "en" ? "Our Projects" : "Nos Projets")}</h2>'
);

content = content.replace(
  'to={`/projects/${proj.id}`}',
  'to={getLocalizedPath(`/projects/${proj.id}`)}'
);

content = content.replace(
  '<h3 className="project-card-title">\n                      {proj.title}\n                    </h3>',
  '<h3 className="project-card-title">\n                      {getLocalized(proj, \'title\')}\n                    </h3>'
);

// 7. In NewsPreviewSection:
content = content.replace(
  "function NewsPreviewSection() {\n  const { t } = useI18n();",
  "function NewsPreviewSection() {\n  const { t, lang, getLocalized, getLocalizedPath } = useI18n();"
);

content = content.replaceAll(
  'to="/news"',
  'to={getLocalizedPath("/news")}'
);

content = content.replace(
  'to={`/news/${article.id}`}',
  'to={getLocalizedPath(`/news/${article.id}`)}'
);

content = content.replace(
  '<h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: \'#111827\', fontSize: \'1rem\', lineHeight: 1.35 }}>\n                    {article.title}\n                  </h3>',
  '<h3 className="font-heading font-bold line-clamp-2 mb-2" style={{ color: \'#111827\', fontSize: \'1rem\', lineHeight: 1.35 }}>\n                    {getLocalized(article, \'title\')}\n                  </h3>'
);

content = content.replace(
  '<p className="line-clamp-2 mb-4" style={{ color: \'#000000\', fontSize: \'0.85rem\', lineHeight: 1.5 }}>{article.excerpt}</p>',
  '<p className="line-clamp-2 mb-4" style={{ color: \'#000000\', fontSize: \'0.85rem\', lineHeight: 1.5 }}>{getLocalized(article, \'excerpt\')}</p>'
);

// 8. In CTASection:
content = content.replace(
  "function CTASection() {\n  const { t } = useI18n();",
  "function CTASection() {\n  const { t, getLocalizedPath } = useI18n();"
);

content = content.replace(
  'to="/act" className="btn btn-blue btn-lg"',
  'to={getLocalizedPath("/support")} className="btn btn-blue btn-lg"'
);

content = content.replace(
  'to="/about" className="btn btn-outline btn-lg',
  'to={getLocalizedPath("/about")} className="btn btn-outline btn-lg'
);

fs.writeFileSync(homePath, content, 'utf8');
console.log('Home.tsx updated successfully');

