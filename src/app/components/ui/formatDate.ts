// Format ISO/DateTime → '26 Mei 2026'. Tanggal DB adalah DateTime (UTC midnight),
// gunakan UTC agar tidak geser zona.
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
