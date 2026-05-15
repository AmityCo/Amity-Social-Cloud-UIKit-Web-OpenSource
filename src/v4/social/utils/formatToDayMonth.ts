export const formatToDayMonth = (date: Date) => {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(date);
};
