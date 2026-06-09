export type ChatItem =
  | { kind: 'date'; id: string; label: string }
  | { kind: 'message'; id: string; message: Amity.Message };

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLabel(date: Date): string {
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const options: Intl.DateTimeFormatOptions =
    year === currentYear
      ? { weekday: 'short', day: 'numeric', month: 'short' }
      : { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function groupMessagesByDate(messages: Amity.Message[]): ChatItem[] {
  const items: ChatItem[] = [];
  let lastDate: Date | null = null;

  for (const message of messages) {
    const createdAt = message.createdAt ? new Date(message.createdAt) : null;
    if (!createdAt) continue;

    if (lastDate && !sameCalendarDay(lastDate, createdAt)) {
      const label = formatDateLabel(lastDate);
      items.push({ kind: 'date', id: `date-${lastDate.toISOString().slice(0, 10)}`, label });
    }

    items.push({
      kind: 'message',
      id: message.messageId ?? (message as { uniqueId?: string }).uniqueId ?? String(items.length),
      message,
    });

    lastDate = createdAt;
  }

  if (lastDate) {
    const label = formatDateLabel(lastDate);
    items.push({ kind: 'date', id: `date-tail-${lastDate.toISOString().slice(0, 10)}`, label });
  }

  return items;
}
