export function downloadICS(event: Amity.Event): void {
  const startDate = new Date(event.startTime)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const endDate = new Date(event.endTime)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title}.ics`;
  link.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}
