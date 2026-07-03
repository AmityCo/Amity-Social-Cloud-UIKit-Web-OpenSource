import dayjs from 'dayjs';
import { resolveString } from '~/v4/core/localization';

function formatShortDate(date: Date, withYear: boolean): string {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  const options: Intl.DateTimeFormatOptions = withYear
    ? { day: 'numeric', month: 'short', year: 'numeric' }
    : { day: 'numeric', month: 'short' };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatTimestamp(input: string | Date): string {
  const now = dayjs();
  const time = dayjs(input);
  const diffInSeconds = now.diff(time, 'second');
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');

  if (diffInSeconds < 60) return resolveString('amity_chat_timestamp_now');
  if (diffInMinutes < 60)
    return `${diffInMinutes}${resolveString('amity_common_time_time_minutes_suffix')}`;
  if (diffInHours < 24)
    return `${diffInHours}${resolveString('amity_common_time_time_hours_suffix')}`;
  if (diffInDays < 7) return `${diffInDays}${resolveString('amity_common_time_time_days_suffix')}`;
  return formatShortDate(time.toDate(), !now.isSame(time, 'year'));
}
