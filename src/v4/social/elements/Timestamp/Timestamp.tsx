import React, { ReactNode } from 'react';
import { resolveString } from '~/v4/core/localization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './Timestamp.module.css';
import dayjs from 'dayjs';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

interface TimestampProps {
  pageId?: string;
  componentId?: string;
  timestamp: Date | string;
  elementId?: string;
  className?: string;
}

function formatLocalDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatTimestamp(input: Date | string): string {
  const now = dayjs();
  const time = dayjs(input);
  const diffInSeconds = now.diff(time, 'second');
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');
  const diffInWeeks = now.diff(time, 'week');
  const diffInMonths = now.diff(time, 'month');

  if (diffInSeconds < 60) return resolveString('amity_common_time_just_now');
  if (diffInMinutes < 60)
    return `${diffInMinutes}${resolveString('amity_common_time_time_minutes_suffix')}`;
  if (diffInHours < 24)
    return `${diffInHours}${resolveString('amity_common_time_time_hours_suffix')}`;
  if (diffInDays === 1) return `1${resolveString('amity_common_time_time_days_suffix')}`;
  if (diffInDays <= 7) return `${diffInDays}${resolveString('amity_common_time_time_days_suffix')}`;
  if (diffInWeeks <= 4) return formatLocalDate(time.toDate(), { day: 'numeric', month: 'short' });
  if (diffInMonths < 12) return formatLocalDate(time.toDate(), { day: 'numeric', month: 'short' });
  return formatLocalDate(time.toDate(), { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Timestamp({
  pageId = '*',
  componentId = '*',
  elementId: $elementId,
  timestamp,
  className,
}: TimestampProps) {
  const elementId = $elementId ? $elementId : 'timestamp';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Caption
      className={clsx(styles.timestamp, className)}
      style={themeStyles}
      testId={accessibilityId}
    >
      {formatTimestamp(timestamp)}
    </Typography.Caption>
  );
}
