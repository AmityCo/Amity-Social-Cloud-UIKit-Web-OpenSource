import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityInviteMemberDescription.module.css';

type CommunityInviteMemberDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const CommunityInviteMemberDescription = ({
  pageId = '*',
  componentId = '*',
}: CommunityInviteMemberDescriptionProps) => {
  const elementId = 'community_invite_member_description';
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.Caption
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityInviteMemberDescription}
    >
      {resolveText('amity_social_label_community_setup_invite_members_description')}
    </Typography.Caption>
  );
};
