import React, { ReactNode } from 'react';
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

function formatTimestamp(input: Date | string): string {
  const now = dayjs();
  const time = dayjs(input);
  const diffInSeconds = now.diff(time, 'second');
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');
  const diffInWeeks = now.diff(time, 'week');
  const diffInMonths = now.diff(time, 'month');
  const diffInYears = now.diff(time, 'year');

  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays === 1) return '1d';
  if (diffInDays <= 7) return `${diffInDays}d`;
  if (diffInWeeks <= 4) return time.format('D MMM');
  if (diffInMonths < 12) return time.format('D MMM');
  return time.format('D MMM YYYY');
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
      data-testid={accessibilityId}
    >
      {formatTimestamp(timestamp)}
    </Typography.Caption>
  );
}
