import React, { ReactNode, PropsWithChildren } from 'react';
import { Box, StyleProps, Text, SkeletonCircle, SkeletonText } from '@noom/wax-component-library';

import Avatar from '~/core/components/Avatar';
import Time from '~/core/components/Time';

import { NotificationRecord } from './models';

export type NotificationRecordItemProps = {
  record: NotificationRecord;
  onClick?: (record: NotificationRecord) => void;
} & StyleProps;

export type BadgeProps = {
  size: 'sm' | 'xs';
};

const BadgeSizeMap = {
  xs: 2,
  sm: 4,
};

export function Badge({ children, size, ...style }: PropsWithChildren<BadgeProps> & StyleProps) {
  return (
    <Box
      bg="primary.500"
      h={BadgeSizeMap[size]}
      w={BadgeSizeMap[size]}
      color="white"
      borderRadius="full"
      boxShadow="md"
      fontSize={3 * BadgeSizeMap[size]}
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...style}
    >
      {children}
    </Box>
  );
}

function HighlightedText(props: { text: string; textToHighlight: string[] }) {
  const words = props.text.split(' ');
  const sections: (string | React.ReactElement)[] = [];

  words.forEach((word, index, fullList) => {
    sections.push(
      props.textToHighlight.some((highlight) => word.includes(highlight)) ? (
        <Text key={index} color="primary.500" fontWeight="500">
          {word}
        </Text>
      ) : (
        word
      ),
    );

    if (index < fullList.length - 1) {
      sections.push(' ');
    }
  });

  return <>{sections}</>;
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
      <Box display="flex" flexDir="column" pl={2} flex={1}>
        <Box>{title}</Box>
        <Box>{subTitle}</Box>
      </Box>
      <Box display="flex" alignItems="center" p={2}>
        {badge}
      </Box>
    </Box>
  );
}

export function NotificationRecordItem({ onClick, record, ...style }: NotificationRecordItemProps) {
  const { targetType, description, imageUrl, lastUpdate, hasRead, verb } = record;

  const handleClick = () => {
    onClick?.(record);
  };

  return (
    <RecordLayout
      cursor="pointer"
      onClick={handleClick}
      avatar={<Avatar avatar={imageUrl} isCommunity={targetType === 'community'} />}
      title={<HighlightedText text={description} textToHighlight={[verb]} />}
      subTitle={
        <Text size="xs" color="gray">
          <Time date={lastUpdate} className="" />
        </Text>
      }
      badge={!hasRead && <Badge size="xs" />}
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
