import { CalendarDate, Time } from '@internationalized/date';

export const calculateMilliseconds = (
  selectedDate: CalendarDate | undefined,
  selectedTime: Time | undefined,
): number | undefined => {
  if (!selectedDate || !selectedTime) return undefined;

  // Manually create a Date object from CalendarDate and Time
  const targetDate = new Date(
    selectedDate.year,
    selectedDate.month - 1, // JavaScript months are 0-indexed
    selectedDate.day,
    selectedTime.hour,
    selectedTime.minute,
    selectedTime.second || 0,
    0,
  );

  const nowMilliseconds = Date.now();

  const targetMilliseconds = targetDate.getTime();

  // Calculate the difference
  return targetMilliseconds - nowMilliseconds;
};
