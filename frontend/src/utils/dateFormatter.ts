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

export function formatNewsDate(dateStr?: string): string {
  if (!dateStr) return '01.01.2026';
  const trimmed = String(dateStr).trim();
  const frMatch = trimmed.match(/^(\d{1,2})\s+([a-zA-Z\u00C0-\u00FF\.]+)\s+(\d{4})/i);
  if (frMatch) {
    const day = frMatch[1].padStart(2, '0');
    const rawMonth = frMatch[2].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('.', '');
    const months: Record<string, string> = {
      jan: '01', janv: '01', janvier: '01',
      fev: '02', fevr: '02', fevrier: '02',
      mar: '03', mars: '03',
      avr: '04', avril: '04',
      mai: '05',
      jui: '06', juin: '06',
      jul: '07', juil: '07', juillet: '07',
      aou: '08', aout: '08',
      sep: '09', sept: '09', septembre: '09',
      oct: '10', octo: '10', octobre: '10',
      nov: '11', novm: '11', novembre: '11',
      dec: '12', dece: '12', decembre: '12',
    };
    const month = months[rawMonth.slice(0, 4)] || months[rawMonth.slice(0, 3)] || '01';
    return `${day}.${month}.${frMatch[3]}`;
  }
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`;
  }
  const slashMatch = trimmed.match(/^(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})/);
  if (slashMatch) {
    return `${slashMatch[1].padStart(2, '0')}.${slashMatch[2].padStart(2, '0')}.${slashMatch[3]}`;
  }
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }
  return trimmed;
}
