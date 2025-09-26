import { Time } from '@internationalized/date';

export const formatTime = (time: Time | undefined): string | undefined => {
  if (!time) return undefined;

  const date = new Date();
  date.setHours(time.hour, time.minute, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
