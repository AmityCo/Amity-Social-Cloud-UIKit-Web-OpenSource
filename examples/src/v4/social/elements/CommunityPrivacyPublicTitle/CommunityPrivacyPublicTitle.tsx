import React from 'react';
import styles from './CommunityPrivacyPublicTitle.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CommunityPrivacyPublicTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const CommunityPrivacyPublicTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityPrivacyPublicTitleProps) => {
  const elementId = 'community_privacy_public_title';
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.BodyBold
      className={styles.communityPrivacyPublicTitle__text}
      data-testid={accessibilityId}
    >
      {config.text}
    </Typography.BodyBold>
  );
};
