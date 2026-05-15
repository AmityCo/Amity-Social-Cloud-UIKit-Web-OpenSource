import { CommunityRepository } from '@amityco/ts-sdk';
import { resolveString } from '~/v4/core/localization';
import { useMutation } from '@tanstack/react-query';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useCommunityActions = (
  {
    onJoinSuccess,
    onJoinError,
    onLeaveSuccess,
    onLeaveError,
    onCancelJoinSuccess,
    onCancelJoinError,
    joinRequest,
  }: {
    onJoinSuccess?: ({
      data,
      communityId,
    }: {
      data?: Amity.JoinResult;
      communityId?: string;
    }) => void;
    onJoinError?: (error: Error) => void;
    onLeaveSuccess?: () => void;
    onLeaveError?: (error: Error) => void;
    onCancelJoinSuccess?: () => void;
    onCancelJoinError?: (error: Error) => void;
    community?: Amity.Community;
    joinRequest?: Amity.JoinRequest | undefined;
  } = {
    community: {} as Amity.Community,
    onJoinSuccess: ({ data, communityId }) => {},
    onJoinError: () => {},
    onLeaveSuccess: () => {},
    onLeaveError: () => {},
    onCancelJoinSuccess: () => {},
    onCancelJoinError: () => {},
    joinRequest: undefined,
  },
): {
  joinCommunity: (community: Amity.Community) => void;
  leaveCommunity: (community: Amity.Community) => void;
  cancelJoinCommunity: () => void;
} => {
  const { success, info } = useNotifications();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { mutate: joinCommunity } = useMutation({
    mutationFn: async (community: Amity.Community) => await community.join(),
    onSuccess: (data: Amity.JoinResult, community: Amity.Community) => {
      success({
        content:
          data.status === 'success'
            ? resolveString('amity_social_label_joined_community', community.displayName)
            : resolveString('amity_social_modal_dialog_join_request_sent'),
      });
      onJoinSuccess?.({ data, communityId: community.communityId });
    },
    onError: (error) => {
      info({
        content: resolveString('amity_social_toast_snackbar_join_community_failed'),
      });
      onJoinError?.(error);
    },
  });

  const { mutate: leaveCommunity } = useMutation({
    mutationFn: (community: Amity.Community) =>
      CommunityRepository.leaveCommunity(community.communityId),
    onSuccess: () => {
      onLeaveSuccess?.()
        ? onLeaveSuccess?.()
        : success({
            content: resolveString('amity_social_toast_setting_leave_success'),
          });
    },
    onError: (error) => {
      info({
        content: resolveString('amity_social_toast_leave_community_failed'),
      });
      onLeaveError?.(error);
    },
  });

  const { mutate: cancelJoinCommunity } = useMutation({
    mutationFn: async () => await joinRequest?.cancel(),
    onSuccess: () => {
      success({
        content: resolveString('amity_social_canceled_to_join_the_community'),
      });
      onCancelJoinSuccess?.();
    },
    onError: (error) => {
      info({
        content: resolveString('amity_social_toast_cancel_request_failed'),
      });
      onCancelJoinError?.(error);
    },
  });

  return {
    joinCommunity: (community) =>
      handleCommunityProfileBehavior({
        allowNonMember: true,
        isJoined: community.isJoined,
        defaultBehavior: () => joinCommunity(community),
      }),
    leaveCommunity,
    cancelJoinCommunity,
  };
};
