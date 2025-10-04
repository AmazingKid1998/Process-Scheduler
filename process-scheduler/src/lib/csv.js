// Very small CSV helper: id,name,arrival,burst[,priority]
// Numbers parsed as Number; trims whitespace.

/**
 * @param {Array<{id:string,name:string,arrival:number,burst:number,priority?:number}>} processes
 * @returns {string}
 */
export function exportCSV(processes) {
  const header = 'id,name,arrival,burst,priority';
  const rows = processes.map(p => [
    p.id,
    escapeCsv(p.name ?? p.id),
    p.arrival,
    p.burst,
    p.priority ?? ''
  ].join(','));
  return [header, ...rows].join('\n');
}

function escapeCsv(s) {
  if (s == null) return '';
  const needsQuotes = /[",\n]/.test(String(s));
  const x = String(s).replace(/"/g, '""');
  return needsQuotes ? `"${x}"` : x;
}

/**
 * @param {string} text
 * @returns {Array<{id:string,name:string,arrival:number,burst:number,priority?:number}>}
 */
export function importCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  // detect header
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes('id') && header.includes('arrival') && header.includes('burst');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const out = [];
  for (const line of dataLines) {
    const cols = parseCsvLine(line);
    const [id, name, arrival, burst, priority] = cols;
    if (id == null || arrival == null || burst == null) continue;
    out.push({
      id: String(id).trim(),
      name: String(name ?? id).trim(),
      arrival: Number(arrival),
      burst: Number(burst),
      ...(priority !== undefined && priority !== '' ? { priority: Number(priority) } : {})
    });
  }
  return out;
}

function parseCsvLine(line) {
  const res = [];
  let i = 0, cur = '', inQuotes = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      cur += ch; i++; continue;
    } else {
      if (ch === ',') { res.push(cur); cur = ''; i++; continue; }
      if (ch === '"') { inQuotes = true; i++; continue; }
      cur += ch; i++; continue;
    }
  }
  res.push(cur);
  return res.map(x => x.trim());
}
