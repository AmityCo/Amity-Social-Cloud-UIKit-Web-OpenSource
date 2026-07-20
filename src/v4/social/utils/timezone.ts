import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TimeZone } from '@vvo/tzdb';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import isYesterday from 'dayjs/plugin/isYesterday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import { getLocalTimeZone } from '@internationalized/date';
import { resolveString } from '~/v4/core/localization';

dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(timezone);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);

const getLocale = () => (typeof navigator !== 'undefined' ? navigator.language : 'en');

const formatOffsetFromMinutes = (offsetInMinutes: number): string => {
  const sign = offsetInMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetInMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
};

export const getFormattedTimeZone = (timeZone?: TimeZone) => {
  if (!timeZone) return '';

  const offset = formatOffsetFromMinutes(timeZone.currentTimeOffsetInMinutes);

  // Localize the timezone region name via Intl
  let regionName: string;
  try {
    const parts = new Intl.DateTimeFormat(getLocale(), {
      timeZoneName: 'long',
      timeZone: timeZone.name,
    }).formatToParts(new Date());
    regionName = parts.find((p) => p.type === 'timeZoneName')?.value ?? timeZone.alternativeName;
  } catch {
    regionName = timeZone.alternativeName;
  }

  // Localize the main city — no standard Intl API supports city-name translation,
  // so we keep the raw city name from tzdb as-is.
  const mainCity: string = timeZone.mainCities[0] ?? '';

  return `(GMT ${offset}) ${regionName} - ${mainCity}`;
};

export const getCurrentTimeZone = () => getLocalTimeZone();

const formatDateTimeLocal = (date: string | Date): string =>
  new Intl.DateTimeFormat(new Intl.Locale(getLocale(), { calendar: 'gregory' }).toString(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date));

export function formatEventDuration(start: string, end?: string): string {
  const isYesterday = dayjs(start).isYesterday();
  const isToday = dayjs(start).isToday();
  const isTomorrow = dayjs(start).isTomorrow();
  const startTime = dayjs(start).format('HH:mm');

  const endTime = end
    ? dayjs(start).isSame(dayjs(end), 'day')
      ? dayjs(end).format('HH:mm')
      : formatDateTimeLocal(end)
    : '';

  if (isToday) return resolveString('amity_social_time_event_date_today', startTime, endTime);
  if (isTomorrow)
    return resolveString('amity_social_label_event_date_tomorrow', startTime, endTime);
  if (isYesterday)
    return resolveString('amity_social_time_event_date_yesterday', startTime, endTime);

  return end
    ? resolveString('amity_social_label_event_date_other', formatDateTimeLocal(start), endTime)
    : formatDateTimeLocal(start);
}

export function formatEventStartDate(start: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(start));
}

export function formatEventStartTime(start: string): string {
  return new Intl.DateTimeFormat(getLocale(), {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(start));
}

export function checkIsWithinMinutes(date: string, minutes = 15) {
  const timeDifferenceMs = dayjs(date).toDate().getTime() - new Date().getTime();
  const fifteenMinutesMs = minutes * 60 * 1000;
  return timeDifferenceMs < fifteenMinutesMs;
}

export const convertToTimezoneISO = (date: Date, timezoneId: string): string => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezoneId })).toISOString();
};

export const convertToTimezoneDate = (date: string, timezone = getCurrentTimeZone()): Date => {
  return dayjs(date).tz(timezone, true).toDate();
};
