import { useMemo } from 'react';
import { MemberRoles } from '~/v4/chat/constants';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import useSDK from '~/v4/core/hooks/useSDK';
import { resolveString } from '~/v4/core/localization';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useCancelInvitation } from '~/v4/social/features/livestream/hooks';
import { useRemoveParticipant } from '~/v4/social/features/livestream/hooks/useRemoveParticipant';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';

export interface UseLivestreamModerationProps {
  pageId?: string;
  room?: Amity.Room | null;
  channel?: Amity.Channel | null;
  invitation?: Amity.Invitation;
  onCoHostLeaveLiveKitRoom?: () => void;
}

export interface UseLivestreamModerationReturn {
  // User data
  invitedCoHost: Amity.User | undefined;
  coHost: Amity.User | undefined;
  host: Amity.User | undefined;
  canCoHostManageProductTags: boolean | undefined;

  // Permission flags
  isHost: boolean;
  isModerator: boolean;

  // Action handlers
  handleCancelInvitation: () => void;
  handleRemoveCoHost: () => void;
  handleLeaveAsCoHost: () => void;

  // Loading states
  isPendingCancelInvitation: boolean;
  isPendingRemoveParticipant: boolean;
}

export const useLivestreamModeration = ({
  pageId = '*',
  room,
  channel,
  invitation,
  onCoHostLeaveLiveKitRoom,
}: UseLivestreamModerationProps): UseLivestreamModerationReturn => {
  const { currentUserId } = useSDK();

  // Extract user data
  const invitedCoHost = useMemo(() => {
    if (!invitation) return undefined;
    return invitation?.user;
  }, [invitation?.user?.userId]);

  const coHost = useMemo(() => {
    return room ? getRoomParticipant(room, 'coHost')?.user : undefined;
  }, [room]);

  const canCoHostManageProductTags = useMemo(() => {
    if (!room) return undefined;

    const coHostParticipant = room.participants?.find(
      (participant) => participant.type === 'coHost',
    );

    return coHostParticipant?.canManageProductTags;
  }, [room]);

  const host = useMemo(() => {
    return room ? getRoomParticipant(room, 'host')?.user : undefined;
  }, [room]);

  // Permission checks
  const isHost = currentUserId === host?.userId;
  const { isModerator } = useChannelPermission(channel?.channelId);
  const notification = useNotifications();

  // Hooks
  const { cancelInvitation, isPending: isPendingCancelInvitation } = useCancelInvitation({
    pageId,
  });
  const { handleRemoveParticipant, isPending: isPendingRemoveParticipant } = useRemoveParticipant({
    room,
  });

  // Action handlers
  const handleCancelInvitation = () => {
    if (invitation?.invitationId) {
      cancelInvitation(invitation.invitationId, {
        onSuccess: () => {
          notification.success({
            content: resolveString('amity_social_toast_snackbar_invitation_declined'),
          });
        },
      });
    }
  };

  const handleRemoveCoHost = () => {
    const targetUserId = coHost?.userId ?? invitedCoHost?.userId;
    if (targetUserId) {
      handleRemoveParticipant(targetUserId);
    }
  };

  const handleLeaveAsCoHost = () => {
    onCoHostLeaveLiveKitRoom?.();
  };

  return {
    // User data
    invitedCoHost,
    coHost,
    host,
    canCoHostManageProductTags,

    // Permission flags
    isHost,
    isModerator,

    // Action handlers
    handleCancelInvitation,
    handleRemoveCoHost,
    handleLeaveAsCoHost,

    // Loading states
    isPendingCancelInvitation,
    isPendingRemoveParticipant,
  };
};
