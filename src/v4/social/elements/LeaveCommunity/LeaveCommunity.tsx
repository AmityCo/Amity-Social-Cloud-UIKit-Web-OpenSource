import React from 'react';
import styles from './LeaveCommunity.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';

type LeaveCommunityProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
};

export const LeaveCommunity = ({
  pageId = '*',
  componentId = '*',
  onClick,
}: LeaveCommunityProps) => {
  const elementId = 'leave_community';
  const { themeStyles, isExcluded, config, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.leaveCommunity__button}
    >
      <Typography.BodyBold className={styles.leaveCommunity__text}>
        {resolveText('amity_social_button_leave_community')}
      </Typography.BodyBold>
    </Button>
  );
};
