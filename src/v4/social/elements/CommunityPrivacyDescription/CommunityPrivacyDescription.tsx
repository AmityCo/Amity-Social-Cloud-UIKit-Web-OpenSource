import React from 'react';
import styles from './CommunityPrivacyDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CommunityPrivacyDescriptionProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
};

export const CommunityPrivacyDescription = ({
  pageId = '*',
  componentId = '*',
  elementId,
}: CommunityPrivacyDescriptionProps) => {
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      className={styles.communityPrivacyDescription__text}
    >
      {config.text}
    </Typography.Caption>
  );
};
