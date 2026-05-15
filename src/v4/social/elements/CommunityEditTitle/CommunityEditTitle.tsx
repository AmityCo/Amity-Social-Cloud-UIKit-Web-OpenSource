import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityEditTitleProps {
  pageId?: string;
  className?: string;
  componentId?: string;
}

export const CommunityEditTitle = ({
  className,
  pageId = '*',
  componentId = '*',
}: CommunityEditTitleProps) => {
  const elementId = 'community_edit_title';
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId} className={className}>
      {resolveText('amity_social_label_community_setup_edit_title')}
    </Typography.TitleBold>
  );
};
