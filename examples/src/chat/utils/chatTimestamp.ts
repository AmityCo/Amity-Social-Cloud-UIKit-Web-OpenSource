import dayjs from 'dayjs';

export function formatChatTimestamp(timestamp: string | Date): string {
  const now = dayjs();
  const messageTime = dayjs(timestamp);

  // If less than 1 minute ago, show "Now"
  if (now.diff(messageTime, 'minute') < 1) {
    return 'Now';
  }

  // If today, show time (e.g., "11:30")
  if (messageTime.isSame(now, 'day')) {
    return messageTime.format('HH:mm');
  }

  // If yesterday, show "Ieri"
  if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Ieri';
  }

  // If this year, show day/month (e.g., "12 Mar")
  if (messageTime.isSame(now, 'year')) {
    return messageTime.format('D MMM');
  }

  // Otherwise show full date
  return messageTime.format('DD/MM/YYYY');
}

export function truncateMessage(message: string, maxLength: number = 60): string {
  if (!message) return '';

  if (message.length <= maxLength) {
    return message;
  }

  return message.substring(0, maxLength - 3) + '...';
}
