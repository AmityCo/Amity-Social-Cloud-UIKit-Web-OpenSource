import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TimeZone } from '@vvo/tzdb';
import isToday from 'dayjs/plugin/isToday';
import timezone from 'dayjs/plugin/timezone';
import isYesterday from 'dayjs/plugin/isYesterday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import { getLocalTimeZone } from '@internationalized/date';

dayjs.extend(utc);
dayjs.extend(isToday);
dayjs.extend(timezone);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);

export const getFormattedTimeZone = (timeZone?: TimeZone) => {
  return `(GMT ${timeZone?.currentTimeFormat?.split(' ')[0]}) ${timeZone?.currentTimeFormat?.split(' ').slice(1).join(' ').split(' - ')[0]} - ${timeZone?.mainCities[0]}`;
};

export const getCurrentTimeZone = () => getLocalTimeZone();

export function formatEventDuration(start: string, end?: string): string {
  const formatStartTime = () => {
    const isYesterday = dayjs(start).isYesterday();
    const isToday = dayjs(start).isToday();
    const isTomorrow = dayjs(start).isTomorrow();
    const startTime = dayjs(start).format('HH:mm');

    const startDate = isToday
      ? `Today, ${startTime}`
      : isTomorrow
        ? `Tomorrow, ${startTime}`
        : isYesterday
          ? `Yesterday, ${startTime}`
          : dayjs(start).format('DD MMM YYYY, HH:mm');

    return startDate;
  };

  const formatEndTime = () => {
    if (!end) return '';

    const isSameDay = dayjs(start).isSame(dayjs(end), 'day');

    const endDate = isSameDay
      ? ` to ${dayjs(end).format('HH:mm')}`
      : ` to ${dayjs(end).format('DD MMM YYYY, HH:mm')}`;

    return endDate;
  };

  const formattedDuration = `${formatStartTime()}${formatEndTime()}`;

  return formattedDuration;
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
