import React from 'react';
import { CommunityRepository } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/natives/Button/Button';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { InvitationDescription, JoinButton, RejectButton } from '~/v4/social/elements';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import styles from './Invitation.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

type InvitationProps = {
  pageId?: string;
  componentId?: string;
  onClose?: () => void;
  invitation: Amity.Invitation;
};

export const Invitation = ({
  onClose,
  invitation,
  pageId = '*',
  componentId = '*',
}: InvitationProps) => {
  const notification = useNotifications();
  const { AmityNotificationTrayPageBehavior } = usePageBehavior();
  const { setAcceptedInvitation, invitationNotificationTray } = useLayoutContext();
  const { confirm } = useConfirmContext();

  const { community } = useCommunity({
    communityId: invitation.targetId,
  });

  const onClickItem = () => {
    onClose?.();
    localStorage.setItem(invitation.invitationId, invitation.invitationId);
    AmityNotificationTrayPageBehavior?.goToCommunityProfilePage?.({
      communityId: invitation.targetId,
    });
    invitationNotificationTray.refresh();
  };

  const onJoinClick = async () => {
    try {
      onClose?.();
      await invitation.accept();
      await CommunityRepository.getCommunityByIds([invitation.targetId]);
      notification.success({ content: `You joined ${invitation.target?.displayName}.` });
      AmityNotificationTrayPageBehavior?.goToCommunityProfilePage?.({
        communityId: invitation.targetId,
      });
      invitation && setAcceptedInvitation(invitation);
    } catch (error: any) {
      if (error.code === ERROR_RESPONSE.UNAVAILABLE) {
        return notification.info({ content: 'This invitation is no longer available.' });
      }
      notification.info({ content: 'Failed to accept invitation. Please try again.' });
    } finally {
      invitationNotificationTray.refresh();
    }
  };

  const handleRejectInvitation = async () => {
    try {
      onClose?.();
      await invitation.reject();
      notification.success({ content: 'Invitation declined.' });
    } catch (error: any) {
      if (error.code === ERROR_RESPONSE.UNAVAILABLE) {
        return notification.info({ content: 'This invitation is no longer available.' });
      }
      notification.info({ content: 'Failed to decline invitation. Please try again.' });
    } finally {
      invitationNotificationTray.refresh();
    }
  };

  const onRejectClick = () => {
    if (community?.requiresJoinApproval) {
      onClose?.();
      return confirm({
        title: 'Decline invitation?',
        content: 'If you change your mind, you’ll have to request to join again.',
        okText: 'Decline',
        onOk: handleRejectInvitation,
      });
    }
    handleRejectInvitation();
  };

  return (
    <Button
      onPress={() => onClickItem()}
      className={styles.invitation}
      data-seen={!!localStorage.getItem(invitation.invitationId)}
    >
      <div className={styles.invitation__content}>
        <div className={styles.invitation__user}>
          <UserAvatar
            pageId={pageId}
            componentId={componentId}
            onPressAvatar={onClickItem}
            shouldRedirectToUserProfile={false}
            className={styles.invitation__avatar}
            userId={invitation.inviterUserPublicId}
          />
          <InvitationDescription
            pageId={pageId}
            invitation={invitation}
            componentId={componentId}
          />
        </div>
        <Timestamp
          pageId={pageId}
          componentId={componentId}
          elementId="invitation_date"
          timestamp={invitation.createdAt}
        />
      </div>
      <div className={styles.invitation__actions}>
        <JoinButton
          pageId={pageId}
          onPress={onJoinClick}
          componentId={componentId}
          elementId="accept_invite_button"
        />
        <RejectButton
          pageId={pageId}
          onPress={onRejectClick}
          componentId={componentId}
          elementId="decline_invite_button"
        />
      </div>
    </Button>
  );
};
