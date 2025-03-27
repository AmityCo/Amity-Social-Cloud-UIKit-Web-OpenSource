import React from 'react';
import styles from './CloseCommunityDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';
import AngleRight from '~/v4/icons/AngleRight';

type CloseCommunityDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const CloseCommunityDescription = ({
  pageId = '*',
  componentId = '*',
}: CloseCommunityDescriptionProps) => {
  const elementId = 'close_community_description';
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
      className={styles.closeCommunityDescription__container}
    >
      {config.text && (
        <Typography.Caption className={styles.closeCommunityDescription__text}>
          {config.text}
        </Typography.Caption>
      )}
    </div>
  );
};
