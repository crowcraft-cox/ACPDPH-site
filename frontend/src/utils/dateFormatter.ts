export function formatProjectDate(dateStr?: string) {
  let d: Date;
  if (dateStr) {
    // If format is YYYY-MM-DD
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, day] = match;
      d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(day, 10));
    } else {
      d = new Date(dateStr);
    }
  } else {
    d = new Date('2026-03-20');
  }

  if (isNaN(d.getTime())) {
    d = new Date('2026-03-20');
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const iso = `${year}-${month}-${day}`;
  const display = `${day}.${month}.${year}`;

  const monthsFr = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  const accessible = `${day} ${monthsFr[d.getMonth()]} ${year}`;

  return { iso, display, accessible };
}

