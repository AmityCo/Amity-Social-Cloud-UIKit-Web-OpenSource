import { useMemo } from 'react';
import { MemberRoles } from '~/v4/chat/constants';
import useChannelRole from '~/v4/chat/hooks/useChannelRole';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import useSDK from '~/v4/core/hooks/useSDK';
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

  // Permission flags
  isHost: boolean;
  isModerator: boolean;

  // Action handlers
  handleCancelInvitation: () => void;
  handlePromoteToModerator: () => void;
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
  const { CHANNEL_MODERATOR } = MemberRoles;

  // Extract user data
  const invitedCoHost = useMemo(() => {
    if (!invitation) return undefined;
    return invitation?.user;
  }, [invitation?.user?.userId]);

  const coHost = useMemo(() => {
    return room ? getRoomParticipant(room, 'coHost')?.user : undefined;
  }, [room]);

  const host = useMemo(() => {
    return room ? getRoomParticipant(room, 'host')?.user : undefined;
  }, [room]);

  // Permission checks
  const isHost = currentUserId === host?.userId;
  const { isModerator } = useChannelPermission(channel?.channelId);

  // Hooks
  const { cancelInvitation, isPending: isPendingCancelInvitation } = useCancelInvitation({
    pageId,
  });
  const { assingRoleToUsers } = useChannelRole({ channel });
  const { handleRemoveParticipant, isPending: isPendingRemoveParticipant } = useRemoveParticipant({
    room,
  });

  // Action handlers
  const handleCancelInvitation = () => {
    if (invitation?.invitationId) {
      cancelInvitation(invitation.invitationId);
    }
  };

  const handlePromoteToModerator = () => {
    if (invitedCoHost?.userId) {
      assingRoleToUsers({
        userIds: [invitedCoHost.userId],
        roleId: CHANNEL_MODERATOR,
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

    // Permission flags
    isHost,
    isModerator,

    // Action handlers
    handleCancelInvitation,
    handlePromoteToModerator,
    handleRemoveCoHost,
    handleLeaveAsCoHost,

    // Loading states
    isPendingCancelInvitation,
    isPendingRemoveParticipant,
  };
};
