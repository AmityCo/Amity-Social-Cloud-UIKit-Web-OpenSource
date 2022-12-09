import React, { PropsWithChildren, useRef, forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  StyleProps,
  Stack,
  Button,
  ButtonProps,
  Text,
  Alert,
} from '@noom/wax-component-library';
import InfiniteScroll from 'react-infinite-scroller';

import { NotificationRecordItem, NotificationRecordSkeleton } from './NotificationRecordItem';
import { NotificationRecord } from '../models';

export type NotificationRecordListProps = {
  notificationRecords: NotificationRecord[];
  isLoading?: boolean;
  error?: string;
  hasMore?: boolean;
  numOfSkeletonRows?: number;
  loadMore?: () => void;
  height?: number | string;
  onClick?: (record: NotificationRecord) => void;
  onBadgeClick?: (record: NotificationRecord) => void;
} & StyleProps;

const Wrap = forwardRef<HTMLDivElement, PropsWithChildren<StyleProps>>(
  ({ children, ...style }, ref) => {
    return (
      <Box display="flex" flexDir="column" overflow="auto" ref={ref} {...style}>
        {children}
      </Box>
    );
  },
);

export function Skeleton({ numOfRows = 3, ...style }: StyleProps & { numOfRows?: number }) {
  return (
    <Stack spacing="-1px" mb="-1px" w="100%" {...style}>
      {[...Array(numOfRows).keys()].map((i) => (
        <NotificationRecordSkeleton key={i} />
      ))}
    </Stack>
  );
}

function MarkAllButton(props: ButtonProps) {
  return (
    <Button variant="link" w="100%" size="sm" colorScheme="primary" fontWeight="normal" {...props}>
      <FormattedMessage id="notificationTray.markAllRead" />
    </Button>
  );
}

export function NotificationRecordListHeader({
  isDisabled,
  titleProps,
  onMarkAllClick,
  showMarkAll,
  ...style
}: {
  titleProps?: StyleProps;
  isDisabled?: boolean;
  showMarkAll?: boolean;
  onMarkAllClick?: () => void;
} & StyleProps) {
  return (
    <Box display="flex" justifyContent="space-between" {...style}>
      <Text fontWeight="500" fontSize="md" {...titleProps}>
        <FormattedMessage id="notificationTray.title" />
      </Text>

      {showMarkAll && (
        <MarkAllButton
          isDisabled={isDisabled}
          onClick={onMarkAllClick}
          display="inline-flex"
          w="auto"
        />
      )}
    </Box>
  );
}

export function NotificationRecordList({
  error,
  height,
  isLoading,
  numOfSkeletonRows,
  notificationRecords,
  hasMore = false,
  loadMore = () => {},
  onClick,
  onBadgeClick,
  ...style
}: NotificationRecordListProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <Wrap {...style} ref={wrapRef}>
        <Skeleton numOfRows={numOfSkeletonRows} />
      </Wrap>
    );
  }

  if (error) {
    return (
      <Wrap {...style} ref={wrapRef}>
        <Alert status="error" w="100%">
          {error}
        </Alert>
      </Wrap>
    );
  }

  if (notificationRecords.length === 0) {
    return (
      <Wrap {...style}>
        <Alert status="info" w="100%">
          <FormattedMessage id="notificationTray.empty" />
        </Alert>
      </Wrap>
    );
  }

  return (
    <Wrap {...style}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<NotificationRecordSkeleton />}
        useWindow={false}
      >
        <Stack spacing="-1px" mb={hasMore ? '-1px' : ''}>
          {notificationRecords.map((record) => (
            <NotificationRecordItem
              key={record.targetGroup}
              record={record}
              onClick={onClick}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </Stack>
      </InfiniteScroll>
    </Wrap>
  );
}
