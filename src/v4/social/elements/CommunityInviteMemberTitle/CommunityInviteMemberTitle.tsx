import React from 'react';
import { Typography, TypographyProps } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type CommunityInviteMemberTitleProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
};

export const CommunityInviteMemberTitle = ({
  pageId = '*',
  componentId = '*',
  ...props
}: CommunityInviteMemberTitleProps) => {
  const elementId = 'community_invite_member_title';
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold {...props} style={themeStyles} data-testid={accessibilityId}>
      {resolveText('amity_social_label_community_setup_invite_members_title')}
    </Typography.TitleBold>
  );
};
