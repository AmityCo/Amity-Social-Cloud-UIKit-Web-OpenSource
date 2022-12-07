import React, { ReactNode, PropsWithChildren } from 'react';
import { Box, StyleProps, Text, SkeletonCircle, SkeletonText } from '@noom/wax-component-library';

import Avatar from '~/core/components/Avatar';
import Time from '~/core/components/Time';

import { NotificationRecord } from '../models';
import { Highlight } from './Hightlight';

export type NotificationRecordItemProps = {
  record: NotificationRecord;
  onClick?: (record: NotificationRecord) => void;
  onBadgeClick?: (record: NotificationRecord) => void;
} & StyleProps;

export type BadgeProps = {
  size: 'sm' | 'xs';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const BadgeSizeMap = {
  xs: 2,
  sm: 4,
};

export function Badge({
  children,
  size,
  onClick,
  ...style
}: PropsWithChildren<BadgeProps> & StyleProps) {
  return (
    <Box
      bg="primary.500"
      h={BadgeSizeMap[size]}
      w={BadgeSizeMap[size]}
      color="white"
      borderRadius="full"
      boxShadow="md"
      fontSize="xs"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onClick={onClick}
      {...style}
    >
      {children}
    </Box>
  );
}

type RecordLayoutProps = {
  avatar: ReactNode;
  title: ReactNode;
  subTitle: ReactNode;
  badge?: ReactNode;
  onClick?: () => void;
} & StyleProps;

export function RecordLayout({
  avatar,
  title,
  subTitle,
  badge,
  onClick,
  ...style
}: RecordLayoutProps) {
  return (
    <Box w="100%" p={3} display="flex" flexDir="row" borderWidth={1} {...style} onClick={onClick}>
      {avatar}
      <Box display="flex" flexDir="column" pl={3} flex={1}>
        <Box>{title}</Box>
        <Box>{subTitle}</Box>
      </Box>
      <Box display="flex" alignItems="center" p={3}>
        {badge}
      </Box>
    </Box>
  );
}

export function NotificationRecordItem({
  onClick,
  onBadgeClick,
  record,
  ...style
}: NotificationRecordItemProps) {
  const { targetType, description, imageUrl, lastUpdate, hasRead, verb } = record;

  const handleClick = () => {
    onClick?.(record);
  };

  const handleBadgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onBadgeClick?.(record);
  };

  return (
    <RecordLayout
      cursor="pointer"
      onClick={handleClick}
      avatar={
        <Avatar
          avatar={imageUrl}
          displayName={record.actors?.[0]?.name}
          isCommunity={targetType === 'community'}
        />
      }
      title={
        <Highlight
          query={record.actors?.map((a) => a.name) ?? []}
          styles={{ color: 'primary.500', fontWeight: '500' }}
          allowDuplicate={false}
        >
          {description}
        </Highlight>
      }
      subTitle={
        <Text size="xs" color="gray">
          <Time date={Number(lastUpdate)} className="" />
        </Text>
      }
      badge={!hasRead && <Badge size="xs" onClick={handleBadgeClick} />}
      {...style}
    />
  );
}

export function NotificationRecordSkeleton(style: StyleProps) {
  return (
    <RecordLayout
      avatar={<SkeletonCircle h={10} w={10} />}
      title={<SkeletonText noOfLines={2} w="100%" />}
      subTitle={<SkeletonText noOfLines={1} w="30%" mt={2} />}
      badge={<SkeletonCircle h={2} w={2} />}
      {...style}
    />
  );
}
