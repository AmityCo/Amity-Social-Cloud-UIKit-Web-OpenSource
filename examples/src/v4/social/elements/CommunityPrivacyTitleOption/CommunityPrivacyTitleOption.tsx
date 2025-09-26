import React from 'react';
import styles from './CommunityPrivacyTitleOption.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components/Typography';

type CommunityPrivacyTitleOptionProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
};

export const CommunityPrivacyTitleOption = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
}: CommunityPrivacyTitleOptionProps) => {
  const { isExcluded, config, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Typography.BodyBold
      data-testid={accessibilityId}
      className={styles.communityPrivacyTitleOption__text}
    >
      {config.text}
    </Typography.BodyBold>
  );
};
