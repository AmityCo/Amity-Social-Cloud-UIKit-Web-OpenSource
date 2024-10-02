import { CommunityRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useCommunityActions = ({
  onJoinSuccess,
  onJoinError,
  onLeaveSuccess,
  onLeaveError,
}: {
  onJoinSuccess?: () => void;
  onJoinError?: (error: Error) => void;
  onLeaveSuccess?: () => void;
  onLeaveError?: (error: Error) => void;
} = {}): {
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
} => {
  const { error: errorFn, success } = useNotifications();

  const { mutate: joinCommunity } = useMutation({
    mutationFn: (communityId: string) => CommunityRepository.joinCommunity(communityId),
    onSuccess: () => {
      success({
        content: 'Successfully joined the community.',
      });
      onJoinSuccess?.();
    },
    onError: (error) => {
      errorFn({
        content: 'Failed to join the community',
      });
      onJoinError?.(error);
    },
  });

  const { mutate: leaveCommunity } = useMutation({
    mutationFn: (communityId: string) => CommunityRepository.leaveCommunity(communityId),
    onSuccess: () => {
      success({
        content: 'Successfully left the community',
      });
      onLeaveSuccess?.();
    },
    onError: (error) => {
      errorFn({
        content: 'Failed to leave the community',
      });
      onLeaveError?.(error);
    },
  });

  return {
    joinCommunity,
    leaveCommunity,
  };
};
