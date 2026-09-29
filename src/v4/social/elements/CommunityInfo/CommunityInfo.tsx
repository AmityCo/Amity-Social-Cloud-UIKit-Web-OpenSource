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
  /**
   * Which id this instance answers to. The community header renders two of
   * these — a post count and a member count — and they belong to different
   * modules, so one shared id could not gate them apart. Defaults to the
   * original id so every other caller keeps its customisation key.
   */
  elementId?: string;
  onClick?: () => void;
  countTestId?: string;
}

export const CommunityInfo = ({
  pageId = '*',
  componentId = '*',
  elementId = 'community_info',
  count,
  text,
  onClick,
  countTestId,
}: CommunityInfoProps) => {
  const { config, accessibilityId, themeStyles, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  if (isExcluded) return null;
  return (
    <Button
      data-testid={`${accessibilityId}_${text}`}
      onPress={onClick}
      className={styles.communityInfo__container}
    >
      <div className={styles.communityInfo__wrapper}>
        <Typography.BodyBold className={styles.communityInfo__count} data-testid={countTestId}>
          {millify(count)}
        </Typography.BodyBold>
        <Typography.Caption className={styles.communityInfo__title}>{text}</Typography.Caption>
      </div>
    </Button>
  );
};
