import millify from 'millify';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityInfo.module.css';
import { Button } from '~/v4/core/natives/Button';

interface CommunityInfoProps {
  count: number;
  text: string;
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
}

export const CommunityInfo = ({
  pageId = '*',
  componentId = '*',
  count,
  text,
  onClick,
}: CommunityInfoProps) => {
  const elementId = 'community_info';
  const { config, accessibilityId, themeStyles, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;
  return (
    <Button onPress={onClick} className={styles.communityInfo__container}>
      <div className={styles.communityInfo__wrapper}>
        <Typography.BodyBold className={styles.communityInfo__count}>
          {millify(count)}
        </Typography.BodyBold>
        <Typography.Caption className={styles.communityInfo__title}>{text}</Typography.Caption>
      </div>
    </Button>
  );
};
