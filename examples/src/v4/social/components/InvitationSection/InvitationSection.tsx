import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { InvitationSectionTitle } from '~/v4/social/elements';
import { Invitation } from '~/v4/social/internal-components/Invitation';

type InvitationSectionProps = {
  pageId?: string;
  onClose?: () => void;
  invitations: Amity.Invitation[];
};

export const InvitationSection = ({
  onClose,
  pageId = '*',
  invitations,
}: InvitationSectionProps) => {
  const componentId = 'invitation_section';
  const { accessibilityId, isExcluded, themeStyles } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} style={themeStyles}>
      <InvitationSectionTitle pageId={pageId} componentId={componentId} />
      {invitations.slice(0, 3).map((invitation) => (
        <Invitation
          pageId={pageId}
          onClose={onClose}
          invitation={invitation}
          componentId={componentId}
          key={invitation.invitationId}
        />
      ))}
    </div>
  );
};
