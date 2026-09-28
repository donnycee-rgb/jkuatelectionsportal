// CSV export for the admin dashboard. Guards against spreadsheet formula
// injection by prefixing cells that begin with = + - @ with an apostrophe.

const safe = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function toCsv(rows, columns) {
  const head = columns.map((c) => safe(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => safe(r[c.key])).join(','));
  return [head, ...body].join('\r\n');
}

export function downloadCsv(filename, csv) {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
