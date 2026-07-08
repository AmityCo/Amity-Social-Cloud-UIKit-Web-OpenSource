export function formatMessageTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}
