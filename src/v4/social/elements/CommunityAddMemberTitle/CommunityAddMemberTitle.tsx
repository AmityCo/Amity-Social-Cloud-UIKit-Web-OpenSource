import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityAddMemberTitleProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityAddMemberTitle = ({
  pageId = '*',
  componentId = '*',
}: CommunityAddMemberTitleProps) => {
  const elementId = 'community_add_member_title';
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId}>
      {resolveText('amity_social_button_members')}
    </Typography.TitleBold>
  );
};
