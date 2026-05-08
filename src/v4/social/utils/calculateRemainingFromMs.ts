import { resolveString } from '~/v4/core/localization';

export const calculateRemainingFromMs = (ms: number): string => {
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;
  const msInMonth = msInDay * 30; // Approximation
  const msInYear = msInDay * 365; // Approximation

  const years = Math.floor(ms / msInYear);
  ms %= msInYear;
  const months = Math.floor(ms / msInMonth);
  ms %= msInMonth;
  const days = Math.floor(ms / msInDay);
  ms %= msInDay;
  const hours = Math.floor(ms / msInHour);
  ms %= msInHour;
  const minutes = Math.floor(ms / msInMinute);
  ms %= msInMinute;
  const seconds = Math.floor(ms / msInSecond);

  // Special case: approximately 1 month — show as "30d left"
  if (months === 1) {
    return resolveString('amity_social_time_time_left_days', 30);
  }

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} left`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} left`;
  if (days > 0) return resolveString('amity_social_time_time_left_days', days);
  if (hours > 0) return resolveString('amity_social_time_time_left_hours', hours);
  if (minutes > 0) return resolveString('amity_social_time_time_left_minutes', minutes);
  if (seconds > 0) return resolveString('amity_social_time_time_left_seconds', seconds);

  return resolveString('amity_social_time_time_left_minutes', 0);
};
