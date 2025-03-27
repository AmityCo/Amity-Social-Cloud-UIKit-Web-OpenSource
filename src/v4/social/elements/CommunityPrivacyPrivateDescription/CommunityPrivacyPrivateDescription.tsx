import React from 'react';
import styles from './CommunityPrivacyPrivateDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CommunityPrivacyPrivateDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const CommunityPrivacyPrivateDescription = ({
  pageId = '*',
  componentId = '*',
}: CommunityPrivacyPrivateDescriptionProps) => {
  const elementId = 'community_privacy_private_description';
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      className={styles.communityPrivacyPrivateDescription__text}
    >
      {config.text}
    </Typography.Caption>
  );
};
