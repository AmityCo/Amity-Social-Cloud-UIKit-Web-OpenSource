import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

import styles from './InvitationDescription.module.css';

type InvitationDescriptionProps = {
  pageId?: string;
  componentId?: string;
  invitation: Amity.Invitation;
};

export const InvitationDescription = ({
  invitation,
  pageId = '*',
  componentId = '*',
}: InvitationDescriptionProps) => {
  const elementId = 'invitation_description';
  const { accessibilityId, resolveText } = useAmityElement({ pageId, componentId, elementId });
  const inviterName = invitation?.createdBy?.displayName ?? '';
  const communityName = invitation?.target?.displayName ?? '';
  const description = resolveText(
    'amity_social_label_community_invitation_message_template',
    inviterName,
    communityName,
  );

  return (
    <Typography.Body as="p" data-testid={accessibilityId} className={styles.invitationDescription}>
      {description}
    </Typography.Body>
  );
};
