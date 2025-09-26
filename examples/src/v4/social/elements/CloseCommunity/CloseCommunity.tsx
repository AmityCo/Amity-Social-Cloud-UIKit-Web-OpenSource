import React from 'react';
import styles from './CloseCommunity.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';

type CloseCommunityProps = {
  pageId?: string;
  componentId?: string;
};

export const CloseCommunity = ({ pageId = '*', componentId = '*' }: CloseCommunityProps) => {
  const elementId = 'close_community';
  const { themeStyles, isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.closeCommunity__container}
    >
      {config.text && (
        <Typography.BodyBold className={styles.closeCommunity__text}>
          {config.text}
        </Typography.BodyBold>
      )}
    </div>
  );
};
