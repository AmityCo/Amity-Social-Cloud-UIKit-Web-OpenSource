export const calculateRemainingFromMs = (ms: number) => {
  const parts = [];
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

  // Special case: 30 days or approximately 1 month
  if (months === 1 || (months === 0 && days === 30)) {
    return '30d';
  }

  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

  return parts.join(' ');
};
