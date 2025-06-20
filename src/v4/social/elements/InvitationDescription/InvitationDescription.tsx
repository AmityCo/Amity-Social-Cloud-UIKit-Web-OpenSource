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
  const { accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Typography.Body as="p" data-testid={accessibilityId} className={styles.invitationDescription}>
      <Typography.BodyBold as="span" className={styles.invitationDescription__inviter}>
        {invitation?.createdBy?.displayName}
      </Typography.BodyBold>{' '}
      invited you to join{' '}
      <Typography.BodyBold as="span">{invitation?.target?.displayName}</Typography.BodyBold>
    </Typography.Body>
  );
};
