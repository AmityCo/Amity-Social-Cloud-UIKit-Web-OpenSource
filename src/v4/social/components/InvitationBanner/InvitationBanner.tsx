import React, { useState } from 'react';
import { Typography } from '~/v4/core/components';
import TruncateMarkup from 'react-truncate-markup';
import { useGetInvitation } from '~/v4/social/hooks';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ERROR_CODE } from '~/v4/social/constants/errorCode';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { JoinButton, RejectButton, UserAvatar } from '~/v4/social/elements';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import styles from './InvitationBanner.module.css';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

type InvitationBannerProps = {
  pageId?: string;
  community: Amity.Community;
  removeInvitation?: () => void;
  invitation?: Amity.Invitation;
};

export function InvitationBanner({
  community,
  pageId = '*',
  removeInvitation,
  invitation: $invitation,
}: InvitationBannerProps) {
  const componentId = 'invitation_banner';

  const { onBack } = useNavigation();
  const notification = useNotifications();
  const [truncate, setTruncate] = useState(false);
  const { setAcceptedInvitation, invitationNotificationTray } = useLayoutContext();
  const { accessibilityId, themeStyles } = useAmityComponent({ pageId, componentId });
  const invitation = $invitation ? $invitation : useGetInvitation(community)?.invitation;
  const { confirm } = useConfirmContext();

  const onJoinClick = async () => {
    try {
      await invitation?.accept();
      await CommunityRepository.getCommunityByIds([community.communityId]);
      notification.success({ content: `You joined ${invitation?.target?.displayName}.` });
      invitation && setAcceptedInvitation(invitation);
      removeInvitation?.();
    } catch (error: any) {
      if (error.code === ERROR_CODE.UNAVAILABLE) {
        notification.info({ content: 'This invitation is no longer available.' });
        community.isPublic || community.isDiscoverable ? removeInvitation?.() : onBack();
        return;
      }
      notification.info({ content: 'Failed to accept invitation. Please try again.' });
    }
    invitationNotificationTray.refresh();
  };

  const handleRejectInvitation = async () => {
    try {
      await invitation?.reject();
      notification.success({ content: 'Invitation declined.' });
      community.isPublic || community.isDiscoverable ? removeInvitation?.() : onBack();
    } catch (error: any) {
      if (error.code === ERROR_CODE.UNAVAILABLE) {
        notification.info({ content: 'This invitation is no longer available.' });
        community.isPublic || community.isDiscoverable ? removeInvitation?.() : onBack();
        return;
      }
      notification.info({ content: 'Failed to decline invitation. Please try again.' });
    }
    invitationNotificationTray.refresh();
  };

  const onRejectClick = async () => {
    if (community?.requiresJoinApproval) {
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
    <div className={styles.invitationBanner} data-testid={accessibilityId} style={themeStyles}>
      <div className={styles.invitationBanner__inviter} data-truncate={truncate}>
        <div className={styles.invitationBanner__avatar}>
          <UserAvatar
            userId={invitation?.inviterUserPublicId}
            className={styles.invitationBanner__avatar}
            textPlaceholderClassName={styles.invitationBanner__avatar}
          />
        </div>
        <Typography.BodyBold as="p" className={styles.invitationBanner__displayName}>
          <TruncateMarkup
            lines={3}
            onTruncate={setTruncate}
            ellipsis={
              <>
                ... <Typography.BodyBold as="span">invited you.</Typography.BodyBold>
              </>
            }
          >
            <span className={styles.capitalize}>{invitation?.createdBy?.displayName}</span>
          </TruncateMarkup>
          {!truncate && <Typography.BodyBold as="span"> invited you.</Typography.BodyBold>}
        </Typography.BodyBold>
      </div>
      <div className={styles.invitationBanner__actions}>
        <JoinButton pageId={pageId} componentId={componentId} onPress={onJoinClick} />
        <RejectButton pageId={pageId} componentId={componentId} onPress={onRejectClick} />
      </div>
    </div>
  );
}
