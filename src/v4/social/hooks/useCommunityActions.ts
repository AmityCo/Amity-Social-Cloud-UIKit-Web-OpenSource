import { CommunityRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useGetJoinRequests } from './useGetJoinRequests';

export const useCommunityActions = (
  {
    onJoinSuccess,
    onJoinError,
    onLeaveSuccess,
    onLeaveError,
    onCancelJoinSuccess,
    onCancelJoinError,
    community,
  }: {
    onJoinSuccess?: () => void;
    onJoinError?: (error: Error) => void;
    onLeaveSuccess?: () => void;
    onLeaveError?: (error: Error) => void;
    onCancelJoinSuccess?: () => void;
    onCancelJoinError?: (error: Error) => void;
    community?: Amity.Community;
  } = {
    community: {} as Amity.Community,
    onJoinSuccess: () => {},
    onJoinError: () => {},
    onLeaveSuccess: () => {},
    onLeaveError: () => {},
    onCancelJoinSuccess: () => {},
    onCancelJoinError: () => {},
  },
): {
  joinCommunity: (community: Amity.Community) => void;
  leaveCommunity: (community: Amity.Community) => void;
  cancelJoinCommunity: () => void;
} => {
  const { success, info } = useNotifications();

  const { joinRequests } = useGetJoinRequests(community);

  const { mutate: joinCommunity } = useMutation({
    mutationFn: async (community: Amity.Community) => await community.join(),
    onSuccess: (data: Amity.JoinResult, community: Amity.Community) => {
      success({
        content:
          data.status === 'success'
            ? `You joined ${community.displayName}.`
            : 'Requested to join. You will be notified once your request is accepted.',
      });
      onJoinSuccess?.();
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
      success({
        content: 'Successfully left the community',
      });
      onLeaveSuccess?.();
    },
    onError: (error) => {
      info({
        content: 'Failed to leave the community. Please try again.',
      });
      onLeaveError?.(error);
    },
  });

  const { mutate: cancelJoinCommunity } = useMutation({
    mutationFn: async () => {
      if (Array.isArray(joinRequests) && joinRequests.length > 0) {
        await joinRequests[0].cancel();
      }
    },
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
    joinCommunity,
    leaveCommunity,
    cancelJoinCommunity,
  };
};
