const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../frontend/src/components/layout/Navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// 1. Imports
content = content.replace(
  "import { Link, useLocation } from 'react-router-dom';",
  "import { Link, useLocation, useNavigate } from 'react-router-dom';"
);
content = content.replace(
  "import { useI18n } from '../../i18n';",
  "import { useI18n, type Lang } from '../../i18n';"
);

// 2. In Navbar component
content = content.replace(
  "  const { t, setLang, lang, languages } = useI18n();\n  const location = useLocation();",
  `  const { t, setLang, lang, languages, getLocalizedPath } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const switchLang = useCallback((newCode: Lang) => {
    setLang(newCode);
    const currentPath = location.pathname;
    if (newCode === 'en') {
      if (!currentPath.startsWith('/en')) {
        navigate(currentPath === '/' ? '/en' : '/en' + currentPath);
      }
    } else {
      if (currentPath.startsWith('/en')) {
        const cleanPath = currentPath.replace(/^\\/en(\\/?)/, '/') || '/';
        navigate(cleanPath);
      }
    }
  }, [location.pathname, navigate, setLang]);

  const getNavLabel = useCallback((label: string): string => {
    switch (label.toUpperCase()) {
      case 'ACCUEIL': return t.header?.home || (lang === 'en' ? 'HOME' : 'ACCUEIL');
      case 'ORGANISATION': return t.header?.organization || (lang === 'en' ? 'ORGANIZATION' : 'ORGANISATION');
      case 'QUI SOMMES-NOUS': return t.header?.about || (lang === 'en' ? 'ABOUT US' : 'QUI SOMMES-NOUS');
      case 'GOUVERNANCE': return t.header?.governance || (lang === 'en' ? 'GOVERNANCE' : 'GOUVERNANCE');
      case "DOMAINES D'INTERVENTION": return t.header?.domains || (lang === 'en' ? 'AREAS OF ACTION' : "DOMAINES D'INTERVENTION");
      case 'NOS PROJETS': return t.header?.projects || (lang === 'en' ? 'OUR PROJECTS' : 'NOS PROJETS');
      case 'ACTUALITÉS': return t.header?.news || (lang === 'en' ? 'NEWS' : 'ACTUALITÉS');
      case 'NOS PARTENAIRES': return t.header?.partners || (lang === 'en' ? 'OUR PARTNERS' : 'NOS PARTENAIRES');
      case 'OFFRES & EMPLOIS': return t.header?.jobs || (lang === 'en' ? 'JOBS & CAREERS' : 'OFFRES & EMPLOIS');
      case 'GALERIES': return t.header?.gallery || (lang === 'en' ? 'GALLERIES' : 'GALERIES');
      case 'CONTACT': return t.header?.contact || 'CONTACT';
      default: return label;
    }
  }, [t, lang]);`
);

// 3. isItemActive
content = content.replace(
  `  // Détection stricte de la route active
  const isItemActive = useCallback(
    (item: NavItem): boolean => {
      if (item.exact || item.to === '/') {
        return location.pathname === '/';
      }
      if (item.dropdown) {
        return item.dropdown.some((sub) => location.pathname === sub.to);
      }
      if (item.to) {
        return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
      }
      return false;
    },
    [location.pathname]
  );

  const isContactActive = location.pathname === '/contact';`,
  `  // Détection stricte de la route active
  const isItemActive = useCallback(
    (item: NavItem): boolean => {
      const cleanCurrent = location.pathname.replace(/^\\/en(\\/|$)/, '/');
      if (item.exact || item.to === '/') {
        return cleanCurrent === '/';
      }
      if (item.dropdown) {
        return item.dropdown.some((sub) => cleanCurrent === sub.to);
      }
      if (item.to) {
        return cleanCurrent === item.to || cleanCurrent.startsWith(item.to + '/');
      }
      return false;
    },
    [location.pathname]
  );

  const isContactActive = location.pathname.replace(/^\\/en(\\/|$)/, '/') === '/contact';`
);

// 4. setLang(item.code) -> switchLang(item.code)
content = content.replaceAll("setLang(item.code);", "switchLang(item.code);");

// 5. Skip link
content = content.replace(
  "Aller au contenu principal",
  "{t.header?.skipToContent || (lang === 'en' ? 'Skip to main content' : 'Aller au contenu principal')}"
);

// 6. Navigation labels
// In desktop normal bar:
content = content.replace("<span>{item.label}</span>", "<span>{getNavLabel(item.label)}</span>");
content = content.replace("{sub.label}", "{getNavLabel(sub.label)}");
content = content.replace("to={item.to || '/'}\n                        className={`header-nav-link", "to={getLocalizedPath(item.to || '/')}\n                        className={`header-nav-link");
content = content.replace(">{item.label}</Link>", ">{getNavLabel(item.label)}</Link>");

// Replace remaining {item.label} with {getNavLabel(item.label)} where appropriate
content = content.replaceAll("<span>{item.label}</span>", "<span>{getNavLabel(item.label)}</span>");
content = content.replaceAll("{sub.label}", "{getNavLabel(sub.label)}");

// NOUS SOUTENIR text
content = content.replaceAll(
  "<span>NOUS SOUTENIR</span>",
  "<span>{t.header?.support || (lang === 'en' ? 'SUPPORT US' : 'NOUS SOUTENIR')}</span>"
);
content = content.replaceAll('to="/support"', 'to={getLocalizedPath("/support")}');
content = content.replaceAll('to="/contact"', 'to={getLocalizedPath("/contact")}');

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Navbar updated successfully');

