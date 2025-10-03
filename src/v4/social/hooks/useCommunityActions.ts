import { CommunityRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

export const useCommunityActions = (
  {
    onJoinSuccess,
    onJoinError,
    onLeaveSuccess,
    onLeaveError,
    onCancelJoinSuccess,
    onCancelJoinError,
    community,
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
  const { AmityGlobalBehavior } = usePageBehavior();
  const { isVisitorOrBot } = useSDK();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { mutate: joinCommunity } = useMutation({
    mutationFn: async (community: Amity.Community) => await community.join(),
    onSuccess: (data: Amity.JoinResult, community: Amity.Community) => {
      success({
        content:
          data.status === 'success'
            ? `You joined ${community.displayName}.`
            : 'Requested to join. You will be notified once your request is accepted.',
      });
      onJoinSuccess?.({ data, communityId: community.communityId });
    },
    onError: (error) => {
      info({
        content: 'Failed to join the community. Please try again.',
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
            content: 'Successfully left the group',
          });
    },
    onError: (error) => {
      info({
        content: 'Failed to leave the community. Please try again.',
      });
      onLeaveError?.(error);
    },
  });

  const { mutate: cancelJoinCommunity } = useMutation({
    mutationFn: async () => await joinRequest?.cancel(),
    onSuccess: () => {
      success({
        content: 'Canceled to join the community.',
      });
      onCancelJoinSuccess?.();
    },
    onError: (error) => {
      info({
        content: 'Failed to cancel joining the community.',
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
