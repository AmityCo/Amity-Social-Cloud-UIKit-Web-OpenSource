import React, { PropsWithChildren } from 'react';
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
import InfiniteScroll from 'react-infinite-scroll-component';

import { NotificationRecordItem, NotificationRecordSkeleton } from './NotificationRecordItem';
import { NotificationRecord } from './models';

export type NotificationRecordListProps = {
  notificationRecords: NotificationRecord[];
  isLoading?: boolean;
  error?: string;
  hasMore?: boolean;
  loadMore?: () => void;
  onClick?: (record: NotificationRecord) => void;
} & StyleProps;

function Wrap({ children, ...style }: PropsWithChildren<StyleProps>) {
  return (
    <Box display="flex" overflow="auto" {...style}>
      {children}
    </Box>
  );
}

export function Skeleton(style: StyleProps) {
  return (
    <Stack spacing="-1px" mb="-1px" w="100%">
      {[...Array(3).keys()].map((i) => (
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
  ...style
}: { titleProps?: StyleProps; isDisabled?: boolean; onMarkAllClick?: () => void } & StyleProps) {
  return (
    <Box display="flex" justifyContent="space-between" {...style}>
      <Text fontWeight="500" fontSize="md" {...titleProps}>
        <FormattedMessage id="notificationTray.title" />
      </Text>

      {onMarkAllClick ? (
        <MarkAllButton
          isDisabled={isDisabled}
          onClick={onMarkAllClick}
          display="inline-flex"
          w="auto"
        />
      ) : null}
    </Box>
  );
}

export function NotificationRecordList({
  error,
  isLoading,
  notificationRecords,
  hasMore = false,
  loadMore = () => {},
  onClick,
  ...style
}: NotificationRecordListProps) {
  if (isLoading) {
    return (
      <Wrap {...style}>
        <Skeleton />
      </Wrap>
    );
  }

  if (error) {
    return (
      <Wrap {...style}>
        <Alert status="error" w="100%">
          {error}
        </Alert>
      </Wrap>
    );
  }

  return (
    <Wrap {...style}>
      <InfiniteScroll
        className=""
        dataLength={notificationRecords.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<NotificationRecordSkeleton />}
      >
        <Stack spacing="-1px" mb={hasMore ? '-1px' : ''}>
          {notificationRecords.map((record) => (
            <NotificationRecordItem key={record.targetGroup} record={record} onClick={onClick} />
          ))}
        </Stack>
      </InfiniteScroll>
    </Wrap>
  );
}
