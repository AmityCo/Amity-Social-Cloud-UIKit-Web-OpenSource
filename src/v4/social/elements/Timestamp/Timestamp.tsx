import React, { ReactNode } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './Timestamp.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { Typography } from '~/v4/core/components';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'Just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: function (number: number, withoutSuffix: string, key: string, isFuture: boolean) {
      if (isFuture) return number + 'M';
      const date = dayjs().subtract(number, 'M');
      const currentDate = dayjs();
      if (date.get('year') === currentDate.get('year')) {
        return date.format('D MMM');
      }
      return date.format('D MMM YYYY');
    },
    MM: function (number: number, withoutSuffix: string, key: string, isFuture: boolean) {
      if (isFuture) return number + 'M';
      const date = dayjs().subtract(number, 'M');
      const currentDate = dayjs();
      if (date.get('year') === currentDate.get('year')) {
        return date.format('D MMM');
      }
      return date.format('D MMM YYYY');
    },
    y: function (number: number, withoutSuffix: string, key: string, isFuture: boolean) {
      if (isFuture) return number + 'y';
      const date = dayjs().subtract(number, 'y');
      const currentDate = dayjs();
      if (date.get('year') === currentDate.get('year')) {
        return date.format('D MMM');
      }
      return date.format('D MMM YYYY');
    },
    yy: function (number: number, withoutSuffix: string, key: string, isFuture: boolean) {
      if (isFuture) return number + 'y';
      const date = dayjs().subtract(number, 'y');
      const currentDate = dayjs();
      if (date.get('year') === currentDate.get('year')) {
        return date.format('D MMM');
      }
      return date.format('D MMM YYYY');
    },
  },
});

interface TimestampProps {
  pageId?: string;
  componentId?: string;
  timestamp: Date | string;
}

export function Timestamp({ pageId = '*', componentId = '*', timestamp }: TimestampProps) {
  const elementId = 'timestamp';
  const { accessibilityId, isExcluded, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const relativeTimeStr = dayjs(timestamp).fromNow();

  if (isExcluded) return null;

  return (
    <Typography.Caption
      className={styles.timestamp}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      {relativeTimeStr}
    </Typography.Caption>
  );
}
