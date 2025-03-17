import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityPrivacyTitleProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityPrivacyTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityPrivacyTitleProps) => {
  const elementId = 'community_privacy_title';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId}>
      {config.text}
    </Typography.TitleBold>
  );
};
