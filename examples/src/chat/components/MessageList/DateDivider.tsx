import React from 'react';
import styles from './DateDivider.module.css';

interface DateDividerProps {
  date: Date;
}

const DateDivider = ({ date }: DateDividerProps) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Today';
    }

    if (isYesterday) {
      return 'Yesterday';
    }

    const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'long' });
    const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short' });

    const weekday = weekdayFormatter.format(date);
    const month = monthFormatter.format(date);
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);

    const formatted = `${weekday}, ${day}${suffix} ${month}`;

    return formatted;
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return (
    <div className={styles.dateDivider}>
      <span className={styles.dateText}>{formatDate(date)}</span>
    </div>
  );
};

export default DateDivider;
