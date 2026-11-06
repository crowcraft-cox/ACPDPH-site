const { readFileSync, writeFileSync } = require('fs');
const f = 'frontend/src/components/layout/Navbar.tsx';
let c = readFileSync(f, 'utf8');

// Find and replace the switchLang function block
const start = c.indexOf('  const switchLang = useCallback');
const end = c.indexOf('  }, [location.pathname, navigate, setLang]);', start) + '  }, [location.pathname, navigate, setLang]);'.length;
if (start === -1 || end < start) {
  console.error('switchLang not found');
  process.exit(1);
}
console.log('Found switchLang from', start, 'to', end);
console.log('Old:\n' + c.substring(start, end));

const newFn = `  const switchLang = useCallback((newCode: Lang) => {
    setLang(newCode);
    const currentPath = location.pathname;
    // Strip any existing lang prefix (/en, /it, /de)
    const cleanPath = currentPath
      .replace(/^\\/en(\\/|$)/, '/')
      .replace(/^\\/it(\\/|$)/, '/')
      .replace(/^\\/de(\\/|$)/, '/') || '/';

    if (newCode === 'fr') {
      navigate(cleanPath);
    } else {
      const prefix = \`/\${newCode}\`;
      navigate(cleanPath === '/' ? prefix : prefix + cleanPath);
    }
  }, [location.pathname, navigate, setLang]);`;

c = c.substring(0, start) + newFn + c.substring(end);
writeFileSync(f, c, 'utf8');
console.log('Done. New fn:\n' + newFn);

